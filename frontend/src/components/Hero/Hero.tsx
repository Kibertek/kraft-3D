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

  useEffect(() => {
    const ctx = gsap.context(() => {
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
    }, heroRef);

    return () => ctx.revert();
  }, []);

return (
  <section
    ref={heroRef}
    id="hero"
    className={styles.hero}
  >
      <Container>
    </section>
     );