import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout/Layout";

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoute>
            {" "}
            <Layout />{" "}
          </PrivateRoute>
        }
      >
        <Route index element={<div>Лендинг (в разработке)</div>} />
        <Route
          path="identify"
          element={<div>Идентификация (в разработке)</div>}
        />
        <Route
          path="diagnose"
          element={<div>Диагностика (в разработке)</div>}
        />
        <Route
          path="recommend"
          element={<div>Рекомендации (в разработке)</div>}
        />
        <Route
          path="collection"
          element={<div>Коллекция (в разработке)</div>}
        />
        <Route path="schedule" element={<div>Календарь (в разработке)</div>} />
      </Route>

      {/* Временные заглушки для авторизации */}
      <Route path="/login" element={<div>Страница Login (в разработке)</div>} />
      <Route
        path="/register"
        element={<div>Страница Register (в разработке)</div>}
      />

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
