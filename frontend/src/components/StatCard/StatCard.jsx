import styles from "./StatCard.module.css";

export default function StatCard({ label, value, icon, sub }) {
  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <span className={styles.label}>{label}</span>
        <i className={`ti ${icon}`} aria-hidden="true" />
      </div>
      <div className={styles.value}>{value}</div>
      {sub && <div className={styles.sub}>{sub}</div>}
    </div>
  );
}
