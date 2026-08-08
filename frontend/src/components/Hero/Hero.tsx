import { useState } from "react";
import UploadZone from "@components/UploadZone/UploadZone";
import Container from "@components/Container/Container";
import business from "@config/business";
import styles from "./Hero.module.scss";

function Hero() {
  const [showUpload, setShowUpload] = useState(false);
  return (
    <section className={styles.hero}>
      <Container>
        <div className={styles.content}>
          <div className={styles.text}>
            <span className={styles.label}>КРАФТ 3D</span>

            <h1>
              Фантазия и идея
              <span> печатается у нас</span>
            </h1>

            <p className={styles.description}>
              3D-печать, моделирование и изготовление изделий на заказ.
            </p>

            <p className={styles.price}>
              {business.pricing}
            </p>

            <button
            className={styles.button}
            onClick={() => setShowUpload(true)}
            >
              Загрузить модель
            </button>
          </div>

          <div className={styles.logo}>
            <div className={styles.logoCore}>
              <span>K</span>
              <span>3D</span>
            </div>

            <div className={styles.ring} />
            <div className={`${styles.ring} ${styles.ringSecond}`} />
          </div>
        </div>
        {showUpload && <UploadZone />}
      </Container>
    </section>
  );
}

export default Hero;