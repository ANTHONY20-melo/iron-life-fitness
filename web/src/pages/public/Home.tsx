import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Dumbbell, Target, ClipboardCheck, UserCheck, Heart, TrendingUp,
  Phone, Mail, MapPin, Instagram, MessageCircle, ChevronDown,
  ChevronRight, Star, Shield, Zap, Clock, Award, Users,
} from 'lucide-react'
import Button from '@/components/common/Button'

/* ────────────────────── Data ────────────────────── */

const benefits = [
  { icon: Dumbbell, title: 'Musculação', desc: 'Área completa com equipamentos de última geração para todos os níveis.' },
  { icon: Target, title: 'Treino Personalizado', desc: 'Planos sob medida para seus objetivos, criados por profissionais.' },
  { icon: ClipboardCheck, title: 'Avaliação Física', desc: 'Acompanhe sua evolução com avaliações periódicas e precisas.' },
  { icon: UserCheck, title: 'Personal Trainer', desc: 'Profissionais qualificados para guiar cada etapa da sua jornada.' },
  { icon: Heart, title: 'Área Cardio', desc: 'Equipamentos cardiovasculares modernos para treinos intensos.' },
  { icon: TrendingUp, title: 'Acompanhamento', desc: 'Monitoramento contínuo de progresso com dados e métricas.' },
]

const plans = [
  {
    name: 'Básico',
    price: '89,90',
    features: ['Musculação ilimitada', 'Área cardiovascular', 'Vestiários', 'Avaliação física inicial'],
    highlighted: false,
  },
  {
    name: 'Premium',
    price: '149,90',
    features: ['Tudo do Básico', 'Personal trainer 2x/sem', 'Avaliações mensais', 'Treinos personalizados', 'Área funcional'],
    highlighted: true,
  },
  {
    name: 'Black',
    price: '249,90',
    features: ['Tudo do Premium', 'Personal ilimitado', 'Nutricionista', 'Acompanhamento 24/7', 'Aulas exclusivas', 'Área VIP'],
    highlighted: false,
  },
]

const structure = [
  { title: 'Sala de Musculação', desc: 'Mais de 500m² com equipamentos importados' },
  { title: 'Área Cardio', desc: 'Esteiras, bikes e elípticos de última geração' },
  { title: 'Espaço Funcional', desc: 'CrossFit, HIIT e treino funcional' },
  { title: 'Vestiários', desc: 'Armários individuais, chuveiros e secadores' },
  { title: 'Recepção', desc: 'Atendimento personalizado e acolhedor' },
  { title: 'Área de Descanso', desc: 'Espaço para recuperação pós-treino' },
]

const trainers = [
  { name: 'Rafael Costa', specialty: 'Musculação & Força', cref: 'CREF 12345-G/SP', bio: '10+ anos de experiência. Especialista em hipertrofia e força.' },
  { name: 'Ana Martins', specialty: 'Funcional & HIIT', cref: 'CREF 12346-G/SP', bio: 'Campeã regional de CrossFit. Foco em performance.' },
  { name: 'Lucas Ferreira', specialty: 'Reabilitação & Condicionamento', cref: 'CREF 12347-G/SP', bio: 'Fisioterapeuta e personal. Prevenção de lesões.' },
]

const testimonials = [
  { name: 'Marcos Silva', text: 'Mudei completamente minha vida em 6 meses. O acompanhamento dos professores é incrível!', rating: 5 },
  { name: 'Juliana Santos', text: 'Melhor academia da região. Equipamentos novos e staff muito atencioso.', rating: 5 },
  { name: 'Pedro Almeida', text: 'O plano Premium vale cada centavo. O personal trainer transformou meu treino.', rating: 5 },
  { name: 'Camila Rodrigues', text: 'Ambiente motivador e limpo. Não troco por nada!', rating: 5 },
]

const faq = [
  { q: 'Qual o horário de funcionamento?', a: 'Segunda a sexta das 06h às 22h, sábado das 08h às 18h e domingo das 08h às 14h.' },
  { q: 'Preciso de encaminhamento médico?', a: 'Recomendamos, mas não é obrigatório. Fazemos avaliação física inicial para adequar seu treino.' },
  { q: 'Posso cancelar a qualquer momento?', a: 'Sim! Não trabalhamos com fidelidade. Cancele quando quiser sem multa.' },
  { q: 'Tem estacionamento?', a: 'Sim, oferecemos estacionamento gratuito para alunos com vaga garantida.' },
  { q: 'As aulas coletivas estão incluídas?', a: 'Depende do plano. O Premium inclui aulas funcionais. O Black inclui todas as aulas.' },
  { q: 'Aceitam convênios?', a: 'Sim, trabalhamos com os principais convênios. Consulte na recepção.' },
]

