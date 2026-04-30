import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Star, Clock } from 'lucide-react'
import { CATEGORIES, RESTAURANTS } from '../../data/mockData'

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()

  const category = CATEGORIES.find(c => c.slug === slug)
  const restaurants = RESTAURANTS.filter(r => r.categorySlug === slug)

  return (
    <div className="min-h-screen bg-[#0F0F0F] max-w-md mx-auto lg:max-w-2xl">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#0F0F0F]/90 backdrop-blur px-4 pt-4 pb-3 border-b border-[#1F1F1F] flex items-center gap-3">
        <Link
          to="/"
          className="w-9 h-9 rounded-full bg-[#1A1A1A] flex items-center justify-center border border-[#2A2A2A]"
        >
          <ArrowLeft className="w-4 h-4 text-white" />
        </Link>
        <div className="flex items-center gap-2">
          {category && <span className="text-2xl">{category.emoji}</span>}
          <h1 className="text-lg font-bold text-white">
            {category ? category.name : 'Categoría'}
          </h1>
        </div>
      </header>

      {/* Lista de restaurantes */}
      <section className="px-4 mt-5 pb-6">
        {restaurants.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <span className="text-6xl opacity-40">{category?.emoji ?? '🍽'}</span>
            <p className="text-[#606060] text-sm text-center">
              No hay restaurantes disponibles<br />en esta categoría todavía.
            </p>
            <Link
              to="/"
              className="mt-2 px-5 py-2.5 bg-[#FF6B00] text-white text-sm font-semibold rounded-xl"
            >
              Ver todos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {restaurants.map(r => (
              <Link
                to={`/restaurant/${r.id}`}
                key={r.id}
                className="block rounded-xl overflow-hidden bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#3A3A3A] transition-all active:scale-[0.98]"
              >
                <div className="h-36 relative overflow-hidden">
                  {r.image
                    ? <img src={r.image} alt={r.name} className="w-full h-full object-cover" />
                    : (
                      <div className={`w-full h-full bg-gradient-to-br ${r.gradient} flex items-center justify-center`}>
                        <span className="text-6xl opacity-60">{r.emoji}</span>
                      </div>
                    )
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
        )}
      </section>
    </div>
  )
}
