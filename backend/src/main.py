from __future__ import annotations

import hashlib
import secrets
import time
from collections import defaultdict, deque
from contextlib import asynccontextmanager
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

from fastapi import Depends, FastAPI, Header, HTTPException, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from pydantic_settings import BaseSettings, SettingsConfigDict
from psycopg.rows import dict_row
from psycopg_pool import ConnectionPool
from pwdlib import PasswordHash


BASE_DIR = Path(__file__).resolve().parents[1]
MIGRATION_FILE = BASE_DIR / "migrations" / "001_auth.sql"


class Settings(BaseSettings):
    app_env: str = "development"
    app_host: str = "127.0.0.1"
    app_port: int = 8000
    database_url: str
    cors_origins: str = "http://localhost:5173"
    session_cookie_name: str = "kraft3d_session"
    session_ttl_hours: int = 12
    cookie_secure: bool = False
    admin_username: str = "admin"
    admin_password: str | None = None

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def origins(self) -> list[str]:
        return [item.strip() for item in self.cors_origins.split(",") if item.strip()]


settings = Settings()
password_hash = PasswordHash.recommended()
dummy_password_hash = password_hash.hash("KRAFT3D-dummy-password-for-timing-protection")

pool = ConnectionPool(settings.database_url, min_size=1, max_size=5, open=False)

# Small first-stage login limiter. Production with multiple workers should move
# this state to shared infrastructure such as Redis.
LOGIN_WINDOW_SECONDS = 15 * 60
LOGIN_MAX_ATTEMPTS = 5
login_attempts: dict[str, deque[float]] = defaultdict(deque)


class LoginRequest(BaseModel):
    username: str = Field(min_length=1, max_length=128)
    password: str = Field(min_length=1, max_length=256)


class ChangePasswordRequest(BaseModel):
    current_password: str = Field(min_length=1, max_length=256)
    new_password: str = Field(min_length=12, max_length=256)


class UserResponse(BaseModel):
    id: int
    username: str
    role: str


class CsrfResponse(BaseModel):
    csrf_token: str


class HealthResponse(BaseModel):
    status: str


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def get_client_ip(request: Request) -> str:
    return request.client.host if request.client else "unknown"


def ensure_request_origin(request: Request) -> None:
    origin = request.headers.get("origin")
    if not origin or origin not in settings.origins:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid request origin")


def audit(user_id: int | None, action: str, request: Request) -> None:
    with pool.connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO admin_audit_log (user_id, action, ip_address, user_agent)
                VALUES (%s, %s, %s, %s)
                """,
                (user_id, action, get_client_ip(request), request.headers.get("user-agent")),
            )
        conn.commit()


def cleanup_sessions() -> None:
    with pool.connection() as conn:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM admin_sessions WHERE expires_at <= NOW()")
        conn.commit()


def ensure_schema() -> None:
    sql = MIGRATION_FILE.read_text(encoding="utf-8")
    with pool.connection() as conn:
        with conn.cursor() as cur:
            cur.execute(sql)
        conn.commit()


def bootstrap_admin() -> None:
    with pool.connection() as conn:
        with conn.cursor(row_factory=dict_row) as cur:
            cur.execute("SELECT COUNT(*) AS count FROM admin_users WHERE role = 'owner'")
            owner_count = cur.fetchone()["count"]

            if owner_count:
                return

            if not settings.admin_password:
                raise RuntimeError(
                    "No owner account exists. Set ADMIN_PASSWORD in backend/.env for the first startup."
                )

            if len(settings.admin_password) < 12:
                raise RuntimeError("ADMIN_PASSWORD must contain at least 12 characters.")

            cur.execute(
                """
                INSERT INTO admin_users (username, password_hash, role)
                VALUES (%s, %s, 'owner')
                ON CONFLICT (username) DO NOTHING
                """,
                (settings.admin_username, password_hash.hash(settings.admin_password)),
            )
        conn.commit()


def authenticate(username: str, password: str) -> dict[str, Any] | None:
    with pool.connection() as conn:
        with conn.cursor(row_factory=dict_row) as cur:
            cur.execute(
                """
                SELECT id, username, password_hash, role, is_active
                FROM admin_users
                WHERE username = %s
                """,
                (username,),
            )
            user = cur.fetchone()

    candidate_hash = user["password_hash"] if user else dummy_password_hash
    valid = password_hash.verify(password, candidate_hash)

    if not user or not valid or not user["is_active"]:
        return None

    return user


def is_login_rate_limited(ip: str) -> bool:
    now = time.time()
    attempts = login_attempts[ip]
    while attempts and now - attempts[0] > LOGIN_WINDOW_SECONDS:
        attempts.popleft()
    return len(attempts) >= LOGIN_MAX_ATTEMPTS


def register_failed_login(ip: str) -> None:
    login_attempts[ip].append(time.time())


def clear_login_attempts(ip: str) -> None:
    login_attempts.pop(ip, None)


def create_session(user_id: int, request: Request) -> tuple[str, str]:
    raw_token = secrets.token_urlsafe(32)
    csrf_token = secrets.token_hex(32)
    expires_at = utcnow() + timedelta(hours=settings.session_ttl_hours)

    with pool.connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO admin_sessions
                    (user_id, token_hash, csrf_token, expires_at, ip_address, user_agent)
                VALUES (%s, %s, %s, %s, %s, %s)
                """,
                (
                    user_id,
                    hash_token(raw_token),
                    csrf_token,
                    expires_at,
                    get_client_ip(request),
                    request.headers.get("user-agent"),
                ),
            )
            cur.execute(
                "UPDATE admin_users SET last_login_at = NOW(), updated_at = NOW() WHERE id = %s",
                (user_id,),
            )
        conn.commit()

    return raw_token, csrf_token


