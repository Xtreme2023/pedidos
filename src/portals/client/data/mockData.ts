import imgPique       from '@/assets/pique.jpeg'
import imgAnticucho   from '@/assets/anticucho.jpeg'
import imgCharque     from '@/assets/charque.jpeg'
import imgSaltena     from '@/assets/saltena.jpeg'
import imgFricase     from '@/assets/fricase.jpeg'
import imgHamburgesa  from '@/assets/hamburgesa.jpeg'

export type Category = {
  id: number
  emoji: string
  name: string
  slug: string
}

export type Restaurant = {
  id: number
  name: string
  category: string
  categorySlug: string
  rating: number
  time: string
  price: string
  gradient: string
  emoji: string
  image: string | null
  deliveryFee: string
  promo: string | null
}

export const CATEGORIES: Category[] = [
  { id: 1,  emoji: '🍖', name: 'Pique',      slug: 'pique'      },
  { id: 2,  emoji: '🥩', name: 'Charque',    slug: 'charque'    },
  { id: 3,  emoji: '🍲', name: 'Fricasé',    slug: 'fricase'    },
  { id: 4,  emoji: '🍔', name: 'Burgers',    slug: 'burgers'    },
  { id: 5,  emoji: '🥟', name: 'Salteñas',   slug: 'saltenas'   },
  { id: 6,  emoji: '🍳', name: 'Silpancho',  slug: 'silpancho'  },
  { id: 7,  emoji: '🍢', name: 'Anticuchos', slug: 'anticuchos' },
  { id: 8,  emoji: '🍕', name: 'Pizza',      slug: 'pizza'      },
  { id: 9,  emoji: '🍗', name: 'Pollo',      slug: 'pollo'      },
  { id: 10, emoji: '🍰', name: 'Postres',    slug: 'postres'    },
]

export const RESTAURANTS: Restaurant[] = [
  { id: 1, name: 'El Pique de Don Lucho',   category: 'Pique Macho',   categorySlug: 'pique',      rating: 4.9, time: '20-30', price: '$',   gradient: 'from-red-700 to-orange-800',    emoji: '🍖', image: imgPique,      deliveryFee: 'Gratis', promo: '20% OFF' },
  { id: 2, name: 'Doña Carmen Fricasé',     category: 'Cocina típica', categorySlug: 'fricase',    rating: 4.8, time: '30-40', price: '$$',  gradient: 'from-amber-700 to-yellow-800',  emoji: '🍲', image: imgFricase,    deliveryFee: 'Gratis', promo: null      },
  { id: 3, name: 'La Burguesía',            category: 'Hamburguesas',  categorySlug: 'burgers',    rating: 4.6, time: '15-25', price: '$',   gradient: 'from-yellow-600 to-orange-700', emoji: '🍔', image: imgHamburgesa, deliveryFee: 'Gratis', promo: 'NUEVO'   },
  { id: 4, name: 'El Charqueador',          category: 'Charque',       categorySlug: 'charque',    rating: 4.7, time: '25-35', price: '$$',  gradient: 'from-stone-600 to-amber-800',   emoji: '🥩', image: imgCharque,    deliveryFee: 'Bs. 10', promo: null      },
  { id: 5, name: 'Anticuchos Doña Fili',    category: 'Anticuchos',    categorySlug: 'anticuchos', rating: 4.9, time: '20-30', price: '$',   gradient: 'from-orange-700 to-red-900',    emoji: '🍢', image: imgAnticucho,  deliveryFee: 'Gratis', promo: '10% OFF' },
  { id: 6, name: 'La Salteñería Central',   category: 'Salteñas',      categorySlug: 'saltenas',   rating: 4.8, time: '10-20', price: '$',   gradient: 'from-yellow-700 to-amber-900',  emoji: '🥟', image: imgSaltena,    deliveryFee: 'Gratis', promo: null      },
]
