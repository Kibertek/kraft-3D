import Container from "@components/Container/Container";
import styles from "./About.module.scss";

function About() {
  return (
    <section className={styles.about} id="about">
      <Container>
        <h2>О компании</h2>

        <p>
          КРАФТ 3D — мастерская современной 3D-печати и моделирования.
          Мы изготавливаем изделия на заказ, помогаем с подготовкой моделей
          и подбираем оптимальную технологию производства.
        </p>
      </Container>
    </section>
  );
}

export default About;