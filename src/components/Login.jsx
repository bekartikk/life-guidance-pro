import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";

const trustSignals = [
  "Personal routines shaped around real energy and real schedules",
  "Career guidance based on your real goals and situation",
  "Flexible planning system that evolves with you",
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

  const isSuccessMessage =
    message.toLowerCase().includes("sent") ||
    message.toLowerCase().includes("logged") ||
    message.toLowerCase().includes("created");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/dashboard");
      } else {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(credential.user);
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
      navigate("/dashboard");
    } catch (error) {
      setMessage(error.message.replace("Firebase: ", ""));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

      {/* 🔙 BACK */}
      <Link
        to="/"
        className="absolute top-6 left-6 text-sm text-gray-600 hover:text-black"
      >
        ← Back to home
      </Link>

      <div className="grid md:grid-cols-2 gap-10 max-w-5xl w-full">

        {/* LEFT SIDE */}
        <div className="hidden md:flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4">
            Build your life with clarity
          </h2>

          <p className="text-gray-600 mb-6">
            Plan goals, build habits, and track your progress with AI-powered guidance.
          </p>

          <div className="space-y-3">
            {trustSignals.map((item) => (
              <div key={item} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-purple-600 mt-1">•</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-lg space-y-6"
        >
          <div>
            <h2 className="text-2xl font-bold">
              {mode === "login" ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-sm text-gray-500">
              {mode === "login"
                ? "Continue your journey"
                : "Start building your life system"}
            </p>
          </div>

          {/* INPUTS */}
          <div className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              required
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min 6 characters)"
              className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              minLength="6"
              required
            />
          </div>

          {/* MESSAGE */}
          {message && (
            <p
              className={`text-sm text-center ${
                isSuccessMessage ? "text-green-600" : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}

          {/* PRIMARY BUTTON */}
          <button
            disabled={isLoading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:scale-[1.02] transition"
          >
            {isLoading
              ? "Please wait..."
              : mode === "login"
              ? "Login"
              : "Create account"}
          </button>

          {/* GOOGLE */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="w-full border py-3 rounded-lg hover:bg-gray-100 transition"
          >
            {isGoogleLoading ? "Connecting..." : "Continue with Google"}
          </button>

          {/* ACTIONS */}
          <div className="flex justify-between text-sm">
            <button
              type="button"
              onClick={() =>
                setMode(mode === "login" ? "signup" : "login")
              }
              className="text-purple-600 hover:underline"
            >
              {mode === "login"
                ? "Create account"
                : "Login instead"}
            </button>

            <button
              type="button"
              onClick={handleResetPassword}
              disabled={isSendingReset}
              className="text-gray-500 hover:underline"
            >
              {isSendingReset ? "Sending..." : "Forgot?"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Login;
