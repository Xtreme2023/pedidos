import { InputHTMLAttributes, forwardRef, ReactNode } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  iconLeft?: ReactNode
  iconRight?: ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, iconLeft, iconRight, className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1.5">
        {/* Label */}
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[#A0A0A0]">
            {label}
          </label>
        )}

        {/* Input wrapper */}
        <div className="relative flex items-center">
          {iconLeft && (
            <span className="absolute left-3 text-[#606060] pointer-events-none">{iconLeft}</span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={[
              'w-full bg-dark-800 border rounded-[8px] px-4 py-2.5 text-sm text-white placeholder:text-dark-500',
              'focus:outline-none focus:ring-2 focus:ring-brand-orange/50 transition-all duration-150',
              error ? 'border-brand-red/70' : 'border-dark-700 hover:border-dark-600',
              iconLeft  ? 'pl-10' : '',
              iconRight ? 'pr-10' : '',
              className,
            ].join(' ')}
            {...props}
          />
          {iconRight && (
            <span className="absolute right-3 text-[#606060] pointer-events-none">{iconRight}</span>
          )}
        </div>

        {/* Error / hint */}
        {error && <p className="text-xs text-brand-red">{error}</p>}
        {hint && !error && <p className="text-xs text-dark-500">{hint}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'

export default Input
