interface AvatarProps {
  src?: string
  name: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizes = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-12 h-12 text-base', xl: 'w-16 h-16 text-xl' }

/* Genera un color determinístico basado en el nombre */
function nameToColor(name: string) {
  const colors = ['#FF6B00','#E63946','#3B82F6','#10B981','#8B5CF6','#F59E0B','#EC4899']
  const idx = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % colors.length
  return colors[idx]
}

function initials(name: string) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

export default function Avatar({ src, name, size = 'md', className = '' }: AvatarProps) {
  return (
    <div
      className={`${sizes[size]} rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-white ${className}`}
      style={!src ? { backgroundColor: nameToColor(name) } : undefined}
    >
      {src
        ? <img src={src} alt={name} className="w-full h-full object-cover" />
        : initials(name)
      }
    </div>
  )
}
