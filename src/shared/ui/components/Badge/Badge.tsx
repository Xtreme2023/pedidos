type OrderStatus = 'pending' | 'preparing' | 'shipping' | 'delivered' | 'cancelled'

interface BadgeProps {
  status: OrderStatus
  className?: string
}

const config: Record<OrderStatus, { label: string; dot: string; classes: string }> = {
  pending:   { label: 'Pendiente',   dot: 'bg-yellow-400', classes: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/25' },
  preparing: { label: 'Preparando',  dot: 'bg-brand-orange', classes: 'text-[#FF6B00] bg-[#FF6B00]/10 border-[#FF6B00]/25' },
  shipping:  { label: 'En camino',   dot: 'bg-blue-400',   classes: 'text-blue-400  bg-blue-400/10  border-blue-400/25'  },
  delivered: { label: 'Entregado',   dot: 'bg-emerald-400',classes: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/25' },
  cancelled: { label: 'Cancelado',   dot: 'bg-red-400',    classes: 'text-red-400   bg-red-400/10   border-red-400/25'   },
}

export default function Badge({ status, className = '' }: BadgeProps) {
  const { label, dot, classes } = config[status]
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${classes} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  )
}
