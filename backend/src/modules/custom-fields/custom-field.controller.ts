import { Request, Response } from 'express'
import { customFieldService } from './custom-field.service'
import { ApiResponse } from '../../common/responses/api-response'

export class CustomFieldController {
  public getCustomFieldDefinitions = async (req: Request, res: Response) => {
    const definitions = await customFieldService.getCustomFieldDefinitions()
    return res.json(ApiResponse.success(definitions, 'Lấy danh sách định nghĩa trường tùy chỉnh thành công'))
  }
}

export const customFieldController = new CustomFieldController()
