import { useEffect, useState } from "react";
import { getGallery, GalleryItem } from "@services/api";
import styles from "./Gallery.module.scss";

function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    getGallery()
      .then((data) => {
        if (active) setItems(data);
      })
      .catch(() => {
        // The static placeholder remains available when the API is offline.
      })
      .finally(() => {
        if (active) setLoaded(true);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="gallery" className={styles.gallery}>
      <div className={styles.container}>
        <div className={styles.label}><span /> НАШИ РАБОТЫ</div>

        <div className={styles.headingRow}>
          <h2>Идеи, которые<br /><span>обретают форму.</span></h2>
          <p className={styles.description}>Галерея работ КРАФТ 3D. Здесь собраны изделия, проекты и фотографии готовых заказов.</p>
        </div>

        {items.length > 0 ? (
          <div className={styles.grid}>
            {items.map((item) => (
              <article className={styles.item} key={item.id}>
                <img src={item.image_url} alt={item.title} loading="lazy" />
                <div className={styles.itemOverlay}>
                  <h3>{item.title}</h3>
                  {item.description && <p>{item.description}</p>}
                </div>
              </article>
            ))}
          </div>
        ) : loaded ? (
          <div className={styles.placeholder}><span>ГАЛЕРЕЯ</span><p>Фотографии работ появятся здесь</p></div>
        ) : (
          <div className={styles.placeholder}><span>ЗАГРУЗКА</span><p>Получаем работы…</p></div>
        )}
      </div>
    </section>
  );
}

export default Gallery;
