/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout/Layout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Identify from "./pages/Identify/Identify";


function PrivateRoute({ children }) {
  return children;
}

function AppRoutes() {
  return (
    <Routes>
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
        <Route path="diagnose" element={<div>Тут будет Diagnostics 🩺</div>} />
        <Route path="recommend" element={<div>Тут будет Recommend ✨</div>} />
        <Route
          path="collection"
          element={<div>Тут будет My Collection 🪴</div>}
        />
        <Route path="schedule" element={<div>Тут будет Calendar 📅</div>} />
      </Route>

      <Route path="/login" element={<div>Страница Login</div>} />
      <Route path="/register" element={<div>Страница Register</div>} />

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
