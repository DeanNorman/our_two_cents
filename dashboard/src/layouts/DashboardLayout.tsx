import React, { useState } from 'react';
import { 
  Home, 
  Receipt, 
  TrendingUp, 
  Settings, 
  Moon, 
  Sun,
  Bell,
  User
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getGreeting } from '../services/mockData';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <Home size={20} />, path: '/' },
  { id: 'transactions', label: 'Transactions', icon: <Receipt size={20} />, path: '/transactions' },
  { id: 'analytics', label: 'Analytics', icon: <TrendingUp size={20} />, path: '/analytics' },
  { id: 'settings', label: 'Settings', icon: <Settings size={20} />, path: '/settings' },
];

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Background with gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
      </div>

      <div className="relative z-10 flex h-screen">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex md:w-64 flex-col p-6 backdrop-blur-xl bg-white/5 border-r border-white/10">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">💑 Our Two Cents</h1>
            <p className="text-sm text-white/60">Building our future, one rand at a time</p>
            <p className="text-xs text-white/40 mt-1">Together since 2024</p>
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeNav === item.id
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-white/10">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold ring-2 ring-white/10">
                  D
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-semibold ring-2 ring-white/10">
                  A
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Dean & Abigail</p>
                <p className="text-xs text-white/60">Our shared dashboard</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="backdrop-blur-xl bg-white/5 border-b border-white/10 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">{getGreeting()}, Dean & Abigail</h2>
                <p className="text-sm text-white/60">Logged in WhatsApp, reviewed here.</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
                  className="p-2 rounded-xl backdrop-blur-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all"
                >
                  {theme === 'dark' ? (
                    <Sun size={20} className="text-white" />
                  ) : (
                    <Moon size={20} className="text-white" />
                  )}
                </button>

                <button
                  type="button"
                  aria-label="Notifications"
                  className="p-2 rounded-xl backdrop-blur-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all relative"
                >
                  <Bell size={20} className="text-white" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                <button
                  type="button"
                  aria-label="Account"
                  className="p-2 rounded-xl backdrop-blur-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all"
                >
                  <User size={20} className="text-white" />
                </button>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 backdrop-blur-xl bg-white/10 border-t border-white/10 px-4 py-3 z-50">
        <div className="flex items-center justify-around">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                activeNav === item.id
                  ? 'text-white bg-white/20'
                  : 'text-white/60'
              }`}
            >
              {item.icon}
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};
