import prisma from '../../config/prisma'
import { NotFoundError, BadRequestError } from '../../common/errors/app.error'
import { auditLogService } from '../audit-logs/audit-log.service'
import { questionParserService, type ParsedQuestion } from './question-parser.service'
import type {
  CreateQuestionBankDto,
  UpdateQuestionBankDto,
  GetQuestionBanksQueryDto,
  GetBankQuestionsQueryDto,
  CreateBankQuestionDto,
  UpdateBankQuestionDto,
} from './question-bank.dto'

export class QuestionBankService {
  /**
   * 1. Lấy danh sách Ngân hàng câu hỏi (kèm phân trang, lọc, tìm kiếm)
   */
  public async getQuestionBanks(query?: GetQuestionBanksQueryDto) {
    const page = Math.max(1, Number(query?.page) || 1)
    const pageSize = Math.max(1, Math.min(100, Number(query?.pageSize) || 10))
    const skip = (page - 1) * pageSize
    const search = query?.search?.trim() || ''
    const categoryId = query?.categoryId
    const syncSource = query?.syncSource

    const where: any = {
      isActive: true,
    }

    if (search) {
      where.OR = [
        { code: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (categoryId && categoryId !== 'ALL') {
      where.categoryId = categoryId
    }

    if (syncSource && syncSource !== 'ALL') {
      where.syncSource = syncSource
    }

    const [total, banks, totalQuestionsAggregate] = await Promise.all([
      prisma.questionBank.count({ where }),
      prisma.questionBank.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { updatedAt: 'desc' },
        include: {
          category: { select: { id: true, name: true, code: true } },
          createdByUser: { select: { id: true, fullName: true, email: true } },
          _count: {
            select: {
              questions: { where: { isActive: true } },
            },
          },
        },
      }),
      prisma.bankQuestion.count({
        where: { isActive: true },
      }),
    ])

    // Lấy danh mục phục vụ bộ lọc
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      select: { id: true, name: true, code: true },
      orderBy: { sortOrder: 'asc' },
    })

    const items = banks.map((b) => ({
      id: b.id,
      code: b.code,
      name: b.name,
      description: b.description,
      categoryId: b.categoryId,
      category: b.category,
      syncSource: b.syncSource,
      googleSheetUrl: b.googleSheetUrl,
      lastSyncedAt: b.lastSyncedAt,
      totalQuestions: b._count.questions,
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
      createdByUser: b.createdByUser,
    }))

