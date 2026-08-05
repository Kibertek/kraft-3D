import Container from "@components/Container/Container";
import styles from "./Contacts.module.scss";

function Contacts() {
  return (
    <section className={styles.contacts} id="contacts">
      <Container>
        <h2>Связаться с нами</h2>

        <p>
          Для оформления заказа воспользуйтесь кнопкой
          «Загрузить модель» или напишите нам в Telegram либо VK.
        </p>
      </Container>
    </section>
  );
}

export default Contacts;