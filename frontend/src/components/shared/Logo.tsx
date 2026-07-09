import { Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  height?: number
  variant?: 'light' | 'dark'
}

export function Logo({ className, height = 32, variant = 'light' }: LogoProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2',
        variant === 'dark' && 'rounded-lg bg-white px-2 py-1',
        className
      )}
    >
      <Building2 style={{ width: height, height }} className="text-primary" />
      <span className="text-primary font-bold" style={{ fontSize: height * 0.6 }}>
        DigiFNB
      </span>
    </span>
  )
}
