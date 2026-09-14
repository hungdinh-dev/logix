import { Badge } from '@/components/ui/badge'
import { Building2 } from 'lucide-react'

export function DepartmentBadge({ name, code }: { name: string; code?: string }) {
  return (
    <Badge variant="outline" className="gap-1 font-normal text-xs py-0.5 px-2 bg-background">
      <Building2 className="h-3 w-3 text-muted-foreground" />
      <span>{name}</span>
      {code && <span className="text-muted-foreground/60 font-mono text-[10px]">({code})</span>}
    </Badge>
  )
}
