import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authAPI } from "../../api/client";
import ErrorModal from "../../components/ErrorModal";
import styles from "../../styles/Login.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setErrorMsg("Заполните все поля.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await authAPI.login({ email, password });
      login(res.data.token);
      navigate("/");
    } catch {
      setErrorMsg("Неверный пароль или email. Попробуйтк еще раз.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.long}>
          <i className="ti ti-plant-2" aria-hidden="true" />
          <span>PlantCare</span>
        </div>

        <h1 className={styles.title}>Добро пожаловать!</h1>
        <p className={styles.sub}>Войдите чтобы следить за своими растениями</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Email</label>
            <input
              type="text"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Пароль</label>
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <button type="submit" disabled={loading} className={styles.btn}>
            {loading ? "Загрузка..." : "Войти"}
          </button>
        </form>

        <p className={styles.footerText}>
          Нет аккаунта? <Link className={styles.link}>Зарегистрироваться</Link>
        </p>
      </div>

      <ErrorModal>
        isOpen={errorMsg !== ""}
        title = "Ошибка входа" message={errorMsg}
        onClose={() => setErrorMsg("")}
      </ErrorModal>
    </div>
  );
}
