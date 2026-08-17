import { useState, useEffect } from 'react'
import { TrendingUp, Camera, Ruler } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'
import Card from '@/components/common/Card'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import Skeleton from '@/components/common/Skeleton'
import toast from 'react-hot-toast'

const mockMeasurements = [
  { date: '01/07', weight: 88, muscle: 35, fat: 22 },
  { date: '01/08', weight: 86.5, muscle: 35.5, fat: 21 },
  { date: '01/09', weight: 85, muscle: 36, fat: 20 },
  { date: '01/10', weight: 83.8, muscle: 36.8, fat: 19 },
  { date: '01/11', weight: 82, muscle: 37.5, fat: 17.5 },
  { date: '01/12', weight: 80.5, muscle: 38, fat: 16 },
]

export default function Evolution() {
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    weight: '', height: '', bodyFat: '', muscleMass: '',
    arm: '', chest: '', waist: '', hip: '', thigh: '',
  })

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  const update = (f: string, v: string) => setForm((prev) => ({ ...prev, [f]: v }))

  const handleSave = () => {
    toast.success('Medidas salvas com sucesso!')
    setForm({ weight: '', height: '', bodyFat: '', muscleMass: '', arm: '', chest: '', waist: '', hip: '', thigh: '' })
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64" />
        <Skeleton className="h-80" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-white">Evolução Corporal</h1>
        <p className="text-sm text-gray-500 mt-1">Acompanhe sua transformação</p>
      </div>

      {/* Charts */}
      <Card>
        <h3 className="text-sm font-semibold text-white mb-4">Peso e Composição Corporal</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockMeasurements}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
              <XAxis dataKey="date" tick={{ fill: '#666', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#666', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 12, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12, color: '#666' }} />
              <Line type="monotone" dataKey="weight" name="Peso (kg)" stroke="#DC2626" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="muscle" name="Massa Muscular (kg)" stroke="#22C55E" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="fat" name="% Gordura" stroke="#F59E0B" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Record measurements */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Ruler className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-semibold text-white">Registrar Medidas</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Input label="Peso (kg)" placeholder="80.5" value={form.weight} onChange={(e) => update('weight', e.target.value)} />
          <Input label="Altura (cm)" placeholder="178" value={form.height} onChange={(e) => update('height', e.target.value)} />
          <Input label="% Gordura" placeholder="16" value={form.bodyFat} onChange={(e) => update('bodyFat', e.target.value)} />
          <Input label="Massa Muscular (kg)" placeholder="38" value={form.muscleMass} onChange={(e) => update('muscleMass', e.target.value)} />
          <Input label="Braço (cm)" placeholder="35" value={form.arm} onChange={(e) => update('arm', e.target.value)} />
          <Input label="Peito (cm)" placeholder="100" value={form.chest} onChange={(e) => update('chest', e.target.value)} />
          <Input label="Cintura (cm)" placeholder="80" value={form.waist} onChange={(e) => update('waist', e.target.value)} />
          <Input label="Quadril (cm)" placeholder="95" value={form.hip} onChange={(e) => update('hip', e.target.value)} />
          <Input label="Coxa (cm)" placeholder="55" value={form.thigh} onChange={(e) => update('thigh', e.target.value)} />
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={handleSave}>Salvar Medidas</Button>
        </div>
      </Card>

      {/* Photo section */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Camera className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-semibold text-white">Fotos de Progresso</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {['Frontal', 'Costas', 'Lateral'].map((side) => (
            <div key={side} className="aspect-[3/4] bg-[#0a0a0a] border border-dashed border-[#2a2a2a] rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
              <Camera className="w-8 h-8 text-gray-700 mb-2" />
              <p className="text-xs text-gray-600">{side}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Before / After */}
      <Card>
        <h3 className="text-sm font-semibold text-white mb-4">Antes & Depois</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="aspect-square bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl flex items-center justify-center">
            <div className="text-center text-gray-700">
              <Camera className="w-10 h-10 mx-auto mb-2" />
              <p className="text-sm">Foto Antes</p>
            </div>
          </div>
          <div className="aspect-square bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl flex items-center justify-center">
            <div className="text-center text-gray-700">
              <Camera className="w-10 h-10 mx-auto mb-2" />
              <p className="text-sm">Foto Depois</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
