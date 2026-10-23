# KRAFT 3D API

FastAPI backend for the KRAFT 3D website and the future admin panel / KRAFT 3D Manager integration.

## Local setup

1. Create a PostgreSQL database named `kraft3d` and a dedicated database user.
2. Copy `.env.example` to `.env`.
3. Put the local PostgreSQL connection string into `DATABASE_URL`.
4. On the first start, set `ADMIN_PASSWORD` to a long random password (12+ characters). The real `.env` is ignored by Git.
5. Install dependencies and run:

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
py -m pip install -r requirements.txt
py -m uvicorn src.main:app --reload --host 127.0.0.1 --port 8000
```

The development API is available at `http://127.0.0.1:8000` and its OpenAPI docs at `/api/docs`.

## Authentication

- Passwords are stored as Argon2 hashes.
- Browser authentication uses a short-lived HttpOnly session cookie.
- Session tokens are stored only as SHA-256 hashes in PostgreSQL.
- State-changing authenticated requests require a CSRF token and a valid configured Origin.
- Login attempts are rate-limited per IP in the first stage.
- Password changes revoke all active sessions.
- Authentication events are written to `admin_audit_log`.

Do not put database passwords, admin passwords, session secrets, or other credentials into GitHub.

## Production architecture

The planned server path is Nginx/HTTPS -> FastAPI -> PostgreSQL on localhost/private interface. PostgreSQL must not be exposed directly to the Internet. KRAFT 3D Manager and other services will communicate through restricted API endpoints rather than direct database access from user PCs.
