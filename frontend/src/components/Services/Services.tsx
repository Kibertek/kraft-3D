import Container from "@components/Container/Container";
import styles from "./Services.module.scss";

function Services() {
  return (
    <section className={styles.services} id="services">
      <Container>
        <h2>Наши услуги</h2>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h3>3D-печать</h3>
            <p>Печать ваших моделей на современных 3D-принтерах.</p>
          </div>

          <div className={styles.card}>
            <h3>3D-моделирование</h3>
            <p>Создание моделей по фотографиям, чертежам и эскизам.</p>
          </div>

          <div className={styles.card}>
            <h3>Подготовка моделей</h3>
            <p>Исправление ошибок STL и подготовка к печати.</p>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default Services;