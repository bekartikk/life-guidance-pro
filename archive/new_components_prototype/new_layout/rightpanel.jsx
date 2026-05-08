import { FireIcon, ArrowTrendingUpIcon, LightBulbIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useState, useEffect } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);

const sampleData = {
  dailyProgress: 68,
  streak: 3,
  aiInsight: 'Focus on high-impact tasks first - your momentum is building!',
};

export default function RightPanel() {
  const [isVisible, setIsVisible] = useState(false);

  const chartData = {
    labels: ['Completed', 'Pending', 'Overdue'],
    datasets: [{
      data: [68, 25, 7],
      backgroundColor: [
        'rgb(59 130 246 / 0.8)',
        'rgb(107 114 128 / 0.6)',
        'rgb(239 68 68 / 0.6)'
      ],
      borderColor: [
        'rgb(59 130 246)',
        'rgb(107 114 128)',
        'rgb(239 68 68)'
      ],
      borderWidth: 2,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div className="hidden xl:flex w-80 border-l border-white/10 bg-[#0a0e1a]/80 backdrop-blur-xl flex-col shadow-2xl animate-slide-in-right">
      
      {/* Header */}
      <div className="p-6 border-b border-white/10 sticky top-0 bg-[#0a0e1a]/90 backdrop-blur-sm z-10">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <ArrowTrendingUpIcon className="h-5 w-5 text-green-400" />
          Quick Stats
        </h3>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
        
        {/* Daily Progress */}
        <div className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 hover:bg-white/10 hover:shadow-2xl hover:shadow-primary-500/20 transition-all duration-300 cursor-pointer">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl shadow-lg">
                <FireIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Momentum</p>
                <p className="font-bold text-white text-lg">{sampleData.streak} Day Streak</p>
              </div>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-2xl flex items-center justify-center border-2 border-green-400/30 group-hover:scale-110 transition-transform">
              <span className="text-2xl font-bold text-green-400">{sampleData.dailyProgress}%</span>
            </div>
          </div>
        </div>

        {/* Progress Pie Chart */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5">
          <p className="text-sm text-gray-400 mb-3 font-medium">Today&apos;s Tasks</p>
          <div className="h-32 relative">
            <Pie data={chartData} options={options} />
          </div>
        </div>

        {/* AI Suggestion */}
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-3xl p-5">
          <div className="flex items-start gap-3 mb-3">
            <LightBulbIcon className="h-6 w-6 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">AI Insight</p>
              <p className="font-semibold text-white text-sm leading-relaxed">{sampleData.aiInsight}</p>
            </div>
          </div>
          <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 px-4 rounded-2xl font-medium text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
            <ChatBubbleLeftIcon className="h-4 w-4 inline mr-2" />
            Ask AI
          </button>
        </div>

      </div>

      {/* Quick Actions Footer */}
      <div className="p-4 border-t border-white/10 bg-[#0a0e1a]/90 backdrop-blur-sm">
        <div className="space-y-2">
          <button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 px-4 rounded-2xl font-medium text-sm transition-all duration-200 hover:shadow-md">
            📝 Quick Plan
          </button>
          <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-3 px-4 rounded-2xl font-medium text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
            ✅ Mark All Done
          </button>
        </div>
      </div>
    </div>
  );
}
