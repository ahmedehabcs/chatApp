import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, lazy, Suspense } from "react";
import { getPrivateKey } from "./utils/db.js";
import Loading from "./components/Loading.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const Home = lazy(() => import("./pages/Home.jsx"));
const Register = lazy(() => import("./pages/Register.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const Verify = lazy(() => import("./pages/Verify.jsx"));

export default function App() {
  const [privateKey, setPrivateKey] = useState(null);

  useEffect(() => {
    (async () => {
      const key = await getPrivateKey();
      if (key) setPrivateKey(key);
    })();
  }, []);

  return (
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />

          {/* only when logged OUT */}
          <Route
            path="/register"
            element={
              <ProtectedRoute requiresAuth={false}>
                <Register />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={
              <ProtectedRoute requiresAuth={false}>
                <Login />
              </ProtectedRoute>
            }
          />

          {/* only when logged IN */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiresAuth={true}>
                <Dashboard privateKey={privateKey} setPrivateKey={setPrivateKey} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/add/:key"
            element={
              <ProtectedRoute requiresAuth={true}>
                <Dashboard privateKey={privateKey} setPrivateKey={setPrivateKey} />
              </ProtectedRoute>
            }
          />

          <Route path="/verify" element={<Verify />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
  );
}