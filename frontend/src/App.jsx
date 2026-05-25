import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Identify from "./pages/Identify/Identify";
import Diagnose from "./pages/Diagnose/Diadnose";
import Recommend from "./pages/Recommend/Recommend";
import Collection from "./pages/Collection/Collection";
import Schedule from "./pages/Schedule/Schedule";

import Layout from "./components/Layout/Layout";

function PrivateRoute({ children }) {
  const { token, isLoading } = useAuth(); 

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
  }

  return token ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { token, isLoading } = useAuth(); 

  if (isLoading) {
    return null; 
  }

  return token ? <Navigate to="/" replace /> : children;
}

function AppRoutes() {
  return (
    <Routes>
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
