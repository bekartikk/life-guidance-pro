import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import "./App.css";

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

  if (isCheckingAuth) {
    return <main className="page-shell loading-shell">Loading your space...</main>;
  }

  return (
    <main className="page-shell">
      <section className="topbar">
        <div className="brand-copy">
          <p className="eyebrow">Private life planning studio</p>
          <h1>Life Guidance Pro</h1>
          <p className="brand-subtitle">
            Build routines, roadmaps, and calmer next steps that actually fit your real life.
          </p>
        </div>

        {user ? (
          <div className="account-actions">
            <div className="account-badge">
              <span className="account-label">Signed in</span>
              <strong>{user.email}</strong>
            </div>
            <button className="secondary-button" onClick={() => signOut(auth)}>
              Logout
            </button>
          </div>
        ) : (
          <div className="topbar-note">Private answers. Flexible plans. Gentle guidance.</div>
        )}
      </section>

      {user ? <Dashboard user={user} /> : <Login />}
    </main>
  );
}

export default App;
