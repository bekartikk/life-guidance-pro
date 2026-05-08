import { useState } from 'react';
import { PlusIcon, MagnifyingGlassIcon, SparklesIcon } from '@heroicons/react/24/outline';

const planTemplates = [
  'Deep work session (90min)',
  'Morning routine optimization',
  'Read 30 pages of key book',
  'Email zero inbox',
  'Weekly review & planning',
  'Exercise + mobility work',
  'High leverage task #1',
  'Creative project time',
];

export default function PlannerSection({ onPlanAdded }) {
  const [inputValue, setInputValue] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onPlanAdded?.(inputValue.trim());
      setInputValue('');
    }
  };

  const addTemplate = (template) => {
    setInputValue(template);
    setShowTemplates(false);
  };

  return (
    <div className="bg-gradient-to-br from-white/5 via-black/20 to-white/10 backdrop-blur-3xl border border-white/20 rounded-3xl p-8 shadow-2xl hover:shadow-3xl hover:shadow-emerald-500/25 transition-all duration-500 group">
      
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-2 border-emerald-400/30 rounded-2xl shadow-xl">
          <PlusIcon className="h-7 w-7 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-2xl font-black bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent mb-1">
            Quick Planner
          </h2>
          <p className="text-gray-400 text-lg">Create your next action in seconds</p>
        </div>
      </div>

      {/* Smart Input */}
      <div className="relative">
        <form onSubmit={handleSubmit} className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="I will work on..."
            value={inputValue}
            onFocus={() => setShowTemplates(true)}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full pl-12 pr-28 py-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl text-lg font-semibold text-white placeholder-gray-500 focus:ring-4 focus:ring-emerald-400/30 focus:border-emerald-400/50 shadow-inner transition-all duration-300 group-hover:shadow-xl"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="absolute inset-y-0 right-2 flex items-center pr-3 text-white font-semibold transition-all duration-200 group-hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
          >
            <SparklesIcon className="h-6 w-6 mr-1" />
            Create
          </button>
        </form>

        {/* Templates Dropdown */}
        {showTemplates && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl animate-fade-in max-h-60 overflow-y-auto z-20">
            <div className="p-2 grid grid-cols-2 gap-2">
              {planTemplates.slice(0, 6).map((template) => (
                <button
                  key={template}
                  onClick={() => addTemplate(template)}
                  className="group relative p-4 rounded-xl text-left hover:bg-white/20 hover:shadow-md transition-all duration-200 flex items-center gap-3"
                >
                  <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full shadow-lg group-hover:scale-125 transition-transform" />
                  <span className="text-sm font-medium text-white truncate">{template}</span>
                </button>
              ))}
            </div>
            <div className="p-3 border-t border-white/10 bg-white/5 rounded-b-2xl">
              <button 
                className="w-full text-xs text-gray-400 hover:text-white transition-colors p-1 rounded-xl hover:bg-white/10"
                onClick={() => setShowTemplates(false)}
              >
                ✕ Hide templates
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Recent Plans Preview */}
      <div className="mt-8 pt-8 border-t border-white/10">
        <div className="space-y-3">
          {[
            { title: 'Deep work session', time: '2h ago', status: 'active' },
            { title: 'Morning routine', time: 'Today 8AM', status: 'completed' },
            { title: 'Weekly review', time: 'Yesterday', status: 'pending' },
          ].map((plan, index) => (
            <div key={index} className={`flex items-center gap-3 p-4 rounded-2xl transition-all duration-200 ${
              plan.status === 'completed' ? 'bg-emerald-500/10 border-emerald-400/30' :
              plan.status === 'active' ? 'bg-blue-500/10 border-blue-400/30' :
              'bg-gray-500/10 border-gray-400/30 hover:bg-gray-500/20'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                plan.status === 'completed' ? 'bg-emerald-400 animate-pulse' :
                plan.status === 'active' ? 'bg-blue-400' : 'bg-gray-400'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white truncate">{plan.title}</p>
                <p className="text-xs text-gray-500">{plan.time}</p>
              </div>
              <div className="w-20 h-6 bg-white/20 backdrop-blur rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-400 to-blue-500 w-[70%]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
