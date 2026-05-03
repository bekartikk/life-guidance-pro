import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { auth } from "./firebase";

import Landing from "./pages/Landing";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import AppErrorBoundary from "./components/AppErrorBoundary";

import "./App.css";

/* 🔐 Protected Route Wrapper */
function ProtectedRoute({ user, children }) {
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

/* 🚫 Public Route Wrapper (avoid logged-in users seeing login) */
function PublicRoute({ user, children }) {
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

function App() {
  const [user, setUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setIsCheckingAuth(false);
    });

    return unsubscribe;
  }, []);

  /* ⏳ Better Loading UI */
  if (isCheckingAuth) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Setting up your workspace...</p>
        </div>
      </main>
    );
  }

  return (
    <BrowserRouter>
      <AppErrorBoundary>
        <Routes>
          {/* 🌐 Landing */}
          <Route path="/" element={<Landing />} />

          {/* 🔓 Public */}
          <Route
            path="/login"
            element={
              <PublicRoute user={user}>
                <Login />
              </PublicRoute>
            }
          />

          {/* 🔐 Protected */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute user={user}>
                <Dashboard user={user} />
              </ProtectedRoute>
            }
          />

          {/* 🚫 Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
