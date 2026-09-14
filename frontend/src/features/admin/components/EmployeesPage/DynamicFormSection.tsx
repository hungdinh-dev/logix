import { Label } from '@/components/ui/label'
import { useCustomFields } from '../../hooks/use-custom-fields'
import type { CustomFieldDefinitionResponse } from '../../types/admin.types'
import { DynamicFieldRenderer } from './DynamicFieldRenderer'

interface Props {
  values: Record<string, string>
  onChange: (definitionId: string, value: string) => void
}

export function DynamicFormSection({ values, onChange }: Props) {
  const { data: definitions = [], isLoading } = useCustomFields('Employee')

  const active = definitions.filter((d) => d.isActive).sort((a, b) => a.sortOrder - b.sortOrder)

  if (isLoading) return <p className="text-xs text-muted-foreground">Đang tải trường tùy chỉnh...</p>
  if (active.length === 0) return null

  const groups = active.reduce<Record<string, CustomFieldDefinitionResponse[]>>((acc, d) => {
    const key = d.group ?? 'Khác'
    ;(acc[key] ??= []).push(d)
    return acc
  }, {})

  return (
    <div className="space-y-4">
      {Object.entries(groups).map(([groupName, fields]) => (
        <div key={groupName}>
          {Object.keys(groups).length > 1 && (
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{groupName}</p>
          )}
          <div className="space-y-3">
            {fields.map((field) => (
              <div key={field.id} className="space-y-1.5">
                <Label htmlFor={field.id}>
                  {field.name}
                  {field.isRequired && <span className="ml-1 text-destructive">*</span>}
                </Label>
                <DynamicFieldRenderer definition={field} value={values[field.id] ?? ''} onChange={(v) => onChange(field.id, v)} />
                {field.helpText && <p className="text-xs text-muted-foreground">{field.helpText}</p>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
