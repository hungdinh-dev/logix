import prisma from '../../config/prisma'
import { NotFoundError, BadRequestError } from '../../common/errors/app.error'
import { CreateDepartmentDto, UpdateDepartmentDto } from './department.dto'

export class DepartmentService {
  /**
   * Lấy danh sách các phòng ban đang hoạt động (Ẩn các phòng ban đã xóa mềm)
   */
  public async getDepartmentsList() {
    const departments = await prisma.department.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' },
    })

    const formatted = departments.map((d) => ({
      id: d.id,
      departmentName: d.deptName,
      departmentCode: d.deptCode,
      isActive: true,
    }))

    return {
      items: formatted,
      totalCount: formatted.length,
    }
  }

  /**
   * Lấy cây sơ đồ tổ chức phòng ban (Chỉ lấy phòng ban đang hoạt động)
   */
  public async getDepartmentTree() {
    const departments = await prisma.department.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' },
    })

    return departments.map((d) => ({
      id: d.id,
      departmentName: d.deptName,
      departmentCode: d.deptCode,
      isActive: true,
      children: [],
    }))
  }

  /**
   * Tạo phòng ban mới (Tự động tái kích hoạt nếu deptCode đã từng bị xóa mềm)
   */
  public async createDepartment(dto: CreateDepartmentDto) {
    const existing = await prisma.department.findUnique({
      where: { deptCode: dto.departmentCode },
    })

    if (existing) {
      if (existing.isActive) {
        throw new BadRequestError('Mã phòng ban đã tồn tại')
      }

      // Tái kích hoạt phòng ban đã bị xóa mềm trước đó
      const updated = await prisma.department.update({
        where: { id: existing.id },
        data: {
          deptName: dto.departmentName,
          isFactoryDept: Boolean(dto.isFactoryDept),
          isActive: true,
        },
      })
      return updated.id
    }

    const dept = await prisma.department.create({
      data: {
        deptCode: dto.departmentCode,
        deptName: dto.departmentName,
        isFactoryDept: Boolean(dto.isFactoryDept),
        isActive: true,
      },
    })
    return dept.id
  }

  /**
   * Cập nhật phòng ban
   */
  public async updateDepartment(id: string, dto: UpdateDepartmentDto) {
    const existing = await prisma.department.findFirst({
      where: { id, isActive: true },
    })
    if (!existing) {
      throw new NotFoundError('Phòng ban')
    }

    await prisma.department.update({
      where: { id },
      data: {
        deptName: dto.departmentName,
        deptCode: dto.departmentCode,
      },
    })
  }

  /**
   * XÓA MỀM (Soft Delete): Đánh dấu isActive = false
   * Ẩn phòng ban khỏi giao diện Frontend mà vẫn bảo lưu quan hệ với nhân viên cũ
   */
  public async deleteDepartment(id: string) {
    const existing = await prisma.department.findUnique({ where: { id } })
    if (!existing || !existing.isActive) {
      throw new NotFoundError('Phòng ban')
    }

    await prisma.department.update({
      where: { id },
      data: { isActive: false },
    })
  }

  /**
   * Lấy danh sách nhân viên thuộc phòng ban
   */
  public async getDepartmentMembers(departmentId: string) {
    const dept = await prisma.department.findFirst({
      where: { id: departmentId, isActive: true },
    })
    if (!dept) {
      throw new NotFoundError('Phòng ban')
    }

    const users = await prisma.user.findMany({
      where: { departmentId, isActive: true },
      include: { position: true },
    })

    return users.map((u) => ({
      userDepartmentId: `${u.id}_${departmentId}`,
      userId: u.id,
      fullName: u.fullName,
      employeeCode: u.employeeCode || '',
      email: u.email || '',
      jobLevelName: u.position?.positionName,
      isPrimary: true,
      startDate: u.createdAt.toISOString(),
    }))
  }
}

export const departmentService = new DepartmentService()
