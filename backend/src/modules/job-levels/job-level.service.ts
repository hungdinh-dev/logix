import prisma from '../../config/prisma'
import { NotFoundError, BadRequestError } from '../../common/errors/app.error'
import { CreateJobLevelDto, UpdateJobLevelDto } from './job-level.dto'

export class JobLevelService {
  /**
   * Lấy danh sách tất cả các Cấp bậc chuyên môn đang hoạt động (Ẩn các cấp bậc đã xóa mềm)
   */
  public async getAllJobLevels() {
    const positions = await prisma.position.findMany({
      where: { isActive: true },
      orderBy: [{ levelRank: 'asc' }, { createdAt: 'asc' }],
    })

    const formatted = positions.map((p, idx) => ({
      id: p.id,
      levelName: p.positionName,
      levelOrder: p.levelRank || idx + 1,
      defaultScopeType: 4,
      description: p.positionCode,
      baseSalaryMin: undefined,
      baseSalaryMax: undefined,
      isDeleted: false,
    }))

    return {
      items: formatted,
      totalCount: formatted.length,
    }
  }

  /**
   * Tạo cấp bậc mới (Tự động tái kích hoạt nếu positionCode đã từng bị xóa mềm)
   */
  public async createJobLevel(dto: CreateJobLevelDto) {
    const code = dto.description || dto.levelName.toUpperCase().replace(/\s+/g, '_')
    const existing = await prisma.position.findUnique({
      where: { positionCode: code },
    })

    if (existing) {
      if (existing.isActive) {
        throw new BadRequestError('Mã cấp bậc công việc đã tồn tại')
      }

      // Tái kích hoạt cấp bậc đã từng xóa mềm
      const updated = await prisma.position.update({
        where: { id: existing.id },
        data: {
          positionName: dto.levelName,
          isActive: true,
        },
      })
      return updated.id
    }

    const pos = await prisma.position.create({
      data: {
        positionCode: code,
        positionName: dto.levelName,
        isActive: true,
      },
    })

    return pos.id
  }

  /**
   * Cập nhật cấp bậc công việc
   */
  public async updateJobLevel(id: string, dto: UpdateJobLevelDto) {
    const existing = await prisma.position.findFirst({
      where: { id, isActive: true },
    })
    if (!existing) {
      throw new NotFoundError('Cấp bậc công việc')
    }

    await prisma.position.update({
      where: { id },
      data: {
        positionName: dto.levelName,
      },
    })
  }

  /**
   * XÓA MỀM (Soft Delete): Đánh dấu isActive = false
   * Ẩn cấp bậc khỏi danh sách Frontend mà không làm mất dữ liệu chức danh của nhân viên cũ
   */
  public async deleteJobLevel(id: string) {
    const existing = await prisma.position.findUnique({ where: { id } })
    if (!existing || !existing.isActive) {
      throw new NotFoundError('Cấp bậc công việc')
    }

    await prisma.position.update({
      where: { id },
      data: { isActive: false },
    })
  }
}

export const jobLevelService = new JobLevelService()
