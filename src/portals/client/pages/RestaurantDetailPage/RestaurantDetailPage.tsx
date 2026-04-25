import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Star, Clock, MapPin, Plus, Minus, ShoppingCart } from 'lucide-react'

/* ── Mock data ─────────────────────────────────────────────── */
const SECTIONS = [
  {
    id: 'populares', name: 'Más pedidos', items: [
      { id: 1, name: 'Pizza Margherita', desc: 'Salsa de tomate, mozzarella, albahaca fresca', price: 185, emoji: '🍕', available: true },
      { id: 2, name: 'Pizza Pepperoni',  desc: 'Pepperoni, mozzarella, salsa ahumada', price: 210, emoji: '🍕', available: true },
    ],
  },
  {
    id: 'entradas', name: 'Entradas', items: [
      { id: 3, name: 'Bruschetta',  desc: 'Pan tostado con tomate, albahaca y aceite de oliva', price: 95,  emoji: '🥖', available: true },
      { id: 4, name: 'Ensalada César', desc: 'Lechuga romana, croutones, parmesano, aderezo', price: 115, emoji: '🥗', available: true },
      { id: 5, name: 'Calamares a la romana', desc: 'Aros de calamar fritos con alioli limón', price: 145, emoji: '🦑', available: false },
    ],
  },
  {
    id: 'pastas', name: 'Pastas', items: [
      { id: 6, name: 'Carbonara',  desc: 'Spaghetti, panceta, huevo, parmesano, pimienta', price: 175, emoji: '🍝', available: true },
      { id: 7, name: 'Penne al ragù', desc: 'Salsa boloñesa tradicional, carne molida', price: 165, emoji: '🍝', available: true },
    ],
  },
]

type CartItem = { id: number; name: string; price: number; qty: number }

/* ── Componente ─────────────────────────────────────────────── */
export default function RestaurantDetailPage() {
  const { id } = useParams()
  const [cart, setCart] = useState<CartItem[]>([])
  const [activeSection, setActiveSection] = useState('populares')

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const cartCount = cart.reduce((s, i) => s + i.qty, 0)

  function addItem(item: { id: number; name: string; price: number }) {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id)
      return existing
        ? prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c)
        : [...prev, { ...item, qty: 1 }]
    })
  }

  function removeItem(id: number) {
    setCart(prev => {
      const existing = prev.find(c => c.id === id)
      if (!existing || existing.qty === 1) return prev.filter(c => c.id !== id)
      return prev.map(c => c.id === id ? { ...c, qty: c.qty - 1 } : c)
    })
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] max-w-md mx-auto lg:max-w-none relative">
      {/* Hero imagen del restaurante */}
      <div className="relative h-52">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-red-800 flex items-center justify-center">
          <span className="text-9xl opacity-30">🍕</span>
        </div>
        {/* Gradiente oscuro abajo */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent to-transparent" />
        {/* Botón atrás */}
        <Link to="/" className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/50 backdrop-blur flex items-center justify-center border border-white/10">
          <ArrowLeft className="w-4 h-4 text-white" />
        </Link>
      </div>

      {/* Info del restaurante */}
      <div className="px-4 -mt-6 relative z-10">
        <h1 className="text-2xl font-bold text-white">La Trattoria</h1>
        <p className="text-[#A0A0A0] text-sm mt-0.5">Cocina italiana · $$</p>
        <div className="flex items-center gap-4 mt-2">
          <span className="flex items-center gap-1 text-sm text-[#A0A0A0]">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> 4.8 (320 reseñas)
          </span>
          <span className="flex items-center gap-1 text-sm text-[#A0A0A0]">
            <Clock className="w-4 h-4" /> 25-35 min
          </span>
          <span className="flex items-center gap-1 text-sm text-emerald-400 font-medium">
            🛵 Envío gratis
          </span>
        </div>
      </div>

      {/* Tabs de secciones del menú */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 mt-5 pb-1">
        {SECTIONS.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeSection === s.id
                ? 'bg-[#FF6B00] text-white'
                : 'bg-[#1A1A1A] text-[#A0A0A0] border border-[#2A2A2A]'
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Ítems del menú */}
      <div className="px-4 mt-4 pb-32 space-y-6">
        {SECTIONS.map(section => (
          <div key={section.id}>
            <h3 className="text-sm font-bold text-[#606060] uppercase tracking-wider mb-3">{section.name}</h3>
            <div className="space-y-3">
              {section.items.map(item => {
                const qty = cart.find(c => c.id === item.id)?.qty ?? 0
                return (
                  <div
                    key={item.id}
                    className={`flex gap-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-3 ${!item.available ? 'opacity-40' : ''}`}
                  >
                    {/* Emoji placeholder de imagen */}
                    <div className="w-20 h-20 rounded-lg bg-[#2A2A2A] flex items-center justify-center flex-shrink-0 text-3xl">
                      {item.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white text-sm">{item.name}</p>
                      <p className="text-[#606060] text-xs mt-0.5 line-clamp-2">{item.desc}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="font-bold text-[#FF6B00]">Bs. {item.price}</p>
                        {/* Controles cantidad */}
                        {item.available && (
                          <div className="flex items-center gap-2">
                            {qty > 0 ? (
                              <>
                                <button onClick={() => removeItem(item.id)} className="w-7 h-7 rounded-full bg-[#2A2A2A] flex items-center justify-center">
                                  <Minus className="w-3 h-3 text-white" />
                                </button>
                                <span className="text-white font-bold text-sm w-4 text-center">{qty}</span>
                              </>
                            ) : null}
                            <button
                              onClick={() => addItem(item)}
                              className="w-7 h-7 rounded-full bg-[#FF6B00] flex items-center justify-center"
                            >
                              <Plus className="w-3 h-3 text-white" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Botón flotante del carrito */}
      {cartCount > 0 && (
        <div className="fixed bottom-14 left-0 right-0 px-4 z-40 max-w-md mx-auto">
          <Link
            to="/cart"
            className="flex items-center justify-between bg-[#FF6B00] text-white rounded-xl px-5 py-4 shadow-[0_8px_32px_rgba(255,107,0,0.5)]"
          >
            <div className="flex items-center gap-2">
              <span className="bg-white/20 rounded-lg w-6 h-6 flex items-center justify-center text-xs font-bold">{cartCount}</span>
              <span className="font-semibold">Ver carrito</span>
            </div>
            <span className="font-bold">Bs. {cartTotal}</span>
          </Link>
        </div>
      )}
    </div>
  )
}
