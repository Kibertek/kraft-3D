import { useRef, useState } from "react";
import styles from "./UploadZone.module.scss";

import {
  createInitialAnalysis,
  analyzeSTL,
  type ModelAnalysis,
} from "@services/analyzer/modelAnalyzer";


function UploadZone() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);

  const [analysis, setAnalysis] =
    useState<ModelAnalysis | null>(null);


  async function handleFile(selectedFile: File) {
    setFile(selectedFile);

    const result =
      createInitialAnalysis(selectedFile);

    setAnalysis(result);


    if (
      selectedFile.name
        .toLowerCase()
        .endsWith(".stl")
    ) {
      const volume =
        await analyzeSTL(selectedFile);

      setAnalysis({
        ...result,
        volume,
      });
    }
  }


  function removeFile() {
    setFile(null);
    setAnalysis(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }


  return (
    <section className={styles.upload}>

      <input
        ref={inputRef}
        type="file"
        accept=".stl,.3mf,.obj"
        hidden

        onChange={(e) => {
          const selectedFile =
            e.target.files?.[0];

          if (selectedFile) {
            handleFile(selectedFile);
          }
        }}
      />


      <div
        className={styles.dropzone}
        onClick={() =>
          inputRef.current?.click()
        }
      >

        {!file ? (
          <>
            <h3>
              📂 Загрузите модель
            </h3>

            <p>
              Нажмите сюда или перетащите файл
            </p>

            <span>
              Поддерживаются STL • 3MF • OBJ
            </span>
          </>
        ) : (

          <>
            <h3>
              ✅ {file.name}
            </h3>

            <p>
              {(file.size / 1024 / 1024)
                .toFixed(2)} MB
            </p>


            <div>
              Объём модели:
              {" "}

              {analysis?.volume
                ? `${analysis.volume.toFixed(2)} мм³`
                : "расчёт..."}
            </div>


            <button
              onClick={(e) => {
                e.stopPropagation();
                removeFile();
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