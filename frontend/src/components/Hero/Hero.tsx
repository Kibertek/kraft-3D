import Container from "@components/Container/Container";
import styles from "./Hero.module.scss";

function Hero() {
  return (
    <section className={styles.hero} id="hero">
      <Container>
        <div className={styles.content}>
          <span className={styles.badge}>
            Профессиональная 3D-печать
          </span>

          <h1>
            Фантазия и идея
            <br />
            печатаются у нас.
          </h1>

          <p>
            Изготавливаем изделия на заказ по вашим моделям.
            <br />
            Печать на современных 3D-принтерах с высоким качеством.
          </p>

          <button className={styles.button}>
            Загрузить модель
          </button>
        </div>
      </Container>
    </section>
  );
}

export default Hero;