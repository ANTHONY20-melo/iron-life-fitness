import { Link } from 'react-router-dom'
import { Dumbbell, ArrowLeft } from 'lucide-react'
import Button from '@/components/common/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl font-black text-primary mb-4">404</div>
        <h1 className="text-2xl font-bold text-white mb-2">Página não encontrada</h1>
        <p className="text-gray-500 mb-8">O que você procura não existe ou foi movido.</p>
        <Link to="/">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao início
          </Button>
        </Link>
      </div>
    </div>
  )
}
