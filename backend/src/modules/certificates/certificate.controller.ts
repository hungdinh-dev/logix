import { Request, Response, NextFunction } from 'express'
import { certificateService } from './certificate.service'
import {
  createCertificateTemplateSchema,
  updateCertificateTemplateSchema,
  issueCertificateSchema,
  revokeCertificateSchema,
  renewCertificateSchema,
} from './certificate.dto'

export class CertificateController {
  // 1. Stats
  public getStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await certificateService.getStats()
      res.status(200).json({
        success: true,
        data: stats,
      })
    } catch (err) {
      next(err)
    }
  }

  // 2. Issued Certificates
  public getIssuedCertificates = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await certificateService.getIssuedCertificates(req.query as any)
      res.status(200).json({
        success: true,
        data: result.items,
        pagination: result.pagination,
      })
    } catch (err) {
      next(err)
    }
  }

  public getCertificateById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cert = await certificateService.getCertificateById(req.params.id)
      res.status(200).json({
        success: true,
        data: cert,
      })
    } catch (err) {
      next(err)
    }
  }

  public getCertificateByCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cert = await certificateService.getCertificateByCode(req.params.code)
      res.status(200).json({
        success: true,
        data: cert,
      })
    } catch (err) {
      next(err)
    }
  }

  public issueCertificate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = issueCertificateSchema.parse(req.body)
      const cert = await certificateService.issueCertificate(validated)
      res.status(201).json({
        success: true,
        message: 'Cấp chứng chỉ đào tạo thành công',
        data: cert,
      })
    } catch (err) {
      next(err)
    }
  }

  public revokeCertificate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = revokeCertificateSchema.parse(req.body)
      const cert = await certificateService.revokeCertificate(req.params.id, validated)
      res.status(200).json({
        success: true,
        message: 'Thu hồi chứng chỉ thành công',
        data: cert,
      })
    } catch (err) {
      next(err)
    }
  }

  public renewCertificate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = renewCertificateSchema.parse(req.body)
      const cert = await certificateService.renewCertificate(req.params.id, validated)
      res.status(200).json({
        success: true,
        message: 'Gia hạn chứng chỉ thành công',
        data: cert,
      })
    } catch (err) {
      next(err)
    }
  }

  public deleteCertificate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await certificateService.deleteCertificate(req.params.id)
      res.status(200).json({
        success: true,
        message: 'Xóa bản ghi chứng chỉ thành công',
      })
    } catch (err) {
      next(err)
    }
  }

  // 3. Templates
  public getTemplates = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const templates = await certificateService.getTemplates()
      res.status(200).json({
        success: true,
        data: templates,
      })
    } catch (err) {
      next(err)
    }
  }

  public getTemplateById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const template = await certificateService.getTemplateById(req.params.id)
      res.status(200).json({
        success: true,
        data: template,
      })
    } catch (err) {
      next(err)
    }
  }

  public createTemplate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = createCertificateTemplateSchema.parse(req.body)
      const template = await certificateService.createTemplate(validated)
      res.status(201).json({
        success: true,
        message: 'Tạo mẫu phôi chứng chỉ thành công',
        data: template,
      })
    } catch (err) {
      next(err)
    }
  }

  public updateTemplate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = updateCertificateTemplateSchema.parse(req.body)
      const template = await certificateService.updateTemplate(req.params.id, validated)
      res.status(200).json({
        success: true,
        message: 'Cập nhật mẫu phôi chứng chỉ thành công',
        data: template,
      })
    } catch (err) {
      next(err)
    }
  }

  public deleteTemplate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await certificateService.deleteTemplate(req.params.id)
      res.status(200).json({
        success: true,
        message: 'Xóa mẫu phôi chứng chỉ thành công',
      })
    } catch (err) {
      next(err)
    }
  }
}

export const certificateController = new CertificateController()
