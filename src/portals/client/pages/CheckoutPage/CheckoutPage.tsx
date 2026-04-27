import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, MapPin, ChevronRight, Plus, Minus, Trash2 } from 'lucide-react'

/* ── Mock data ─────────────────────────────────────────────── */
const CART_ITEMS = [
  { id: 1, name: 'Pizza Margherita', qty: 1, price: 105, emoji: '🍕' },
  { id: 2, name: 'Bruschetta',       qty: 2, price: 55,  emoji: '🥖' },
  { id: 6, name: 'Carbonara',        qty: 1, price: 75, emoji: '🍝' },
]
const PAYMENT_METHODS = [
  { id: 'card1', label: '**** 4242', brand: 'Visa',       icon: '💳' },
  { id: 'cash',  label: 'Efectivo',  brand: 'En casa',    icon: '💵' },
]

export default function CheckoutPage() {
  const [items, setItems] = useState(CART_ITEMS)
  const [payment, setPayment] = useState('card1')

  const subtotal  = items.reduce((s, i) => s + i.price * i.qty, 0)
  const delivery  = 0
  const serviceFee = Math.round(subtotal * 0.05)
  const total     = subtotal + delivery + serviceFee

  function changeQty(id: number, delta: number) {
    setItems(prev => prev
      .map(i => i.id === id ? { ...i, qty: i.qty + delta } : i)
      .filter(i => i.qty > 0)
    )
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] max-w-md mx-auto lg:max-w-2xl">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[#0F0F0F]/90 backdrop-blur flex items-center gap-3 px-4 py-4 border-b border-[#1F1F1F]">
        <Link to="/restaurant/1" className="w-9 h-9 rounded-full bg-[#1A1A1A] flex items-center justify-center border border-[#2A2A2A]">
          <ArrowLeft className="w-4 h-4 text-white" />
        </Link>
        <h1 className="text-lg font-bold text-white">Tu pedido</h1>
      </header>

      <div className="px-4 py-4 space-y-4">
        {/* Restaurante */}
        <div className="flex items-center gap-2 text-sm text-[#A0A0A0]">
          <span className="text-xl">🍕</span>
          <span>La Trattoria</span>
          <span className="ml-auto text-[#FF6B00] font-medium">{items.length} artículos</span>
        </div>

        {/* Items del carrito */}
        <div className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] divide-y divide-[#2A2A2A]">
          {items.map(item => (
            <div key={item.id} className="flex items-center gap-3 px-4 py-3">
              <span className="text-2xl">{item.emoji}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{item.name}</p>
                <p className="text-xs text-[#FF6B00] font-medium mt-0.5">Bs. {item.price}</p>
              </div>
              {/* Controles */}
              <div className="flex items-center gap-2">
                <button onClick={() => changeQty(item.id, -1)} className="w-7 h-7 rounded-full bg-[#2A2A2A] flex items-center justify-center">
                  {item.qty === 1 ? <Trash2 className="w-3 h-3 text-[#E63946]" /> : <Minus className="w-3 h-3 text-white" />}
                </button>
                <span className="text-white font-bold text-sm w-4 text-center">{item.qty}</span>
                <button onClick={() => changeQty(item.id, 1)} className="w-7 h-7 rounded-full bg-[#2A2A2A] flex items-center justify-center">
                  <Plus className="w-3 h-3 text-white" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Dirección de entrega */}
        <section>
          <h3 className="text-sm font-bold text-[#A0A0A0] uppercase tracking-wider mb-2">Dirección</h3>
          <button className="w-full flex items-center gap-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl px-4 py-3 text-left">
            <MapPin className="w-5 h-5 text-[#FF6B00] flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">Casa</p>
              <p className="text-xs text-[#606060]">Calle Madero 42, Col. Centro</p>
            </div>
            <ChevronRight className="w-4 h-4 text-[#606060]" />
          </button>
        </section>

        {/* Método de pago */}
        <section>
          <h3 className="text-sm font-bold text-[#A0A0A0] uppercase tracking-wider mb-2">Pago</h3>
          <div className="space-y-2">
            {PAYMENT_METHODS.map(m => (
              <button
                key={m.id}
                onClick={() => setPayment(m.id)}
                className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 border transition-all ${
                  payment === m.id
                    ? 'bg-[#FF6B00]/10 border-[#FF6B00]/40'
                    : 'bg-[#1A1A1A] border-[#2A2A2A]'
                }`}
              >
                <span className="text-2xl">{m.icon}</span>
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-white">{m.label}</p>
                  <p className="text-xs text-[#606060]">{m.brand}</p>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 ${payment === m.id ? 'border-[#FF6B00] bg-[#FF6B00]' : 'border-[#3A3A3A]'}`} />
              </button>
            ))}
          </div>
        </section>

        {/* Resumen de precios */}
        <div className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-4 space-y-2">
          <div className="flex justify-between text-sm text-[#A0A0A0]">
            <span>Subtotal</span><span>Bs. {subtotal}</span>
          </div>
          <div className="flex justify-between text-sm text-[#A0A0A0]">
            <span>Envío</span>
            <span className="text-emerald-400">{delivery === 0 ? 'Gratis' : `Bs. ${delivery}`}</span>
          </div>
          <div className="flex justify-between text-sm text-[#A0A0A0]">
            <span>Cargo por servicio</span><span>Bs. {serviceFee}</span>
          </div>
          <div className="pt-2 border-t border-[#2A2A2A] flex justify-between font-bold text-white">
            <span>Total</span><span className="text-[#FF6B00] text-lg">Bs. {total}</span>
          </div>
        </div>

        {/* CTA confirmar pedido */}
        <Link
          to="/tracking/42"
          className="flex items-center justify-between w-full bg-[#FF6B00] hover:bg-[#E55A00] text-white rounded-xl px-5 py-4 font-bold shadow-[0_8px_32px_rgba(255,107,0,0.4)] transition-all active:scale-[0.98] mt-2"
        >
          <span>Confirmar pedido</span>
          <span>Bs. {total}</span>
        </Link>
      </div>
    </div>
  )
}
