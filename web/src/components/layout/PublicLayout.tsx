import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Dumbbell, Menu, X } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import Button from '@/components/common/Button'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/#planos', label: 'Planos' },
  { to: '/#estrutura', label: 'Estrutura' },
  { to: '/#faq', label: 'FAQ' },
  { to: '/#contato', label: 'Contato' },
]

export default function PublicLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { isAuthenticated, user } = useAuthStore()

  const dashboardPath = user?.role === 'ADMIN' || user?.role === 'TRAINER' ? '/admin' : '/student'

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="p-2 bg-primary rounded-lg">
                <Dumbbell className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                IRON <span className="text-primary">LIFE</span>
              </span>
            </Link>

            {/* Desktop */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.to}
                  href={link.to}
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <Link to={dashboardPath}>
                  <Button size="sm">Meu Painel</Button>
                </Link>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm">Entrar</Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm">Cadastrar</Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-[#1a1a1a] bg-[#0a0a0a] animate-fadeIn">
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.to}
                  href={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2.5 text-gray-400 hover:text-white hover:bg-[#111] rounded-xl transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-2 border-t border-[#1a1a1a] space-y-2">
                {isAuthenticated ? (
                  <Link to={dashboardPath} onClick={() => setMobileOpen(false)}>
                    <Button className="w-full" size="sm">Meu Painel</Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileOpen(false)}>
                      <Button variant="outline" className="w-full" size="sm">Entrar</Button>
                    </Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full" size="sm">Cadastrar</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1a1a1a] bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-primary rounded-lg">
                  <Dumbbell className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">
                  IRON <span className="text-primary">LIFE</span>
                </span>
              </div>
              <p className="text-sm text-gray-500 max-w-sm">
                Transforme seu corpo, eleve sua performance. A academia que vai mudar sua vida.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Links</h4>
              <div className="space-y-2">
                <a href="/#planos" className="block text-sm text-gray-500 hover:text-white transition-colors">Planos</a>
                <a href="/#estrutura" className="block text-sm text-gray-500 hover:text-white transition-colors">Estrutura</a>
                <a href="/#faq" className="block text-sm text-gray-500 hover:text-white transition-colors">FAQ</a>
                <a href="/#contato" className="block text-sm text-gray-500 hover:text-white transition-colors">Contato</a>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Contato</h4>
              <div className="space-y-2 text-sm text-gray-500">
                <p>Rua Exemplo, 123 - Centro</p>
                <p>(11) 99999-9999</p>
                <p>contato@ironlifefitness.com.br</p>
              </div>
            </div>
          </div>
          <div className="border-t border-[#1a1a1a] mt-8 pt-8 text-center">
            <p className="text-xs text-gray-600">
              &copy; {new Date().getFullYear()} Iron Life Fitness. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
