import { Bars3Icon, XMarkIcon, ChartBarIcon, CalendarIcon, TargetIcon, ClockIcon, ChartPieIcon, UserIcon, CogIcon } from '@heroicons/react/24/outline';

const navItems = [
  { name: 'Dashboard', icon: ChartBarIcon, current: true },
  { name: 'Planner', icon: CalendarIcon, current: false },
  { name: 'Goals', icon: TargetIcon, current: false },
  { name: 'Habits', icon: ClockIcon, current: false },
  { name: 'Analytics', icon: ChartPieIcon, current: false },
  { name: 'Profile', icon: UserIcon, current: false },
  { name: 'Settings', icon: CogIcon, current: false },
];

export default function Sidebar() {
  return (
    <div className="flex flex-col w-64 bg-gradient-to-b from-[#020617] to-[#0a0e1a] border-r border-white/10 shadow-2xl h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-purple-500 bg-clip-text text-transparent">
          LifeGuide
        </h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 mt-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.name}
              className={`group flex items-center px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                item.current
                  ? 'bg-gradient-to-r from-primary-500 to-blue-600 text-white shadow-lg shadow-primary-500/25 translate-y-0'
                  : 'text-gray-400 hover:bg-white/10 hover:text-white hover:shadow-md hover:translate-x-1 hover:scale-[1.02]'
              }`}
            >
              <Icon className="h-5 w-5 mr-3 group-hover:rotate-3 transition-transform duration-200" aria-hidden="true" />
              {item.name}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 mt-auto">
        <div className="flex items-center p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all duration-200 cursor-pointer">
          <UserIcon className="h-6 w-6 mr-3 text-gray-400" />
          <div>
            <p className="font-medium text-white">John Doe</p>
            <p className="text-xs text-gray-500">Pro Member</p>
          </div>
        </div>
      </div>
    </div>
  );
}
