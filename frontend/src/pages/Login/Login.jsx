import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authAPI } from "../../api/client";
import ErrorModal from "../../components/ErrorModal/ErrorModal";
import styles from "../../styles/Login.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      setErrorMsg("Неверный email или пароль. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.leftPanel}>
          <div className={styles.logo}>
            <i className="ti ti-leaf" aria-hidden="true" />
            <span>PlantCare AI</span>
          </div>
          <div className={styles.promoContent}>
            <h2 className={styles.promoTitle}>
              Умный уход за твоими растениями
            </h2>
            <p className={styles.promoSub}>
              AI определяет вид по фото, анализирует состояние и составляет
              персональный график полива с учётом погоды.
            </p>
          </div>
          <div className={styles.features}>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <i className="ti ti-camera" />
              </div>
              <span>Определение вида по фотографии</span>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <i className="ti ti-device-laptop" />
              </div>
              <span>Диагностика болезней и вредителей</span>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <i className="ti ti-calendar-event" />
              </div>
              <span>График полива с учётом погоды</span>
            </div>
          </div>
        </div>

        <div className={styles.rightPanel}>
          <h1 className={styles.title}>Добро пожаловать</h1>
          <p className={styles.sub}>Войдите в свой аккаунт, чтобы продолжить</p>

          <form onSubmit={handleSubmit} className={styles.form}>
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
              <label>Пароль</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Введите пароль"
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

            <div className={styles.forgotWrapper}>
              <Link to="/forgot" className={styles.forgotLink}>
                Забыли пароль?
              </Link>
            </div>

            <button type="submit" className={styles.btn} disabled={loading}>
              {loading ? "Входим..." : "Войти"}
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
            Продолжить через Google
          </button>

          <p className={styles.footerText}>
            Нет аккаунта?{" "}
            <Link to="/register" className={styles.link}>
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </div>

      <ErrorModal
        isOpen={errorMsg !== ""}
        title="Ошибка входа"
        message={errorMsg}
        onClose={() => setErrorMsg("")}
      />
    </div>
  );
}
