import { Request, Response } from 'express'
import { jobLevelService } from './job-level.service'
import { ApiResponse } from '../../common/responses/api-response'
import { HttpStatus } from '../../common/enums/http-status.enum'

export class JobLevelController {
  public getAllJobLevels = async (req: Request, res: Response) => {
    const data = await jobLevelService.getAllJobLevels()
    return res.json(ApiResponse.success(data, 'Lấy danh sách cấp bậc thành công'))
  }

  public createJobLevel = async (req: Request, res: Response) => {
    const id = await jobLevelService.createJobLevel(req.body)
    return res
      .status(HttpStatus.CREATED)
      .json(ApiResponse.success(id, 'Tạo cấp bậc mới thành công', HttpStatus.CREATED))
  }

  public updateJobLevel = async (req: Request, res: Response) => {
    await jobLevelService.updateJobLevel(req.params.id, req.body)
    return res.json(ApiResponse.success(null, 'Cập nhật cấp bậc thành công'))
  }

  public deleteJobLevel = async (req: Request, res: Response) => {
    await jobLevelService.deleteJobLevel(req.params.id)
    return res.json(ApiResponse.success(null, 'Xóa cấp bậc thành công'))
  }
}

export const jobLevelController = new JobLevelController()
