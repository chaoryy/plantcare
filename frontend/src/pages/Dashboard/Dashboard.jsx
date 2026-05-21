// src/pages/Dashboard/Dashboard.jsx
import { useEffect, useState } from "react";
import { plantsAPI, userAPI } from "../../api/client";
import { useWeather } from "../../hooks/useWeather";
import PlantCard from "../../components/PlantCard/PlantCard";
import StatCard from "../../components/StatCard/StatCard";
import styles from "../../styles/Dashboard.module.css";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Доброе утро";
  if (hour < 18) return "Добрый день";
  return "Добрый вечер";
}

export default function Dashboard() {
  const [plants, setPlants] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const { weather, loading: weatherLoading } = useWeather(user?.city);

  useEffect(() => {
    Promise.all([plantsAPI.getCollection(), userAPI.getMe()])
      .then(([plantsRes, userRes]) => {
        setPlants(plantsRes.data.plants);
        setUser(userRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const needWater = plants.filter((p) => p.status === "needs_water").length;
  const sick = plants.filter((p) => p.status === "sick").length;

  const weatherValue = weatherLoading
    ? "..."
    : weather
      ? `${weather.temp}°C`
      : "—";

  const weatherSub = weather
    ? `${weather.city} · ${weather.condition}`
    : (user?.city ?? "");

  const weatherIcon = weather?.icon ?? "ti-cloud";

  if (loading) return <p className={styles.loading}>Загрузка...</p>;

  return (
    <div>
      <div className={styles.welcome}>
        <div>
          <h1 className={styles.title}>
            {getGreeting()}, {user?.name}
          </h1>
          <p className={styles.date}>
            {new Date().toLocaleDateString("ru-RU", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
        </div>
      </div>

      <div className={styles.stats}>
        <StatCard label="Растения" value={plants.length} icon="ti-plant-2" />
        <StatCard label="Полить сегодня" value={needWater} icon="ti-droplet" />
        <StatCard label="Нужно внимание" value={sick} icon="ti-alert-triangle"/>
        <StatCard label="Погода" value={weatherValue} icon={weatherIcon} sub={weatherSub}/>
      </div>

      <h2 className={styles.sectionTitle}>Мои растения</h2>

      {plants.length === 0 ? (
        <p className={styles.empty}>
          У вас пока растений. Добавьте первое растение!
        </p>
      ) : (
        <div className={styles.grid}>
          {plants.map((plant) => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
        </div>
      )}
    </div>
  );
}
