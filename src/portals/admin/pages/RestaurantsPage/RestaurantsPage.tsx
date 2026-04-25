import { useState } from 'react'
import { Search, Filter, ChevronDown, CheckCircle, XCircle, MoreVertical } from 'lucide-react'

/* ── Mock data ─────────────────────────────────────────────── */
type RStatus = 'active' | 'pending' | 'suspended'

interface Restaurant {
  id: number; name: string; category: string; owner: string
  city: string; orders: number; revenue: string; status: RStatus; joined: string
}

const RESTAURANTS: Restaurant[] = [
  { id: 1, name: 'La Trattoria',    category: 'Italiana',  owner: 'Marco Rossi',   city: 'Cercado',        orders: 1420, revenue: 'Bs. 41.2k', status: 'active',    joined: '12 Ene 2024' },
  { id: 2, name: 'Sakura Sushi',    category: 'Tradicional',  owner: 'Yuki Tanaka',   city: 'America',  orders: 980,  revenue: 'Bs. 32.8k', status: 'active',    joined: '3 Feb 2024'  },
  { id: 3, name: 'Burger Republic', category: 'Americana', owner: 'John Smith',    city: 'Sacaba',    orders: 2100, revenue: 'Bs. 28.5k', status: 'active',    joined: '15 Oct 2023' },
  { id: 4, name: 'Ramen Kyoto',     category: 'Japonesa',  owner: 'Hana Mori',     city: 'Quillacollo',        orders: 0,    revenue: 'Bs. 0',     status: 'pending',   joined: '20 Abr 2024' },
  { id: 5, name: 'Taco Express',    category: 'Mexicana',  owner: 'Carlos Vega',   city: 'Zona sur',       orders: 0,    revenue: 'Bs. 0',     status: 'pending',   joined: '21 Abr 2024' },
  { id: 6, name: 'Pizza Palace',    category: 'Italiana',  owner: 'Luigi Ferrari', city: 'Catolica',        orders: 320,  revenue: 'Bs. 9.4k',  status: 'suspended', joined: '5 Mar 2024'  },
  { id: 7, name: 'Green Bowl Co.',  category: 'Saludable', owner: 'Sofia Green',   city: 'Blnaco',  orders: 760,  revenue: 'Bs. 18.2k', status: 'active',    joined: '28 Nov 2023' },
]

const STATUS_CFG: Record<RStatus, { label: string; cls: string }> = {
  active:    { label: 'Activo',     cls: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/25' },
  pending:   { label: 'Pendiente',  cls: 'text-yellow-400  bg-yellow-400/10  border-yellow-400/25'  },
  suspended: { label: 'Suspendido', cls: 'text-red-400     bg-red-400/10     border-red-400/25'     },
}

export default function AdminRestaurants() {
  const [search, setSearch]   = useState('')
  const [filter, setFilter]   = useState<'all' | RStatus>('all')
  const [data, setData]       = useState(RESTAURANTS)

  const filtered = data.filter(r =>
    (filter === 'all' || r.status === filter) &&
    r.name.toLowerCase().includes(search.toLowerCase())
  )

  function approve(id: number) {
    setData(prev => prev.map(r => r.id === id ? { ...r, status: 'active' as RStatus } : r))
  }
  function suspend(id: number) {
    setData(prev => prev.map(r => r.id === id ? { ...r, status: 'suspended' as RStatus } : r))
  }

  const counts = { all: data.length, active: data.filter(r=>r.status==='active').length, pending: data.filter(r=>r.status==='pending').length, suspended: data.filter(r=>r.status==='suspended').length }

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      {/* Header */}
      <header className="bg-[#1A1A1A] border-b border-[#2A2A2A] px-4 py-4 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-lg font-bold text-white">Restaurantes</h1>
          <p className="text-xs text-[#606060] mt-0.5">{counts.active} activos · {counts.pending} por aprobar · {counts.suspended} suspendidos</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-5 space-y-4">
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#606060]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar restaurante..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-sm text-white placeholder:text-[#606060] focus:outline-none focus:border-[#FF6B00]/50"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'active', 'pending', 'suspended'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                  filter === f ? 'bg-[#FF6B00] text-white border-[#FF6B00]' : 'bg-[#1A1A1A] text-[#A0A0A0] border-[#2A2A2A]'
                }`}
              >
                {f === 'all' ? `Todos (${counts.all})` : `${STATUS_CFG[f].label} (${counts[f]})`}
              </button>
            ))}
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl overflow-hidden">
          {/* Header de tabla */}
          <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-[#2A2A2A] text-xs font-semibold text-[#606060] uppercase tracking-wider">
            <span>Restaurante</span><span>Ciudad</span><span>Pedidos</span><span>Ingresos</span><span>Estado</span><span>Acciones</span>
          </div>

          {/* Filas */}
          <div className="divide-y divide-[#2A2A2A]">
            {filtered.map(r => (
              <div key={r.id} className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-2 md:gap-4 px-5 py-4 items-center hover:bg-[#1F1F1F] transition-colors">
                {/* Nombre y dueño */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF6B00]/40 to-[#E63946]/40 flex items-center justify-center text-lg flex-shrink-0">🍽</div>
                  <div>
                    <p className="font-semibold text-white text-sm">{r.name}</p>
                    <p className="text-xs text-[#606060]">{r.owner} · {r.category}</p>
                  </div>
                </div>
                <span className="text-sm text-[#A0A0A0]">{r.city}</span>
                <span className="text-sm text-white font-medium">{r.orders.toLocaleString()}</span>
                <span className="text-sm text-white font-medium">{r.revenue}</span>
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border w-fit ${STATUS_CFG[r.status].cls}`}>
                  {STATUS_CFG[r.status].label}
                </span>
                {/* Acciones contextuales */}
                <div className="flex items-center gap-1.5">
                  {r.status === 'pending' && (
                    <button
                      onClick={() => approve(r.id)}
                      className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 rounded-lg text-xs font-semibold hover:bg-emerald-400/20 transition-colors"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Aprobar
                    </button>
                  )}
                  {r.status === 'active' && (
                    <button
                      onClick={() => suspend(r.id)}
                      className="flex items-center gap-1 px-2.5 py-1.5 bg-red-400/10 border border-red-400/30 text-red-400 rounded-lg text-xs font-semibold hover:bg-red-400/20 transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Suspender
                    </button>
                  )}
                  {r.status === 'suspended' && (
                    <button
                      onClick={() => approve(r.id)}
                      className="flex items-center gap-1 px-2.5 py-1.5 bg-[#2A2A2A] border border-[#3A3A3A] text-[#A0A0A0] rounded-lg text-xs font-semibold hover:bg-[#3A3A3A] transition-colors"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Reactivar
                    </button>
                  )}
                  <button className="w-7 h-7 rounded-lg bg-[#2A2A2A] flex items-center justify-center hover:bg-[#3A3A3A]">
                    <MoreVertical className="w-3.5 h-3.5 text-[#606060]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {filtered.length === 0 && (
          <p className="text-center py-12 text-[#606060] text-sm">Sin resultados para "{search}"</p>
        )}
      </main>
    </div>
  )
}
