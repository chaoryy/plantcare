import { useEffect, useState } from "react";
import { plantsAPI } from "../../api/client";
import ErrorModal from "../../components/ErrorModal/ErrorModal";
import styles from "../../styles/Schedule.module.css";

const getLocalDateString = () => {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 10);
};

const TODAY = getLocalDateString();

export default function Schedule() {
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    plantsAPI
      .getSchedule()
      .then((res) => setSchedule(res.data))
      .catch(() => {
        setErrorMsg(
          "Не удалось загрузить график полива. Проверьте сеть или попробуйте позже.",
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const markDone = (id) => setDone((prev) => [...prev, id]);

  if (loading) return <p className={styles.loading}>Загрузка...</p>;

  const plantsArray = schedule?.plants || schedule || [];

  const todayPlants = plantsArray.filter((p) => p.next_water === TODAY);
  const upcoming = plantsArray.filter((p) => p.next_water > TODAY);

  return (
    <div>
      <h1 className={styles.title}>График полива</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          Сегодня{" "}
          {todayPlants.length > 0 && (
            <span className={styles.count}>{todayPlants.length}</span>
          )}
        </h2>

        {todayPlants.length === 0 ? (
          <p className={styles.empty}>На сегодня всё полито 🎉</p>
        ) : (
          <div className={styles.list}>
            {todayPlants.map((p) => (
              <div
                key={p.id}
                className={`${styles.item} ${done.includes(p.id) ? styles.itemDone : ""}`}
              >
                <div className={styles.itemIcon}>
                  <i className="ti ti-droplet" aria-hidden="true" />
                </div>
                <div className={styles.itemInfo}>
                  <p className={styles.itemName}>{p.name}</p>
                  {p.note && <p className={styles.itemNote}>{p.note}</p>}
                </div>
                <button
                  className={styles.doneBtn}
                  onClick={() => markDone(p.id)}
                  disabled={done.includes(p.id)}
                >
                  {done.includes(p.id) ? "Готово ✓" : "Отметить"}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {upcoming.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Ближайшие</h2>
          <div className={styles.list}>
            {upcoming.map((p) => (
              <div key={p.id} className={styles.item}>
                <div className={`${styles.itemIcon} ${styles.upcoming}`}>
                  <i className="ti ti-calendar" aria-hidden="true" />
                </div>
                <div className={styles.itemInfo}>
                  <p className={styles.itemName}>{p.name}</p>
                  <p className={styles.itemNote}>
                    {new Date(p.next_water).toLocaleDateString("ru-RU", {
                      day: "numeric",
                      month: "long",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <ErrorModal
        isOpen={errorMsg !== ""}
        title="Ошибка расписания"
        message={errorMsg}
        onClose={() => setErrorMsg("")}
      />
    </div>
  );
}
