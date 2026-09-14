import { z } from 'zod'

export const roleSchema = z.object({
  roleName: z.string().min(1, 'Tên role là bắt buộc').max(100, 'Tối đa 100 ký tự'),
  displayName: z.string().min(1, 'Tên hiển thị là bắt buộc').max(100, 'Tối đa 100 ký tự'),
  description: z.string().max(500, 'Tối đa 500 ký tự').optional(),
})
export type RoleFormValues = z.infer<typeof roleSchema>

export const departmentSchema = z.object({
  departmentName: z.string().min(1, 'Department name is required').max(255),
  departmentCode: z.string().min(1, 'Department code is required').max(50),
  parentDepartmentId: z.string().uuid().optional().or(z.literal('')),
  managerId: z.string().uuid().optional().or(z.literal('')),
  isActive: z.boolean(),
})
export type DepartmentFormValues = z.infer<typeof departmentSchema>

export const createEmployeeSchema = z.object({
  fullName: z.string().min(1, 'Họ tên là bắt buộc').max(255),
  email: z.string().min(1, 'Email là bắt buộc').email('Email không hợp lệ').max(255),
  jobLevelId: z.string().min(1, 'Cấp bậc là bắt buộc'),
  dateOfJoin: z.string().min(1, 'Ngày vào làm là bắt buộc'),
  employeeCode: z.string().max(50).optional().or(z.literal('')),
  gender: z.enum(['Male', 'Female', 'Other']).optional(),
  dateOfBirth: z.string().optional().or(z.literal('')),
  identityCardNumber: z.string().max(20).optional().or(z.literal('')),
  identityCardIssuedDate: z.string().optional().or(z.literal('')),
  identityCardIssuedPlace: z.string().max(255).optional().or(z.literal('')),
  phoneNumber: z.string().max(20).optional().or(z.literal('')),
  permanentAddress: z.string().max(500).optional().or(z.literal('')),
  currentAddress: z.string().max(500).optional().or(z.literal('')),
  taxCode: z.string().max(20).optional().or(z.literal('')),
  socialInsuranceCode: z.string().max(20).optional().or(z.literal('')),
  managerId: z.string().optional().or(z.literal('')),
  contractType: z.enum(['Probation', 'FixedTerm', 'Indefinite', 'PartTime', 'Internship', 'Freelance', 'Seasonal']).optional(),
  bankName: z.string().max(200).optional().or(z.literal('')),
  bankAccountNumber: z.string().max(50).optional().or(z.literal('')),
  customFieldValues: z.record(z.string(), z.string()).optional(),
})
export type CreateEmployeeFormValues = z.infer<typeof createEmployeeSchema>

export const jobLevelSchema = z.object({
  levelName: z.string().min(1, 'Level name is required').max(100),
  levelOrder: z.coerce.number().int().min(1, 'Order must be ≥ 1'),
  defaultScopeType: z.coerce.number().int().min(1).max(4),
  description: z.string().max(500).optional(),
  baseSalaryMin: z.coerce.number().min(0).optional(),
  baseSalaryMax: z.coerce.number().min(0).optional(),
})
export type JobLevelFormValues = z.infer<typeof jobLevelSchema>
