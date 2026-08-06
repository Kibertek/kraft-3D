import { useRef, useState } from "react";
import styles from "./UploadZone.module.scss";

function UploadZone() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);

  function handleFile(file: File) {
    setFile(file);
  }

  return (
    <section className={styles.upload}>
      <input
        ref={inputRef}
        type="file"
        accept=".stl,.3mf,.obj"
        hidden
        onChange={(e) => {
          if (e.target.files?.length) {
            handleFile(e.target.files[0]);
          }
        }}
      />

      <div
        className={styles.dropzone}
        onClick={() => inputRef.current?.click()}
      >
        {!file ? (
          <>
            <h3>📂 Загрузите модель</h3>

            <p>Нажмите сюда или перетащите файл</p>

            <span>Поддерживаются STL • 3MF • OBJ</span>
          </>
        ) : (
          <>
            <h3>✅ {file.name}</h3>

            <p>{(file.size / 1024 / 1024).toFixed(2)} MB</p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
              }}
            >
              Удалить файл
            </button>
          </>
        )}
      </div>
    </section>
  );
}

export default UploadZone;