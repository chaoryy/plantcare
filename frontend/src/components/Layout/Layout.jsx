import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./Layout.module.css";

const NAV_ITEMS = [
  { path: "/", icon: "ti-layout-dashboard", label: "Home" },
  { path: "/identify", icon: "ti-camera", label: "Identify type" },
  { path: "/diagnose", icon: "ti-stethoscope", label: "Diagnostics" },
  { path: "/recommend", icon: "ti-sparkles", label: "Recommend plant" },
  { path: "/collection", icon: "ti-plant-2", label: "My collection" },
  { path: "/schedule", icon: "ti-calendar", label: "Calendar" },
];

export default function Layout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className={styles.wrapper}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <i className="ti ti-leaf" />
          <span>PlantCare</span>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map(({ path, icon, label }) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/"}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ""}`
              }
            >
              <i className={`ti ${icon}`} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className={styles.bottom}>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <i className="ti ti-logout" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