    return {
      items,
      stats: {
        totalBanks: total,
        totalQuestions: totalQuestionsAggregate,
        googleSheetBanks: banks.filter((b) => b.syncSource === 'GOOGLE_SHEETS').length,
      },
      categories,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize) || 1,
      },
    }
  }

  /**
   * 2. Lấy chi tiết 1 Ngân hàng câu hỏi
   */
  public async getQuestionBankById(id: string) {
    const bank = await prisma.questionBank.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, name: true, code: true } },
        createdByUser: { select: { id: true, fullName: true, email: true } },
        _count: {
          select: {
            questions: { where: { isActive: true } },
          },
        },
      },
    })

    if (!bank) {
      throw new NotFoundError('Ngân hàng câu hỏi')
    }

    return {
      ...bank,
      totalQuestions: bank._count.questions,
    }
  }

  /**
   * 3. Tạo mới Ngân hàng câu hỏi (ghi Audit Log)
   */
  public async createQuestionBank(dto: CreateQuestionBankDto, userId?: string) {
    const existingCode = await prisma.questionBank.findUnique({
      where: { code: dto.code },
    })
    if (existingCode) {
      throw new BadRequestError(`Mã ngân hàng "${dto.code}" đã tồn tại. Vui lòng chọn mã khác.`)
    }

    const bank = await prisma.questionBank.create({
      data: {
        code: dto.code.trim().toUpperCase(),
        name: dto.name.trim(),
        description: dto.description?.trim(),
        categoryId: dto.categoryId || null,
        googleSheetUrl: dto.googleSheetUrl?.trim() || null,
        syncSource: dto.googleSheetUrl ? 'GOOGLE_SHEETS' : 'MANUAL',
        createdBy: userId || null,
      },
      include: {
        category: true,
      },
    })

    // Ghi Audit Log (CREATE)
    await auditLogService.logChange({
      tableName: 'quiz_question_banks',
      entityId: bank.id,
      action: 'CREATE',
      userId: userId || null,
      fieldName: 'Khởi tạo ngân hàng câu hỏi',
      newValue: `Tạo mới ngân hàng "${bank.name}" (${bank.code})`,
      metadata: {
        code: bank.code,
        name: bank.name,
        syncSource: bank.syncSource,
        googleSheetUrl: bank.googleSheetUrl,
      },
    })

    return bank
  }

  /**
   * 4. Cập nhật Ngân hàng câu hỏi (ghi Audit Log)
   */
  public async updateQuestionBank(id: string, dto: UpdateQuestionBankDto, userId?: string) {
    const bank = await prisma.questionBank.findUnique({ where: { id } })
    if (!bank) {
      throw new NotFoundError('Ngân hàng câu hỏi')
    }

    if (dto.code && dto.code !== bank.code) {
      const existing = await prisma.questionBank.findUnique({ where: { code: dto.code } })
      if (existing && existing.id !== id) {
        throw new BadRequestError(`Mã ngân hàng "${dto.code}" đã được sử dụng.`)
      }
    }

    const { diff, changedFields } = auditLogService.calculateDiff(bank, dto)

    const updated = await prisma.questionBank.update({
      where: { id },
      data: {
        code: dto.code ? dto.code.trim().toUpperCase() : undefined,
        name: dto.name ? dto.name.trim() : undefined,
        description: dto.description !== undefined ? dto.description : undefined,
        categoryId: dto.categoryId !== undefined ? dto.categoryId : undefined,
        googleSheetUrl: dto.googleSheetUrl !== undefined ? dto.googleSheetUrl : undefined,
        syncSource: dto.googleSheetUrl ? 'GOOGLE_SHEETS' : bank.syncSource,
        isActive: dto.isActive !== undefined ? dto.isActive : undefined,
      },
      include: {
        category: true,
      },
    })

    if (changedFields.length > 0) {
      await auditLogService.logChange({
        tableName: 'quiz_question_banks',
        entityId: id,
        action: 'UPDATE',
        userId: userId || null,
        fieldName: `Cập nhật thông tin (${changedFields.join(', ')})`,
        newValue: `Cập nhật ${changedFields.length} trường thông tin`,
        diff,
        metadata: { changedFields },
      })
    }

    return updated
  }

  /**
   * 5. Xóa Ngân hàng câu hỏi (Soft Delete)
   */
  public async deleteQuestionBank(id: string, userId?: string) {
    const bank = await prisma.questionBank.findUnique({ where: { id } })
    if (!bank) {
      throw new NotFoundError('Ngân hàng câu hỏi')
    }

    const updated = await prisma.questionBank.update({
      where: { id },
      data: { isActive: false },
    })

    await auditLogService.logChange({
      tableName: 'quiz_question_banks',
      entityId: id,
      action: 'DELETE',
      userId: userId || null,
      fieldName: 'Xóa ngân hàng câu hỏi',
      newValue: `Đã vô hiệu hóa ngân hàng "${bank.name}" (${bank.code})`,
      metadata: { code: bank.code, name: bank.name },
    })

    return updated
  }

  /**
   * 6. Đồng bộ câu hỏi từ Google Sheet (Tính toán Semantic Delta & Ghi Audit Log)
   */
  public async syncFromGoogleSheet(id: string, sheetUrlOverride?: string, userId?: string) {
    const bank = await prisma.questionBank.findUnique({
      where: { id },
      include: {
        questions: {
          include: { options: true },
        },
      },
    })
    if (!bank) {
      throw new NotFoundError('Ngân hàng câu hỏi')
    }

    const targetUrl = sheetUrlOverride || bank.googleSheetUrl
    if (!targetUrl) {
      throw new BadRequestError('Chưa có URL Google Sheet để đồng bộ. Vui lòng cung cấp link Google Sheet.')
    }

    // Bước 1: Tải CSV từ Google Sheet
    const csvContent = await questionParserService.fetchGoogleSheetCsv(targetUrl)

    // Bước 2: Parse & Validate
    const { questions: incomingQuestions, errors: syncErrors } = questionParserService.parseCsv(csvContent)

    if (incomingQuestions.length === 0 && syncErrors.length > 0) {
      throw new BadRequestError(
        `Không thể đồng bộ câu hỏi nào. Phát hiện ${syncErrors.length} lỗi cú pháp trong trang tính (Dòng ${syncErrors[0]?.row}: ${syncErrors[0]?.error})`
      )
    }

    // Bước 3: Đồng bộ dữ liệu & Tính Semantic Delta trong RAM
    const syncResult = await this.executeQuestionsSync(
      bank,
      incomingQuestions,
      syncErrors,
      'GOOGLE_SHEETS',
      targetUrl,
      userId
    )

    return syncResult
  }

  /**
   * 7. Nhập câu hỏi từ nội dung CSV / Excel
   */
  public async importFromCsv(id: string, csvContent: string, userId?: string) {
    const bank = await prisma.questionBank.findUnique({
      where: { id },
      include: {
        questions: {
          include: { options: true },
        },
      },
    })
    if (!bank) {
      throw new NotFoundError('Ngân hàng câu hỏi')
    }

    const { questions: incomingQuestions, errors: syncErrors } = questionParserService.parseCsv(csvContent)
    if (incomingQuestions.length === 0 && syncErrors.length > 0) {
      throw new BadRequestError(
        `Không thể nhập câu hỏi nào. Phát hiện ${syncErrors.length} lỗi trong file (Dòng ${syncErrors[0]?.row}: ${syncErrors[0]?.error})`
      )
    }

    return await this.executeQuestionsSync(
      bank,
      incomingQuestions,
      syncErrors,
      'EXCEL',
      'Imported via CSV/Excel file',
      userId
    )
  }

  /**
   * Helper cốt lõi: Tính toán Semantic Delta, thực thi Transaction và ghi Audit Log
   */
  private async executeQuestionsSync(
    bank: any,
    incomingQuestions: ParsedQuestion[],
    syncErrors: Array<{ row: number; code?: string; error: string }>,
    sourceType: 'GOOGLE_SHEETS' | 'EXCEL',
    sourceIdentifier: string,
    userId?: string
  ) {
    const existingQuestions = bank.questions as Array<{
      id: string
      externalCode: string | null
      questionText: string
      difficulty: string
      points: number
      explanation: string | null
      tags: string | null
      isActive: boolean
      version: number
      options: Array<{ id: string; optionText: string; isCorrect: boolean; sortOrder: number }>
    }>

    const existingMap = new Map<string, (typeof existingQuestions)[0]>()
    existingQuestions.forEach((q) => {
      const key = (q.externalCode || q.questionText).trim().toLowerCase()
      existingMap.set(key, q)
    })

    const addedQuestions: string[] = []
    const updatedQuestions: Array<{ code: string; title: string; changes: string }> = []
    const deactivatedQuestions: string[] = []

    const incomingKeys = new Set<string>()

    await prisma.$transaction(async (tx) => {
      for (const inc of incomingQuestions) {
        const key = (inc.externalCode || inc.questionText).trim().toLowerCase()
        incomingKeys.add(key)

        const existing = existingMap.get(key)
        if (!existing) {
          // A. INSERT NEW QUESTION
          await tx.bankQuestion.create({
            data: {
              questionBankId: bank.id,
              externalCode: inc.externalCode,
              questionText: inc.questionText,
              questionType: inc.questionType,
              difficulty: inc.difficulty,
              points: inc.points,
              explanation: inc.explanation,
              tags: inc.tags,
              isActive: true,
              version: 1,
              options: {
                create: inc.options.map((opt) => ({
                  optionText: opt.optionText,
                  isCorrect: opt.isCorrect,
                  sortOrder: opt.sortOrder,
                })),
              },
            },
          })
          addedQuestions.push(`${inc.externalCode || 'Câu mới'}: ${inc.questionText.slice(0, 45)}...`)
        } else {
          // B. UPDATE EXISTING QUESTION
          // Kiểm tra xem có thay đổi nội dung không
          const isTextChanged = existing.questionText !== inc.questionText
          const isDifficultyChanged = existing.difficulty !== inc.difficulty
          const isExplanationChanged = existing.explanation !== inc.explanation

          // So sánh đáp án
          const existingOpts = existing.options.map((o) => `${o.optionText}:${o.isCorrect}`).sort().join('|')
          const incOpts = inc.options.map((o) => `${o.optionText}:${o.isCorrect}`).sort().join('|')
          const isOptionsChanged = existingOpts !== incOpts

          if (isTextChanged || isDifficultyChanged || isExplanationChanged || isOptionsChanged || !existing.isActive) {
            // Xóa options cũ và tạo lại options mới
            await tx.bankQuestionOption.deleteMany({
              where: { questionId: existing.id },
            })

            await tx.bankQuestion.update({
              where: { id: existing.id },
              data: {
                questionText: inc.questionText,
                questionType: inc.questionType,
                difficulty: inc.difficulty,
                points: inc.points,
                explanation: inc.explanation,
                tags: inc.tags,
                isActive: true,
                version: existing.version + 1,
                options: {
                  create: inc.options.map((opt) => ({
                    optionText: opt.optionText,
                    isCorrect: opt.isCorrect,
                    sortOrder: opt.sortOrder,
                  })),
                },
              },
            })

            const changesList: string[] = []
            if (isTextChanged) changesList.push('Sửa câu hỏi')
            if (isOptionsChanged) changesList.push('Sửa đáp án')
            if (isDifficultyChanged) changesList.push(`Độ khó -> ${inc.difficulty}`)
            if (!existing.isActive) changesList.push('Kích hoạt lại')

            updatedQuestions.push({
              code: inc.externalCode || existing.externalCode || 'Q',
              title: inc.questionText.slice(0, 40),
              changes: changesList.join(', '),
            })
          }
        }
      }

      // C. DEACTIVATE QUESTIONS NOT PRESENT IN INCOMING DATA
      for (const ex of existingQuestions) {
        if (!ex.isActive) continue
        const key = (ex.externalCode || ex.questionText).trim().toLowerCase()
        if (!incomingKeys.has(key)) {
          await tx.bankQuestion.update({
            where: { id: ex.id },
            data: { isActive: false },
          })
          deactivatedQuestions.push(`${ex.externalCode || 'Q'}: ${ex.questionText.slice(0, 40)}`)
        }
      }

      // Cập nhật tổng số câu & mốc thời gian đồng bộ trên Bank
      const activeCount = await tx.bankQuestion.count({
        where: { questionBankId: bank.id, isActive: true },
      })

      await tx.questionBank.update({
        where: { id: bank.id },
        data: {
          lastSyncedAt: new Date(),
          totalQuestions: activeCount,
          syncSource: sourceType,
          googleSheetUrl: sourceType === 'GOOGLE_SHEETS' ? sourceIdentifier : bank.googleSheetUrl,
        },
      })
    })

    // D. GHI SEMANTIC AUDIT LOG
    const summaryParts: string[] = []
    if (addedQuestions.length > 0) summaryParts.push(`+ Thêm ${addedQuestions.length} câu`)
    if (updatedQuestions.length > 0) summaryParts.push(`~ Cập nhật ${updatedQuestions.length} câu`)
    if (deactivatedQuestions.length > 0) summaryParts.push(`- Vô hiệu hóa ${deactivatedQuestions.length} câu`)

    const summaryText =
      summaryParts.length > 0
        ? `${sourceType === 'GOOGLE_SHEETS' ? 'Đồng bộ Google Sheet' : 'Nhập file Excel'}: ${summaryParts.join(' • ')}`
        : `Đồng bộ hoàn tất (Không có thay đổi so với ${incomingQuestions.length} câu hiện tại)`

    await auditLogService.logChange({
      tableName: 'quiz_question_banks',
      entityId: bank.id,
      action: 'SYNC',
      userId: userId || null,
      fieldName: sourceType === 'GOOGLE_SHEETS' ? 'Đồng bộ từ Google Sheet' : 'Nhập từ file Excel',
      newValue: summaryText,
      metadata: {
        sourceType,
        sourceIdentifier,
        totalIncoming: incomingQuestions.length,
        addedCount: addedQuestions.length,
        updatedCount: updatedQuestions.length,
        deactivatedCount: deactivatedQuestions.length,
        addedQuestions,
        updatedQuestions,
        deactivatedQuestions,
        syncErrors,
      },
    })

    return {
      message: summaryText,
      stats: {
        totalIncoming: incomingQuestions.length,
        added: addedQuestions.length,
        updated: updatedQuestions.length,
        deactivated: deactivatedQuestions.length,
      },
      addedQuestions,
      updatedQuestions,
      deactivatedQuestions,
      syncErrors,
    }
  }

  /**
   * 8. Lấy danh sách câu hỏi trong 1 Ngân hàng
   */
  public async getBankQuestions(bankId: string, query?: GetBankQuestionsQueryDto) {
    const page = Math.max(1, Number(query?.page) || 1)
    const pageSize = Math.max(1, Math.min(100, Number(query?.pageSize) || 20))
    const skip = (page - 1) * pageSize
    const search = query?.search?.trim() || ''
    const difficulty = query?.difficulty
    const tag = query?.tag?.trim()
    const isActive = query?.isActive

    const where: any = {
      questionBankId: bankId,
    }

    if (isActive !== undefined) {
      where.isActive = isActive
    } else {
      where.isActive = true
    }

    if (search) {
      where.OR = [
        { externalCode: { contains: search, mode: 'insensitive' } },
        { questionText: { contains: search, mode: 'insensitive' } },
        { tags: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (difficulty && difficulty !== 'ALL') {
      where.difficulty = difficulty
    }

    if (tag) {
      where.tags = { contains: tag, mode: 'insensitive' }
    }

    const [total, questions] = await Promise.all([
      prisma.bankQuestion.count({ where }),
      prisma.bankQuestion.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: [{ externalCode: 'asc' }, { createdAt: 'desc' }],
        include: {
          options: {
            orderBy: { sortOrder: 'asc' },
          },
        },
      }),
    ])

    return {
      items: questions,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize) || 1,
      },
    }
  }

  /**
   * 9. Thêm câu hỏi thủ công (ghi Audit Log)
   */
  public async createManualQuestion(bankId: string, dto: CreateBankQuestionDto, userId?: string) {
    const bank = await prisma.questionBank.findUnique({ where: { id: bankId } })
    if (!bank) throw new NotFoundError('Ngân hàng câu hỏi')

    const correctCount = dto.options.filter((o) => o.isCorrect).length
    if (dto.questionType === 'SINGLE_CHOICE' || dto.questionType === 'TRUE_FALSE') {
      if (correctCount !== 1) {
        throw new BadRequestError('Câu hỏi trắc nghiệm 1 đáp án (hoặc Đúng/Sai) bắt buộc phải có đúng 1 đáp án đúng')
      }
    } else if (dto.questionType === 'MULTIPLE_CHOICE') {
      if (correctCount < 1) {
        throw new BadRequestError('Câu hỏi trắc nghiệm nhiều đáp án bắt buộc phải có ít nhất 1 đáp án đúng')
      }
    }

    const question = await prisma.bankQuestion.create({
      data: {
        questionBankId: bankId,
        externalCode: dto.externalCode || null,
        questionText: dto.questionText.trim(),
        questionType: dto.questionType,
        difficulty: dto.difficulty,
        points: dto.points,
        explanation: dto.explanation?.trim() || null,
        tags: dto.tags?.trim() || null,
        isActive: true,
        version: 1,
        options: {
          create: dto.options.map((opt, idx) => ({
            optionText: opt.optionText.trim(),
            isCorrect: opt.isCorrect,
            sortOrder: opt.sortOrder || idx + 1,
          })),
        },
      },
      include: {
        options: { orderBy: { sortOrder: 'asc' } },
      },
    })

    // Tăng count
    await prisma.questionBank.update({
      where: { id: bankId },
      data: { totalQuestions: { increment: 1 } },
    })

    await auditLogService.logChange({
      tableName: 'quiz_question_banks',
      entityId: bankId,
      action: 'CREATE',
      userId: userId || null,
      fieldName: 'Thêm câu hỏi mới thủ công',
      newValue: `+ Thêm câu hỏi "${question.externalCode || ''}: ${question.questionText.slice(0, 45)}"`,
      metadata: { questionId: question.id, questionCode: question.externalCode },
    })

    return question
  }

  /**
   * 10. Chỉnh sửa câu hỏi thủ công (ghi Audit Log)
   */
  public async updateManualQuestion(
    bankId: string,
    questionId: string,
    dto: UpdateBankQuestionDto,
    userId?: string
  ) {
    const question = await prisma.bankQuestion.findFirst({
      where: { id: questionId, questionBankId: bankId },
      include: { options: true },
    })
    if (!question) throw new NotFoundError('Câu hỏi')

    if (dto.options && dto.options.length > 0) {
      const qType = dto.questionType || question.questionType
      const correctCount = dto.options.filter((o) => o.isCorrect).length
      if (qType === 'SINGLE_CHOICE' || qType === 'TRUE_FALSE') {
        if (correctCount !== 1) {
          throw new BadRequestError('Câu hỏi trắc nghiệm 1 đáp án (hoặc Đúng/Sai) bắt buộc phải có đúng 1 đáp án đúng')
        }
      } else if (qType === 'MULTIPLE_CHOICE') {
        if (correctCount < 1) {
          throw new BadRequestError('Câu hỏi trắc nghiệm nhiều đáp án bắt buộc phải có ít nhất 1 đáp án đúng')
        }
      }
    }

    await prisma.$transaction(async (tx) => {
      if (dto.options && dto.options.length > 0) {
        await tx.bankQuestionOption.deleteMany({
          where: { questionId },
        })
      }

      await tx.bankQuestion.update({
        where: { id: questionId },
        data: {
          externalCode: dto.externalCode !== undefined ? dto.externalCode : undefined,
          questionText: dto.questionText ? dto.questionText.trim() : undefined,
          questionType: dto.questionType || undefined,
          difficulty: dto.difficulty || undefined,
          points: dto.points !== undefined ? dto.points : undefined,
          explanation: dto.explanation !== undefined ? dto.explanation : undefined,
          tags: dto.tags !== undefined ? dto.tags : undefined,
          isActive: dto.isActive !== undefined ? dto.isActive : undefined,
          version: question.version + 1,
          options: dto.options
            ? {
                create: dto.options.map((opt, idx) => ({
                  optionText: opt.optionText.trim(),
                  isCorrect: opt.isCorrect,
                  sortOrder: opt.sortOrder || idx + 1,
                })),
              }
            : undefined,
        },
      })
    })

    const updated = await prisma.bankQuestion.findUnique({
      where: { id: questionId },
      include: { options: { orderBy: { sortOrder: 'asc' } } },
    })

    await auditLogService.logChange({
      tableName: 'quiz_question_banks',
      entityId: bankId,
      action: 'UPDATE',
      userId: userId || null,
      fieldName: 'Chỉnh sửa câu hỏi',
      newValue: `~ Cập nhật câu hỏi "${question.externalCode || ''}: ${question.questionText.slice(0, 40)}"`,
      metadata: { questionId, version: (updated?.version || 1) },
    })

    return updated
  }

  /**
   * 11. Xóa câu hỏi (Soft Delete)
   */
  public async deleteManualQuestion(bankId: string, questionId: string, userId?: string) {
    const question = await prisma.bankQuestion.findFirst({
      where: { id: questionId, questionBankId: bankId },
    })
    if (!question) throw new NotFoundError('Câu hỏi')

    await prisma.bankQuestion.update({
      where: { id: questionId },
      data: { isActive: false },
    })

    await prisma.questionBank.update({
      where: { id: bankId },
      data: { totalQuestions: { decrement: 1 } },
    })

    await auditLogService.logChange({
      tableName: 'quiz_question_banks',
      entityId: bankId,
      action: 'DELETE',
      userId: userId || null,
      fieldName: 'Vô hiệu hóa câu hỏi',
      newValue: `- Xóa câu hỏi "${question.externalCode || ''}: ${question.questionText.slice(0, 40)}"`,
      metadata: { questionId },
    })

    return { success: true }
  }

  /**
   * 12. Rút ngẫu nhiên câu hỏi từ Ngân hàng (Dynamic Quiz Pooling)
   */
  public async sampleQuestionsFromPool(bankId: string, selectCount: number, difficultyFilter?: string) {
    const where: any = {
      questionBankId: bankId,
      isActive: true,
    }
    if (difficultyFilter && difficultyFilter !== 'ALL') {
      where.difficulty = difficultyFilter
    }

    const eligible = await prisma.bankQuestion.findMany({
      where,
      include: {
        options: { orderBy: { sortOrder: 'asc' } },
      },
    })

    if (eligible.length === 0) {
      return []
    }

    // Shuffle ngẫu nhiên bằng thuật toán Fisher-Yates
    const shuffled = [...eligible]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    return shuffled.slice(0, Math.min(selectCount, shuffled.length))
  }
}

export const questionBankService = new QuestionBankService()
