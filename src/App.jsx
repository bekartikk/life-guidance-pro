import { Suspense, lazy, useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { auth } from "./firebase";
import AppErrorBoundary from "./components/AppErrorBoundary";
import { usePageTracking } from "./hooks/usePageTracking";
import { identifyUser, resetAnalytics, trackEvent } from "./utils/analytics";
import "./App.css";

const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./components/Login"));
const Dashboard = lazy(() => import("./components/Dashboard"));

function ProtectedRoute({ user, children }) {
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ user, children }) {
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

function HomeRoute({ user }) {
  if (user) return <Navigate to="/dashboard" replace />;
  return <Landing />;
}

function FullScreenLoader() {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-300 text-sm">Setting up your workspace...</p>
      </div>
    </div>
  );
}

function RouteTelemetry() {
  usePageTracking();
  return null;
}

function AppRoutes({ user }) {
  return (
    <Suspense fallback={<FullScreenLoader />}>
      <RouteTelemetry />
      <Routes>
        <Route path="/" element={<HomeRoute user={user} />} />
        <Route
          path="/login"
          element={
            <PublicRoute user={user}>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user}>
              <Dashboard user={user} />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setIsCheckingAuth(false);

      if (currentUser) {
        identifyUser(currentUser);
        trackEvent("auth_state_changed", { state: "authenticated" });
      } else {
        resetAnalytics();
        trackEvent("auth_state_changed", { state: "logged_out" });
      }
    });

    return () => unsubscribe();
  }, []);

  if (isCheckingAuth) {
    return <FullScreenLoader />;
  }

  return (
    <BrowserRouter>
      <AppErrorBoundary>
        <AppRoutes user={user} />
      </AppErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
