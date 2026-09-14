import { ChevronDown, ChevronUp, KeyRound, Shield } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { RenderNodeProps } from '@/features/hr/components/orgchart/OrgChartTree'
import type { RoleNode } from '../../types/admin.types'

const ROLE_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  SUPER_ADMIN: { bg: 'bg-violet-500/10', text: 'text-violet-600 dark:text-violet-400', dot: '#8b5cf6' },
  HR_ADMIN:    { bg: 'bg-blue-500/10',   text: 'text-blue-600 dark:text-blue-400',     dot: '#3b82f6' },
  EMPLOYEE:    { bg: 'bg-green-500/10',  text: 'text-green-600 dark:text-green-400',   dot: '#22c55e' },
  CUSTOMER:    { bg: 'bg-amber-500/10',  text: 'text-amber-600 dark:text-amber-400',   dot: '#f59e0b' },
}

const FALLBACK_COLOR = { bg: 'bg-muted', text: 'text-muted-foreground', dot: '#94a3b8' }

export function RoleHierarchyNode({
  node,
  isRoot,
  selected,
  isExpanded,
  hasChildren,
  onSelect,
  onToggle,
  editMode: _editMode,
}: RenderNodeProps<RoleNode>) {
  const [hovered, setHovered] = useState(false)
  const colors = ROLE_COLORS[node.roleName] ?? FALLBACK_COLOR
  const isHighlighted = selected

  return (
    <div className="relative flex flex-col items-center">
      <div
        onClick={() => onSelect?.(node)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          'rounded-xl cursor-pointer select-none transition-all duration-200 bg-card',
          isHighlighted
            ? 'border-2 border-primary shadow-lg shadow-black/10'
            : hovered
            ? 'border border-primary/40 shadow-md shadow-black/8'
            : 'border border-border shadow-sm shadow-black/5',
          hovered && !isHighlighted && 'scale-[1.03]',
        )}
        style={{ width: isRoot ? 240 : 208, padding: 16 }}
      >
        {/* Role color dot */}
        <div className="w-2 h-2 rounded-full mb-2" style={{ backgroundColor: colors.dot }} />

        {/* Icon */}
        <div className="flex justify-center mb-2">
          <div className={cn('rounded-full flex items-center justify-center', colors.bg)}
            style={{ width: isRoot ? 56 : 48, height: isRoot ? 56 : 48 }}
          >
            <Shield className={cn(isRoot ? 'w-7 h-7' : 'w-6 h-6', colors.text)} />
          </div>
        </div>

        {/* Role name */}
        <p className="text-sm font-semibold text-foreground text-center truncate">
          {node.displayName ?? node.roleName}
        </p>

        {/* roleName code */}
        <p className="text-[11px] text-muted-foreground text-center mt-0.5 font-mono truncate">
          {node.roleName}
        </p>

        {/* Badges */}
        <div className="flex justify-center gap-1.5 mt-1.5 flex-wrap">
          {node.isSystemRole && (
            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-violet-500/10 text-violet-600 dark:text-violet-400">
              System
            </span>
          )}
          <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium', colors.bg, colors.text)}>
            {node.roleName.replace('_', ' ')}
          </span>
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
          <div className="flex items-center gap-1">
            <KeyRound className="w-3 h-3 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">
              {node.permissionCount} permissions
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground">
            {node.children.length} {node.children.length === 1 ? 'sub-role' : 'sub-roles'}
          </span>
        </div>
      </div>

      {/* Expand/collapse toggle */}
      {hasChildren && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onToggle?.(node.id) }}
          className={cn(
            'absolute -bottom-3 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-card flex items-center justify-center shadow-sm transition-colors cursor-pointer z-10 border',
            isExpanded ? 'border-primary text-primary' : 'border-border text-muted-foreground',
          )}
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
        >
          {isExpanded
            ? <ChevronUp className="w-3 h-3" />
            : <ChevronDown className="w-3 h-3" />
          }
        </button>
      )}
    </div>
  )
}
