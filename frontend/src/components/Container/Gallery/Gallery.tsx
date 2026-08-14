import styles from "./Gallery.module.scss";

const works = [
  {
    id: 1,
    title: "Изделие на заказ",
    image: "/gallery/work-1.jpg",
  },
  {
    id: 2,
    title: "3D-модель",
    image: "/gallery/work-2.jpg",
  },
  {
    id: 3,
    title: "Деталь",
    image: "/gallery/work-3.jpg",
  },
  {
    id: 4,
    title: "Авторская работа",
    image: "/gallery/work-4.jpg",
  },
];

function Gallery() {
  return (
    <section id="gallery" className={styles.gallery}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <div className={styles.label}>
              <span />
              НАШИ РАБОТЫ
            </div>

            <h2>
              Идеи, которые
              <br />
              <span>обретают форму.</span>
            </h2>
          </div>

          <p className={styles.description}>
            Несколько примеров изделий,
            которые мы создавали на заказ.
          </p>
        </div>

        <div className={styles.grid}>
          {works.map((work) => (
            <article
              key={work.id}
              className={styles.card}
            >
              <div className={styles.image}>
                <img
                  src={work.image}
                  alt={work.title}
                />

                <div className={styles.overlay}>
                  <span>{work.title}</span>
                  <span>↗</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className={styles.bottom}>
          <span>
            Больше работ публикуем в социальных сетях
          </span>

          <div className={styles.socials}>
            <a
              href="https://vk.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              VK ↗
            </a>

            <a
              href="https://t.me/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Telegram ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Gallery;