import { MagnifyingGlassIcon, BellIcon, ChevronDownIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline';

export default function Header() {
  return (
    <div className="h-16 bg-[#0f172a]/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-6 shadow-lg">
      
      {/* Left: Breadcrumbs */}
      <div className="flex items-center space-x-4">
        <button className="lg:hidden p-2 rounded-xl hover:bg-white/10 transition">
          <Bars3Icon className="h-6 w-6 text-gray-400" />
        </button>
        <div className="flex items-center space-x-2">
          <ChartBarIcon className="h-5 w-5 text-primary-400" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
            Dashboard
          </h1>
        </div>
      </div>

      {/* Center: Search */}
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search plans, goals, habits..."
            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm placeholder-gray-500 focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 transition-all duration-200"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center space-x-3">
        {/* Notifications */}
        <button className="relative p-2 rounded-xl hover:bg-white/10 transition">
          <BellIcon className="h-6 w-6 text-gray-400" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
        </button>

        {/* Theme Toggle */}
        <button className="p-2 rounded-xl hover:bg-white/10 transition">
          <MoonIcon className="h-6 w-6 text-gray-400" />
        </button>

        {/* Quick Action */}
        <button className="bg-gradient-to-r from-primary-500 to-blue-600 hover:from-primary-600 hover:to-blue-700 text-white px-5 py-2.5 rounded-2xl font-semibold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
          + New Plan
        </button>

        {/* User Menu */}
        <div className="flex items-center space-x-2 p-2 hover:bg-white/10 rounded-xl transition cursor-pointer group">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">JD</span>
          </div>
          <ChevronDownIcon className="h-4 w-4 text-gray-500 group-hover:rotate-180 transition-transform duration-200" />
        </div>
      </div>
    </div>
  );
}
