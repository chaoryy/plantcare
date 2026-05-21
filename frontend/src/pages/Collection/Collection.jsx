// src/pages/Collection/Collection.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { plantsAPI } from "../../api/client";
import PlantCard from "../../components/PlantCard/PlantCard";
import ConfirmModal from "../../components/ConfirmModal/ConfrimModal";
import ErrorModal from "../../components/ErrorModal/ErrorModal";
import styles from "../../styles/Collection.module.css"

export default function Collection() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null); // ← новый стейт
  const navigate = useNavigate();

  useEffect(() => {
    plantsAPI
      .getCollection()
      .then((res) => setPlants(res.data?.plants || res.data || []))
      .catch(() =>
        setErrorMsg("Не удалось загрузить коллекцию. Попробуйте позже."),
      )
      .finally(() => setLoading(false));
  }, []);

  const openDeleteModal = (id) => setDeleteId(id);

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await plantsAPI.deleteFromCollection(deleteId);
      setPlants((prev) => prev.filter((p) => p.id !== deleteId));
    } catch {
      setErrorMsg("Не удалось удалить растение. Попробуйте позже.");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  if (loading) return <p className={styles.loading}>Загрузка...</p>;

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Моя коллекция ({plants.length})</h1>
        <button className={styles.addBtn} onClick={() => navigate("/identify")}>
          <i className="ti ti-plus" aria-hidden="true" />
          Добавить растение
        </button>
      </div>

      {plants.length === 0 ? (
        <div className={styles.empty}>
          <i className="ti ti-plant-2" aria-hidden="true" />
          <p>Коллекция пуста</p>
          <button
            className={styles.addBtn}
            onClick={() => navigate("/identify")}
          >
            Определить первое растение
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {plants.map((plant) => (
            <PlantCard
              key={plant.id}
              plant={plant}
              onDelete={openDeleteModal}
            />
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={deleteId !== null}
        title="Удалить растение?"
        message="Вы уверены, что хотите удалить это растение из коллекции? Все данные об уходе будут безвозвратно стёрты."
        onConfirm={handleConfirmDelete}
        onCancel={() => !deleting && setDeleteId(null)}
        isLoading={deleting}
      />

      <ErrorModal
        isOpen={errorMsg !== null}
        message={errorMsg}
        onClose={() => setErrorMsg(null)}
      />
    </div>
  );
}
