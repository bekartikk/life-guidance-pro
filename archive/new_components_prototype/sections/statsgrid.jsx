import { ArrowTrendingUpIcon, FireIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

export default function StatsGrid({ progress }) {
  const stats = [
    {
      label: 'Momentum',
      value: progress.momentumPoints,
      change: '+12%',
      trend: 'up',
      icon: ArrowTrendingUpIcon,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      label: 'Streak',
      value: progress.activeStreak,
      change: '+1',
      trend: 'up',
      icon: FireIcon,
      color: 'from-orange-500 to-red-500',
    },
    {
      label: 'Active Plans',
      value: progress.totalPlans,
      change: '2 new',
      trend: 'stable',
      icon: DocumentTextIcon,
      color: 'from-emerald-500 to-teal-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:-translate-y-2 hover:rotate-1"
          >
            {/* Icon */}
            <div className="absolute -top-4 left-6 p-3 bg-gradient-to-br from-white/20 rounded-2xl backdrop-blur-xl border border-white/20 shadow-xl group-hover:scale-110 transition-all duration-300">
              <Icon className={`h-8 w-8 text-${stat.color.replace('from-', '').replace(' to-', '')}`} />
            </div>

            {/* Content */}
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wider font-medium mb-1">{stat.label}</p>
              <p className="text-4xl font-black bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mb-2">
                {stat.value}
              </p>
              <div className="flex items-center gap-1">
                <span className={`text-sm font-semibold ${
                  stat.trend === 'up' ? 'text-green-400' : stat.trend === 'down' ? 'text-red-400' : 'text-gray-400'
                }`}>
                  {stat.change}
                </span>
                <ArrowTrendingUpIcon className={`h-4 w-4 ${stat.trend === 'up' ? 'text-green-400 rotate-0' : 'text-gray-400 rotate-90'}`} />
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6 w-full bg-white/10 rounded-full h-2">
              <div 
                className={`bg-gradient-to-r ${stat.color} h-2 rounded-full shadow-lg transition-all duration-1000`}
                style={{ width: `${Math.min(stat.value / 100 * 100, 100)}%` }}
              />
            </div>

            {/* Sparkline-like dots */}
            <div className="flex gap-1 mt-4">
              {[1, 2, 3, 4, 5].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${
                    i < stat.value / 20 ? 'bg-gradient-to-r from-white scale-125 shadow-lg' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
