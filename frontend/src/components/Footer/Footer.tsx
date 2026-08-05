import Container from "@components/Container/Container";
import styles from "./Footer.module.scss";

function Footer() {
  return (
    <footer className={styles.footer}>
      <Container>
        <p>© 2026 КРАФТ 3D</p>
        <p>Богомолов Павел Дмитриевич • Самозанятый</p>
      </Container>
    </footer>
  );
}

export default Footer;