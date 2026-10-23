import styles from "./Gallery.module.scss";

function Gallery() {
  return (
    <section id="gallery" className={styles.gallery}>
      <div className={styles.container}>
        <div className={styles.label}>
          <span />
          НАШИ РАБОТЫ
        </div>

        <div className={styles.headingRow}>
          <h2>
            Идеи, которые
            <br />
            <span>обретают форму.</span>
          </h2>

          <p className={styles.description}>
            Галерея работ КРАФТ 3D. Здесь будут наши изделия,
            проекты и фотографии готовых заказов.
          </p>
        </div>

        <div className={styles.placeholder}>
          <span>ГАЛЕРЕЯ</span>
          <p>Фотографии работ появятся здесь</p>
        </div>
      </div>
    </section>
  );
}

export default Gallery;
