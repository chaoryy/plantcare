/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout/Layout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Identify from "./pages/Identify/Identify";
import Diagnose from "./pages/Diagnose/Diadnose";
import Collection from "./pages/Collection/Collection";
import Recommend from "./pages/Recommend/Recommend";
import Schedule from "./pages/Schedule/Schedule";

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
        <Route path="diagnose" element={<Diagnose />} />
        <Route path="recommend" element={<Recommend />} />
        <Route path="collection" element={<Collection />} />
        <Route path="schedule" element={<Schedule/>} />
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
