import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom'
import HomePage from '@client/pages/HomePage/HomePage'
import RestaurantDetailPage from '@client/pages/RestaurantDetailPage/RestaurantDetailPage'
import CheckoutPage from '@client/pages/CheckoutPage/CheckoutPage'
import OrderTrackingPage from '@client/pages/OrderTrackingPage/OrderTrackingPage'
import RestaurantDashboard from '@restaurant/pages/DashboardPage/DashboardPage'
import RestaurantOrderDetail from '@restaurant/pages/OrderDetailPage/OrderDetailPage'
import RestaurantMenu from '@restaurant/pages/MenuPage/MenuPage'
import AdminDashboard from '@admin/pages/DashboardPage/DashboardPage'
import AdminRestaurants from '@admin/pages/RestaurantsPage/RestaurantsPage'
import AdminUsers from '@admin/pages/UsersPage/UsersPage'

/* Demo nav flotante para cambiar entre portales durante el desarrollo */
function DemoNav() {
  const loc = useLocation()
  const links = [
    { to: '/',                        label: '🏠 Cliente' },
    { to: '/restaurant/1',            label: '🍽 Restaurante' },
    { to: '/cart',                    label: '🛒 Carrito' },
    { to: '/tracking/42',             label: '📍 Tracking' },
    { to: '/portal/restaurant',       label: '👨‍🍳 Portal R.' },
    { to: '/portal/restaurant/menu',  label: '📋 Menú R.' },
    { to: '/portal/admin',            label: '⚙ Admin' },
    { to: '/portal/admin/restaurants',label: '🏪 Restaurantes' },
    { to: '/portal/admin/users',      label: '👥 Usuarios' },
  ]
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 overflow-x-auto bg-[#1A1A1A] border-t border-[#2A2A2A] no-scrollbar">
      <div className="flex gap-1 px-2 py-2 min-w-max">
        {links.map(l => (
          <Link
            key={l.to}
            to={l.to}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              loc.pathname === l.to
                ? 'bg-[#FF6B00] text-white'
                : 'bg-[#2A2A2A] text-[#A0A0A0] hover:text-white'
            }`}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}

export default function App() {
  return (
    <>
      <DemoNav />
      <div className="pb-12">
        <Routes>
          {/* Portal cliente */}
          <Route path="/"                          element={<HomePage />} />
          <Route path="/restaurant/:id"            element={<RestaurantDetailPage />} />
          <Route path="/cart"                      element={<CheckoutPage />} />
          <Route path="/tracking/:id"              element={<OrderTrackingPage />} />
          {/* Portal restaurante */}
          <Route path="/portal/restaurant"         element={<RestaurantDashboard />} />
          <Route path="/portal/restaurant/orders/:id" element={<RestaurantOrderDetail />} />
          <Route path="/portal/restaurant/menu"    element={<RestaurantMenu />} />
          {/* Portal admin */}
          <Route path="/portal/admin"              element={<AdminDashboard />} />
          <Route path="/portal/admin/restaurants"  element={<AdminRestaurants />} />
          <Route path="/portal/admin/users"        element={<AdminUsers />} />
          <Route path="*"                          element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  )
}
