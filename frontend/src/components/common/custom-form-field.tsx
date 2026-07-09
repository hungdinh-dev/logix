import { Control, FieldPath, FieldValues } from 'react-hook-form'
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form'
import { FloatingLabelInput, FloatingLabelInputProps } from '@/components/ui/floating-label-input'
import { LucideIcon } from 'lucide-react'

interface CustomFormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<
  FloatingLabelInputProps,
  'label' | 'leftIcon' | 'rightIcon' | 'rightIconOnClick' | 'error' | 'showSuccessIcon'
> {
  control: Control<TFieldValues>
  name: TName
  label: string
  leftIcon?: LucideIcon
  rightIcon?: LucideIcon
  rightIconOnClick?: () => void
}

export function CustomFormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  leftIcon,
  rightIcon,
  rightIconOnClick,
  ...props
}: CustomFormFieldProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const hasError = !!fieldState.error
        return (
          <FormItem>
            <FormControl>
              <FloatingLabelInput
                {...field}
                {...props}
                label={label}
                leftIcon={leftIcon}
                rightIcon={rightIcon}
                rightIconOnClick={rightIconOnClick}
                showSuccessIcon={!hasError && !!field.value}
                error={hasError}
              />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )
      }}
    />
  )
}