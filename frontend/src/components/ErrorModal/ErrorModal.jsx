import { createPortal } from "react-dom";
import styles from "../ErrorModal/Error.module.css";

const ErrorModal = ({ isOpen, title, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      {createPortal(
        <div className={styles.backdrop} onClick={onClose} />,
        document.getElementById("backdrop-root"),
      )}

      {createPortal(
        <div className={styles.modal} role="alertdialog" aria-modal="true">
          <div className={styles.icon}>
            <i className="ti ti-circle-x" aria-hidden="true" />
          </div>

          <header className={styles.header}>
            <h2>{title || "Произошла ошибка"}</h2>
          </header>

          <main className={styles.content}>
            <p>{message || "Что-то пошло не так. Попробуйте позже."}</p>
          </main>

          <footer className={styles.actions}>
            <button className={styles.closeBtn} onClick={onClose}>
              Понятно
            </button>
          </footer>
        </div>,
        document.getElementById("modal-root"),
      )}
    </>
  );
};

export default ErrorModal;
