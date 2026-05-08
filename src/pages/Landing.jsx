import { Link } from "react-router-dom";

export default function Landing() {
  return (
<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,.3),rgba(255,119,198,.1),transparent)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(120,119,198,.3),rgba(255,119,198,.1),transparent)]"></div>
      </div>

      {/* 🔝 NAVBAR */}
      <nav className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        <h1 className="text-2xl font-black bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent drop-shadow-lg">
            Life Guidance Pro
          </h1>
        <Link
          to="/login"
          className="bg-gradient-to-r from-primary-500 to-blue-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 hover:from-primary-600 hover:to-blue-700"
        >
          Get Started
        </Link>
      </nav>

      {/* 🚀 HERO */}
      <section className="min-h-[80vh] flex items-center">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

          {/* LEFT */}
          <div>
            <span className="inline-block mb-4 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-full">
              AI Powered Life Planning
            </span>

            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Design Your Life With{" "}
              <span className="text-purple-600">Clarity & Direction</span>
            </h1>

            <p className="text-lg text-gray-600 mb-8">
              Plan goals, build habits, and track your progress with intelligent AI guidance.
            </p>

            <div className="flex gap-4">
              <Link
                to="/login"
                className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:scale-105 transition"
              >
                Start Planning Free
              </Link>

              <a
                href="#features"
                className="border px-6 py-3 rounded-xl hover:bg-gray-100 transition"
              >
                Explore Features
              </a>
            </div>
          </div>

          {/* RIGHT */}
          <div className="bg-white rounded-2xl shadow-xl p-6 hover:scale-105 transition duration-500">
            <h3 className="font-semibold mb-4">Your Dashboard</h3>

            <div className="mb-4">
              <p className="text-sm text-gray-500">Main Goal</p>
              <p className="font-medium">Become more productive</p>
            </div>

            <div className="mb-4">
              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div className="bg-purple-600 h-2 w-2/3 rounded-full"></div>
              </div>
            </div>

            <div className="bg-purple-50 p-3 rounded-lg text-sm text-purple-700">
              💡 AI Suggestion: Focus on your top 3 tasks today
            </div>
          </div>

        </div>
      </section>

      {/* ⭐ FEATURES */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">

          <h2 className="text-3xl font-bold mb-12">
            Everything You Need to Improve Your Life
          </h2>

          <div className="grid md:grid-cols-3 gap-8">

            {[
              {
                title: "AI Life Planning",
                desc: "Get personalized plans based on your goals and lifestyle.",
              },
              {
                title: "Habit Tracking",
                desc: "Build consistency with smart tracking and reminders.",
              },
              {
                title: "Progress Analytics",
                desc: "Visualize your growth and stay motivated every day.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
              >
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* 🔄 HOW IT WORKS */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">

          <h2 className="text-3xl font-bold mb-12">How It Works</h2>

          <div className="grid md:grid-cols-3 gap-8 text-left">

            {[
              "Set your goals and preferences",
              "Get AI-powered personalized plan",
              "Track progress and improve daily",
            ].map((step, i) => (
              <div key={i} className="p-6 border rounded-xl">
                <span className="text-purple-600 font-bold text-xl">
                  {i + 1}
                </span>
                <p className="mt-2 text-gray-700">{step}</p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* 🔥 FINAL CTA */}
      <section className="py-20 bg-purple-600 text-white text-center">
        <h2 className="text-3xl font-bold mb-6">
          Start Building Your Life Today
        </h2>

        <Link
          to="/login"
          className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:scale-105 transition"
        >
          Get Started Free
        </Link>
      </section>

    </div>
  );
}