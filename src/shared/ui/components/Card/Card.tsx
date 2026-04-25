import { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  header?: ReactNode
  footer?: ReactNode
  noPadding?: boolean
}

export default function Card({ header, footer, noPadding, className = '', children, ...props }: CardProps) {
  return (
    <div
      className={`bg-dark-900 border border-dark-800 rounded-xl overflow-hidden ${className}`}
      {...props}
    >
      {/* Header opcional */}
      {header && (
        <div className="px-5 py-4 border-b border-dark-800 font-semibold text-white">
          {header}
        </div>
      )}

      {/* Contenido */}
      <div className={noPadding ? '' : 'p-5'}>
        {children}
      </div>

      {/* Footer opcional */}
      {footer && (
        <div className="px-5 py-4 border-t border-dark-800 bg-dark-950">
          {footer}
        </div>
      )}
    </div>
  )
}
