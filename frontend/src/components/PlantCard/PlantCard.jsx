import styles from "./PlantCard.module.css";

const STATUS_LABEL = {
  healthy: { text: "Здоров", cls: "ok" },
  needs_water: { text: "Нужна вода", cls: "warn" },
  sick: { text: "Болеет", cls: "bad" },
};

const STATUS_ICON = {
  healthy: "ti-leaf",
  needs_water: "ti-droplet",
  sick: "ti-virus",
};

export default function PlantCard({ plant, onDelete }) {
  const status = STATUS_LABEL[plant.status] ?? {
    text: "Неизвестно",
    cls: "ok",
  };
  const icon = STATUS_ICON[plant.status] ?? "ti-leaf";

  return (
    <div className={styles.card}>
      <div className={`${styles.img} ${styles[plant.status]}`}>
        {plant.photo_url ? (
          <img src={plant.photo_url} alt={plant.name} />
        ) : (
          <i className={`ti ${icon}`} aria-hidden="true" />
        )}
      </div>

      <div className={styles.info}>
        <div className={styles.name}>{plant.name}</div>
        <div className={styles.latin}>{plant.latin}</div>

        <div className={styles.footer}>
          <div className={styles.water}>
            <i className="ti ti-droplet" aria-hidden="true" />
            {plant.next_water === new Date().toISOString().slice(0, 10)
              ? "Полить сегодня"
              : `Полив: ${plant.next_water}`}
          </div>
          <span className={`${styles.badge} ${styles[status.cls]}`}>
            {status.text}
          </span>
        </div>

        {onDelete && (
          <button
            className={styles.deleteBtn}
            onClick={() => onDelete(plant.id)}
            aria-label="Удалить растение"
          >
            <i className="ti ti-trash" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}
