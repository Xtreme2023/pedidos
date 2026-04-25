import { ButtonHTMLAttributes, forwardRef } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size    = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  fullWidth?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary:   'bg-brand-orange hover:bg-brand-orange-hover text-white shadow-[0_0_0_0_rgba(255,107,0,0)] hover:shadow-[0_0_20px_rgba(255,107,0,0.35)]',
  secondary: 'bg-dark-800 hover:bg-dark-700 text-white border border-dark-700',
  ghost:     'bg-transparent hover:bg-dark-800 text-white',
  danger:    'bg-brand-red hover:bg-brand-red-hover text-white shadow-[0_0_0_0_rgba(230,57,70,0)] hover:shadow-[0_0_20px_rgba(230,57,70,0.35)]',
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-8  px-3 text-sm  rounded-lg gap-1.5',
  md: 'h-11 px-5 text-sm  rounded-[8px] gap-2',
  lg: 'h-13 px-6 text-base rounded-[8px] gap-2',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, fullWidth, className = '', children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center font-semibold transition-all duration-150',
        'disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      )}
      {children}
    </button>
  )
)
Button.displayName = 'Button'

export default Button
