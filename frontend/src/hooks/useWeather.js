import { useEffect, useState } from "react";

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

    const timer = setTimeout(() => {
      const mockData = {
        temp: 24,
        condition: "Ясно",
        humidity: 60,
        city: city,
      };

      setWeather({
        ...mockData,
        icon: WEATHER_ICONS[mockData.condition] ?? "ti-cloud",
      });
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [city]);

  return { weather, loading, error };
}
