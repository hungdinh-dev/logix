import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

export interface ParsedQuestionOption {
  optionText: string
  isCorrect: boolean
  sortOrder: number
}

export interface ParsedQuestion {
  externalCode: string
  questionText: string
  questionType: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TRUE_FALSE'
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  points: number
  explanation?: string
  tags?: string
  options: ParsedQuestionOption[]
}

export interface ParseResult {
  questions: ParsedQuestion[]
  errors: Array<{ row: number; code?: string; error: string }>
}

export class QuestionParserService {
  private serviceAccountCredentials: any = null
  private cachedAccessToken: string | null = null
  private tokenExpiryTime: number = 0

  constructor() {
    this.loadServiceAccountCredentials()
  }

  /**
   * Nạp file khóa Google Service Account nếu có trong thư mục dự án
   */
  private loadServiceAccountCredentials() {
    const candidatePaths = [
      path.resolve(process.cwd(), '../lms-list-functions-a6929ed66987.json'),
      path.resolve(process.cwd(), 'lms-list-functions-a6929ed66987.json'),
      path.resolve(__dirname, '../../../../lms-list-functions-a6929ed66987.json'),
    ]

    for (const p of candidatePaths) {
      if (fs.existsSync(p)) {
        try {
          this.serviceAccountCredentials = JSON.parse(fs.readFileSync(p, 'utf8'))
          break
        } catch (e) {
          console.warn('[QuestionParserService] Failed to parse service account JSON:', e)
        }
      }
    }
  }

  /**
   * Sinh JWT Token để chứng thực Google Service Account
   */
  private createJWT(): string {
    const creds = this.serviceAccountCredentials
    if (!creds) throw new Error('Service Account Credentials not loaded')

    const header = { alg: 'RS256', typ: 'JWT' }
    const now = Math.floor(Date.now() / 1000)
    const payload = {
      iss: creds.client_email,
      scope: 'https://www.googleapis.com/auth/spreadsheets',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    }
    const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url')
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url')
    const signatureInput = `${encodedHeader}.${encodedPayload}`
    const signer = crypto.createSign('RSA-SHA256')
    signer.update(signatureInput)
    const signature = signer.sign(creds.private_key, 'base64url')
    return `${signatureInput}.${signature}`
  }

