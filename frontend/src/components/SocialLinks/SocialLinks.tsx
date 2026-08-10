import styles from "./SocialLinks.module.scss";

function SocialLinks() {
  return (
    <section className={styles.social}>
      <div className={styles.container}>
        <h2>Мы в социальных сетях</h2>

        <p>
          Следите за новыми работами, проектами и процессом печати.
        </p>

        <div className={styles.links}>
          <a
            href="https://vk.com/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            <span className={styles.icon}>VK</span>

            <span>
              <strong>ВКонтакте</strong>
              <small>Наши работы и новости</small>
            </span>

            <span className={styles.arrow}>→</span>
          </a>

          <a
            href="https://t.me/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            <span className={styles.icon}>TG</span>

            <span>
              <strong>Telegram</strong>
              <small>Связаться с нами</small>
            </span>

            <span className={styles.arrow}>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default SocialLinks;