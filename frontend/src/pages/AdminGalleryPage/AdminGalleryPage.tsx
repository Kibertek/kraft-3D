import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  createGalleryItem,
  deleteGalleryItem,
  getAdminGallery,
  updateGalleryItem,
  uploadGalleryImage,
  GalleryItem,
} from "@services/api";
import styles from "./AdminGalleryPage.module.scss";

function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [isPublished, setIsPublished] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadItems() {
    setIsLoading(true);
    try {
      setItems(await getAdminGallery());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Не удалось загрузить галерею");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadItems();
  }, []);

  async function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError("");
    setMessage("");
    setIsSaving(true);
    try {
      const uploaded = await uploadGalleryImage(file);
      setImagePath(uploaded.image_path);
      setPreviewUrl(uploaded.image_url);
      setMessage("Изображение загружено. Теперь можно сохранить карточку.");
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Не удалось загрузить изображение");
    } finally {
      setIsSaving(false);
      event.target.value = "";
    }
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!imagePath) {
      setError("Сначала загрузите изображение.");
      return;
    }

    setIsSaving(true);
    try {
      await createGalleryItem({ title, description, image_path: imagePath, sort_order: sortOrder, is_published: isPublished });
      setTitle("");
      setDescription("");
      setImagePath("");
      setPreviewUrl("");
      setSortOrder(0);
      setIsPublished(true);
      setMessage("Работа добавлена в галерею.");
      await loadItems();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Не удалось сохранить работу");
    } finally {
      setIsSaving(false);
    }
  }

  async function togglePublished(item: GalleryItem) {
    try {
      const updated = await updateGalleryItem(item.id, { is_published: !item.is_published });
      setItems((current) => current.map((entry) => (entry.id === updated.id ? updated : entry)));
    } catch (toggleError) {
      setError(toggleError instanceof Error ? toggleError.message : "Не удалось изменить публикацию");
    }
  }

  async function handleDelete(item: GalleryItem) {
    if (!window.confirm(`Удалить «${item.title}» из галереи?`)) return;
    try {
      await deleteGalleryItem(item.id);
      setItems((current) => current.filter((entry) => entry.id !== item.id));
      setMessage("Работа удалена.");
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Не удалось удалить работу");
    }
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <Link to="/admin" className={styles.back}>← Панель управления</Link>
          <p className={styles.eyebrow}>УПРАВЛЕНИЕ САЙТОМ</p>
          <h1>Галерея работ</h1>
          <p className={styles.subtitle}>Загружайте готовые изделия, задавайте порядок и управляйте публикацией.</p>
        </div>
        <span className={styles.stage}>ЭТАП 3 · ГАЛЕРЕЯ</span>
      </header>

      <div className={styles.layout}>
        <section className={styles.formCard}>
          <div className={styles.cardHeading}>
            <div><span>01</span><h2>Новая работа</h2></div>
            <small>JPG · PNG · WEBP / до 8 МБ</small>
          </div>

          <form onSubmit={handleCreate}>
            <label>
              Название
              <input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={200} placeholder="Например, брелок «Маленький Джек»" required />
            </label>
            <label>
              Описание
              <textarea value={description} onChange={(event) => setDescription(event.target.value)} maxLength={2000} rows={4} placeholder="Короткое описание работы" />
            </label>
            <label>
              Изображение
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} disabled={isSaving} />
            </label>

            {previewUrl && <img className={styles.preview} src={previewUrl} alt="Предпросмотр" />}

            <div className={styles.row}>
              <label>
                Порядок
                <input type="number" value={sortOrder} onChange={(event) => setSortOrder(Number(event.target.value))} />
              </label>
              <label className={styles.checkbox}>
                <input type="checkbox" checked={isPublished} onChange={(event) => setIsPublished(event.target.checked)} />
                <span>Показывать на сайте</span>
              </label>
            </div>

            {error && <p className={styles.error} role="alert">{error}</p>}
            {message && <p className={styles.success} role="status">{message}</p>}
            <button type="submit" disabled={isSaving}>{isSaving ? "СОХРАНЕНИЕ…" : "ДОБАВИТЬ В ГАЛЕРЕЮ"}</button>
          </form>
        </section>

        <section className={styles.listSection}>
          <div className={styles.listHeading}>
            <div><span>02</span><h2>Работы</h2></div>
            <small>{items.length} КАРТОЧЕК</small>
          </div>

          {isLoading ? (
            <div className={styles.empty}>Загрузка галереи…</div>
          ) : items.length === 0 ? (
            <div className={styles.empty}>Галерея пока пуста. Человечество ещё не успело ничего напечатать.</div>
          ) : (
            <div className={styles.grid}>
              {items.map((item) => (
                <article className={styles.item} key={item.id}>
                  <img src={item.image_url} alt={item.title} />
                  <div className={styles.itemBody}>
                    <div className={styles.itemTop}>
                      <h3>{item.title}</h3>
                      <span className={item.is_published ? styles.published : styles.hidden}>{item.is_published ? "Опубликовано" : "Скрыто"}</span>
                    </div>
                    {item.description && <p>{item.description}</p>}
                    <div className={styles.itemActions}>
                      <button type="button" onClick={() => void togglePublished(item)}>{item.is_published ? "Скрыть" : "Опубликовать"}</button>
                      <button type="button" className={styles.delete} onClick={() => void handleDelete(item)}>Удалить</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default AdminGalleryPage;
