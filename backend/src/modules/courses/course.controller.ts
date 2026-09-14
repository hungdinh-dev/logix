import { Request, Response } from 'express'
import { courseService } from './course.service'
import { ApiResponse } from '../../common/responses/api-response'
import { HttpStatus } from '../../common/enums/http-status.enum'
import { AuthenticatedRequest } from '../../middlewares/auth.middleware'

export class CourseController {
  // ==========================================
  // Category Endpoints (LMS-001)
  // ==========================================

  public getAllCategories = async (req: Request, res: Response) => {
    const categories = await courseService.getAllCategories()
    return res.json(ApiResponse.success(categories, 'Lấy danh mục khóa học thành công'))
  }

  public getCategoryById = async (req: Request, res: Response) => {
    const category = await courseService.getCategoryById(req.params.id)
    return res.json(ApiResponse.success(category, 'Lấy chi tiết danh mục thành công'))
  }

  public createCategory = async (req: AuthenticatedRequest, res: Response) => {
    const category = await courseService.createCategory(req.body)
    return res
      .status(HttpStatus.CREATED)
      .json(ApiResponse.success(category, 'Tạo danh mục khóa học thành công', HttpStatus.CREATED))
  }

  public updateCategory = async (req: AuthenticatedRequest, res: Response) => {
    const category = await courseService.updateCategory(req.params.id, req.body)
    return res.json(ApiResponse.success(category, 'Cập nhật danh mục thành công'))
  }

  public deleteCategory = async (req: AuthenticatedRequest, res: Response) => {
    await courseService.deleteCategory(req.params.id)
    return res.json(ApiResponse.success(null, 'Xóa danh mục khóa học thành công'))
  }

  // ==========================================
  // Course Endpoints (LMS-002 -> LMS-012)
  // ==========================================

  public getAllCourses = async (req: Request, res: Response) => {
    const {
      search,
      categoryId,
      status,
      isMandatory,
      targetPositionId,
      targetDepartmentId,
      targetStoreId,
      targetEmploymentStatus,
    } = req.query

    const courses = await courseService.getAllCourses({
      search: search ? String(search) : undefined,
      categoryId: categoryId ? String(categoryId) : undefined,
      status: status ? String(status) : undefined,
      isMandatory: isMandatory !== undefined ? isMandatory === 'true' : undefined,
      targetPositionId: targetPositionId ? String(targetPositionId) : undefined,
      targetDepartmentId: targetDepartmentId ? String(targetDepartmentId) : undefined,
      targetStoreId: targetStoreId ? String(targetStoreId) : undefined,
      targetEmploymentStatus: targetEmploymentStatus ? String(targetEmploymentStatus) : undefined,
    })
    return res.json(ApiResponse.success(courses, 'Lấy danh sách khóa học thành công'))
  }

  public getCourseById = async (req: Request, res: Response) => {
    const course = await courseService.getCourseById(req.params.id)
    return res.json(ApiResponse.success(course, 'Lấy chi tiết khóa học thành công'))
  }

  public createCourse = async (req: AuthenticatedRequest, res: Response) => {
    const course = await courseService.createCourse(req.body)
    return res
      .status(HttpStatus.CREATED)
      .json(ApiResponse.success(course, 'Tạo khóa học mới thành công', HttpStatus.CREATED))
  }

  public updateCourse = async (req: AuthenticatedRequest, res: Response) => {
    const course = await courseService.updateCourse(req.params.id, req.body)
    return res.json(ApiResponse.success(course, 'Cập nhật khóa học thành công'))
  }

  // LMS-003: Sao chép khóa học
  public cloneCourse = async (req: AuthenticatedRequest, res: Response) => {
    const clonedCourse = await courseService.cloneCourse(req.params.id)
    return res
      .status(HttpStatus.CREATED)
      .json(ApiResponse.success(clonedCourse, 'Sao chép khóa học thành công', HttpStatus.CREATED))
  }

