import { useState } from 'react'
import { Search, UserPlus, MoreVertical, ShieldCheck, Store, UserCircle } from 'lucide-react'

/* ── Mock data ─────────────────────────────────────────────── */
type Role = 'admin' | 'restaurant' | 'client'

interface User {
  id: number; name: string; email: string; role: Role
  joined: string; orders: number; status: 'active' | 'inactive'
}

const USERS: User[] = [
  { id: 1, name: 'Admin Root',     email: 'admin@foodapp.mx',       role: 'admin',      joined: '1 Ene 2023',  orders: 0,   status: 'active'   },
  { id: 2, name: 'Ana García',     email: 'ana@gmail.com',          role: 'client',     joined: '5 Feb 2024',  orders: 14,  status: 'active'   },
  { id: 3, name: 'Marco Rossi',    email: 'marco@trattoria.mx',     role: 'restaurant', joined: '12 Ene 2024', orders: 0,   status: 'active'   },
  { id: 4, name: 'Carlos López',   email: 'carlos@hotmail.com',     role: 'client',     joined: '18 Mar 2024', orders: 7,   status: 'active'   },
  { id: 5, name: 'Yuki Tanaka',    email: 'yuki@sakura.mx',         role: 'restaurant', joined: '3 Feb 2024',  orders: 0,   status: 'active'   },
  { id: 6, name: 'Laura Méndez',   email: 'laura@gmail.com',        role: 'client',     joined: '2 Abr 2024',  orders: 3,   status: 'active'   },
  { id: 7, name: 'Luis Spam',      email: 'spam@test.com',          role: 'client',     joined: '10 Abr 2024', orders: 0,   status: 'inactive' },
  { id: 8, name: 'Sofía Ruiz',     email: 'sofia@outlook.com',      role: 'client',     joined: '8 Mar 2024',  orders: 21,  status: 'active'   },
]

const ROLE_CFG: Record<Role, { label: string; icon: typeof ShieldCheck; cls: string }> = {
  admin:      { label: 'Admin',       icon: ShieldCheck, cls: 'text-[#FF6B00] bg-[#FF6B00]/10 border-[#FF6B00]/25'  },
  restaurant: { label: 'Restaurante', icon: Store,       cls: 'text-blue-400  bg-blue-400/10  border-blue-400/25'   },
  client:     { label: 'Cliente',     icon: UserCircle,  cls: 'text-purple-400 bg-purple-400/10 border-purple-400/25' },
}

export default function AdminUsers() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | Role>('all')
  const [users, setUsers]  = useState(USERS)

  const filtered = users.filter(u =>
    (roleFilter === 'all' || u.role === roleFilter) &&
    (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  )

  function toggleStatus(id: number) {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u))
  }

  const counts = { all: users.length, admin: users.filter(u=>u.role==='admin').length, restaurant: users.filter(u=>u.role==='restaurant').length, client: users.filter(u=>u.role==='client').length }

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      {/* Header */}
      <header className="bg-[#1A1A1A] border-b border-[#2A2A2A] px-4 py-4 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white">Usuarios</h1>
            <p className="text-xs text-[#606060] mt-0.5">{counts.client} clientes · {counts.restaurant} restaurantes · {counts.admin} admins</p>
          </div>
          <button className="flex items-center gap-2 bg-[#FF6B00] hover:bg-[#E55A00] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all">
            <UserPlus className="w-4 h-4" /> Nuevo usuario
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-5 space-y-4">
        {/* Búsqueda y filtros de rol */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#606060]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nombre o email..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-sm text-white placeholder:text-[#606060] focus:outline-none focus:border-[#FF6B00]/50"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'admin', 'restaurant', 'client'] as const).map(r => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                  roleFilter === r ? 'bg-[#FF6B00] text-white border-[#FF6B00]' : 'bg-[#1A1A1A] text-[#A0A0A0] border-[#2A2A2A]'
                }`}
              >
                {r === 'all' ? `Todos (${counts.all})` : `${ROLE_CFG[r].label} (${counts[r]})`}
              </button>
            ))}
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl overflow-hidden">
          <div className="hidden md:grid grid-cols-[2fr_2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-[#2A2A2A] text-xs font-semibold text-[#606060] uppercase tracking-wider">
            <span>Usuario</span><span>Email</span><span>Rol</span><span>Pedidos</span><span>Estado</span><span>Acción</span>
          </div>
          <div className="divide-y divide-[#2A2A2A]">
            {filtered.map(user => {
              const RoleCfg = ROLE_CFG[user.role]
              const RoleIcon = RoleCfg.icon
              return (
                <div key={user.id} className="grid grid-cols-1 md:grid-cols-[2fr_2fr_1fr_1fr_1fr_auto] gap-2 md:gap-4 px-5 py-3.5 items-center hover:bg-[#1F1F1F] transition-colors">
                  {/* Avatar + nombre */}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                      style={{ background: `hsl(${user.id * 47 % 360}, 60%, 45%)` }}
                    >
                      {user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{user.name}</p>
                      <p className="text-xs text-[#606060]">Desde {user.joined}</p>
                    </div>
                  </div>
                  <span className="text-sm text-[#A0A0A0] truncate">{user.email}</span>
                  {/* Rol */}
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border w-fit ${RoleCfg.cls}`}>
                    <RoleIcon className="w-3 h-3" /> {RoleCfg.label}
                  </span>
                  <span className="text-sm text-white font-medium">{user.role === 'client' ? user.orders : '—'}</span>
                  {/* Toggle activo/inactivo */}
                  <button
                    onClick={() => toggleStatus(user.id)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border w-fit transition-all ${
                      user.status === 'active'
                        ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/25'
                        : 'text-red-400 bg-red-400/10 border-red-400/25'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                    {user.status === 'active' ? 'Activo' : 'Inactivo'}
                  </button>
                  <button className="w-7 h-7 rounded-lg bg-[#2A2A2A] flex items-center justify-center hover:bg-[#3A3A3A]">
                    <MoreVertical className="w-3.5 h-3.5 text-[#606060]" />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
