import Container from "@components/Container/Container";
import styles from "./Header.module.scss";

import logo from "@assets/logo/Kraft 3D.svg";

function Header() {
  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.wrapper}>
          <a href="#" className={styles.logo}>
            <img src={logo} alt="КРАФТ 3D" />
          </a>

          <nav className={styles.navigation}>
            <a href="#hero">Главная</a>
            <a href="#services">Услуги</a>
            <a href="#about">О компании</a>
            <a href="#contacts">Контакты</a>
          </nav>
        </div>
      </Container>
    </header>
  );
}

export default Header;