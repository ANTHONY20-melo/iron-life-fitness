import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, User, Mail, Phone, Calendar, CreditCard, Dumbbell, TrendingUp } from 'lucide-react'
import Card from '@/components/common/Card'
import Badge from '@/components/common/Badge'
import Avatar from '@/components/common/Avatar'
import Button from '@/components/common/Button'
import Skeleton from '@/components/common/Skeleton'

const mockStudent = {
  id: '1', name: 'Marcos Silva', email: 'marcos@email.com', cpf: '123.456.789-00',
  phone: '(11) 98888-7777', plan: 'Premium', status: 'active', joinDate: '2026-01-15',
  points: 1250, level: 5,
}

const tabs = ['Perfil', 'Treinos', 'Pagamentos', 'Evolução', 'Check-ins']

export default function StudentDetail() {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('Perfil')

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-48" />
      </div>
    )
  }

  const s = mockStudent

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center gap-3">
        <Link to="/admin/students" className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#1a1a1a] transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">{s.name}</h1>
          <p className="text-sm text-gray-500">{s.email}</p>
        </div>
      </div>

      {/* Profile card */}
      <Card>
        <div className="flex items-center gap-6">
          <Avatar name={s.name} size="lg" />
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white">{s.name}</h3>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
              <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {s.email}</span>
              <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {s.phone}</span>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <Badge variant="success">{s.plan}</Badge>
              <Badge variant={s.status === 'active' ? 'success' : 'danger'}>
                {s.status === 'active' ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Membro desde</p>
            <p className="text-sm text-white font-medium">
              {new Date(s.joinDate + 'T12:00:00').toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#111] border border-[#2a2a2a] rounded-xl p-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab ? 'bg-primary text-white' : 'text-gray-500 hover:text-white hover:bg-[#1a1a1a]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'Perfil' && (
        <Card>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-[#0a0a0a] rounded-xl p-4">
              <p className="text-xs text-gray-500">CPF</p>
              <p className="text-sm text-white mt-1">{s.cpf}</p>
            </div>
            <div className="bg-[#0a0a0a] rounded-xl p-4">
              <p className="text-xs text-gray-500">Plano</p>
              <p className="text-sm text-white mt-1">{s.plan}</p>
            </div>
            <div className="bg-[#0a0a0a] rounded-xl p-4">
              <p className="text-xs text-gray-500">Status</p>
              <p className="text-sm text-white mt-1">{s.status === 'active' ? 'Ativo' : 'Inativo'}</p>
            </div>
            <div className="bg-[#0a0a0a] rounded-xl p-4">
              <p className="text-xs text-gray-500">Pontos</p>
              <p className="text-sm text-white mt-1">{s.points}</p>
            </div>
            <div className="bg-[#0a0a0a] rounded-xl p-4">
              <p className="text-xs text-gray-500">Nível</p>
              <p className="text-sm text-white mt-1">{s.level}</p>
            </div>
            <div className="bg-[#0a0a0a] rounded-xl p-4">
              <p className="text-xs text-gray-500">Desde</p>
              <p className="text-sm text-white mt-1">
                {new Date(s.joinDate + 'T12:00:00').toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        </Card>
      )}

      {activeTab !== 'Perfil' && (
        <Card>
          <p className="text-sm text-gray-500 text-center py-8">
            Conteúdo de "{activeTab}" será carregado do backend.
          </p>
        </Card>
      )}
    </div>
  )
}
