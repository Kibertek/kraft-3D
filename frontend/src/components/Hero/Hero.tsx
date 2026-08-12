import { useEffect, useRef } from "react";
import gsap from "gsap";

import Container from "@components/Container/Container";
import styles from "./Hero.module.scss";

function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  const orbitOneRef = useRef<HTMLDivElement>(null);
  const orbitTwoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Анимация появления Hero
      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      timeline
        .from(titleRef.current, {
          y: 50,
          opacity: 0,
          duration: 1,
        })
        .from(
          descriptionRef.current,
          {
            y: 25,
            opacity: 0,
            duration: 0.7,
          },
          "-=0.5"
        )
        .from(
          buttonRef.current,
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
          },
          "-=0.4"
        )
        .from(
          visualRef.current,
          {
            scale: 0.8,
            opacity: 0,
            duration: 1.2,
          },
          "-=0.8"
        );

      // Вращение первой орбиты
      gsap.to(orbitOneRef.current, {
        rotation: 360,
        duration: 18,
        repeat: -1,
        ease: "none",
      });

      // Вращение второй орбиты в обратную сторону
      gsap.to(orbitTwoRef.current, {
        rotation: -360,
        duration: 25,
        repeat: -1,
        ease: "none",
      });

      // Реакция центрального объекта на движение мыши
      const handleMouseMove = (event: MouseEvent) => {
        if (!visualRef.current) return;

        const x =
          (event.clientX / window.innerWidth - 0.5) * 2;

        const y =
          (event.clientY / window.innerHeight - 0.5) * 2;

        gsap.to(visualRef.current, {
          x: x * 15,
          y: y * 10,
          duration: 1,
          ease: "power3.out",
        });
      };

      window.addEventListener("mousemove", handleMouseMove);

      // Очистка при удалении компонента
      return () => {
        window.removeEventListener(
          "mousemove",
          handleMouseMove
        );
      };
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      className={styles.hero}
    >
      <div className={styles.glow} />

      <Container>
        <div className={styles.content}>
          <div className={styles.info}>
            <div className={styles.label}>
              <span />
              КРАФТ 3D
            </div>

            <h1 ref={titleRef}>
              Фантазия и идея
              <br />
              <span>печатаются у нас.</span>
            </h1>

            <p
              ref={descriptionRef}
              className={styles.description}
            >
              3D-печать, моделирование и изготовление
              изделий на заказ.
            </p>

            <button
              ref={buttonRef}
              className={styles.button}
            >
              Посмотреть работы
              <span>↓</span>
            </button>
          </div>

          <div
            ref={visualRef}
            className={styles.visual}
          >
            <div className={styles.object}>
              <div className={styles.objectInner}>
                K<span>3D</span>
              </div>
            </div>

            <div
              ref={orbitOneRef}
              className={`${styles.orbit} ${styles.orbitOne}`}
            />

            <div
              ref={orbitTwoRef}
              className={`${styles.orbit} ${styles.orbitTwo}`}
            />
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