  /**
   * Lấy OAuth2 Access Token từ Google APIs
   */
  private async getAccessToken(): Promise<string> {
    const now = Math.floor(Date.now() / 1000)
    if (this.cachedAccessToken && this.tokenExpiryTime > now + 60) {
      return this.cachedAccessToken
    }

    const jwt = this.createJWT()
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      }),
    })
    const data = (await res.json()) as any
    if (data.error) {
      throw new Error(`Google Auth Failed: ${data.error_description || data.error}`)
    }

    this.cachedAccessToken = data.access_token
    this.tokenExpiryTime = now + (data.expires_in || 3600)
    return this.cachedAccessToken!
  }

  /**
   * Trích xuất Sheet ID và gid từ Google Sheets URL
   */
  public extractGoogleSheetId(url: string): { sheetId: string; gid?: string } | null {
    const sheetIdMatch = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
    if (!sheetIdMatch) return null

    const gidMatch = url.match(/[#&?]gid=([0-9]+)/)
    return {
      sheetId: sheetIdMatch[1],
      gid: gidMatch ? gidMatch[1] : undefined,
    }
  }

  /**
   * Tạo URL tải CSV từ Google Sheet URL (Public Fallback)
   */
  public getGoogleSheetCsvUrl(url: string): string | null {
    const extracted = this.extractGoogleSheetId(url)
    if (!extracted) return null

    let csvUrl = `https://docs.google.com/spreadsheets/d/${extracted.sheetId}/export?format=csv`
    if (extracted.gid) {
      csvUrl += `&gid=${extracted.gid}`
    }
    return csvUrl
  }

  /**
   * Tải nội dung CSV từ Google Sheet URL:
   * Ưu tiên 1: Google Service Account API v4 (truy cập được cả private sheets đã share với service account).
   * Ưu tiên 2: Public CSV export fallback (khi Google Sheet được public "Anyone with link").
   */
  public async fetchGoogleSheetCsv(url: string): Promise<string> {
    const extracted = this.extractGoogleSheetId(url)
    if (!extracted) {
      throw new Error('URL Google Sheet không hợp lệ. Vui lòng kiểm tra lại định dạng link.')
    }

    // 1. Thử truy vấn qua Google Service Account nếu có key file
    if (this.serviceAccountCredentials) {
      try {
        const token = await this.getAccessToken()
        // Lấy metadata để giải quyết sheetId / gid thành tên tab tương ứng
        const metaRes = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${extracted.sheetId}?fields=sheets.properties`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        const meta = (await metaRes.json()) as any

        if (meta && meta.sheets && meta.sheets.length > 0) {
          let targetTabTitle = meta.sheets[0].properties.title
          if (extracted.gid) {
            const matched = meta.sheets.find(
              (s: any) => String(s.properties.sheetId) === String(extracted.gid)
            )
            if (matched) {
              targetTabTitle = matched.properties.title
            }
          }

          // Lấy dữ liệu các hàng trong tab được chọn
          const valuesRes = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${extracted.sheetId}/values/${encodeURIComponent(targetTabTitle)}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
          const valuesData = (await valuesRes.json()) as any

          if (valuesData && Array.isArray(valuesData.values)) {
            // Chuyển mảng 2D thành chuỗi CSV hợp lệ
            return this.rowsToCsv(valuesData.values)
          }
        }
      } catch (serviceAccountError) {
        console.warn(
          '[QuestionParserService] Service Account fetch failed, falling back to public CSV export:',
          serviceAccountError
        )
      }
    }

    // 2. Fallback: Tải qua public CSV export endpoint
    const csvUrl = this.getGoogleSheetCsvUrl(url)
    if (!csvUrl) {
      throw new Error('URL Google Sheet không hợp lệ.')
    }

    const response = await fetch(csvUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'LogiX-LMS-QuestionBank-Sync/1.0',
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Không tìm thấy Google Sheet. Vui lòng kiểm tra lại Sheet ID hoặc link.')
      }
      if (response.status === 401 || response.status === 403 || response.redirected) {
        throw new Error(
          'Không thể truy cập Google Sheet. Vui lòng chia sẻ trang tính với Service Account: lms-list-functions@lms-list-functions.iam.gserviceaccount.com hoặc đặt ở chế độ "Bất kỳ ai có liên kết đều có thể xem".'
        )
      }
      throw new Error(`Không thể kết nối đến Google Sheets (HTTP ${response.status})`)
    }

    return await response.text()
  }

  /**
   * Chuyển mảng 2 chiều thành chuỗi CSV có bọc dấu ngoặc kép an toàn
   */
  private rowsToCsv(rows: string[][]): string {
    return rows
      .map((row) =>
        row
          .map((cell) => {
            const str = String(cell ?? '')
            if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
              return `"${str.replace(/"/g, '""')}"`
            }
            return str
          })
          .join(',')
      )
      .join('\n')
  }

  /**
   * Phân tích nội dung CSV (từ Google Sheet hoặc file CSV upload)
   * Sử dụng Smart Header Detection để nhận diện cột linh hoạt
   */
  public parseCsv(csvText: string): ParseResult {
    const rows = this.splitCsvRows(csvText)
    if (rows.length <= 1) {
      return {
        questions: [],
        errors: [{ row: 1, error: 'File rỗng hoặc không có dòng dữ liệu nào ngoài tiêu đề' }],
      }
    }

    const header = rows[0].map((h) => h.trim().toLowerCase())

    // 1. Ánh xạ vị trí cột động theo tên tiêu đề (Smart Header Mapping)
    const colMap = {
      code: header.findIndex((h) => h === 'code' || h.includes('mã') || h.includes('id')),
      question: header.findIndex((h) => h === 'question' || h.includes('câu hỏi') || h.includes('nội dung')),
      type: header.findIndex((h) => h === 'type' || h.includes('loại')),
      difficulty: header.findIndex((h) => h === 'difficulty' || h.includes('độ khó')),
      points: header.findIndex((h) => h === 'points' || h.includes('điểm')),
      optA: header.findIndex((h) => h === 'option_a' || h === 'a' || h.includes('đáp án a')),
      optB: header.findIndex((h) => h === 'option_b' || h === 'b' || h.includes('đáp án b')),
      optC: header.findIndex((h) => h === 'option_c' || h === 'c' || h.includes('đáp án c')),
      optD: header.findIndex((h) => h === 'option_d' || h === 'd' || h.includes('đáp án d')),
      correct: header.findIndex((h) => h === 'correct_answer' || h === 'correct' || h.includes('đúng')),
      explanation: header.findIndex((h) => h === 'explanation' || h.includes('giải thích')),
      tags: header.findIndex((h) => h === 'tags' || h.includes('thẻ') || h.includes('tag')),
    }

    // Fallback sang vị trí mặc định 12 cột chuẩn nếu header không tìm thấy
    const getVal = (cols: string[], idx: number, fallbackIdx: number): string => {
      if (idx !== -1 && idx < cols.length) return cols[idx] || ''
      if (fallbackIdx < cols.length) return cols[fallbackIdx] || ''
      return ''
    }

    const questions: ParsedQuestion[] = []
    const errors: Array<{ row: number; code?: string; error: string }> = []

    // 2. Phân tích từng dòng dữ liệu (Row 1 trở đi)
    for (let i = 1; i < rows.length; i++) {
      const cols = rows[i].map((c) => c.trim())
      // Bỏ qua dòng hoàn toàn rỗng
      if (cols.every((c) => !c)) continue

      const rowNumber = i + 1
      const externalCode = getVal(cols, colMap.code, 0) || `Q${i}`
      const questionText = getVal(cols, colMap.question, 1)
      const rawType = getVal(cols, colMap.type, 2).toUpperCase()
      const rawDifficulty = getVal(cols, colMap.difficulty, 3).toUpperCase()
      const rawPoints = getVal(cols, colMap.points, 4)
      const optA = getVal(cols, colMap.optA, 5)
      const optB = getVal(cols, colMap.optB, 6)
      const optC = getVal(cols, colMap.optC, 7)
      const optD = getVal(cols, colMap.optD, 8)
      const rawCorrect = getVal(cols, colMap.correct, 9).toUpperCase()
      const explanation = getVal(cols, colMap.explanation, 10)
      const tags = getVal(cols, colMap.tags, 11)

      // Validation 1: Nội dung câu hỏi
      if (!questionText || questionText.length < 3) {
        errors.push({
          row: rowNumber,
          code: externalCode,
          error: 'Nội dung câu hỏi quá ngắn hoặc bị bỏ trống',
        })
        continue
      }

      // Validation 2: Ít nhất 2 phương án đáp án A và B
      if (!optA || !optB) {
        errors.push({
          row: rowNumber,
          code: externalCode,
          error: 'Câu hỏi phải có ít nhất 2 đáp án (A và B)',
        })
        continue
      }

      // Xây dựng danh sách options
      const rawOptions = [
        { key: 'A', text: optA },
        { key: 'B', text: optB },
        { key: 'C', text: optC },
        { key: 'D', text: optD },
      ].filter((o) => !!o.text)

      // Validation 3: Phải có đáp án đúng
      if (!rawCorrect) {
        errors.push({
          row: rowNumber,
          code: externalCode,
          error: 'Chưa chỉ định đáp án đúng (ví dụ: A, B, C hoặc D)',
        })
        continue
      }

      // Chuẩn hóa loại câu hỏi
      let questionType: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TRUE_FALSE' = 'SINGLE_CHOICE'
      if (rawType.includes('MULTI')) {
        questionType = 'MULTIPLE_CHOICE'
      } else if (rawType.includes('TRUE') || rawType.includes('TF')) {
        questionType = 'TRUE_FALSE'
      }

      // Chuẩn hóa độ khó
      let difficulty: 'EASY' | 'MEDIUM' | 'HARD' = 'MEDIUM'
      if (rawDifficulty.includes('EASY') || rawDifficulty.includes('DE') || rawDifficulty.includes('DỄ')) {
        difficulty = 'EASY'
      } else if (rawDifficulty.includes('HARD') || rawDifficulty.includes('KHO') || rawDifficulty.includes('KHÓ')) {
        difficulty = 'HARD'
      }

      // Chuẩn hóa điểm
      const points = Math.max(1, parseInt(rawPoints, 10) || 1)

      // Xử lý cờ isCorrect cho từng option
      const correctKeys = rawCorrect
        .split(/[,;|]/)
        .map((k) => k.trim().toUpperCase())
        .filter(Boolean)

      const options: ParsedQuestionOption[] = rawOptions.map((opt, idx) => ({
        optionText: opt.text,
        isCorrect: correctKeys.includes(opt.key) || correctKeys.includes(opt.text.toUpperCase()),
        sortOrder: idx + 1,
      }))

      // Nếu không có option nào khớp với đáp án đúng
      if (!options.some((o) => o.isCorrect)) {
        errors.push({
          row: rowNumber,
          code: externalCode,
          error: `Đáp án đúng "${rawCorrect}" không khớp với các lựa chọn (A, B, C, D)`,
        })
        continue
      }

      questions.push({
        externalCode,
        questionText,
        questionType,
        difficulty,
        points,
        explanation: explanation || undefined,
        tags: tags || undefined,
        options,
      })
    }

    return { questions, errors }
  }

  /**
   * Tách các dòng CSV, hỗ trợ ký tự xuống dòng bên trong dấu ngoặc kép
   */
  private splitCsvRows(csvText: string): string[][] {
    const cleanText = csvText.replace(/^\uFEFF/, '') // Gỡ bỏ UTF-8 BOM nếu có
    const rows: string[][] = []
    let currentRow: string[] = []
    let currentCell = ''
    let insideQuotes = false

    for (let i = 0; i < cleanText.length; i++) {
      const char = cleanText[i]
      const nextChar = cleanText[i + 1]

      if (char === '"') {
        if (insideQuotes && nextChar === '"') {
          currentCell += '"'
          i++
        } else {
          insideQuotes = !insideQuotes
        }
      } else if (char === ',' && !insideQuotes) {
        currentRow.push(currentCell)
        currentCell = ''
      } else if ((char === '\r' || char === '\n') && !insideQuotes) {
        if (char === '\r' && nextChar === '\n') {
          i++
        }
        currentRow.push(currentCell)
        currentCell = ''
        if (currentRow.some((c) => c.trim() !== '')) {
          rows.push(currentRow)
        }
        currentRow = []
      } else {
        currentCell += char
      }
    }

    if (currentCell || currentRow.length > 0) {
      currentRow.push(currentCell)
      if (currentRow.some((c) => c.trim() !== '')) {
        rows.push(currentRow)
      }
    }

    return rows
  }
}

export const questionParserService = new QuestionParserService()
