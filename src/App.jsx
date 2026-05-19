import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { auth } from "./firebase";
import AppErrorBoundary from "./components/AppErrorBoundary";
import { usePageTracking } from "./hooks/usePageTracking";
import { identifyUser, resetAnalytics, trackEvent } from "./utils/analytics";
import { captureException } from "./monitoring/sentry";
import "./App.css";

function isComponentLike(value) {
  if (typeof value === "function") {
    return true;
  }

  if (!value || typeof value !== "object") {
    return false;
  }

  const reactType = value.$$typeof;
  const description = typeof reactType === "symbol" ? reactType.description : "";

  return description === "react.memo" || description === "react.forward_ref";
}

function resolveLazyComponent(module) {
  const directDefault = module?.default;
  if (isComponentLike(directDefault)) {
    return directDefault;
  }

  const nestedDefault = directDefault?.default;
  if (isComponentLike(nestedDefault)) {
    return nestedDefault;
  }

  return null;
}

function safeLazy(loader, title) {
  const wrappedLoader = () =>
    loader()
      .then((module) => {
        const component = resolveLazyComponent(module);
        if (import.meta.env.DEV) {
          console.log("loaded:", title, component?.displayName || component?.name || component?.$$typeof?.description || typeof component);
        }
        if (!component) {
          console.error("Invalid lazy component:", title, module);
          throw new Error(`Invalid lazy component export for ${title}.`);
        }
        return { default: component };
      })
      .catch((error) => {
        captureException(error, {
          tags: { boundary: "app-route-lazy", route_title: title },
        });
        return {
          default: function RouteFallback() {
            return (
              <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
                <div className="flex flex-col items-center gap-4 text-center px-6">
                  <div className="h-10 w-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  <p className="text-slate-300 text-sm">This view could not load right now. Refresh and try again.</p>
                </div>
              </div>
            );
          },
        };
      });

  const LazyComponent = lazy(wrappedLoader);
  LazyComponent.preload = () => wrappedLoader().then(() => null).catch(() => null);
  return LazyComponent;
}

const Landing = safeLazy(() => import("./pages/Landing"), "Landing");
const Login = safeLazy(() => import("./components/Login"), "Login");
const Dashboard = safeLazy(() => import("./components/Dashboard"), "Dashboard");

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
  const authResolvedRef = useRef(false);

  useEffect(() => {
    let isActive = true;
    const authTimeout = window.setTimeout(() => {
      if (!isActive || authResolvedRef.current) {
        return;
      }
      setIsCheckingAuth(false);
    }, 8000);

    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      authResolvedRef.current = true;
      if (!isActive) {
        return;
      }

      setUser((previousUser) => {
        if ((previousUser?.uid || null) === (currentUser?.uid || null)) {
          return previousUser || currentUser;
        }
        return currentUser;
      });
      setIsCheckingAuth(false);

      try {
        if (currentUser) {
          identifyUser(currentUser);
          trackEvent("auth_state_changed", { state: "authenticated" });
        } else {
          resetAnalytics();
          trackEvent("auth_state_changed", { state: "logged_out" });
        }
      } catch (error) {
        captureException(error, {
          tags: { surface: "app_auth_hydration" },
        });
      }
    });

    return () => {
      isActive = false;
      window.clearTimeout(authTimeout);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isCheckingAuth || typeof window === "undefined") {
      return undefined;
    }

    const schedule =
      "requestIdleCallback" in window
        ? window.requestIdleCallback.bind(window)
        : (callback) => window.setTimeout(callback, 200);

    const cancel =
      "cancelIdleCallback" in window
        ? window.cancelIdleCallback.bind(window)
        : window.clearTimeout.bind(window);

    const handle = schedule(() => {
      if (user) {
        void Dashboard.preload?.();
      } else {
        void Login.preload?.();
        void Dashboard.preload?.();
      }
    });

    return () => cancel(handle);
  }, [isCheckingAuth, user]);

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
