import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { CustomFieldDefinitionResponse } from '../../types/admin.types'

interface Props {
  readonly definition: CustomFieldDefinitionResponse
  readonly value: string
  readonly onChange: (v: string) => void
}

export function DynamicFieldRenderer({ definition, value, onChange }: Props) {
  switch (definition.fieldType) {
    case 'Number':
      return (
        <Input
          type="number"
          value={value}
          placeholder={definition.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )
    case 'Date':
      return <Input type="date" value={value} onChange={(e) => onChange(e.target.value)} />
    case 'Checkbox':
      return (
        <div className="flex items-center gap-2 h-9">
          <Checkbox
            id={definition.id}
            checked={value === 'true'}
            onCheckedChange={(checked) => onChange(checked ? 'true' : 'false')}
          />
          <label htmlFor={definition.id} className="text-sm cursor-pointer">
            {definition.placeholder ?? 'Có'}
          </label>
        </div>
      )
    case 'Select':
      return (
        <Select value={value || undefined} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder={definition.placeholder ?? 'Chọn...'} />
          </SelectTrigger>
          <SelectContent>
            {definition.options
              .filter((o) => o.isActive)
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((o) => (
                <SelectItem key={o.id} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      )
    case 'MultiSelect': {
      const selected = value ? value.split(',').filter(Boolean) : []
      const activeOpts = definition.options.filter((o) => o.isActive).sort((a, b) => a.sortOrder - b.sortOrder)
      return (
        <div className="space-y-2 rounded-md border p-3">
          {activeOpts.length === 0 && (
            <p className="text-xs text-muted-foreground">Chưa có lựa chọn</p>
          )}
          {activeOpts.map((o) => (
            <div key={o.id} className="flex items-center gap-2">
              <Checkbox
                id={`${definition.id}-${o.value}`}
                checked={selected.includes(o.value)}
                onCheckedChange={(checked) => {
                  const next = checked ? [...selected, o.value] : selected.filter((v) => v !== o.value)
                  onChange(next.join(','))
                }}
              />
              <label htmlFor={`${definition.id}-${o.value}`} className="text-sm cursor-pointer select-none">
                {o.label}
              </label>
            </div>
          ))}
        </div>
      )
    }
    case 'TextArea':
      return (
        <Textarea
          value={value}
          placeholder={definition.placeholder}
          rows={3}
          onChange={(e) => onChange(e.target.value)}
        />
      )
    default:
      return (
        <Input value={value} placeholder={definition.placeholder} onChange={(e) => onChange(e.target.value)} />
      )
  }
}
