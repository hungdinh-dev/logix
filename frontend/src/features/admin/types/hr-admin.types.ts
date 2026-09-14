// HR-specific types - Tạm thời giữ trong admin/ cho đến khi Team HRM phát triển chính thức
// Khi Team HRM bắt đầu, di chuyển toàn bộ file này sang features/hr/shared/types/

export type Gender = 'Male' | 'Female' | 'Other'

export const GENDER_LABELS: Record<Gender, string> = {
  Male: 'Nam',
  Female: 'Nữ',
  Other: 'Khác',
}

export type ContractType = 'Probation' | 'FixedTerm' | 'Indefinite' | 'PartTime' | 'Internship' | 'Freelance' | 'Seasonal'

export const CONTRACT_TYPE_LABELS: Record<ContractType, string> = {
  Probation: 'Thử việc',
  FixedTerm: 'Có thời hạn',
  Indefinite: 'Không thời hạn',
  PartTime: 'Bán thời gian',
  Internship: 'Thực tập',
  Freelance: 'Cộng tác viên',
  Seasonal: 'Thời vụ',
}

export interface CreateEmployeePayload {
  fullName: string
  email: string
  jobLevelId: string
  dateOfJoin: string
  employeeCode?: string
  gender?: Gender
  dateOfBirth?: string
  identityCardNumber?: string
  identityCardIssuedDate?: string
  identityCardIssuedPlace?: string
  phoneNumber?: string
  permanentAddress?: string
  currentAddress?: string
  taxCode?: string
  socialInsuranceCode?: string
  managerId?: string
  contractType?: ContractType
  bankName?: string
  bankAccountNumber?: string
  customFieldValues?: Record<string, string>
}

export type CustomFieldType = 'Text' | 'Number' | 'Date' | 'Select' | 'MultiSelect' | 'Checkbox' | 'TextArea'
export type ValidationType = 'Email' | 'Phone' | 'CitizenId' | 'TaxCode' | 'Passport' | 'EmployeeCode'

export const FIELD_TYPE_LABELS: Record<CustomFieldType, string> = {
  Text: 'Văn bản',
  Number: 'Số',
  Date: 'Ngày',
  Select: 'Chọn một',
  MultiSelect: 'Chọn nhiều',
  Checkbox: 'Checkbox',
  TextArea: 'Đoạn văn',
}

export interface CustomFieldOptionResponse {
  id: string
  value: string
  label: string
  sortOrder: number
  isActive: boolean
}

export interface CustomFieldDefinitionResponse {
  id: string
  code: string
  name: string
  fieldType: CustomFieldType
  module: string
  isSystem: boolean
  isRequired: boolean
  isActive: boolean
  sortOrder: number
  placeholder?: string
  helpText?: string
  group?: string
  validationJson?: string
  options: CustomFieldOptionResponse[]
}

export interface CreateCustomFieldPayload {
  code: string
  name: string
  fieldType: CustomFieldType
  module: string
  isRequired: boolean
  sortOrder: number
  placeholder?: string
  helpText?: string
  group?: string
  validationJson?: string
  options?: { value: string; label: string; sortOrder: number }[]
}

export interface UpdateCustomFieldPayload {
  name: string
  isRequired: boolean
  isActive: boolean
  sortOrder: number
  placeholder?: string
  helpText?: string
  group?: string
  validationJson?: string
  options?: { id?: string; value: string; label: string; sortOrder: number; isActive: boolean }[]
}
