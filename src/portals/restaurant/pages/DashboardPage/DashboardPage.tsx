import { useState } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, ShoppingBag, Clock, DollarSign, Bell, ChevronRight, Users } from 'lucide-react'

/* ── Mock data ─────────────────────────────────────────────── */
const STATS = [
  { icon: ShoppingBag, label: 'Pedidos hoy',   value: '34',    delta: '+8',     positive: true,  color: 'text-[#FF6B00]', bg: 'bg-[#FF6B00]/10' },
  { icon: DollarSign,  label: 'Ingresos',      value: 'Bs. 5,280', delta: '+12%',  positive: true,  color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { icon: Clock,       label: 'Tiempo prom.',  value: '28 min', delta: '-3 min', positive: true,  color: 'text-blue-400',    bg: 'bg-blue-400/10' },
  { icon: Users,       label: 'Clientes',      value: '29',    delta: '+5',     positive: true,  color: 'text-purple-400',  bg: 'bg-purple-400/10' },
]

type OrderStatus = 'pending' | 'preparing' | 'shipping' | 'delivered' | 'cancelled'

interface Order {
  id: string
  customer: string
  items: string
  total: number
  time: string
  status: OrderStatus
}

const ORDERS: Order[] = [
  { id: 'FD-0051', customer: 'Ana García',     items: '2 items',  total: 310, time: '2 min',  status: 'pending'   },
  { id: 'FD-0050', customer: 'Carlos López',   items: '4 items',  total: 485, time: '8 min',  status: 'preparing' },
  { id: 'FD-0049', customer: 'Laura Méndez',   items: '1 item',   total: 185, time: '15 min', status: 'preparing' },
  { id: 'FD-0048', customer: 'Sofía Ruiz',     items: '3 items',  total: 365, time: '22 min', status: 'shipping'  },
  { id: 'FD-0047', customer: 'Miguel Torres',  items: '2 items',  total: 260, time: '35 min', status: 'delivered' },
]

const STATUS_BADGE: Record<OrderStatus, { label: string; cls: string }> = {
  pending:   { label: 'Nuevo',       cls: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/25' },
  preparing: { label: 'Preparando',  cls: 'text-[#FF6B00]  bg-[#FF6B00]/10  border-[#FF6B00]/25'  },
  shipping:  { label: 'En camino',   cls: 'text-blue-400   bg-blue-400/10   border-blue-400/25'   },
  delivered: { label: 'Entregado',   cls: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/25' },
  cancelled: { label: 'Cancelado',   cls: 'text-red-400    bg-red-400/10    border-red-400/25'    },
}

/* ── Componente ─────────────────────────────────────────────── */
export default function RestaurantDashboard() {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      {/* Header del restaurante */}
      <header className="bg-[#1A1A1A] border-b border-[#2A2A2A] px-4 py-4 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-xl">🍕</div>
            <div>
              <h1 className="font-bold text-white text-base">La Trattoria</h1>
              <p className="text-xs text-[#606060]">Panel del restaurante</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Toggle abierto/cerrado */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                isOpen ? 'bg-emerald-400/15 text-emerald-400 border-emerald-400/30' : 'bg-red-400/15 text-red-400 border-red-400/30'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-emerald-400' : 'bg-red-400'}`} />
              {isOpen ? 'Abierto' : 'Cerrado'}
            </button>
            <button className="relative w-9 h-9 rounded-full bg-[#2A2A2A] flex items-center justify-center">
              <Bell className="w-4 h-4 text-white" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF6B00] rounded-full" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-5 space-y-6">
        {/* Stats del día */}
        <section>
          <h2 className="text-sm font-bold text-[#606060] uppercase tracking-wider mb-3">Resumen de hoy</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {STATS.map(s => (
              <div key={s.label} className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4">
                <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center mb-2`}>
                  <s.icon className={`w-4.5 h-4.5 ${s.color}`} />
                </div>
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-[#606060] mt-0.5">{s.label}</p>
                <p className={`text-xs font-semibold mt-1 ${s.positive ? 'text-emerald-400' : 'text-red-400'}`}>
                  {s.delta} vs ayer
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Pedidos en tiempo real */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-[#606060] uppercase tracking-wider flex items-center gap-2">
              Pedidos activos
              <span className="w-2 h-2 bg-[#FF6B00] rounded-full animate-pulse" />
            </h2>
            <Link to="/portal/restaurant/orders/FD-0051" className="text-[#FF6B00] text-xs font-semibold flex items-center gap-1">
              Ver todos <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2">
            {ORDERS.map(order => (
              <Link
                key={order.id}
                to={`/portal/restaurant/orders/${order.id}`}
                className="flex items-center gap-4 bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#3A3A3A] rounded-xl px-4 py-3 transition-all"
              >
                {/* ID y cliente */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[#606060]">#{order.id.split('-')[1]}</span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${STATUS_BADGE[order.status].cls}`}
                    >
                      {STATUS_BADGE[order.status].label}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-white mt-0.5">{order.customer}</p>
                  <p className="text-xs text-[#606060]">{order.items}</p>
                </div>
                {/* Total y tiempo */}
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-white">Bs. {order.total}</p>
                  <p className="text-xs text-[#606060] mt-0.5">hace {order.time}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#3A3A3A]" />
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
