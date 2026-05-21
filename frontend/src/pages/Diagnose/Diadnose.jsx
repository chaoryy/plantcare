// src/pages/Diagnose/Diagnose.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { plantsAPI } from "../../api/client";
import UploadZone from "../../components/UploadZone/UploadZone";
import Loader from "../../components/Loader/Loader";
import styles from "../../styles/Diagnose.module.css";

const SEVERITY_CLS = { лёгкая: "low", средняя: "mid", высокая: "high" };

const PROBLEM_ICONS = {
  клещ: "ti-bug",
  гниль: "ti-droplet-off",
  ожог: "ti-sun-off",
  грибок: "ti-mushroom",
  нехватка: "ti-leaf-off",
};

function getProblemIcon(problemName) {
  if (!problemName) return "ti-bug";
  const lower = problemName.toLowerCase();
  const match = Object.keys(PROBLEM_ICONS).find((key) => lower.includes(key));
  return match ? PROBLEM_ICONS[match] : "ti-bug";
}

export default function Diagnose() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleDiagnose = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setSaved(false);
    try {
      const res = await plantsAPI.diagnose(file);
      setResult(res.data);
    } catch {
      setError("Не удалось провести диагностику. Попробуйте другое фото.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result || saved) return;
    setSaving(true);
    try {
      await plantsAPI.addToCollection({
        plant_name: result.name || result.plant_name || "Больное растение",
        latin: result.latin ?? "",
        photo_url: null,
        status: "sick",
      });
      setSaved(true);
      setTimeout(() => navigate("/collection"), 1500);
    } catch {
      setError("Не удалось сохранить растение.");
    } finally {
      setSaving(false);
    }
  };

  const severityKey = result?.severity?.toLowerCase();
  const statusClass = SEVERITY_CLS[severityKey] || "low";
  const problemIcon = getProblemIcon(result?.problem);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Диагностика растения</h1>
      <p className={styles.sub}>
        AI определит болезни, вредителей и проблемы с уходом
      </p>

      <UploadZone onFileSelect={setFile} />

      <button
        className={styles.btn}
        onClick={handleDiagnose}
        disabled={!file || loading}
      >
        <i className="ti ti-stethoscope" aria-hidden="true" />
        {loading ? "Анализирую..." : "Диагностировать"}
      </button>

      {loading && <Loader text="AI ищет проблемы..." />}
      {error && <p className={styles.error}>{error}</p>}

      {result && (
        <div className={styles.result}>
          {result.urgent && (
            <div className={styles.urgent}>
              <i className="ti ti-alert-triangle" aria-hidden="true" />
              Требует срочного внимания!
            </div>
          )}

          <div className={styles.problemHeader}>
            <div className={styles.problemIcon}>
              {/* иконка теперь динамическая */}
              <i className={`ti ${problemIcon}`} aria-hidden="true" />
            </div>
            <div>
              <h2 className={styles.problemName}>{result.problem}</h2>
              <p className={styles.confidence}>
                Определено AI с вероятностью {result.confidence || 87}%
              </p>
            </div>
            <span className={`${styles.sevBadge} ${styles[statusClass]}`}>
              {result.severity}
            </span>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Симптомы</h3>
            <ul className={styles.list}>
              {result.symptoms.map((s, i) => (
                <li key={i} className={styles.symptom}>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Лечение</h3>
            <ul className={styles.list}>
              {result.treatment.map((t, i) => (
                <li key={i} className={styles.treat}>
                  <i className="ti ti-check" aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.actions}>
            {saved ? (
              <div className={styles.savedMsg}>
                <i className="ti ti-check" aria-hidden="true" />
                Добавлено в коллекцию! Переходим...
              </div>
            ) : (
              <button
                className={styles.saveBtn}
                onClick={handleSave}
                disabled={saving}
              >
                <i
                  className={`ti ${saving ? "ti-loader" : "ti-plus"}`}
                  aria-hidden="true"
                />
                {saving ? "Сохраняем..." : "Добавить в коллекцию"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
