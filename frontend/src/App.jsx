/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout/Layout";


// Временный PrivateRoute, который всегда пропускает, пока мы верстаем лендинг
function PrivateRoute({ children }) {
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Наш Layout и дочерние страницы внутри него */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<div>Тут будет Dashboard 🌿</div>} />
        <Route path="identify" element={<div>Тут будет Identify 📷</div>} />
        <Route path="diagnose" element={<div>Тут будет Diagnostics 🩺</div>} />
        <Route path="recommend" element={<div>Тут будет Recommend ✨</div>} />
        <Route
          path="collection"
          element={<div>Тут будет My Collection 🪴</div>}
        />
        <Route path="schedule" element={<div>Тут будет Calendar 📅</div>} />
      </Route>

      {/* Временные заглушки для страниц входа/регистрации */}
      <Route path="/login" element={<div>Страница Login</div>} />
      <Route path="/register" element={<div>Страница Register</div>} />

      {/* Редирект на главную, если роут не найден */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// Главный компонент, в котором теперь реально используются BrowserRouter и AuthProvider
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
