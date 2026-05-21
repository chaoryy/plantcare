import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { plantsAPI } from "../../api/client";
import UploadZone from "../../components/UploadZone/UploadZone";
import Loader from "../../components/Loader/Loader";
import styles from "../../styles/Identify.module.css";

export default function Identify() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await plantsAPI.identify(file);
      setResult(res.data);
    } catch {
      setError("Unable to identify the plant. Try a different photo.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result || saved) return;
    setSaving(true);
    try {
      await plantsAPI.addToCollection({
        plant_name: result.name,
        latin: result.latin,
        photo_url: null,
      });
      setSaved(true);
      setTimeout(() => navigate("/collection"), 1500);
    } catch {
      setError("Failed to save the plant.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Identify Plant</h1>
      <p className={styles.sub}>
        Upload a photo – AI will identify the species with up to 95% accuracy
      </p>

      <UploadZone onFileSelect={setFile} />

      <button
        className={styles.btn}
        onClick={handleAnalyze}
        disabled={!file || loading}
      >
        <i className="ti ti-sparkles" aria-hidden="true" />
        {loading ? "Analyzing..." : "Define"}
      </button>

      {loading && <Loader text="AI analyzes photos..." />}

      {error && <p className={styles.error}>{error}</p>}

      {result && (
        <div className={styles.result}>
          <div className={styles.resultHeader}>
            <div className={styles.resultIcon}>
              <i className="ti ti-leaf" aria-hidden="true" />
            </div>
            <div>
              <h2 className={styles.plantName}>{result.name}</h2>
              <p className={styles.plantLatin}>
                {result.latin} · confidence {result.confidence}%
              </p>
            </div>
            <span className={styles.confBadge}>
              <i className="ti ti-check" /> Defined
            </span>
          </div>

          <p className={styles.desc}>{result.description}</p>

          <div className={styles.careGrid}>
            <div className={styles.careItem}>
              <i className="ti ti-droplet" aria-hidden="true" />
              <span className={styles.careLabel}>Watering</span>
              <span className={styles.careVal}>{result.care.water}</span>
            </div>
            <div className={styles.careItem}>
              <i className="ti ti-sun" aria-hidden="true" />
              <span className={styles.careLabel}>Light</span>
              <span className={styles.careVal}>{result.care.light}</span>
            </div>
            <div className={styles.careItem}>
              <i className="ti ti-temperature" aria-hidden="true" />
              <span className={styles.careLabel}>Temperature</span>
              <span className={styles.careVal}>{result.care.temperature}</span>
            </div>
          </div>

          {saved ? (
            <div className={styles.savedMsg}>
              <i className="ti ti-check" aria-hidden="true" />
              Added to the collection! Let's move on.
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
              {saving ? "Saving..." : "Add to collection"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
