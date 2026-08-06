import Container from "@components/Container/Container";
import business from "@config/business";
import styles from "./Hero.module.scss";

function Hero() {
  return (
    <section className={styles.hero} id="hero">
      <Container>
        <div className={styles.grid}>
          <div className={styles.left}>
            <span className={styles.badge}>
              Профессиональная 3D-печать
            </span>

            <h1>{business.slogan}</h1>

            <p>{business.description}</p>

            <div className={styles.buttons}>
              <button className={styles.primary}>
                Загрузить модель
              </button>

              <button className={styles.secondary}>
                Рассчитать стоимость
              </button>
            </div>

            <div className={styles.features}>
              <span>✓ STL / 3MF / OBJ</span>
              <span>✓ PLA / PETG / ABS / TPU</span>
            </div>

            <small>{business.notice}</small>
          </div>

          <div className={styles.right}>
            <div className={styles.object}>
              <div className={styles.glow}></div>
              <div className={styles.cube}>KRAFT 3D</div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default Hero;