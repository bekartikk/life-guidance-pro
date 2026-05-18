import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  HiOutlineArrowLeft,
  HiOutlineCheckCircle,
  HiOutlineHeart,
  HiOutlineLightBulb,
  HiOutlineMoon,
  HiOutlineSparkles,
} from "react-icons/hi2";
import { auth } from "../firebase";
import { trackEvent } from "../utils/analytics";
import "../styles/auth-onboarding.css";

const trustSignals = [
  "Personal routines shaped around real energy and real schedules",
  "Career guidance based on your real goals and situation",
  "Flexible planning system that evolves with you instead of judging you",
];

const onboardingSteps = [
  "Daily routine and wake/sleep pattern",
  "Goals, stress, and real-world pressure",
  "Hobbies, happiness triggers, and energy",
  "Career direction, skills, and future scope",
  "AI guidance style and emotional support preferences",
];

const coachModes = [
  { title: "Supportive Mentor", icon: HiOutlineHeart, description: "Gentle, encouraging, emotionally aware guidance." },
  { title: "Discipline Coach", icon: HiOutlineCheckCircle, description: "Clearer structure, stronger accountability, less drift." },
  { title: "Balanced Strategist", icon: HiOutlineLightBulb, description: "Keeps life, energy, growth, and ambition in proportion." },
  { title: "Recovery Mode", icon: HiOutlineMoon, description: "Lowers intensity when stress, burnout, or heaviness is high." },
];

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState("Supportive Mentor");

  const isSuccessMessage =
    message.toLowerCase().includes("sent") ||
    message.toLowerCase().includes("logged") ||
    message.toLowerCase().includes("created");

  const selectedCoach = useMemo(
    () => coachModes.find((item) => item.title === selectedMode) || coachModes[0],
    [selectedMode],
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
        trackEvent("login_completed", { method: "email" });
        navigate("/dashboard");
      } else {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(credential.user);
        trackEvent("signup_completed", {
          method: "email",
          coach_mode: selectedMode,
        });
        setMessage("Account created. Verification email sent.");
      }
    } catch (error) {
      setMessage(error.message.replace("Firebase: ", ""));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email.trim()) {
      setMessage("Enter your email first.");
      return;
    }

    setIsSendingReset(true);
    setMessage("");

    try {
      await sendPasswordResetEmail(auth, email.trim());
      trackEvent("password_reset_requested");
      setMessage("Password reset email sent.");
    } catch (error) {
      setMessage(error.message.replace("Firebase: ", ""));
    } finally {
      setIsSendingReset(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setMessage("");

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      trackEvent(mode === "login" ? "login_completed" : "signup_completed", {
        method: "google",
        coach_mode: selectedMode,
      });
      navigate("/dashboard");
    } catch (error) {
      setMessage(error.message.replace("Firebase: ", ""));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const CoachIcon = selectedCoach.icon;

  return (
    <section className="auth-experience">
      <div className="auth-experience__orb auth-experience__orb--violet" />
      <div className="auth-experience__orb auth-experience__orb--teal" />

      <Link to="/" className="auth-back-link">
        <HiOutlineArrowLeft className="h-4 w-4" />
        Back to home
      </Link>

      <div className="auth-layout">
        <aside className="auth-story-panel">
          <div className="auth-story-panel__copy">
            <p className="auth-eyebrow">Welcome AI onboarding</p>
            <h1>Start building a life system that adapts with you.</h1>
            <p>
              After signup, the AI will guide you through routine, energy, goals, pressure, interests, career direction, and the coaching style that fits you best.
            </p>
          </div>

          <div className="auth-trust-list">
            {trustSignals.map((item) => (
              <div key={item} className="auth-trust-item">
                <HiOutlineCheckCircle className="h-4.5 w-4.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="auth-onboarding-card">
            <div className="auth-onboarding-card__head">
              <span>Setup journey</span>
              <strong>5 AI-guided stages</strong>
            </div>
            <div className="auth-onboarding-steps">
              {onboardingSteps.map((step, index) => (
                <article key={step} className="auth-onboarding-step">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{step}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="auth-coach-card">
            <div className="auth-coach-card__head">
              <span>AI personality preview</span>
              <strong>{selectedCoach.title}</strong>
            </div>
            <div className="auth-coach-grid">
              {coachModes.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.title}
                    type="button"
                    className={item.title === selectedMode ? "auth-coach-option is-active" : "auth-coach-option"}
                    onClick={() => {
                      setSelectedMode(item.title);
                      trackEvent("onboarding_coach_mode_selected", { mode: item.title });
                    }}
                  >
                    <Icon className="h-4.5 w-4.5" />
                    <span>{item.title}</span>
                  </button>
                );
              })}
            </div>
            <div className="auth-coach-preview">
              <CoachIcon className="h-5 w-5" />
              <p>{selectedCoach.description}</p>
            </div>
          </div>
        </aside>

        <form onSubmit={handleSubmit} className="auth-form-panel">
          <div className="auth-form-panel__head">
            <p className="auth-eyebrow">Secure access</p>
            <h2>{mode === "login" ? "Welcome back" : "Create your workspace"}</h2>
            <p>
              {mode === "login"
                ? "Continue your adaptive planning journey."
                : "Your account opens the full AI life operating system experience."}
            </p>
          </div>

          <div className="auth-mode-switch">
            <button
              type="button"
              className={mode === "login" ? "is-active" : ""}
              onClick={() => setMode("login")}
            >
              Log in
            </button>
            <button
              type="button"
              className={mode === "signup" ? "is-active" : ""}
              onClick={() => setMode("signup")}
            >
              Sign up
            </button>
          </div>

          <div className="auth-input-grid">
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Minimum 6 characters"
                minLength="6"
                required
              />
            </label>
          </div>

          {message ? (
            <p className={isSuccessMessage ? "auth-message auth-message--success" : "auth-message auth-message--error"}>
              {message}
            </p>
          ) : null}

          <button disabled={isLoading} className="auth-primary-button">
            {isLoading
              ? "Please wait..."
              : mode === "login"
                ? "Enter dashboard"
                : "Create my workspace"}
          </button>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="auth-secondary-button"
          >
            <HiOutlineSparkles className="h-4.5 w-4.5" />
            {isGoogleLoading ? "Connecting..." : "Continue with Google"}
          </button>

          <div className="auth-form-actions">
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
            >
              {mode === "login" ? "Need an account?" : "Already have an account?"}
            </button>

            <button type="button" onClick={handleResetPassword} disabled={isSendingReset}>
              {isSendingReset ? "Sending..." : "Forgot password?"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Login;
