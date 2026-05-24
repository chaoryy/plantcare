import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// страницы
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Identify from "./pages/Identify/Identify";
import Diagnose from "./pages/Diagnose/Diadnose";
import Recommend from "./pages/Recommend/Recommend";
import Collection from "./pages/Collection/Collection";
import Schedule from "./pages/Schedule/Schedule";

// layout с сайдбаром
import Layout from "./components/Layout/Layout";

// если токена нет — редирект на /login, но только ПОСЛЕ загрузки контекста
function PrivateRoute({ children }) {
  const { token, isLoading } = useAuth(); // ← Добавили isLoading

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "vh",
        }}
      >
        Loading...
      </div>
    );
    // Сюда можно будет бахнуть твой красивый Loader, если захочешь
  }

  return token ? children : <Navigate to="/login" replace />;
}

// если токен есть и юзер идёт на /login или /register — редирект на главную
function PublicRoute({ children }) {
  const { token, isLoading } = useAuth(); // ← Добавили isLoading

  if (isLoading) {
    return null; // Просто ждем окончания проверки токена
  }

  return token ? <Navigate to="/" replace /> : children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* публичные страницы — только для незалогиненных */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* защищённые страницы — только для залогиненных */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="identify" element={<Identify />} />
        <Route path="diagnose" element={<Diagnose />} />
        <Route path="recommend" element={<Recommend />} />
        <Route path="collection" element={<Collection />} />
        <Route path="schedule" element={<Schedule />} />
      </Route>

      {/* любой неизвестный путь → на главную */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
