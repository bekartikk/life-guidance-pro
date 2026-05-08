import { FireIcon, PlayIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function Overview() {
  const [currentFocus, setCurrentFocus] = useState('Build your morning routine');

  const todaysFocus = [
    'Build your morning routine',
    'Complete 3 priority tasks',
    'Review yesterday&apos;s progress',
    'Plan tomorrow&apos;s wins',
  ];

  return (
    <div className="relative bg-gradient-to-br from-white/5 via-black/30 to-white/5 backdrop-blur-3xl border border-white/20 rounded-3xl p-8 shadow-2xl hover:shadow-3xl hover:shadow-primary-500/20 transition-all duration-500 group overflow-hidden">
      
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-blue-500/10 opacity-50 animate-pulse"></div>
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-orange-500/20 to-red-400/20 border-2 border-orange-400/30 rounded-2xl backdrop-blur-xl animate-bounce-slow">
            <FireIcon className="h-7 w-7 text-orange-400" />
          </div>
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent mb-2">
              Today&apos;s Focus
            </h1>
            <p className="text-gray-400 text-lg font-medium">Your #1 priority</p>
          </div>
        </div>

        {/* Focus Suggestion */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8 hover:bg-white/10 transition-all duration-300 group-hover:scale-[1.02]">
          <div className="flex items-start gap-4 mb-4">
            <PlayIcon className="h-8 w-8 text-primary-400 mt-1 flex-shrink-0 animate-pulse" />
            <div className="flex-1 min-w-0">
              <p className="text-xl font-bold text-white leading-relaxed pr-4">{currentFocus}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {todaysFocus.map((focus, index) => (
              <button
                key={focus}
                onClick={() => setCurrentFocus(focus)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                  currentFocus === focus
                    ? 'bg-gradient-to-r from-primary-500 to-blue-600 text-white shadow-lg shadow-primary-500/25 scale-105'
                    : 'bg-white/10 text-gray-400 border border-white/20 hover:bg-white/20 hover:text-white hover:shadow-md hover:scale-105'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Quote */}
        <div className="bg-gradient-to-r from-yellow-500/10 via-orange-500/5 to-red-500/10 border border-yellow-400/20 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <LightBulbIcon className="h-8 w-8 text-yellow-400 mt-1 flex-shrink-0 animate-pulse" />
            <div>
              <p className="text-sm text-yellow-300 uppercase tracking-wider font-semibold mb-2">"AI Suggestion"</p>
              <p className="text-lg font-semibold text-white leading-relaxed">
                "Consistency over perfection. Start small, stay steady, achieve greatness."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
