import { Link } from 'react-router-dom'
import { ArrowLeft, Phone, MessageCircle, CheckCircle2, Circle } from 'lucide-react'

/* ── Mock timeline ─────────────────────────────────────────── */
const TIMELINE = [
  { id: 1, label: 'Pedido recibido',      time: '13:02', done: true,  active: false },
  { id: 2, label: 'Restaurante confirmó', time: '13:04', done: true,  active: false },
  { id: 3, label: 'Preparando tu pedido', time: '13:05', done: true,  active: true  },
  { id: 4, label: 'En camino',            time: '--:--',  done: false, active: false },
  { id: 5, label: 'Entregado',            time: '--:--',  done: false, active: false },
]

export default function OrderTrackingPage() {
  const activeStep = TIMELINE.findIndex(s => s.active)

  return (
    <div className="min-h-screen bg-[#0F0F0F] max-w-md mx-auto lg:max-w-2xl flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-4 border-b border-[#1F1F1F]">
        <Link to="/cart" className="w-9 h-9 rounded-full bg-[#1A1A1A] flex items-center justify-center border border-[#2A2A2A]">
          <ArrowLeft className="w-4 h-4 text-white" />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-white">Pedido #FD-0042</h1>
          <p className="text-xs text-[#FF6B00] font-medium">Preparando tu pedido…</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-xs text-[#606060]">Tiempo estimado</p>
          <p className="text-base font-bold text-white">~22 min</p>
        </div>
      </header>

      {/* Mapa placeholder */}
      <div className="mx-4 mt-4 rounded-2xl overflow-hidden relative h-52 bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center">
        {/* Grid de mapa simulado */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'repeating-linear-gradient(#FF6B00 0 1px, transparent 1px 100%), repeating-linear-gradient(90deg, #FF6B00 0 1px, transparent 1px 100%)', backgroundSize: '32px 32px' }}
        />
        {/* Pin del restaurante */}
        <div className="absolute top-8 left-16 flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-[#FF6B00] flex items-center justify-center text-sm shadow-[0_0_16px_rgba(255,107,0,0.6)]">🍕</div>
          <span className="text-[10px] text-[#A0A0A0] mt-1">Restaurante</span>
        </div>
        {/* Pin del repartidor */}
        <div className="absolute top-16 left-1/2 flex flex-col items-center animate-pulse">
          <div className="w-8 h-8 rounded-full bg-[#3B82F6] flex items-center justify-center text-sm shadow-[0_0_16px_rgba(59,130,246,0.6)]">🛵</div>
          <span className="text-[10px] text-[#A0A0A0] mt-1">Repartidor</span>
        </div>
        {/* Pin del destino */}
        <div className="absolute bottom-8 right-12 flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-[#10B981] flex items-center justify-center text-sm shadow-[0_0_16px_rgba(16,185,129,0.6)]">🏠</div>
          <span className="text-[10px] text-[#A0A0A0] mt-1">Tu casa</span>
        </div>
        <p className="text-[#3A3A3A] text-xs font-mono">[ Integrar Google Maps ]</p>
      </div>

      {/* Repartidor */}
      <div className="mx-4 mt-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl px-4 py-3 flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg font-bold text-white flex-shrink-0">
          JM
        </div>
        <div className="flex-1">
          <p className="font-semibold text-white text-sm">Juan Martínez</p>
          <div className="flex items-center gap-1 text-xs text-[#606060]">
            <span className="text-yellow-400">★</span> 4.9 · Repartidor verificado
          </div>
        </div>
        <div className="flex gap-2">
          <button className="w-9 h-9 rounded-full bg-[#FF6B00]/15 border border-[#FF6B00]/30 flex items-center justify-center">
            <Phone className="w-4 h-4 text-[#FF6B00]" />
          </button>
          <button className="w-9 h-9 rounded-full bg-[#2A2A2A] border border-[#3A3A3A] flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-[#A0A0A0]" />
          </button>
        </div>
      </div>

      {/* Timeline de estados */}
      <div className="mx-4 mt-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4">
        <h3 className="text-sm font-bold text-[#A0A0A0] uppercase tracking-wider mb-4">Estado del pedido</h3>
        <div className="space-y-0">
          {TIMELINE.map((step, i) => (
            <div key={step.id} className="flex gap-3">
              {/* Línea vertical + ícono */}
              <div className="flex flex-col items-center">
                {step.done || step.active
                  ? <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${step.active ? 'text-[#FF6B00]' : 'text-emerald-400'}`} />
                  : <Circle className="w-5 h-5 flex-shrink-0 text-[#3A3A3A]" />
                }
                {i < TIMELINE.length - 1 && (
                  <div className={`w-0.5 h-8 mt-1 ${step.done ? 'bg-emerald-400/40' : 'bg-[#2A2A2A]'}`} />
                )}
              </div>
              {/* Texto */}
              <div className="pb-6 last:pb-0">
                <p className={`text-sm font-semibold ${step.active ? 'text-[#FF6B00]' : step.done ? 'text-white' : 'text-[#3A3A3A]'}`}>
                  {step.label}
                  {step.active && <span className="ml-2 text-xs animate-pulse">●</span>}
                </p>
                <p className="text-xs text-[#606060] mt-0.5">{step.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resumen del pedido */}
      <div className="mx-4 mt-4 mb-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl px-4 py-3">
        <p className="text-sm text-[#A0A0A0]">La Trattoria · 3 artículos · <span className="text-[#FF6B00] font-semibold">Bs. 485</span></p>
      </div>
    </div>
  )
}
