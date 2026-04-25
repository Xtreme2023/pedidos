import { useState } from 'react'
import { Plus, Search, Edit2, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'

/* ── Mock data ─────────────────────────────────────────────── */
const CATEGORIES = ['Todos', 'Pizzas', 'Entradas', 'Pastas', 'Postres', 'Bebidas']

interface MenuItem {
  id: number; name: string; category: string
  price: number; emoji: string; available: boolean; sales: number
}

const MENU: MenuItem[] = [
  { id: 1, name: 'Pizza Margherita',  category: 'Pizzas',   price: 185, emoji: '🍕', available: true,  sales: 142 },
  { id: 2, name: 'Pizza Pepperoni',   category: 'Pizzas',   price: 210, emoji: '🍕', available: true,  sales: 98  },
  { id: 3, name: 'Pizza 4 Quesos',    category: 'Pizzas',   price: 225, emoji: '🍕', available: false, sales: 67  },
  { id: 4, name: 'Bruschetta',        category: 'Entradas', price: 95,  emoji: '🥖', available: true,  sales: 55  },
  { id: 5, name: 'Ensalada César',    category: 'Entradas', price: 115, emoji: '🥗', available: true,  sales: 43  },
  { id: 6, name: 'Calamares',         category: 'Entradas', price: 145, emoji: '🦑', available: false, sales: 21  },
  { id: 7, name: 'Carbonara',         category: 'Pastas',   price: 175, emoji: '🍝', available: true,  sales: 88  },
  { id: 8, name: 'Penne al ragù',     category: 'Pastas',   price: 165, emoji: '🍝', available: true,  sales: 72  },
  { id: 9, name: 'Tiramisú',          category: 'Postres',  price: 85,  emoji: '🍰', available: true,  sales: 61  },
]

export default function RestaurantMenu() {
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [search, setSearch]         = useState('')
  const [items, setItems]           = useState<MenuItem[]>(MENU)

  const filtered = items.filter(i =>
    (activeCategory === 'Todos' || i.category === activeCategory) &&
    i.name.toLowerCase().includes(search.toLowerCase())
  )

  function toggleAvailability(id: number) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, available: !i.available } : i))
  }

  const availableCount  = items.filter(i => i.available).length
  const unavailableCount = items.length - availableCount

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      {/* Header */}
      <header className="bg-[#1A1A1A] border-b border-[#2A2A2A] px-4 py-4 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white">Gestión de Menú</h1>
            <p className="text-xs text-[#606060]">
              <span className="text-emerald-400">{availableCount} disponibles</span>
              {' · '}
              <span className="text-red-400">{unavailableCount} no disponibles</span>
            </p>
          </div>
          <button className="flex items-center gap-2 bg-[#FF6B00] hover:bg-[#E55A00] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all">
            <Plus className="w-4 h-4" /> Agregar
          </button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-5 space-y-4">
        {/* Búsqueda */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#606060]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar platillo..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-sm text-white placeholder:text-[#606060] focus:outline-none focus:border-[#FF6B00]/50"
          />
        </div>

        {/* Tabs de categorías */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-[#FF6B00] text-white'
                  : 'bg-[#1A1A1A] text-[#A0A0A0] border border-[#2A2A2A]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Lista de platillos */}
        <div className="space-y-2">
          {filtered.map(item => (
            <div
              key={item.id}
              className={`flex items-center gap-4 bg-[#1A1A1A] border rounded-xl px-4 py-3 transition-all ${
                item.available ? 'border-[#2A2A2A]' : 'border-[#2A2A2A] opacity-60'
              }`}
            >
              {/* Emoji del platillo */}
              <div className="w-12 h-12 rounded-lg bg-[#2A2A2A] flex items-center justify-center text-2xl flex-shrink-0">
                {item.emoji}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm">{item.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-[#606060]">{item.category}</span>
                  <span className="text-xs text-[#3A3A3A]">·</span>
                  <span className="text-xs text-[#606060]">{item.sales} vendidos</span>
                </div>
              </div>

              {/* Precio */}
              <span className="font-bold text-white text-sm flex-shrink-0">Bs. {item.price}</span>

              {/* Acciones */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button className="w-8 h-8 rounded-lg bg-[#2A2A2A] flex items-center justify-center hover:bg-[#3A3A3A] transition-colors">
                  <Edit2 className="w-3.5 h-3.5 text-[#A0A0A0]" />
                </button>
                <button className="w-8 h-8 rounded-lg bg-[#2A2A2A] flex items-center justify-center hover:bg-red-500/10 hover:border hover:border-red-500/30 transition-colors">
                  <Trash2 className="w-3.5 h-3.5 text-[#606060] hover:text-red-400" />
                </button>
                {/* Toggle disponibilidad */}
                <button
                  onClick={() => toggleAvailability(item.id)}
                  className="flex-shrink-0"
                  title={item.available ? 'Deshabilitar' : 'Habilitar'}
                >
                  {item.available
                    ? <ToggleRight className="w-8 h-8 text-[#FF6B00]" />
                    : <ToggleLeft className="w-8 h-8 text-[#3A3A3A]" />
                  }
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-[#606060]">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-sm">No se encontraron platillos</p>
          </div>
        )}
      </div>
    </div>
  )
}
