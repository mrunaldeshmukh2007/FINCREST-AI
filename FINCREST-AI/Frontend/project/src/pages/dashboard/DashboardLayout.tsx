import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  LayoutDashboard, ArrowLeftRight, PiggyBank, Target, Brain, Bot,
  ScanLine, BarChart3, FileText, BellRing, User, Settings, Sparkles,
  Search, Plus, Menu, X, LogOut, ChevronRight,
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const navItems = [
  { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/app/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { to: '/app/budgets', label: 'Budgets', icon: PiggyBank },
  { to: '/app/goals', label: 'Goals', icon: Target },
  { to: '/app/insights', label: 'Insights', icon: BarChart3 },
  { to: '/app/reports', label: 'Reports', icon: FileText },
  { to: '/app/digital-twin', label: 'Digital Twin', icon: Brain, highlight: true },
  { to: '/app/ai-coach', label: 'AI Coach', icon: Bot },
  { to: '/app/receipt-scanner', label: 'Receipt Scanner', icon: ScanLine },
  { to: '/app/notifications', label: 'Notifications', icon: BellRing },
];

const bottomNav = [
  { to: '/app/profile', label: 'Profile', icon: User },
  { to: '/app/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-40 lg:hidden" />
        )}
      </AnimatePresence>

      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 z-50 transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-full glass-strong border-r flex flex-col p-4">
          <div className="flex items-center gap-2.5 px-2 py-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>FinCrest<span className="text-gradient"> AI</span></span>
            <button className="ml-auto lg:hidden" onClick={() => setSidebarOpen(false)}><X className="w-5 h-5" /></button>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <SidebarLink key={item.to} {...item} onClick={() => setSidebarOpen(false)} />
            ))}
          </nav>

          <div className="space-y-1 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
            {bottomNav.map((item) => (
              <SidebarLink key={item.to} {...item} onClick={() => setSidebarOpen(false)} />
            ))}
            <button onClick={() => window.location.href = '/'} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-white/5" style={{ color: 'var(--text-muted)' }}>
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function SidebarLink({ to, label, icon: Icon, end, highlight, onClick }: any) {
  return (
    <NavLink to={to} end={end} onClick={onClick} className={({ isActive }) => `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-400' : 'hover:bg-white/5'}`} style={{ color: 'var(--text-secondary)' }}>
      {({ isActive }) => (
        <>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isActive ? 'bg-gradient-to-br from-blue-600 to-purple-600' : 'group-hover:bg-white/5'}`}>
            <Icon className={`w-4 h-4 ${isActive ? 'text-white' : ''}`} />
          </div>
          <span className={isActive ? '' : ''} style={isActive ? { color: 'var(--text-primary)' } : {}}>{label}</span>
          {highlight && <span className="ml-auto"><span className="text-xs px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400">AI</span></span>}
        </>
      )}
    </NavLink>
  );
}

function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-30 glass-strong border-b">
      <div className="flex items-center gap-3 px-4 md:px-6 h-16">
        <button className="lg:hidden" onClick={onMenuClick}><Menu className="w-5 h-5" /></button>

        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          <input placeholder="Search transactions, goals, ask AI..." className="w-full glass rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/50" style={{ color: 'var(--text-primary)' }} />
        </div>

        <div className="flex items-center gap-2 md:gap-3 ml-auto">
          <button onClick={() => navigate('/app/notifications')} className="relative w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/5">
            <BellRing className="w-4.5 h-4.5" style={{ color: 'var(--text-secondary)' }} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
          </button>
          <ThemeToggle />
          <button onClick={() => navigate('/app/transactions')} className="btn-primary rounded-xl px-3 md:px-4 py-2 text-sm font-semibold flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> <span className="hidden md:inline">Quick Add</span>
          </button>
          <button onClick={() => navigate('/app/profile')} className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
            AS
          </button>
        </div>
      </div>
    </header>
  );
}
