import styles from "./Socials.module.scss";

function Socials() {
  return (
    <section className={styles.socials}>
      <div className={styles.inner}>
        <span className={styles.label}>
          Мы в сети
        </span>

        <div className={styles.links}>
          <a
            href="https://t.me/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Telegram
            <span>↗</span>
          </a>

          <a
            href="https://vk.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            VK
            <span>↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default Socials;