/* ────────────────────── Component ────────────────────── */

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="bg-[#0a0a0a]">
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated bg */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#0a0a0a]" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          {/* Grid lines */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }}
          />
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-8">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Academia Premium em Salvador</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white leading-tight mb-6">
            TRANSFORME SEU{' '}
            <span className="text-primary">CORPO.</span>
            <br />
            ELEVE SUA{' '}
            <span className="text-primary">PERFORMANCE.</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Treine com os melhores equipamentos, profissionais qualificados e um ambiente
            feito para quem leva fitness a sério.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="animate-pulse-glow">
                SEJA ALUNO
                <ChevronRight className="w-5 h-5" />
              </Button>
            </Link>
            <a href="#estrutura">
              <Button variant="outline" size="lg">
                CONHEÇA A ACADEMIA
              </Button>
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-gray-600" />
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm text-primary font-medium uppercase tracking-widest">Por que escolher a gente</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3">Nossos Diferenciais</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <div
                key={i}
                className="group bg-[#111] border border-[#2a2a2a] rounded-2xl p-6 hover:border-primary/30 hover:bg-[#1a1a1a] transition-all duration-300"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <b.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{b.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLANS ── */}
      <section id="planos" className="py-24 px-4 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm text-primary font-medium uppercase tracking-widest">Investimento</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3">Escolha seu Plano</h2>
            <p className="text-gray-500 mt-3 max-w-lg mx-auto">
              Planos flexíveis sem fidelidade. Cancele quando quiser.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`relative bg-[#111] border rounded-2xl p-8 transition-all duration-300 ${
                  plan.highlighted
                    ? 'border-primary shadow-lg shadow-primary/10 md:scale-105 md:-my-4'
                    : 'border-[#2a2a2a] hover:border-[#3a3a3a]'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-xs font-bold rounded-full uppercase tracking-wider">
                    Mais Popular
                  </div>
                )}
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-sm text-gray-500">R$</span>
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  <span className="text-sm text-gray-500">/mês</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-400">
                      <Shield className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/register">
                  <Button
                    variant={plan.highlighted ? 'primary' : 'outline'}
                    className="w-full"
                  >
                    ASSINAR PLANO
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STRUCTURE ── */}
      <section id="estrutura" className="py-24 px-4 bg-[#111]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm text-primary font-medium uppercase tracking-widest">Nosso Espaço</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3">Estrutura Completa</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {structure.map((s, i) => (
              <div
                key={i}
                className="group relative h-48 bg-[#0a0a0a] border border-[#2a2a2a] rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-lg font-semibold text-white mb-1">{s.title}</h3>
                  <p className="text-sm text-gray-400">{s.desc}</p>
                </div>
                <div className="absolute top-4 right-4 w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Dumbbell className="w-5 h-5 text-primary" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRAINERS ── */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm text-primary font-medium uppercase tracking-widest">Nossa Equipe</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3">Professores</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainers.map((t, i) => (
              <div
                key={i}
                className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-6 hover:border-[#3a3a3a] transition-all duration-300"
              >
                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <UserCheck className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-white text-center">{t.name}</h3>
                <p className="text-sm text-primary text-center mt-1">{t.specialty}</p>
                <p className="text-xs text-gray-600 text-center mt-1">{t.cref}</p>
                <p className="text-sm text-gray-500 text-center mt-3">{t.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 px-4 bg-[#111]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm text-primary font-medium uppercase tracking-widest">Depoimentos</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3">O que dizem nossos alunos</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-2xl p-6 hover:border-[#3a3a3a] transition-all duration-300"
              >
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm text-gray-400 leading-relaxed mb-4">"{t.text}"</p>
                <p className="text-sm font-semibold text-white">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm text-primary font-medium uppercase tracking-widest">Dúvidas</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3">Perguntas Frequentes</h2>
          </div>
          <div className="space-y-3">
            {faq.map((item, i) => (
              <div
                key={i}
                className="bg-[#111] border border-[#2a2a2a] rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-[#1a1a1a] transition-colors"
                >
                  <span className="text-sm font-medium text-white">{item.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                      openFaq === i ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 animate-fadeIn">
                    <p className="text-sm text-gray-400 leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contato" className="py-24 px-4 bg-[#111]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm text-primary font-medium uppercase tracking-widest">Fale Conosco</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3">Contato</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-xl"><MapPin className="w-5 h-5 text-primary" /></div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Endereço</h4>
                  <p className="text-sm text-gray-500">Rua das Rosas, 123 - Centro, Salvador - BA</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-xl"><Phone className="w-5 h-5 text-primary" /></div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Telefone</h4>
                  <p className="text-sm text-gray-500">(71) 3000-1234</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-xl"><MessageCircle className="w-5 h-5 text-primary" /></div>
                <div>
                  <h4 className="text-sm font-semibold text-white">WhatsApp</h4>
                  <p className="text-sm text-gray-500">(71) 99999-9999</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-xl"><Mail className="w-5 h-5 text-primary" /></div>
                <div>
                  <h4 className="text-sm font-semibold text-white">E-mail</h4>
                  <p className="text-sm text-gray-500">contato@ironlifefitness.com.br</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-xl"><Instagram className="w-5 h-5 text-primary" /></div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Instagram</h4>
                  <p className="text-sm text-gray-500">@ironlifefitness</p>
                </div>
              </div>
            </div>
            <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-2xl h-80 flex items-center justify-center">
              <div className="text-center text-gray-600">
                <MapPin className="w-10 h-10 mx-auto mb-3" />
                <p className="text-sm">Mapa interativo</p>
                <p className="text-xs text-gray-700 mt-1">Google Maps aqui</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Pronto para <span className="text-primary">transformar</span> seu corpo?
          </h2>
          <p className="text-gray-500 mb-8 max-w-lg mx-auto">
            Comece hoje e faça parte da comunidade Iron Life. Sua melhor versão começa aqui.
          </p>
          <Link to="/register">
            <Button size="lg" className="animate-pulse-glow">
              COMEÇAR AGORA
              <ChevronRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
