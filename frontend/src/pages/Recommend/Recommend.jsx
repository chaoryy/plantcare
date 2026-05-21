import { useState } from "react";
import { plantsAPI } from "../../api/client";
import Loader from "../../components/Loader/Loader";
import ErrorModal from "../../components/ErrorModal/ErrorModal";
import styles from "../../styles/Recommend.module.css";

const CHIPS = [
  "Мало света",
  "Редкий полив",
  "Есть кот",
  "Есть дети",
  "Сухой воздух",
  "Новичок",
];

export default function Recommend() {
  const [conditions, setConditions] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(""); 

  const toggleChip = (chip) => {
    const cleanChip = chip.toLowerCase();

    const currentPhrases = conditions
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p !== "");

    if (currentPhrases.includes(cleanChip)) {
      const filtered = currentPhrases.filter((p) => p !== cleanChip);
      setConditions(filtered.join(", "));
    } else {
      const updated = [...currentPhrases, cleanChip];
      setConditions(updated.join(", "));
    }
  };

  const handleSubmit = async () => {
    if (!conditions.trim()) return;
    setLoading(true);
    setErrorMsg("");
    setResult(null);
    try {
      const res = await plantsAPI.recommend(conditions);
      setResult(res.data);
    } catch {
      setErrorMsg(
        "Не удалось подобрать растения со стороны сервера. Проверьте соединение и попробуйте ещё раз.",
      );
    } finally {
      setLoading(false);
    }
  };

  const isChipActive = (chip) => {
    return conditions.toLowerCase().includes(chip.toLowerCase());
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Подобрать растение</h1>
      <p className={styles.sub}>
        Опиши свои условия — AI найдёт идеальное растение для тебя
      </p>

      <div className={styles.form}>
        <textarea
          className={styles.textarea}
          placeholder="Например: тёмная комната, забываю поливать, есть кот..."
          value={conditions}
          onChange={(e) => setConditions(e.target.value)}
          rows={3}
        />
        <div className={styles.chips}>
          {CHIPS.map((chip) => (
            <button
              key={chip}
              className={`${styles.chip} ${isChipActive(chip) ? styles.activeChip : ""}`}
              onClick={() => toggleChip(chip)}
            >
              {chip}
            </button>
          ))}
        </div>
        <button
          className={styles.btn}
          onClick={handleSubmit}
          disabled={!conditions.trim() || loading}
        >
          <i className="ti ti-sparkles" aria-hidden="true" />
          {loading ? "Подбираю..." : "Подобрать растения"}
        </button>
      </div>

      {loading && <Loader text="AI подбирает варианты..." />}

      {result && (
        <>
          <h2 className={styles.section}>Рекомендации AI</h2>
          <div className={styles.grid}>
            {result.recommendations.map((rec, i) => (
              <div key={i} className={styles.card}>
                <div className={styles.cardTop}>
                  <div className={styles.cardIcon}>
                    <i className="ti ti-plant-2" aria-hidden="true" />
                  </div>
                  <div>
                    <p className={styles.recName}>{rec.name}</p>
                    <p className={styles.recDiff}>{rec.difficulty} уход</p>
                  </div>
                </div>
                <p className={styles.recWhy}>{rec.why}</p>
                <div className={styles.tags}>
                  {rec.safe_for_pets ? (
                    <span className={styles.tagGreen}>
                      Безопасна для питомцев
                    </span>
                  ) : (
                    <span className={styles.tagRed}>Ядовита для животных</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <ErrorModal
        isOpen={errorMsg !== ""}
        title="Ошибка подбора"
        message={errorMsg}
        onClose={() => setErrorMsg("")}
      />
    </div>
  );
}
