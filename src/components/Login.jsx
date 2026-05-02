import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";
import heroImage from "../assets/hero.png";

const trustSignals = [
  "Personal routines shaped around real energy and real schedules",
  "Career and future suggestions based on goals, hobbies, and pressure points",
  "Flexible planning flow where users can keep adjusting the routine over time",
];

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      if (mode === "login") {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        if (!credential.user.emailVerified) {
          setMessage("Logged in. A verification email is still recommended so account recovery stays easier.");
        }
      } else {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(credential.user);
        setMessage("Account created. A verification email has been sent to help secure your account.");
      }
    } catch (error) {
      setMessage(error.message.replace("Firebase: ", ""));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email.trim()) {
      setMessage("Enter your email first, then use password reset.");
      return;
    }

    setIsSendingReset(true);
    setMessage("");
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setMessage("Password reset email sent. Check your inbox and spam folder.");
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
      setMessage("Google sign-in completed.");
    } catch (error) {
      setMessage(error.message.replace("Firebase: ", ""));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <section className="auth-layout" id="auth-shell">
      <div className="auth-copy">
        <p className="eyebrow">A clearer next step starts here</p>
        <h2>Turn stress, uncertainty, and overthinking into a plan you can actually follow.</h2>
        <p>
          This space helps users shape routines, future direction, and small daily wins.
          It is supportive planning, not therapy, medical advice, or emergency care.
        </p>
        <div className="feature-list">
          {trustSignals.map((item) => (
            <div key={item} className="feature-item">
              <span className="feature-dot" />
              <span>{item}</span>
            </div>
          ))}
        </div>
        <div className="auth-visual-card" aria-hidden="true">
          <img src={heroImage} alt="" />
          <div>
            <strong>One system instead of scattered notes</strong>
            <p>Plans, reviews, goals, habits, reminders, and rewards stay connected so progress doesn’t disappear.</p>
          </div>
        </div>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-heading">
          <p className="eyebrow">Your private account</p>
          <h2>{mode === "login" ? "Welcome back" : "Create your account"}</h2>
          <p>
            {mode === "login"
              ? "Pick up your planning flow and continue building routines that fit your life."
              : "Create an account so you can build guidance plans and keep improving them over time."}
          </p>
        </div>

        <label>
          Email
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Minimum 6 characters" minLength="6" required />
        </label>

        {message && <p className={message.toLowerCase().includes("sent") || message.toLowerCase().includes("logged in") ? "success-message" : "error-message"}>{message}</p>}

        <button className="primary-button" disabled={isLoading}>
          {isLoading ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
        </button>

        <button className="secondary-button" type="button" onClick={handleGoogleSignIn} disabled={isGoogleLoading}>
          {isGoogleLoading ? "Connecting Google..." : "Continue with Google"}
        </button>

        <div className="auth-helper-actions">
          <button className="link-button" type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")}>
            {mode === "login" ? "Need an account? Sign up" : "Already have an account? Login"}
          </button>
          <button className="link-button" type="button" onClick={handleResetPassword} disabled={isSendingReset}>
            {isSendingReset ? "Sending reset..." : "Forgot password?"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default Login;