def get_session(request: Request) -> dict[str, Any]:
    raw_token = request.cookies.get(settings.session_cookie_name)
    if not raw_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    with pool.connection() as conn:
        with conn.cursor(row_factory=dict_row) as cur:
            cur.execute(
                """
                SELECT
                    s.id AS session_id,
                    s.user_id,
                    s.csrf_token,
                    s.expires_at,
                    u.username,
                    u.role,
                    u.is_active
                FROM admin_sessions s
                JOIN admin_users u ON u.id = s.user_id
                WHERE s.token_hash = %s
                  AND s.expires_at > NOW()
                """,
                (hash_token(raw_token),),
            )
            session = cur.fetchone()

            if session:
                cur.execute(
                    "UPDATE admin_sessions SET last_seen_at = NOW() WHERE id = %s",
                    (session["session_id"],),
                )
        conn.commit()

    if not session or not session["is_active"]:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    return session


def require_admin(request: Request) -> dict[str, Any]:
    session = get_session(request)
    if session["role"] not in {"owner", "admin"}:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
    return session


def require_csrf(request: Request, csrf_token: str | None, session: dict[str, Any]) -> None:
    if not csrf_token or not secrets.compare_digest(csrf_token, session["csrf_token"]):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid CSRF token")


@asynccontextmanager
async def lifespan(_: FastAPI):
    pool.open()
    ensure_schema()
    cleanup_sessions()
    bootstrap_admin()
    yield
    pool.close()


app = FastAPI(
    title="KRAFT 3D API",
    version="0.1.0",
    docs_url="/api/docs" if settings.app_env != "production" else None,
    redoc_url=None,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "X-CSRF-Token"],
)


@app.get("/api/health", response_model=HealthResponse)
def health() -> HealthResponse:
    with pool.connection() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT 1")
            cur.fetchone()
    return HealthResponse(status="ok")


@app.post("/api/auth/login", response_model=UserResponse)
def login(payload: LoginRequest, request: Request, response: Response) -> UserResponse:
    ensure_request_origin(request)
    ip = get_client_ip(request)

    if is_login_rate_limited(ip):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many login attempts",
            headers={"Retry-After": str(LOGIN_WINDOW_SECONDS)},
        )

    user = authenticate(payload.username.strip(), payload.password)
    if not user:
        register_failed_login(ip)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    clear_login_attempts(ip)
    raw_token, _ = create_session(user["id"], request)
    response.set_cookie(
        key=settings.session_cookie_name,
        value=raw_token,
        max_age=settings.session_ttl_hours * 60 * 60,
        httponly=True,
        secure=settings.cookie_secure,
        samesite="lax",
        path="/",
    )
    audit(user["id"], "auth.login", request)
    return UserResponse(id=user["id"], username=user["username"], role=user["role"])


@app.post("/api/auth/logout")
def logout(request: Request, response: Response, x_csrf_token: str | None = Header(default=None)) -> dict[str, str]:
    ensure_request_origin(request)
    session = get_session(request)
    require_csrf(request, x_csrf_token, session)
    raw_token = request.cookies.get(settings.session_cookie_name)

    with pool.connection() as conn:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM admin_sessions WHERE token_hash = %s", (hash_token(raw_token),))
        conn.commit()

    audit(session["user_id"], "auth.logout", request)
    response.delete_cookie(settings.session_cookie_name, path="/")
    return {"status": "ok"}


@app.get("/api/auth/me", response_model=UserResponse)
def me(session: dict[str, Any] = Depends(require_admin)) -> UserResponse:
    return UserResponse(id=session["user_id"], username=session["username"], role=session["role"])


@app.get("/api/auth/csrf", response_model=CsrfResponse)
def csrf(session: dict[str, Any] = Depends(require_admin)) -> CsrfResponse:
    return CsrfResponse(csrf_token=session["csrf_token"])


@app.post("/api/auth/password")
def change_password(
    payload: ChangePasswordRequest,
    request: Request,
    x_csrf_token: str | None = Header(default=None),
    session: dict[str, Any] = Depends(require_admin),
) -> dict[str, str]:
    ensure_request_origin(request)
    require_csrf(request, x_csrf_token, session)

    with pool.connection() as conn:
        with conn.cursor(row_factory=dict_row) as cur:
            cur.execute("SELECT password_hash FROM admin_users WHERE id = %s", (session["user_id"],))
            user = cur.fetchone()

    if not user or not password_hash.verify(payload.current_password, user["password_hash"]):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Current password is incorrect")

    if payload.current_password == payload.new_password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="New password must be different")

    with pool.connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "UPDATE admin_users SET password_hash = %s, updated_at = NOW() WHERE id = %s",
                (password_hash.hash(payload.new_password), session["user_id"]),
            )
            cur.execute("DELETE FROM admin_sessions WHERE user_id = %s", (session["user_id"],))
        conn.commit()

    audit(session["user_id"], "auth.password_changed", request)
    return {"status": "ok", "message": "Password changed. Please log in again."}


@app.get("/api/admin/health")
def admin_health(session: dict[str, Any] = Depends(require_admin)) -> dict[str, str]:
    return {"status": "ok", "user": session["username"]}
