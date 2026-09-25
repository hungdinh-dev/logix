import { Router } from 'express'
import { questionBankController } from './question-bank.controller'
import {
  createQuestionBankSchema,
  updateQuestionBankSchema,
  createBankQuestionSchema,
  updateBankQuestionSchema,
} from './question-bank.dto'
import { validateRequest } from '../../common/middlewares/validate.middleware'
import { asyncHandler } from '../../common/utils/async-handler'
import { authenticateToken } from '../../middlewares/auth.middleware'

const router = Router()

// 1. Template download (public/authenticated)
router.get('/template', asyncHandler(questionBankController.downloadTemplate))

// 2. Question Bank CRUD
router.get('/', authenticateToken, asyncHandler(questionBankController.getQuestionBanks))
router.post(
  '/',
  authenticateToken,
  validateRequest(createQuestionBankSchema),
  asyncHandler(questionBankController.createQuestionBank)
)
router.get('/:id', authenticateToken, asyncHandler(questionBankController.getQuestionBankById))
router.put(
  '/:id',
  authenticateToken,
  validateRequest(updateQuestionBankSchema),
  asyncHandler(questionBankController.updateQuestionBank)
)
router.delete('/:id', authenticateToken, asyncHandler(questionBankController.deleteQuestionBank))

// 3. Sync & Import
router.post('/:id/sync-sheets', authenticateToken, asyncHandler(questionBankController.syncFromGoogleSheet))
router.post('/:id/sync-sheet', authenticateToken, asyncHandler(questionBankController.syncFromGoogleSheet))
router.post('/:id/import-csv', authenticateToken, asyncHandler(questionBankController.importFromCsv))

// 4. Questions inside bank
router.get('/:id/questions', authenticateToken, asyncHandler(questionBankController.getBankQuestions))
router.post(
  '/:id/questions',
  authenticateToken,
  validateRequest(createBankQuestionSchema),
  asyncHandler(questionBankController.createManualQuestion)
)
router.put(
  '/:id/questions/:questionId',
  authenticateToken,
  validateRequest(updateBankQuestionSchema),
  asyncHandler(questionBankController.updateManualQuestion)
)
router.delete(
  '/:id/questions/:questionId',
  authenticateToken,
  asyncHandler(questionBankController.deleteManualQuestion)
)

export default router
