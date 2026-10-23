import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { login } from "@services/api";
import styles from "./AdminLoginPage.module.scss";

function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = (location.state as { from?: string } | null)?.from ?? "/admin";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(username.trim(), password);
      navigate(from, { replace: true });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Не удалось выполнить вход");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="admin-login-title">
        <Link to="/" className={styles.brand}>
          <span className={styles.brandMark}>K3D</span>
          <span>
            <strong>КРАФТ 3D</strong>
            <small>ПАНЕЛЬ УПРАВЛЕНИЯ</small>
          </span>
        </Link>

        <div className={styles.heading}>
          <p>ЗАКРЫТАЯ ЗОНА</p>
          <h1 id="admin-login-title">Вход в админ-панель</h1>
          <span>Доступ проверяется сервером. Браузер не хранит пароль или постоянный токен.</span>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label>
            Логин
            <input
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </label>

          <label>
            Пароль
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {error && <p className={styles.error} role="alert">{error}</p>}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "ПРОВЕРКА…" : "ВОЙТИ"}
          </button>
        </form>

        <p className={styles.securityNote}>Сессия ограничена по времени и использует защищённую HttpOnly cookie.</p>
      </section>
    </main>
  );
}

export default AdminLoginPage;
