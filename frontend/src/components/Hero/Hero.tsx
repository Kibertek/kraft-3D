import Container from "@components/Container/Container";
import styles from "./Hero.module.scss";

function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.glow} />

      <Container>
        <div className={styles.content}>
          <div className={styles.info}>
            <div className={styles.label}>
              <span />
              КРАФТ 3D
            </div>

            <h1>
              Фантазия и идея
              <br />
              <span>печатаются у нас.</span>
            </h1>

            <p className={styles.description}>
              3D-печать, моделирование и изготовление
              изделий на заказ.
            </p>

            <button className={styles.button}>
              Посмотреть работы
              <span>↓</span>
            </button>
          </div>

          <div className={styles.visual}>
            <div className={styles.object}>
              <div className={styles.objectInner}>
                K<span>3D</span>
              </div>
            </div>

            <div className={`${styles.orbit} ${styles.orbitOne}`} />
            <div className={`${styles.orbit} ${styles.orbitTwo}`} />
          </div>
        </div>

        <div className={styles.bottom}>
          <span>01</span>
          <span>Идея → форма → изделие</span>
        </div>
      </Container>
    </section>
  );
}

export default Hero;