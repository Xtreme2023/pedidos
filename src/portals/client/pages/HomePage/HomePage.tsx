import { Link } from 'react-router-dom'
import { Search, MapPin, Bell, Star, Clock, ChevronRight } from 'lucide-react'
import { CATEGORIES, RESTAURANTS } from '../../data/mockData'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0F0F0F] max-w-md mx-auto lg:max-w-2xl">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#0F0F0F]/90 backdrop-blur px-4 pt-4 pb-3 border-b border-[#1F1F1F]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-[#FF6B00]" />
            <div>
              <p className="text-[#606060] text-xs">Entregar en</p>
              <p className="text-white font-semibold leading-tight">Av. America, Chochabamba</p>
            </div>
          </div>
          <button className="relative w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center border border-[#2A2A2A]">
            <Bell className="w-4.5 h-4.5 text-white" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#FF6B00] rounded-full" />
          </button>
        </div>
        {/* Barra de búsqueda */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#606060]" />
          <input
            readOnly
            placeholder="Busca restaurantes o platillos..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-sm text-white placeholder:text-[#606060] focus:outline-none"
          />
        </div>
      </header>

      {/* Hero banner */}
      <div className="mx-4 mt-4 rounded-2xl overflow-hidden bg-gradient-to-r from-[#FF6B00] to-[#E63946] p-5 relative">
        <div className="relative z-10">
          <span className="text-xs font-semibold bg-white/20 text-white px-2 py-0.5 rounded-full">Oferta del día</span>
          <h2 className="text-xl font-bold text-white mt-2 leading-tight">¡Lo mejor de Cochabamba<br />a tu puerta!</h2>
          <p className="text-white/70 text-xs mt-1">Pique, fricasé, salteñas y más</p>
          <button className="mt-3 bg-white text-[#FF6B00] text-sm font-bold px-4 py-2 rounded-lg">
            Ver ofertas
          </button>
        </div>
        <span className="absolute right-4 bottom-2 text-6xl opacity-40">🍖</span>
      </div>

      {/* Categorías */}
      <section className="mt-6 px-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-white">Categorías</h3>
          <button className="text-[#FF6B00] text-xs font-semibold flex items-center gap-1">
            Ver todas <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map((cat, i) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className={`flex-shrink-0 flex flex-col items-center gap-1.5 px-4 py-2.5 rounded-xl border transition-all ${
                i === 0
                  ? 'bg-[#FF6B00]/15 border-[#FF6B00]/40 text-[#FF6B00]'
                  : 'bg-[#1A1A1A] border-[#2A2A2A] text-[#A0A0A0] hover:border-[#3A3A3A]'
              }`}
            >
              <span className="text-2xl">{cat.emoji}</span>
              <span className="text-xs font-medium">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Restaurantes cerca de ti */}
      <section className="mt-6 px-4 pb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-white">Cerca de ti</h3>
          <button className="text-[#FF6B00] text-xs font-semibold flex items-center gap-1">
            Ver todos <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {RESTAURANTS.map(r => (
            <Link to={`/restaurant/${r.id}`} key={r.id} className="block rounded-xl overflow-hidden bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#3A3A3A] transition-all active:scale-[0.98]">
              <div className="h-36 relative overflow-hidden">
                {r.image
                  ? <img src={r.image} alt={r.name} className="w-full h-full object-cover" />
                  : <div className={`w-full h-full bg-gradient-to-br ${r.gradient} flex items-center justify-center`}>
                      <span className="text-6xl opacity-60">{r.emoji}</span>
                    </div>
                }
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                {r.promo && (
                  <span className="absolute top-2 left-2 bg-[#FF6B00] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {r.promo}
                  </span>
                )}
                <span className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 text-white text-xs font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {r.rating}
                </span>
              </div>
              <div className="p-3">
                <h4 className="font-bold text-white text-sm">{r.name}</h4>
                <p className="text-[#606060] text-xs mt-0.5">{r.category} · {r.price}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="flex items-center gap-1 text-xs text-[#A0A0A0]">
                    <Clock className="w-3 h-3" /> {r.time} min
                  </span>
                  <span className={`text-xs font-medium ${r.deliveryFee === 'Gratis' ? 'text-emerald-400' : 'text-[#A0A0A0]'}`}>
                    {r.deliveryFee === 'Gratis' ? '🛵 Envío gratis' : `🛵 ${r.deliveryFee}`}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