  // LMS-004: Ngưng / Kích hoạt khóa học
  public updateCourseStatus = async (req: AuthenticatedRequest, res: Response) => {
    const course = await courseService.updateCourseStatus(req.params.id, req.body)
    return res.json(ApiResponse.success(course, 'Cập nhật trạng thái khóa học thành công'))
  }

  public deleteCourse = async (req: AuthenticatedRequest, res: Response) => {
    await courseService.deleteCourse(req.params.id)
    return res.json(ApiResponse.success(null, 'Xóa khóa học thành công'))
  }

  // LMS-005: Gán theo Chức danh
  public assignToPosition = async (req: AuthenticatedRequest, res: Response) => {
    const result = await courseService.assignToPosition(req.params.id, req.body.positionId)
    return res.json(ApiResponse.success(result, 'Gán khóa học theo chức danh thành công'))
  }

  // LMS-006: Gán theo Loại nhân sự
  public assignToEmploymentStatus = async (req: AuthenticatedRequest, res: Response) => {
    const result = await courseService.assignToEmploymentStatus(req.params.id, req.body.employmentStatus)
    return res.json(ApiResponse.success(result, 'Gán khóa học theo loại nhân sự thành công'))
  }

  // LMS-007: Gán theo Cửa hàng
  public assignToStore = async (req: AuthenticatedRequest, res: Response) => {
    const result = await courseService.assignToStore(req.params.id, req.body.storeId)
    return res.json(ApiResponse.success(result, 'Gán khóa học theo cửa hàng thành công'))
  }

  // LMS-008: Gán theo Bộ phận sản xuất
  public assignToDepartment = async (req: AuthenticatedRequest, res: Response) => {
    const result = await courseService.assignToDepartment(req.params.id, req.body.departmentId)
    return res.json(ApiResponse.success(result, 'Gán khóa học theo bộ phận sản xuất thành công'))
  }

  // LMS-044 & LMS-011: Ghi danh cá nhân
  public enrollCourse = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id
    if (!userId) {
      return res.status(HttpStatus.UNAUTHORIZED).json(ApiResponse.error('Chưa xác thực', HttpStatus.UNAUTHORIZED))
    }
    const enrollment = await courseService.enrollCourse(userId, req.params.id)
    return res
      .status(HttpStatus.CREATED)
      .json(ApiResponse.success(enrollment, 'Ghi danh khóa học thành công', HttpStatus.CREATED))
  }

  // ==========================================
  // 4. CURRICULUM & MODULE HANDLERS (LMS-017)
  // ==========================================

  public getCourseCurriculum = async (req: AuthenticatedRequest, res: Response) => {
    const curriculum = await courseService.getCourseCurriculum(req.params.id)
    return res.json(ApiResponse.success(curriculum, 'Lấy chương trình đào tạo thành công'))
  }

  public createModule = async (req: AuthenticatedRequest, res: Response) => {
    const module = await courseService.createModule(req.params.id, req.body)
    return res
      .status(HttpStatus.CREATED)
      .json(ApiResponse.success(module, 'Tạo chương học mới thành công', HttpStatus.CREATED))
  }

  public updateModule = async (req: AuthenticatedRequest, res: Response) => {
    const module = await courseService.updateModule(req.params.moduleId, req.body)
    return res.json(ApiResponse.success(module, 'Cập nhật chương học thành công'))
  }

  public deleteModule = async (req: AuthenticatedRequest, res: Response) => {
    const result = await courseService.deleteModule(req.params.moduleId)
    return res.json(ApiResponse.success(result, 'Xóa chương học thành công'))
  }

  public reorderModules = async (req: AuthenticatedRequest, res: Response) => {
    const modules = await courseService.reorderModules(req.params.id, req.body)
    return res.json(ApiResponse.success(modules, 'Sắp xếp lại các chương học thành công'))
  }

  public syncCurriculum = async (req: AuthenticatedRequest, res: Response) => {
    const course = await courseService.syncCourseCurriculum(req.params.id, req.body)
    return res.json(ApiResponse.success(course, 'Đồng bộ giáo trình khóa học thành công'))
  }
}

export const courseController = new CourseController()

