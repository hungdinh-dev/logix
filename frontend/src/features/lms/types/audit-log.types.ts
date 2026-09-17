export type AuditActionType =
  | 'CREATE'
  | 'UPDATE'
  | 'STATUS_CHANGE'
  | 'CLONE'
  | 'DELETE'
  | 'SYNC'
  | 'ASSIGN'

export interface FieldDiffItem {
  old: any
  new: any
}

export interface AuditLogItem {
  id: string
  tableName: string
  entityId: string
  action: AuditActionType | string
  fieldName: string | null
  oldValue: string | null
  newValue: string | null
  diff: Record<string, FieldDiffItem> | null
  metadata: Record<string, any> | null
  userId: string | null
  userName: string
  userEmail: string
  userAvatar: string
  createdAt: string
}

export interface AuditLogQueryResult {
  items: AuditLogItem[]
  total: number
}
