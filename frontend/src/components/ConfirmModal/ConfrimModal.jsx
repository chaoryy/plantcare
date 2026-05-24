import { createPortal } from "react-dom";
import styles from "./ConfirmModal.module.css";

const ConfirmModal = ({ isOpen, title, message, onCancel, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <>
      {createPortal(
        <div className={styles.backdrop} onClick={onCancel} />,
        document.getElementById("backdrop-root"),
      )}

      {createPortal(
        <div className={styles.modal} role="dialog" aria-modal="true">
          <div className={styles.icon}>
            <i className="ti ti-trash-x" aria-hidden="true" />
          </div>

          <header className={styles.header}>
            <h2>{title}</h2>
          </header>

          <main className={styles.content}>
            <p>{message}</p>
          </main>

          <footer className={styles.actions}>
            <button className={styles.cancelBtn} onClick={onCancel}>
              Отмена
            </button>
            <button className={styles.confirmBtn} onClick={onConfirm}>
              Удалить
            </button>
          </footer>
        </div>,
        document.getElementById("modal-root"),
      )}
    </>
  );
};

export default ConfirmModal;
