import { Link } from 'react-router-dom'
import { ShoppingBag, DollarSign, Store, Users, TrendingUp, ChevronRight, ArrowUpRight } from 'lucide-react'

/* ── Mock data ─────────────────────────────────────────────── */
const KPIS = [
  { icon: ShoppingBag, label: 'Pedidos totales',       value: '12,430', delta: '+18%', color: 'text-[#FF6B00]', bg: 'bg-[#FF6B00]/10',   gradient: 'from-[#FF6B00]/20 to-transparent' },
  { icon: DollarSign,  label: 'Ingresos del mes',      value: 'Bs. 284k',  delta: '+22%', color: 'text-emerald-400', bg: 'bg-emerald-400/10', gradient: 'from-emerald-400/20 to-transparent' },
  { icon: Store,       label: 'Restaurantes activos',  value: '148',    delta: '+5',   color: 'text-blue-400',   bg: 'bg-blue-400/10',    gradient: 'from-blue-400/20 to-transparent' },
  { icon: Users,       label: 'Usuarios registrados',  value: '34.2k',  delta: '+340', color: 'text-purple-400', bg: 'bg-purple-400/10',  gradient: 'from-purple-400/20 to-transparent' },
]

/* Datos para la gráfica semanal (barras simuladas) */
const WEEKLY = [
  { day: 'Lun', orders: 1420, revenue: 41200 },
  { day: 'Mar', orders: 1650, revenue: 48000 },
  { day: 'Mié', orders: 1380, revenue: 40100 },
  { day: 'Jue', orders: 1890, revenue: 54900 },
  { day: 'Vie', orders: 2240, revenue: 65200 },
  { day: 'Sáb', orders: 2680, revenue: 77800 },
  { day: 'Dom', orders: 1960, revenue: 56900 },
]

const RECENT_ORDERS = [
  { id: 'FD-12430', restaurant: 'La Trattoria',    customer: 'Ana García',   amount: 485, status: 'delivered' as const },
  { id: 'FD-12429', restaurant: 'Sakura Sushi',    customer: 'Luis Ramos',   amount: 620, status: 'shipping'  as const },
  { id: 'FD-12428', restaurant: 'Burger Republic', customer: 'Mia Torres',   amount: 215, status: 'preparing' as const },
  { id: 'FD-12427', restaurant: 'Taco Loco',       customer: 'Omar Vega',    amount: 175, status: 'delivered' as const },
  { id: 'FD-12426', restaurant: 'Ramen House',     customer: 'Valeria Cruz', amount: 340, status: 'cancelled' as const },
]

const STATUS_CFG = {
  pending:   'text-yellow-400 bg-yellow-400/10 border-yellow-400/25',
  preparing: 'text-[#FF6B00] bg-[#FF6B00]/10 border-[#FF6B00]/25',
  shipping:  'text-blue-400 bg-blue-400/10 border-blue-400/25',
  delivered: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/25',
  cancelled: 'text-red-400 bg-red-400/10 border-red-400/25',
} as const
const STATUS_LABEL = { pending: 'Pendiente', preparing: 'Preparando', shipping: 'En camino', delivered: 'Entregado', cancelled: 'Cancelado' }

/* ── Componente ─────────────────────────────────────────────── */
export default function AdminDashboard() {
  const maxOrders = Math.max(...WEEKLY.map(w => w.orders))

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      {/* Topbar */}
      <header className="bg-[#1A1A1A] border-b border-[#2A2A2A] px-4 py-4 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center text-white text-lg">⚙</div>
            <div>
              <h1 className="font-bold text-white text-base">Panel de Administración</h1>
              <p className="text-xs text-[#606060]">TumenuYa · Vista global</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#606060]">
            <div className="w-2 h-2 bg-emerald-400 rounded-full" />
            Sistema operativo
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {KPIS.map(kpi => (
            <div key={kpi.label} className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-5 relative overflow-hidden">
              {/* Gradiente decorativo */}
              <div className={`absolute inset-0 bg-gradient-to-br ${kpi.gradient} opacity-50`} />
              <div className="relative z-10">
                <div className={`w-10 h-10 rounded-xl ${kpi.bg} flex items-center justify-center mb-3`}>
                  <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
                <p className="text-2xl font-bold text-white">{kpi.value}</p>
                <p className="text-xs text-[#606060] mt-1">{kpi.label}</p>
                <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-400 mt-1.5">
                  <ArrowUpRight className="w-3 h-3" /> {kpi.delta} esta semana
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Gráfica semanal */}
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-white">Pedidos — última semana</h2>
            <div className="flex items-center gap-1.5 text-xs text-[#606060]">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">+18%</span> vs semana pasada
            </div>
          </div>
          {/* Barras */}
          <div className="flex items-end gap-2 h-36">
            {WEEKLY.map(w => {
              const pct = (w.orders / maxOrders) * 100
              const isMax = w.orders === maxOrders
              return (
                <div key={w.day} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-[10px] text-[#606060]">{w.orders.toLocaleString()}</span>
                  <div className="w-full rounded-t-lg relative" style={{ height: `${pct}%` }}>
                    <div
                      className={`absolute inset-0 rounded-t-lg ${isMax ? 'bg-[#FF6B00]' : 'bg-[#2A2A2A]'}`}
                      title={`${w.day}: ${w.orders} pedidos`}
                    />
                    {isMax && <div className="absolute inset-0 rounded-t-lg bg-[#FF6B00] opacity-30 blur-sm" />}
                  </div>
                  <span className="text-xs text-[#606060]">{w.day}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Pedidos recientes */}
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#2A2A2A]">
            <h2 className="font-bold text-white">Pedidos recientes</h2>
            <Link to="/portal/admin" className="text-[#FF6B00] text-xs font-semibold flex items-center gap-1">
              Ver todos <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-[#2A2A2A]">
            {RECENT_ORDERS.map(order => (
              <div key={order.id} className="flex items-center gap-4 px-5 py-3">
                <span className="text-xs font-mono text-[#606060] w-20 flex-shrink-0">{order.id}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{order.restaurant}</p>
                  <p className="text-xs text-[#606060]">{order.customer}</p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${STATUS_CFG[order.status]}`}>
                  {STATUS_LABEL[order.status]}
                </span>
                <span className="font-bold text-white text-sm flex-shrink-0">Bs. {order.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
