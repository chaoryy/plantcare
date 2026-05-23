import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authAPI } from "../../api/client";
import ErrorModal from "../../components/ErrorModal/ErrorModal";
import styles from "../../styles/Login.module.css";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !firstName.trim() ||
      !email.trim() ||
      !city.trim() ||
      !password.trim()
    ) {
      setErrorMsg("Заполните все поля.");
      return;
    }
    if (password.length < 8) {
      setErrorMsg("Пароль должен быть не менее 8 символов.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await authAPI.register({
        username: firstName.trim(),
        email,
        city,
        password,
      });
      login(res.data.token);
      navigate("/");
    } catch {
      setErrorMsg("Ошибка регистрации. Возможно, этот email уже используется.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Левая панель */}
        <div className={styles.leftPanel}>
          <div className={styles.logo}>
            <i className="ti ti-leaf" aria-hidden="true" />
            <span>PlantCare AI</span>
          </div>
          <div className={styles.promoContent}>
            <h2 className={styles.promoTitle}>
              Начни заботиться о растениях правильно
            </h2>
            <p className={styles.promoSub}>
              Создай аккаунт и получи персонального AI-ботаника в кармане.
              Бесплатно.
            </p>
          </div>
          <div className={styles.features}>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <i className="ti ti-building-store" />
              </div>
              <span>Коллекция всех твоих растений</span>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <i className="ti ti-sun" />
              </div>
              <span>Прогноз погоды — полив под климат</span>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <i className="ti ti-bell" />
              </div>
              <span>Напоминания о поливе</span>
            </div>
          </div>
        </div>

        <div className={styles.rightPanel}>
          <h1 className={styles.title}>Создать аккаунт</h1>
          <p className={styles.sub}>
            Уже есть аккаунт?{" "}
            <Link to="/login" className={styles.link}>
              Войти
            </Link>
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label>Имя</label>
              <input
                type="text"
                placeholder="Алина"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Город</label>
              <input
                type="text"
                placeholder="Бишкек"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Пароль</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Минимум 8 символов"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i
                    className={`ti ${showPassword ? "ti-eye-off" : "ti-eye"}`}
                  />
                </button>
              </div>
            </div>

            <button type="submit" className={styles.btn} disabled={loading}>
              {loading ? "Создаем..." : "Создать аккаунт"}
            </button>
          </form>

          <div className={styles.divider}>
            <span>или</span>
          </div>

          <button type="button" className={styles.googleBtn}>
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
            Зарегистрироваться через Google
          </button>
        </div>
      </div>

      <ErrorModal
        isOpen={errorMsg !== ""}
        title="Ошибка регистрации"
        message={errorMsg}
        onClose={() => setErrorMsg("")}
      />
    </div>
  );
}
