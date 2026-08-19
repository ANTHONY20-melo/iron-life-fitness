import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import {
  Dumbbell, LayoutDashboard, ClipboardList, History, TrendingUp,
  ClipboardCheck, Calendar, CreditCard, Trophy, User, LogOut, Menu, X, Bell,
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import Avatar from '@/components/common/Avatar'
import clsx from 'clsx'

const navItems = [
  { to: '/student', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/student/workouts', icon: Dumbbell, label: 'Treinos' },
  { to: '/student/history', icon: History, label: 'Histórico' },
  { to: '/student/evolution', icon: TrendingUp, label: 'Evolução' },
  { to: '/student/assessments', icon: ClipboardCheck, label: 'Avaliações' },
  { to: '/student/schedule', icon: Calendar, label: 'Agenda' },
  { to: '/student/payments', icon: CreditCard, label: 'Pagamentos' },
  { to: '/student/achievements', icon: Trophy, label: 'Conquistas' },
  { to: '/student/profile', icon: User, label: 'Perfil' },
]

export default function StudentLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuthStore()

  const isActive = (path: string, end?: boolean) => {
    if (end) return location.pathname === path
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0a0a0a] border-r border-[#1a1a1a]',
          'flex flex-col transition-transform duration-300 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 h-16 border-b border-[#1a1a1a]">
          <div className="p-2 bg-primary rounded-lg">
            <Dumbbell className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">
            IRON <span className="text-primary">LIFE</span>
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.to, item.end)
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-500 hover:text-white hover:bg-[#111]'
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-[#1a1a1a]">
          <div className="flex items-center gap-3">
            <Avatar name={user?.student?.fullName || user?.email || 'U'} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.student?.fullName || 'Aluno'}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
            <button onClick={logout} className="p-1.5 text-gray-500 hover:text-red-400 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#1a1a1a] flex items-center px-4 gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-gray-400 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
          </button>
          <div className="flex items-center gap-2">
            <Avatar name={user?.student?.fullName || user?.email || 'U'} size="sm" />
            <span className="text-sm text-white hidden sm:block">
              {user?.student?.fullName || 'Aluno'}
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
