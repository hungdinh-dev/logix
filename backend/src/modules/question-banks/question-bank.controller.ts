import { Request, Response, NextFunction } from 'express'
import { questionBankService } from './question-bank.service'

export class QuestionBankController {
  public async getQuestionBanks(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await questionBankService.getQuestionBanks(req.query as any)
      res.json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  public async getQuestionBankById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await questionBankService.getQuestionBankById(req.params.id)
      res.json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  public async createQuestionBank(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id
      const result = await questionBankService.createQuestionBank(req.body, userId)
      res.status(201).json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  public async updateQuestionBank(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id
      const result = await questionBankService.updateQuestionBank(req.params.id, req.body, userId)
      res.json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  public async deleteQuestionBank(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id
      const result = await questionBankService.deleteQuestionBank(req.params.id, userId)
      res.json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  public async syncFromGoogleSheet(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id
      const sheetUrl = req.body?.sheetUrl
      const result = await questionBankService.syncFromGoogleSheet(req.params.id, sheetUrl, userId)
      res.json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  public async importFromCsv(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id
      const csvContent = req.body?.csvContent
      const result = await questionBankService.importFromCsv(req.params.id, csvContent, userId)
      res.json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  public async getBankQuestions(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await questionBankService.getBankQuestions(req.params.id, req.query as any)
      res.json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  public async createManualQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id
      const result = await questionBankService.createManualQuestion(req.params.id, req.body, userId)
      res.status(201).json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  public async updateManualQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id
      const result = await questionBankService.updateManualQuestion(
        req.params.id,
        req.params.questionId,
        req.body,
        userId
      )
      res.json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  public async deleteManualQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id
      const result = await questionBankService.deleteManualQuestion(
        req.params.id,
        req.params.questionId,
        userId
      )
      res.json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }

  public async downloadTemplate(req: Request, res: Response, next: NextFunction) {
    try {
      const csvHeader = [
        'Mã câu hỏi',
        'Nội dung câu hỏi',
        'Loại câu (SINGLE/MULTIPLE/TRUE_FALSE)',
        'Đáp án A',
        'Đáp án B',
        'Đáp án C',
        'Đáp án D',
        'Đáp án đúng (A/B/C/D)',
        'Độ khó (EASY/MEDIUM/HARD)',
        'Nhãn (Tags)',
        'Giải thích đáp án chi tiết',
      ].join(',')

      const sampleRow1 = [
        'ATTP-01',
        '"Nhiệt độ bảo quản kem tiêu chuẩn trong tủ đông là bao nhiêu?"',
        'SINGLE',
        '"-5°C đến 0°C"',
        '"-18°C đến -22°C"',
        '"2°C đến 5°C"',
        '"0°C đến 4°C"',
        'B',
        'EASY',
        '"attp, bao_quan"',
        '"Theo SOP Ba Hưng mục 3.2, kem cần giữ ở mức -18°C đến -22°C để giữ cấu trúc."',
      ].join(',')

      const sampleRow2 = [
        'ATTP-02',
        '"Quy trình rửa tay chuẩn trước khi vào ca gồm bao nhiêu bước?"',
        'SINGLE',
        '"3 bước"',
        '"4 bước"',
        '"6 bước"',
        '"8 bước"',
        'C',
        'MEDIUM',
        '"attp, ve_sinh"',
        '"Quy trình 6 bước của Bộ Y Tế áp dụng cho toàn bộ nhân viên F&B."',
      ].join(',')

      const csvContent = '\uFEFF' + [csvHeader, sampleRow1, sampleRow2].join('\n')
      res.setHeader('Content-Type', 'text/csv; charset=utf-8')
      res.setHeader('Content-Disposition', 'attachment; filename="question_bank_template.csv"')
      res.send(csvContent)
    } catch (error) {
      next(error)
    }
  }
}

export const questionBankController = new QuestionBankController()
