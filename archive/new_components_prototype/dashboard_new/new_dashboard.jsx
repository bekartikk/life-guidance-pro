import { useState, useEffect } from 'react';
import AppLayout from "../new_layout/applayout.jsx";
import Overview from "../sections/overview";
import StatsGrid from "../sections/statsgrid";
import PlannerSection from "../sections/plannersection";

export default function Dashboard() {
  const [progress, setProgress] = useState({
    momentumPoints: 75,
    activeStreak: 3,
    totalPlans: 2,
  });
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simulate loading and data fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setPlans([
        { id: 1, title: 'Deep work session', status: 'active' },
        { id: 2, title: 'Morning routine', status: 'completed' },
      ]);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const handlePlanAdded = (newPlanTitle) => {
    const newPlan = {
      id: Date.now(),
      title: newPlanTitle,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    setPlans([newPlan, ...plans]);
    setProgress(prev => ({
      ...prev,
      totalPlans: prev.totalPlans + 1,
      momentumPoints: Math.min(100, prev.momentumPoints + 5),
    }));
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[70vh] p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-400"></div>
          <p className="mt-4 text-gray-400 text-lg">Loading your dashboard...</p>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="p-12 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-4">Something went wrong</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-primary-500 to-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            Retry
          </button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen pb-24">
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
          
          {/* Main Content */}
          <Overview />
          
          <div className="grid lg:grid-cols-2 gap-8">
            <StatsGrid progress={progress} />
            <PlannerSection onPlanAdded={handlePlanAdded} />
          </div>

          {/* Recent Plans Section */}
          {plans.length > 0 && (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <h3 className="text-2xl font-black bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mb-6 flex items-center gap-3">
                Recent Plans
                <span className="text-sm text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full font-semibold">
                  {plans.length}
                </span>
              </h3>
              <div className="space-y-4">
                {plans.slice(0, 4).map((plan) => (
                  <div key={plan.id} className="group flex items-center gap-4 p-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 hover:shadow-xl transition-all duration-300 cursor-pointer">
                    <div className={`flex-shrink-0 w-2 h-12 rounded-l-xl ${
                      plan.status === 'completed' ? 'bg-gradient-to-b from-emerald-400 to-emerald-500' :
                      'bg-gradient-to-b from-blue-400 to-blue-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-white text-lg mb-1 truncate">{plan.title}</h4>
                      <p className="text-sm text-gray-400 mb-2">Created {new Date(plan.createdAt).toLocaleString()}</p>
                      <div className="flex items-center gap-4 text-xs">
                        <span className={`px-3 py-1 rounded-full font-semibold ${
                          plan.status === 'completed' 
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-400/30' 
                            : 'bg-blue-500/20 text-blue-400 border-blue-400/30'
                        } border`}>
                          {plan.status.toUpperCase()}
                        </span>
                        <span className="text-gray-500">● Quick Action</span>
                      </div>
                    </div>
                    <button className="p-2 rounded-xl hover:bg-white/20 transition group-hover:scale-110">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </AppLayout>
  );
}
