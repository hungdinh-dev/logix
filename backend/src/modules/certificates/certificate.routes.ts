import { Router } from 'express'
import { certificateController } from './certificate.controller'
import { authenticateToken } from '../../middlewares/auth.middleware'

export const certificateRouter = Router()

// Public verification route for scanning QR code on printed certificates
certificateRouter.get('/verify/:code', certificateController.getCertificateByCode)

// Authenticated Routes (LMS Admin / Trainer / HR)
certificateRouter.use(authenticateToken)

// 1. KPI Stats
certificateRouter.get('/stats', certificateController.getStats)

// 2. Templates Management
certificateRouter.get('/templates', certificateController.getTemplates)
certificateRouter.post('/templates', certificateController.createTemplate)
certificateRouter.get('/templates/:id', certificateController.getTemplateById)
certificateRouter.put('/templates/:id', certificateController.updateTemplate)
certificateRouter.delete('/templates/:id', certificateController.deleteTemplate)

// 3. Issued Certificates Management
certificateRouter.get('/', certificateController.getIssuedCertificates)
certificateRouter.post('/issue', certificateController.issueCertificate)
certificateRouter.get('/:id', certificateController.getCertificateById)
certificateRouter.patch('/:id/revoke', certificateController.revokeCertificate)
certificateRouter.patch('/:id/renew', certificateController.renewCertificate)
certificateRouter.delete('/:id', certificateController.deleteCertificate)
