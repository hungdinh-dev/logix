import { ChevronRight, KeyRound, Shield } from 'lucide-react'
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from '@/components/ui/sheet'
import type { RoleNode } from '../../types/admin.types'

interface Props {
  role: RoleNode | null
  open: boolean
  onClose: () => void
  onFocusNode: (id: string) => void
}

export function RoleHierarchySheet({ role, open, onClose, onFocusNode }: Props) {
  if (!role) return null

  return (
    <Sheet open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose() }}>
      <SheetContent
        side="right"
        className="overflow-y-auto p-0"
        style={{ width: 360, maxWidth: '100vw' }}
      >
        <SheetHeader className="p-5 border-b border-border">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <SheetTitle className="text-base font-semibold text-foreground leading-tight">
                {role.displayName ?? role.roleName}
              </SheetTitle>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">{role.roleName}</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                {role.isSystemRole && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-violet-500/10 text-violet-600 dark:text-violet-400">
                    System Role
                  </span>
                )}
                <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-primary/10 text-primary">
                  Active
                </span>
              </div>
            </div>
          </div>
        </SheetHeader>

        <div className="p-5 space-y-5">

          {/* Description */}
          {role.description && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                Description
              </p>
              <p className="text-sm text-foreground leading-relaxed">{role.description}</p>
            </div>
          )}

          {/* Permissions summary */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <KeyRound className="w-3.5 h-3.5 text-muted-foreground" />
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Permissions ({role.permissionCount})
              </p>
            </div>
            {role.permissions.length > 0 ? (
              <div className="space-y-1">
                {role.permissions.map((permission) => (
                  <div key={permission.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/40">
                    <span className="text-xs font-mono text-foreground">{permission.permissionCode}</span>
                    <span className="text-[10px] text-muted-foreground">{permission.module}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                {role.permissionCount} permissions — tải từ API
              </p>
            )}
          </div>

          {/* Sub-roles */}
          {role.children.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Sub-roles ({role.children.length})
              </p>
              <div className="space-y-1">
                {role.children.map((child) => (
                  <button
                    key={child.id}
                    type="button"
                    onClick={() => { onFocusNode(child.id); onClose() }}
                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Shield className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {child.displayName ?? child.roleName}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-mono truncate">
                        {child.roleName}
                      </p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
