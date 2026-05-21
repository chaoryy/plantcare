
import { useState, useRef } from "react";
import styles from "./UploadZone.module.css";

export default function UploadZone({ onFileSelect }) {
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("The file is too large. Maximum 10MB.");
      return;
    }
    setPreview(URL.createObjectURL(file));
    onFileSelect(file);
  };

  const handleReset = (e) => {
    e.stopPropagation();
    setPreview(null);
    onFileSelect(null);
    inputRef.current.value = "";
  };

  return (
    <div
      className={`${styles.zone} ${dragging ? styles.dragging : ""} ${preview ? styles.hasPreview : ""}`}
      onClick={() => inputRef.current.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFile(e.dataTransfer.files[0]);
      }}
    >
      {preview ? (
        <>
          <img src={preview} alt="preview" className={styles.preview} />
          <button className={styles.resetBtn} onClick={handleReset}>
            <i className="ti ti-x" aria-hidden="true" /> Another photo
          </button>
        </>
      ) : (
        <>
          <i className="ti ti-camera-plus" aria-hidden="true" />
          <p className={styles.title}>Drag or click to select</p>
          <p className={styles.sub}>JPG, PNG · under 10MB</p>
        </>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => handleFile(e.target.files[0])}
      />
    </div>
  );
}
