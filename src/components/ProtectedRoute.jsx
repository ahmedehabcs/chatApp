import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { checkAuth } from "../api/auth.js";
import { clearDB } from "../utils/db.js";
import Loading from "./Loading.jsx";

export default function ProtectedRoute({ children, requiresAuth }) {
    const [isAuth, setIsAuth] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const auth = await checkAuth();
                if (cancelled) return;

                if (!auth) {
                    await clearDB();
                    setIsAuth(false);
                } else {
                    setIsAuth(true);
                }
            } catch (err) {
                console.error("Auth check failed:", err);
                if (!cancelled) {
                    await clearDB();
                    setIsAuth(false);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => cancelled = true;
    }, []);

    if (loading) return <Loading />;

    // If route requires login but user is not logged in
    if (requiresAuth && !isAuth) return <Navigate to="/login" replace />;

    // If route requires logout but user is logged in
    if (!requiresAuth && isAuth) return <Navigate to="/dashboard" replace />;

    return children;
}