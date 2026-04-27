import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Phone, Clock, MapPin } from 'lucide-react'

type Status = 'pending' | 'preparing' | 'shipping' | 'delivered' | 'cancelled'

const FLOW: Status[] = ['pending', 'preparing', 'shipping', 'delivered']
const STATUS_LABEL: Record<Status, string> = {
  pending:   'Nuevo pedido',
  preparing: 'Preparando',
  shipping:  'En camino',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
}
const NEXT_ACTION: Partial<Record<Status, string>> = {
  pending:   '✓ Aceptar pedido',
  preparing: '🛵 Listo para envío',
  shipping:  '✓ Marcar entregado',
}
const STATUS_COLOR: Record<Status, string> = {
  pending:   'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  preparing: 'text-[#FF6B00] bg-[#FF6B00]/10 border-[#FF6B00]/30',
  shipping:  'text-blue-400 bg-blue-400/10 border-blue-400/30',
  delivered: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
  cancelled: 'text-red-400 bg-red-400/10 border-red-400/30',
}

const ITEMS = [
  { id: 1, name: 'Pizza Margherita', qty: 1, price: 185, notes: 'Sin albahaca' },
  { id: 2, name: 'Bruschetta',       qty: 2, price: 95,  notes: '' },
  { id: 6, name: 'Carbonara',        qty: 1, price: 175, notes: 'Extra queso' },
]

export default function RestaurantOrderDetail() {
  const { id } = useParams()
  const [status, setStatus] = useState<Status>('pending')

  function advance() {
    const idx = FLOW.indexOf(status)
    if (idx < FLOW.length - 1) setStatus(FLOW[idx + 1])
  }

  const total = ITEMS.reduce((s, i) => s + i.price * i.qty, 0)

  return (
    <div className="min-h-screen bg-[#0F0F0F] max-w-md mx-auto lg:max-w-2xl">
      {/* Header */}
      <header className="bg-[#1A1A1A] border-b border-[#2A2A2A] px-4 py-4 sticky top-0 z-20 flex items-center gap-3">
          <Link to="/portal/restaurant" className="w-9 h-9 rounded-full bg-[#2A2A2A] flex items-center justify-center border border-[#3A3A3A]">
            <ArrowLeft className="w-4 h-4 text-white" />
          </Link>
          <div className="flex-1">
            <h1 className="font-bold text-white">Pedido #{id?.split('-')[1] ?? '0051'}</h1>
            <p className="text-xs text-[#606060]">La Trattoria</p>
          </div>
          {/* Badge de estado */}
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_COLOR[status]}`}>
            {STATUS_LABEL[status]}
          </span>
      </header>

      <div className="px-4 py-5 space-y-4">
        {/* Info del cliente */}
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B00] to-[#E63946] flex items-center justify-center text-white font-bold text-sm">AG</div>
            <div className="flex-1">
              <p className="font-semibold text-white">Ana García</p>
              <p className="text-xs text-[#606060]">Cliente frecuente · 12 pedidos</p>
            </div>
            <button className="w-9 h-9 rounded-full bg-[#FF6B00]/15 border border-[#FF6B00]/30 flex items-center justify-center">
              <Phone className="w-4 h-4 text-[#FF6B00]" />
            </button>
          </div>
          <div className="mt-3 pt-3 border-t border-[#2A2A2A] flex items-start gap-2">
            <MapPin className="w-4 h-4 text-[#606060] mt-0.5 flex-shrink-0" />
            <p className="text-sm text-[#A0A0A0]">Calle Madero 42, Col. Centro, CDMX</p>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#606060]" />
            <p className="text-sm text-[#A0A0A0]">Pedido hace <span className="text-white font-medium">2 minutos</span></p>
          </div>
        </div>

        {/* Ítems del pedido */}
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-[#2A2A2A]">
            <h3 className="font-semibold text-white">Artículos ({ITEMS.length})</h3>
          </div>
          {ITEMS.map(item => (
            <div key={item.id} className="px-4 py-3 border-b border-[#2A2A2A] last:border-none flex items-start gap-3">
              <span className="bg-[#2A2A2A] text-white text-xs font-bold w-6 h-6 rounded flex items-center justify-center flex-shrink-0">{item.qty}x</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{item.name}</p>
                {item.notes && <p className="text-xs text-[#FF6B00] mt-0.5">📝 {item.notes}</p>}
              </div>
              <p className="text-sm font-bold text-white">Bs. {item.price * item.qty}</p>
            </div>
          ))}
          {/* Total */}
          <div className="px-4 py-3 bg-[#0F0F0F] flex justify-between items-center">
            <span className="text-sm text-[#606060]">Total del pedido</span>
            <span className="text-lg font-bold text-[#FF6B00]">Bs. {total}</span>
          </div>
        </div>

        {/* Barra de progreso del estado */}
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4">
          <h3 className="text-sm font-bold text-[#606060] uppercase tracking-wider mb-3">Progreso</h3>
          <div className="flex items-center gap-1">
            {FLOW.map((s, i) => (
              <div key={s} className="flex items-center gap-1 flex-1">
                <div className={`h-1.5 flex-1 rounded-full transition-all ${
                  FLOW.indexOf(status) >= i ? 'bg-[#FF6B00]' : 'bg-[#2A2A2A]'
                }`} />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {FLOW.map(s => (
              <span key={s} className={`text-[10px] ${status === s ? 'text-[#FF6B00] font-semibold' : FLOW.indexOf(s) <= FLOW.indexOf(status) ? 'text-[#606060]' : 'text-[#3A3A3A]'}`}>
                {STATUS_LABEL[s]}
              </span>
            ))}
          </div>
        </div>

        {/* Acciones */}
        {status !== 'delivered' && status !== 'cancelled' && (
          <div className="flex gap-3">
            <button
              onClick={() => setStatus('cancelled')}
              className="flex-1 py-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-semibold text-sm hover:bg-red-500/20 transition-all"
            >
              Rechazar
            </button>
            <button
              onClick={advance}
              className="flex-[2] py-3.5 rounded-xl bg-[#FF6B00] hover:bg-[#E55A00] text-white font-semibold text-sm shadow-[0_4px_20px_rgba(255,107,0,0.4)] transition-all active:scale-[0.98]"
            >
              {NEXT_ACTION[status]}
            </button>
          </div>
        )}

        {/* Entregado */}
        {status === 'delivered' && (
          <div className="bg-emerald-400/10 border border-emerald-400/30 rounded-xl py-4 text-center">
            <p className="text-emerald-400 font-bold">✓ Pedido entregado exitosamente</p>
          </div>
        )}
      </div>
    </div>
  )
}
