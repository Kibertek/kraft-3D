import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "@services/api";
import styles from "./AdminPage.module.scss";

const sections = [
  { number: "01", title: "Галерея работ", description: "Фотографии, подписи и порядок карточек", status: "Запланировано" },
  { number: "02", title: "Услуги", description: "Названия, описания и предварительные цены", status: "Запланировано" },
  { number: "03", title: "Тексты и контакты", description: "Описание компании, VK, Telegram и объявления", status: "Запланировано" },
  { number: "04", title: "Заказы с сайта", description: "Заявки и состояние синхронизации с KRAFT 3D Manager", status: "Будущий этап" },
];

function AdminPage() {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      navigate("/admin/login", { replace: true });
    }
  }

  return (
    <main className={styles.page}>
      <aside className={styles.sidebar}>
        <Link to="/" className={styles.brand}>
          <span className={styles.brandMark}>K3D</span>
          <span>
            <strong>КРАФТ 3D</strong>
            <small>ПАНЕЛЬ УПРАВЛЕНИЯ</small>
          </span>
        </Link>

        <div className={styles.navLabel}>РАБОЧЕЕ ПРОСТРАНСТВО</div>
        <nav className={styles.navigation} aria-label="Навигация панели управления">
          <a className={styles.active} href="#overview"><span>▦</span> Обзор</a>
          <a href="#gallery"><span>▧</span> Галерея работ</a>
          <a href="#services"><span>◇</span> Услуги</a>
          <a href="#content"><span>≡</span> Тексты и контакты</a>
          <a href="#orders"><span>↗</span> Заказы</a>
        </nav>

        <div className={styles.sidebarBottom}>
          <span className={styles.statusDot} />
          <span>Авторизация сервера активна</span>
          <button type="button" onClick={handleLogout} disabled={isLoggingOut}>
            {isLoggingOut ? "Выход…" : "Выйти из панели"}
          </button>
          <Link to="/">← Вернуться на сайт</Link>
        </div>
      </aside>

      <section className={styles.workspace} id="overview">
        <header className={styles.topbar}>
          <div>
            <div className={styles.breadcrumb}>КРАФТ 3D <span>/</span> АДМИНИСТРИРОВАНИЕ</div>
            <h1>Панель управления</h1>
          </div>
          <div className={styles.previewBadge}>ЭТАП 2 · АВТОРИЗАЦИЯ</div>
        </header>

        <div className={styles.notice} role="status">
          <span className={styles.noticeIcon}>✓</span>
          <div>
            <strong>Доступ теперь проверяется сервером</strong>
            <p>Вход использует серверную сессию в HttpOnly cookie. Реальные разделы управления и PostgreSQL-данные подключим следующими этапами.</p>
          </div>
        </div>

        <div className={styles.welcome}>
          <div>
            <p className={styles.eyebrow}>ВАШ САЙТ · ВАШИ ПРАВИЛА</p>
            <h2>Всё важное для сайта<br /><span>в одном месте.</span></h2>
            <p className={styles.welcomeText}>Управление работами, услугами, контактами и входящими заказами будет собрано здесь.</p>
          </div>
          <div className={styles.orb} aria-hidden="true"><span>K</span><i>3D</i></div>
        </div>

        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>УПРАВЛЕНИЕ САЙТОМ</p>
            <h2>Разделы панели</h2>
          </div>
          <span className={styles.counter}>04 РАЗДЕЛА</span>
        </div>

        <div className={styles.cards}>
          {sections.map((section) => (
            <article className={styles.card} key={section.number} id={
              section.number === "01" ? "gallery" :
              section.number === "02" ? "services" :
              section.number === "03" ? "content" : "orders"
            }>
              <div className={styles.cardTop}>
                <span className={styles.cardNumber}>{section.number}</span>
                <span className={styles.cardArrow}>↗</span>
              </div>
              <h3>{section.title}</h3>
              <p>{section.description}</p>
              <div className={styles.cardFooter}>
                <span className={styles.statusPill}>{section.status}</span>
              </div>
            </article>
          ))}
        </div>

        <footer className={styles.footer}>
          <span>KRAFT 3D MANAGER · ВЕБ-АДМИНИСТРИРОВАНИЕ</span>
          <span>ЭТАП 2 / АВТОРИЗАЦИЯ</span>
        </footer>
      </section>
    </main>
  );
}

export default AdminPage;
