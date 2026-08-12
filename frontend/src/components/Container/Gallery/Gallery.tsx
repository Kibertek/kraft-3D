import styles from "./Gallery.module.scss";

function Gallery() {
  return (
    <section id="gallery" className={styles.gallery}>
      <div className={styles.container}>
        <div className={styles.label}>
          <span />
          НАШИ РАБОТЫ
        </div>

        <h2>
          Идеи, которые
          <br />
          <span>обретают форму.</span>
        </h2>

        <p>
          Здесь скоро появится галерея работ КРАФТ 3D.
        </p>
      </div>
    </section>
  );
}

export default Gallery;