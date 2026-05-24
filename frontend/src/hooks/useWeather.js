import { useEffect, useState } from "react";
import { weatherAPI } from "../api/client";

const WEATHER_ICONS = {
  Ясно: "ti-sun",
  Облачно: "ti-cloud",
  Дождь: "ti-cloud-rain",
  Снег: "ti-snowflake",
  Гроза: "ti-bolt",
  Туман: "ti-mist",
};

export function useWeather(city) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!city) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(null);

    weatherAPI
      .getByCity(city)
      .then((res) => {
        const data = res.data;
        setWeather({
          ...data,
          icon: WEATHER_ICONS[data.condition] ?? "ti-cloud",
        });
      })
      .catch(() => setError("Failed to load weather"))
      .finally(() => setLoading(false));

    const interval = setInterval(
      () => {
        weatherAPI
          .getByCity(city)
          .then((res) => {
            const data = res.data;
            setWeather({
              ...data,
              icon: WEATHER_ICONS[data.condition] ?? "ti-cloud",
            });
          })
          .catch(() => {});
      },
      30 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, [city]);

  return { weather, loading, error };
}
