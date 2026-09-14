import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { employeesService } from '../services/employees.service'

const KEY = 'employees'

export function useEmployees(search?: string) {
  return useQuery({
    queryKey: [KEY, search],
    queryFn: () => employeesService.list(search),
  })
}

export function useCreateEmployee() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: employeesService.create,
    onSuccess: () => { client.invalidateQueries({ queryKey: [KEY] }); toast.success('Tạo nhân sự thành công') },
    onError: (error) => { console.error(error); toast.error('Tạo nhân sự thất bại') },
  })
}
