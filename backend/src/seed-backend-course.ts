import prisma from './config/prisma'

async function seedBackendCourse() {
  console.log('🚀 [Doc-Agent & BE-Agent] Bắt đầu khởi tạo Khóa học Backend Chuyên Nghiệp...')

  // 1. Tìm hoặc tạo Danh mục: Kỹ Thuật Phần Mềm & Backend
  let category = await prisma.category.findUnique({
    where: { code: 'TECH_BE' },
  })

  if (!category) {
    category = await prisma.category.create({
      data: {
        code: 'TECH_BE',
        name: 'Kỹ Thuật Phần Mềm & Backend',
        description: 'Lộ trình đào tạo kỹ sư Backend chuyên sâu: Kiến trúc hệ thống, Node.js, Express, PostgreSQL, REST API và Realtime SSE',
        sortOrder: 5,
        isActive: true,
      },
    })
    console.log('✅ Đã tạo Danh mục:', category.name)
  }

  // 2. Tìm hoặc dọn sạch khóa học cũ nếu đã tồn tại để cập nhật mới
  const existingCourse = await prisma.course.findUnique({
    where: { code: 'CRS-BE-01' },
    include: {
      modules: {
        include: {
          lessons: {
            include: {
              quiz: {
                include: {
                  questions: {
                    include: {
                      options: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  })

  if (existingCourse) {
    console.log('🔄 Đang làm mới khóa học cũ CRS-BE-01...')
    // Prisma cascade delete will clean up modules, lessons, quizzes, questions
    await prisma.course.delete({
      where: { id: existingCourse.id },
    })
  }

  // Tìm tác giả tạo khóa học
  const author = await prisma.user.findFirst({
    where: { email: { in: ['admin@bahung.com', 'admin@gmail.com'] } },
  })

  // 3. Tạo Khóa học chính (Course)
  const course = await prisma.course.create({
    data: {
      code: 'CRS-BE-01',
      title: 'Lập Trình Backend Chuyên Nghiệp (Node.js, Express, PostgreSQL & Clean Architecture)',
      slug: 'khoa-hoc-lap-trinh-backend-chuyen-nghiep',
      description:
        'Lộ trình đào tạo Backend Engineer toàn diện chuẩn doanh nghiệp: Từ giao thức mạng HTTP/HTTPS, RESTful API tiêu chuẩn, Node.js & TypeScript, phân tầng kiến trúc (Controller - Service - DTO), thiết kế Database PostgreSQL với Prisma ORM, xác thực JWT & RBAC, cho đến Realtime SSE và tư duy thiết kế hệ thống mở rộng sang C# .NET.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
      categoryId: category.id,
      courseType: 'STANDARD',
      level: 'INTERMEDIATE',
      isMandatory: false,
      durationDays: 45,
      progressionMode: 'FREE',
      isCommercial: false,
      isInternal: true,
      status: 'PUBLISHED',
      isActive: true,
      createdBy: author?.id,
      instructorId: author?.id || null,
      learningOutcomes: [
        'Nắm vững kiến trúc phân tầng 3-Tier chuẩn công nghiệp (Controller - Service - DTO - Repository)',
        'Thiết kế và tối ưu hóa Cơ sở dữ liệu PostgreSQL quan hệ với Prisma ORM',
        'Xây dựng hệ thống xác thực JWT, Refresh Token xoay vòng và phân quyền RBAC đa cấp bậc',
        'Lập trình giao tiếp thời gian thực hai chiều với Server-Sent Events (SSE) và tư duy mở rộng sang SignalR',
        'Tư duy thiết kế hệ thống Clean Architecture sẵn sàng refactor mở rộng sang C# .NET Core',
      ],
    },
  })

  console.log(`✅ Đã tạo Khóa học: ${course.title} (ID: ${course.id})`)

  // ==========================================
  // MODULE 1: NỀN TẢNG MẠNG & WEB ARCHITECTURE
  // ==========================================
  const mod1 = await prisma.courseModule.create({
    data: {
      courseId: course.id,
      title: 'Chương 1: Nền Tảng Mạng Máy Tính & Kiến Trúc Web Service',
      sortOrder: 1,
    },
  })

  // Bài 1.1: Video YouTube
  await prisma.lesson.create({
    data: {
      moduleId: mod1.id,
      title: '1.1 Tổng quan Kiến trúc Client - Server & Giao thức HTTP/HTTPS',
      description: 'Phân tích chi tiết mô hình Client - Server, cơ chế phân giải tên miền DNS, bắt tay 3 bước TCP 3-Way Handshake và bảo mật mã hóa đường truyền TLS/SSL.',
      lessonType: 'VIDEO',
      videoProvider: 'YOUTUBE',
      videoUrl: 'https://www.youtube.com/watch?v=iYM2zFP3Zn0',
      videoDuration: 720,
      sortOrder: 1,
      isVisible: true,
    },
  })

  // Bài 1.2: Article Rich Text
  await prisma.lesson.create({
    data: {
      moduleId: mod1.id,
      title: '1.2 Giải phẫu Vòng đời HTTP Request & Chuẩn Thiết kế RESTful API',
      description: 'Cấu trúc gói tin HTTP, phân loại Headers, Body, Query Parameters và nguyên tắc thiết kế RESTful chuẩn REST (Idempotency, Status Codes, ApiResponse template).',
      lessonType: 'ARTICLE',
      estimatedReadTime: 12,
      sortOrder: 2,
      isVisible: true,
      bodyHtml: `
<h2>1. Cấu trúc của một HTTP Request & Response</h2>
<p>Khi Client (trình duyệt web, ứng dụng di động) gửi yêu cầu đến Backend Server, gói tin HTTP bao gồm 4 thành phần chủ chốt:</p>
<ul>
  <li><strong>Request Line:</strong> Chứa HTTP Method (<code>GET</code>, <code>POST</code>, <code>PUT</code>, <code>DELETE</code>, <code>PATCH</code>) và đường dẫn tài nguyên (Path / URI).</li>
  <li><strong>Headers:</strong> Chứa siêu dữ liệu (Metadata) như <code>Content-Type: application/json</code>, <code>Authorization: Bearer &lt;token&gt;</code>, <code>User-Agent</code>, v.v.</li>
  <li><strong>Body (Payload):</strong> Dữ liệu được đóng gói dạng chuỗi JSON gửi kèm (chỉ xuất hiện trong <code>POST</code>, <code>PUT</code>, <code>PATCH</code>).</li>
  <li><strong>Query Parameters:</strong> Tham số lọc trên URL (ví dụ: <code>?page=1&limit=20&status=ACTIVE</code>).</li>
</ul>

<h2>2. 5 Nguyên Tắc Vàng Khi Thiết Kế RESTful API Chuẩn Doanh Nghiệp</h2>
<ol>
  <li><strong>Sử dụng danh từ số nhiều cho tài nguyên (Nouns, not Verbs):</strong> 
    <br/>❌ Tránh: <code>POST /api/createCourse</code> hoặc <code>GET /api/getAllUsers</code>
    <br/>✅ Chuẩn: <code>POST /api/courses</code> và <code>GET /api/users</code>
  </li>
  <li><strong>Tôn trọng tính lũy thừa (Idempotency):</strong>
    <p>Một phương thức được coi là <em>Idempotent</em> nếu thực thi 1 lần hay 1.000 lần liên tiếp thì trạng thái dữ liệu trên server vẫn không thay đổi:</p>
    <ul>
      <li><code>GET</code>, <code>PUT</code>, <code>DELETE</code>: Có tính lũy thừa.</li>
      <li><code>POST</code>: <strong>Không</strong> có tính lũy thừa (mỗi lần gọi sẽ tạo thêm 1 bản ghi mới).</li>
    </ul>
  </li>
  <li><strong>Sử dụng HTTP Status Codes chính xác:</strong>
    <ul>
      <li><code>200 OK</code>: Truy vấn hoặc cập nhật thành công.</li>
      <li><code>201 Created</code>: Tạo mới tài nguyên thành công.</li>
      <li><code>400 Bad Request</code>: Dữ liệu gửi lên sai định dạng (DTO validation thất bại).</li>
      <li><code>401 Unauthorized</code>: Chưa đăng nhập hoặc Access Token không hợp lệ/hết hạn.</li>
      <li><code>403 Forbidden</code>: Đã đăng nhập nhưng không có quyền thực thi tác vụ này.</li>
      <li><code>404 Not Found</code>: Không tìm thấy tài nguyên trong cơ sở dữ liệu.</li>
      <li><code>500 Internal Server Error</code>: Lỗi máy chủ ngoài dự kiến (cần log vào file/Sentry).</li>
    </ul>
  </li>
  <li><strong>Chuẩn hóa khuôn mẫu Response (Standard Envelope):</strong>
    <p>Luôn bọc kết quả trả về trong một định dạng đồng nhất:</p>
    <pre><code class="language-json">{
  "isSuccess": true,
  "statusCode": 200,
  "message": "Lấy thông tin thành công",
  "data": { ... },
  "errors": null
}</code></pre>
  </li>
</ol>
      `,
    },
  })

  // Bài 1.3: Quiz Lesson
  const quizL1 = await prisma.lesson.create({
    data: {
      moduleId: mod1.id,
      title: '1.3 Bài kiểm tra: Nền tảng Mạng & Chuẩn RESTful API',
      description: 'Đề thi trắc nghiệm 4 câu hỏi đánh giá mức độ am hiểu về giao thức HTTP, tính Idempotency và chuẩn REST API.',
      lessonType: 'QUIZ',
      sortOrder: 3,
      isVisible: true,
    },
  })

  const quiz1 = await prisma.quiz.create({
    data: {
      lessonId: quizL1.id,
      title: 'Bài kiểm tra Chương 1: Nền tảng Mạng & RESTful API',
      passScore: 80,
      timeLimitMinutes: 15,
      maxAttempts: 3,
      shuffleQuestions: true,
      showAnswerFeedback: true,
    },
  })

  // Q1.1
  const q1_1 = await prisma.quizQuestion.create({
    data: {
      quizId: quiz1.id,
      questionText: 'Trong các HTTP Method sau đây, phương thức nào KHÔNG có tính lũy thừa (Non-idempotent)?',
      questionType: 'SINGLE_CHOICE',
      points: 2.5,
      explanation: 'POST không có tính lũy thừa vì mỗi lần gửi một request POST hợp lệ, server sẽ tạo ra một bản ghi mới trong cơ sở dữ liệu.',
      sortOrder: 1,
    },
  })
  await prisma.quizQuestionOption.createMany({
    data: [
      { questionId: q1_1.id, optionText: 'POST', isCorrect: true, sortOrder: 1 },
      { questionId: q1_1.id, optionText: 'GET', isCorrect: false, sortOrder: 2 },
      { questionId: q1_1.id, optionText: 'PUT', isCorrect: false, sortOrder: 3 },
      { questionId: q1_1.id, optionText: 'DELETE', isCorrect: false, sortOrder: 4 },
    ],
  })

  // Q1.2
  const q1_2 = await prisma.quizQuestion.create({
    data: {
      quizId: quiz1.id,
      questionText: 'Mã trạng thái HTTP nào biểu thị người dùng đã xác thực danh tính nhưng không có quyền truy cập vào tài nguyên (Access Denied)?',
      questionType: 'SINGLE_CHOICE',
      points: 2.5,
      explanation: '401 là chưa đăng nhập (Unauthorized), trong khi 403 (Forbidden) chỉ việc server hiểu người gửi là ai nhưng từ chối cấp quyền thực hiện.',
      sortOrder: 2,
    },
  })
  await prisma.quizQuestionOption.createMany({
    data: [
      { questionId: q1_2.id, optionText: '403 Forbidden', isCorrect: true, sortOrder: 1 },
      { questionId: q1_2.id, optionText: '401 Unauthorized', isCorrect: false, sortOrder: 2 },
      { questionId: q1_2.id, optionText: '400 Bad Request', isCorrect: false, sortOrder: 3 },
      { questionId: q1_2.id, optionText: '404 Not Found', isCorrect: false, sortOrder: 4 },
    ],
  })

  // Q1.3: MULTIPLE_CHOICE
  const q1_3 = await prisma.quizQuestion.create({
    data: {
      quizId: quiz1.id,
      questionText: 'Những thực hành nào sau đây là chuẩn mực khi thiết kế RESTful API? (Chọn tất cả các đáp án đúng)',
      questionType: 'MULTIPLE_CHOICE',
      points: 2.5,
      explanation: 'REST API nên dùng danh từ số nhiều, sử dụng HTTP status code chính xác và bọc dữ liệu trong khuôn chuẩn. Tránh đưa động từ vào URI.',
      sortOrder: 3,
    },
  })
  await prisma.quizQuestionOption.createMany({
    data: [
      { questionId: q1_3.id, optionText: 'Sử dụng danh từ số nhiều cho Endpoint (ví dụ /api/courses thay vì /api/createCourse)', isCorrect: true, sortOrder: 1 },
      { questionId: q1_3.id, optionText: 'Sử dụng HTTP Status Code 201 Created khi tạo mới tài nguyên thành công', isCorrect: true, sortOrder: 2 },
      { questionId: q1_3.id, optionText: 'Luôn trả về mã 200 OK cho mọi request và để mã lỗi bên trong body', isCorrect: false, sortOrder: 3 },
      { questionId: q1_3.id, optionText: 'Hỗ trợ lọc dữ liệu thông qua Query Parameters (ví dụ ?limit=10&page=1)', isCorrect: true, sortOrder: 4 },
    ],
  })

  // Q1.4: TRUE_FALSE
  const q1_4 = await prisma.quizQuestion.create({
    data: {
      quizId: quiz1.id,
      questionText: 'Quá trình bắt tay 3 bước TCP (3-Way Handshake) bao gồm các gói tin theo thứ tự: SYN -> SYN-ACK -> ACK. Đúng hay Sai?',
      questionType: 'SINGLE_CHOICE',
      points: 2.5,
      explanation: 'Chính xác. TCP 3-Way Handshake bắt đầu bằng Client gửi SYN, Server phản hồi SYN-ACK, và Client xác nhận bằng ACK trước khi dữ liệu được truyền.',
      sortOrder: 4,
    },
  })
  await prisma.quizQuestionOption.createMany({
    data: [
      { questionId: q1_4.id, optionText: 'Đúng', isCorrect: true, sortOrder: 1 },
      { questionId: q1_4.id, optionText: 'Sai', isCorrect: false, sortOrder: 2 },
    ],
  })

  // ==========================================
  // MODULE 2: NODE.JS, EXPRESS & KIẾN TRÚC 3 TẦNG
  // ==========================================
  const mod2 = await prisma.courseModule.create({
    data: {
      courseId: course.id,
      title: 'Chương 2: Node.js Core, Express.js & Kiến Trúc Phân Tầng Thực Chiến',
      sortOrder: 2,
    },
  })

  // Bài 2.1: Video
  await prisma.lesson.create({
    data: {
      moduleId: mod2.id,
      title: '2.1 Thiết lập Dự án Express.js với TypeScript & Clean Architecture',
      description: 'Khởi tạo monorepo pnpm, cấu hình tsconfig cho backend, quản lý biến môi trường với dotenv và tổ chức thư mục module-based.',
      lessonType: 'VIDEO',
      videoProvider: 'YOUTUBE',
      videoUrl: 'https://www.youtube.com/watch?v=1r-F3FION18',
      videoDuration: 900,
      sortOrder: 1,
      isVisible: true,
    },
  })

  // Bài 2.2: Article
  await prisma.lesson.create({
    data: {
      moduleId: mod2.id,
      title: '2.2 Phân tầng Kiến trúc Chuẩn mực: DTO vs Controller vs Service vs Repository',
      description: 'Đi sâu vào nguyên lý đơn trách nhiệm (Single Responsibility Principle): Phân định rõ ranh giới giữa tầng điều hướng, tầng xác thực dữ liệu và tầng nghiệp vụ.',
      lessonType: 'ARTICLE',
      estimatedReadTime: 15,
      sortOrder: 2,
      isVisible: true,
      bodyHtml: `
<h2>1. Tại sao cần Kiến trúc Phân Tầng (Layered Architecture)?</h2>
<p>Khi ứng dụng nhỏ, ta có xu hướng viết tất cả code xác thực, truy vấn database và xử lý phản hồi ngay trong callback của route: <code>app.post('/api/users', async (req, res) => { ... })</code>. Cách viết này (Fat Controller / Spaghetti Code) sẽ khiến code không thể tái sử dụng, không thể viết Unit Test và cực kỳ khó refactor.</p>

<h2>2. 4 Tầng Trọng Yếu Trong Dự Án LogiX</h2>

<h3>Tầng 1: Route & DTO (Data Transfer Object)</h3>
<p><strong>Nhiệm vụ:</strong> Định tuyến và kiểm tra dữ liệu đầu vào. DTO sử dụng <code>Zod</code> để thiết lập khuôn mẫu nghiêm ngặt:</p>
<pre><code class="language-typescript">// lesson-comment.dto.ts
import { z } from 'zod'

export const createCommentSchema = z.object({
  body: z.object({
    content: z.string().trim().min(1, 'Nội dung bắt buộc').max(2000),
    parentId: z.string().uuid().nullable().optional(),
    replyToUserId: z.string().uuid().nullable().optional(),
  }),
})

export type CreateCommentInput = z.infer<typeof createCommentSchema>['body']
</code></pre>
<p><em>Lợi ích:</em> Ngăn chặn lỗi bảo mật <strong>Mass Assignment Vulnerability</strong> (kẻ xấu không thể tự ý chèn thêm các trường quản trị như <code>isInstructorReply: true</code>).</p>

<h3>Tầng 2: Controller (HTTP Dispatcher)</h3>
<p><strong>Nhiệm vụ:</strong> Tiếp nhận request HTTP, bóc tách tham số, ủy quyền cho Service thực thi và trả về response chuẩn hóa:</p>
<pre><code class="language-typescript">// lesson-comment.controller.ts
export class LessonCommentController {
  public createComment = async (req: AuthenticatedRequest, res: Response) => {
    const comment = await lessonCommentService.createComment(
      req.params.lessonId,
      req.user!.id,
      req.body
    )
    return res.status(HttpStatus.CREATED).json(
      ApiResponse.success(comment, 'Đăng bình luận thành công', HttpStatus.CREATED)
    )
  }
}
</code></pre>

<h3>Tầng 3: Service (Business Logic Core)</h3>
<p><strong>Nhiệm vụ:</strong> Nắm giữ 100% logic kinh doanh. Tầng Service không hề biết đến các đối tượng <code>req</code> hay <code>res</code> của Express:</p>
<pre><code class="language-typescript">// lesson-comment.service.ts
export class LessonCommentService {
  async createComment(lessonId: string, userId: string, input: CreateCommentInput) {
    // 1. Kiểm tra bài học tồn tại
    // 2. Xác định vai trò Giảng viên (Role Trainer/Admin)
    // 3. Giữ tối đa 2 cấp hiển thị (Flatten Parent ID)
    // 4. Lưu DB qua Prisma
    // 5. Gửi thông báo Realtime nếu có người được trả lời
  }
}
</code></pre>
      `,
    },
  })

  // Bài 2.3: Article
  await prisma.lesson.create({
    data: {
      moduleId: mod2.id,
      title: '2.3 Xử lý Lỗi Tập Trung (Global Error Handling) & Async Middleware',
      description: 'Kỹ thuật bắt lỗi tập trung trong Express: Sử dụng async wrapper asyncHandler và Global Error Middleware để loại bỏ khối try-catch trùng lặp.',
      lessonType: 'ARTICLE',
      estimatedReadTime: 10,
      sortOrder: 3,
      isVisible: true,
      bodyHtml: `
<h2>Vấn đề: Try-Catch bừa bãi trong Controller</h2>
<p>Trong các dự án thiếu chuẩn mực, mỗi hàm controller thường bị bao bọc bởi một khối <code>try { ... } catch (err) { res.status(500).json(...) }</code> lặp đi lặp lại hàng trăm lần.</p>

<h2>Giải pháp 1: Async Handler Wrapper</h2>
<p>Tạo một higher-order function để tự động chuyển mọi lỗi async về middleware xử lý lỗi tiếp theo qua <code>next(error)</code>:</p>
<pre><code class="language-typescript">// common/utils/async-handler.ts
import { Request, Response, NextFunction } from 'express'

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
</code></pre>

<h2>Giải pháp 2: Global Error Middleware</h2>
<p>Đặt middleware này ở cuối cùng trong file <code>index.ts</code> để bắt trọn mọi loại lỗi:</p>
<pre><code class="language-typescript">app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[Error Occurred]:', err)

  // 1. Lỗi kiểm thực Zod
  if (err instanceof ZodError) {
    return res.status(400).json(ApiResponse.error('Dữ liệu không hợp lệ', 400, err.flatten().fieldErrors))
  }

  // 2. Lỗi Prisma ORM
  if (err.code === 'P2002') {
    return res.status(409).json(ApiResponse.error('Bản ghi đã tồn tại (trùng lặp khóa duy nhất)', 409))
  }

  // 3. Lỗi hệ thống mặc định
  return res.status(500).json(ApiResponse.error(err.message || 'Lỗi máy chủ nội bộ', 500))
})
</code></pre>
      `,
    },
  })

  // Bài 2.4: Quiz
  const quizL2 = await prisma.lesson.create({
    data: {
      moduleId: mod2.id,
      title: '2.4 Bài kiểm tra: Tư duy Phân tầng & Node.js Runtime',
      description: 'Đề thi trắc nghiệm đánh giá hiểu biết về DTO, Controller, Service và cơ chế bắt lỗi tập trung.',
      lessonType: 'QUIZ',
      sortOrder: 4,
      isVisible: true,
    },
  })

  const quiz2 = await prisma.quiz.create({
    data: {
      lessonId: quizL2.id,
      title: 'Bài kiểm tra Chương 2: Kiến trúc Phân tầng & Xử lý Lỗi',
      passScore: 80,
      timeLimitMinutes: 15,
      maxAttempts: 3,
      shuffleQuestions: true,
      showAnswerFeedback: true,
    },
  })

  // Q2.1
  const q2_1 = await prisma.quizQuestion.create({
    data: {
      quizId: quiz2.id,
      questionText: 'Trong kiến trúc 3 tầng chuẩn mực, tầng nào chịu trách nhiệm giao tiếp trực tiếp với cơ sở dữ liệu và chứa đựng các quy tắc nghiệp vụ cốt lõi?',
      questionType: 'SINGLE_CHOICE',
      points: 2.5,
      explanation: 'Tầng Service là nơi chứa 100% logic nghiệp vụ và truy vấn cơ sở dữ liệu qua ORM/Repository. Controller chỉ điều phối HTTP.',
      sortOrder: 1,
    },
  })
  await prisma.quizQuestionOption.createMany({
    data: [
      { questionId: q2_1.id, optionText: 'Service Layer', isCorrect: true, sortOrder: 1 },
      { questionId: q2_1.id, optionText: 'Controller Layer', isCorrect: false, sortOrder: 2 },
      { questionId: q2_1.id, optionText: 'Route Layer', isCorrect: false, sortOrder: 3 },
      { questionId: q2_1.id, optionText: 'DTO Layer', isCorrect: false, sortOrder: 4 },
    ],
  })

  // Q2.2
  const q2_2 = await prisma.quizQuestion.create({
    data: {
      quizId: quiz2.id,
      questionText: 'Mục đích chính của việc sử dụng Zod Schema làm DTO (Data Transfer Object) ở Backend là gì?',
      questionType: 'SINGLE_CHOICE',
      points: 2.5,
      explanation: 'Zod DTO vừa kiểm thực tính toàn vẹn của dữ liệu ở Runtime, vừa sinh ra Type an toàn ở Compile-time, đồng thời chặn đứng lỗ hổng Mass Assignment.',
      sortOrder: 2,
    },
  })
  await prisma.quizQuestionOption.createMany({
    data: [
      { questionId: q2_2.id, optionText: 'Xác thực định dạng dữ liệu đầu vào và ngăn chặn lỗ hổng Mass Assignment', isCorrect: true, sortOrder: 1 },
      { questionId: q2_2.id, optionText: 'Thay thế hoàn toàn cơ sở dữ liệu PostgreSQL', isCorrect: false, sortOrder: 2 },
      { questionId: q2_2.id, optionText: 'Tăng tốc độ mạng bằng cách nén ảnh', isCorrect: false, sortOrder: 3 },
      { questionId: q2_2.id, optionText: 'Tự động tạo giao diện người dùng trên trình duyệt', isCorrect: false, sortOrder: 4 },
    ],
  })

  // Q2.3
  const q2_3 = await prisma.quizQuestion.create({
    data: {
      quizId: quiz2.id,
      questionText: 'Trong Express.js, một Global Error Handling Middleware bắt buộc phải khai báo bao nhiêu tham số trong hàm callback?',
      questionType: 'SINGLE_CHOICE',
      points: 2.5,
      explanation: 'Express nhận diện một middleware là error handler khi và chỉ khi nó có đúng 4 tham số: (err, req, res, next).',
      sortOrder: 3,
    },
  })
  await prisma.quizQuestionOption.createMany({
    data: [
      { questionId: q2_3.id, optionText: 'Đúng 4 tham số: (err, req, res, next)', isCorrect: true, sortOrder: 1 },
      { questionId: q2_3.id, optionText: '2 tham số: (req, res)', isCorrect: false, sortOrder: 2 },
      { questionId: q2_3.id, optionText: '3 tham số: (req, res, next)', isCorrect: false, sortOrder: 3 },
      { questionId: q2_3.id, optionText: '1 tham số duy nhất: (err)', isCorrect: false, sortOrder: 4 },
    ],
  })

  // Q2.4
  const q2_4 = await prisma.quizQuestion.create({
    data: {
      quizId: quiz2.id,
      questionText: 'Wrapper asyncHandler giúp bắt các ngoại lệ bất đồng bộ (unhandled promise rejections) và tự động chuyển về Global Error Middleware bằng hàm nào?',
      questionType: 'SINGLE_CHOICE',
      points: 2.5,
      explanation: 'Khi promise bị reject, .catch(next) sẽ đưa lỗi vào hàm next() để Express chuyển tới error middleware.',
      sortOrder: 4,
    },
  })
  await prisma.quizQuestionOption.createMany({
    data: [
      { questionId: q2_4.id, optionText: 'next(error)', isCorrect: true, sortOrder: 1 },
      { questionId: q2_4.id, optionText: 'res.send(error)', isCorrect: false, sortOrder: 2 },
      { questionId: q2_4.id, optionText: 'process.exit(1)', isCorrect: false, sortOrder: 3 },
      { questionId: q2_4.id, optionText: 'throw error', isCorrect: false, sortOrder: 4 },
    ],
  })

  // ==========================================
  // MODULE 3: POSTGRESQL & PRISMA ORM
  // ==========================================
  const mod3 = await prisma.courseModule.create({
    data: {
      courseId: course.id,
      title: 'Chương 3: Cơ Sở Dữ Liệu Quan Hệ (PostgreSQL) & Prisma ORM',
      sortOrder: 3,
    },
  })

  // Bài 3.1: Video
  await prisma.lesson.create({
    data: {
      moduleId: mod3.id,
      title: '3.1 Thiết kế Cơ Sở Dữ Liệu Quan Hệ: Khóa Chính, Khóa Ngoại & Indexing',
      description: 'Các dạng chuẩn hóa dữ liệu 1NF - 3NF, so sánh hiệu năng giữa UUID v4 và Auto-Increment Serial, kỹ thuật đánh Index B-Tree để tối ưu hóa truy vấn hàng triệu bản ghi.',
      lessonType: 'VIDEO',
      videoProvider: 'YOUTUBE',
      videoUrl: 'https://www.youtube.com/watch?v=Q1b_8gL_b3U',
      videoDuration: 850,
      sortOrder: 1,
      isVisible: true,
    },
  })

  // Bài 3.2: Article
  await prisma.lesson.create({
    data: {
      moduleId: mod3.id,
      title: '3.2 Làm Chủ Prisma ORM: Relations, Cascade Deletion & Database Transactions',
      description: 'Kỹ thuật khai báo quan hệ 1-N, Self-relation (Adjacency list), cơ chế xóa liên hoàn onDelete: Cascade và bảo toàn tính toàn vẹn dữ liệu (ACID) với prisma.$transaction.',
      lessonType: 'ARTICLE',
      estimatedReadTime: 15,
      sortOrder: 2,
      isVisible: true,
      bodyHtml: `
<h2>1. Mô hình Cây Tự Tham Chiếu (Self-Relation / Adjacency List)</h2>
<p>Khi thiết kế tính năng thảo luận đa cấp (Bình luận cha $\rightarrow$ Phản hồi con), ta sử dụng quan hệ tự trỏ lại chính bảng đó:</p>
<pre><code class="language-prisma">model LessonComment {
  id        String          @id @default(uuid())
  lessonId  String          @map("lesson_id")
  parentId  String?         @map("parent_id")
  parent    LessonComment?  @relation("CommentReplies", fields: [parentId], references: [id], onDelete: Cascade)
  replies   LessonComment[] @relation("CommentReplies")
  
  content   String
  @@index([lessonId, parentId])
}
</code></pre>

<h2>2. Tại sao onDelete: Cascade là tối quan trọng?</h2>
<p>Nếu không có <code>onDelete: Cascade</code>, khi ta xóa một bình luận cha, hệ thống PostgreSQL sẽ bắn lỗi vi phạm ràng buộc khóa ngoại (Foreign Key Constraint Violation) vì các bản ghi con vẫn đang trỏ tới ID vừa bị xóa. Nhờ Cascade, toàn bộ câu trả lời con và lượt thích (Likes) liên quan sẽ được cơ sở dữ liệu dọn sạch tự động.</p>

<h2>3. Giao dịch Cơ sở dữ liệu (Database Transactions)</h2>
<p>Khi người dùng bấm "Thích" (Like) một bình luận, ta phải thực hiện 2 thao tác đồng thời: thêm bản ghi vào bảng <code>crs_lesson_comment_likes</code> và tăng cột <code>likes_count</code> trong bảng <code>crs_lesson_comments</code>.</p>
<p>Nếu một trong hai thao tác thất bại, hệ thống sẽ rơi vào trạng thái dữ liệu không nhất quán. Để giải quyết, ta bọc trong <code>prisma.$transaction</code>:</p>
<pre><code class="language-typescript">await prisma.$transaction([
  prisma.lessonCommentLike.create({
    data: { commentId, userId }
  }),
  prisma.lessonComment.update({
    where: { id: commentId },
    data: { likesCount: { increment: 1 } }
  })
])
</code></pre>
      `,
    },
  })

  // Bài 3.3: Quiz
  const quizL3 = await prisma.lesson.create({
    data: {
      moduleId: mod3.id,
      title: '3.3 Bài kiểm tra: PostgreSQL, Indexing & Prisma Transactions',
      description: 'Đánh giá kiến thức về tính toàn vẹn dữ liệu ACID, chỉ mục Index và quan hệ Cascade trong cơ sở dữ liệu quan hệ.',
      lessonType: 'QUIZ',
      sortOrder: 3,
      isVisible: true,
    },
  })

  const quiz3 = await prisma.quiz.create({
    data: {
      lessonId: quizL3.id,
      title: 'Bài kiểm tra Chương 3: Cơ sở dữ liệu & Prisma ORM',
      passScore: 80,
      timeLimitMinutes: 15,
      maxAttempts: 3,
      shuffleQuestions: true,
      showAnswerFeedback: true,
    },
  })

  // Q3.1
  const q3_1 = await prisma.quizQuestion.create({
    data: {
      quizId: quiz3.id,
      questionText: 'Khi cấu hình "onDelete: Cascade" cho quan hệ khóa ngoại, điều gì sẽ xảy ra khi bản ghi ở bảng cha bị xóa?',
      questionType: 'SINGLE_CHOICE',
      points: 2.5,
      explanation: 'onDelete: Cascade đảm bảo tất cả các bản ghi con phụ thuộc vào khóa ngoại đó sẽ được tự động xóa theo, ngăn ngừa hiện tượng dữ liệu mồ côi (orphan rows).',
      sortOrder: 1,
    },
  })
  await prisma.quizQuestionOption.createMany({
    data: [
      { questionId: q3_1.id, optionText: 'Tất cả các bản ghi con liên kết sẽ tự động bị xóa theo', isCorrect: true, sortOrder: 1 },
      { questionId: q3_1.id, optionText: 'Cơ sở dữ liệu báo lỗi và ngăn không cho xóa bảng cha', isCorrect: false, sortOrder: 2 },
      { questionId: q3_1.id, optionText: 'Khóa ngoại ở các bản ghi con tự động chuyển thành NULL', isCorrect: false, sortOrder: 3 },
      { questionId: q3_1.id, optionText: 'Bản ghi cha bị xóa nhưng bản ghi con vẫn tồn tại bình thường', isCorrect: false, sortOrder: 4 },
    ],
  })

  // Q3.2
  const q3_2 = await prisma.quizQuestion.create({
    data: {
      quizId: quiz3.id,
      questionText: 'Trong 4 tính chất ACID của Transaction, chữ cái "A" (Atomicity - Tính nguyên tử) có ý nghĩa gì?',
      questionType: 'SINGLE_CHOICE',
      points: 2.5,
      explanation: 'Tính nguyên tử bảo đảm toàn bộ các thao tác trong một transaction phải thành công 100%, nếu có bất kỳ thao tác nào lỗi thì toàn bộ dữ liệu sẽ được hoàn tác (Rollback).',
      sortOrder: 2,
    },
  })
  await prisma.quizQuestionOption.createMany({
    data: [
      { questionId: q3_2.id, optionText: 'Tất cả thao tác cùng thành công hoặc cùng thất bại hoàn toàn (All or Nothing)', isCorrect: true, sortOrder: 1 },
      { questionId: q3_2.id, optionText: 'Tốc độ thực thi nhanh như năng lượng nguyên tử', isCorrect: false, sortOrder: 2 },
      { questionId: q3_2.id, optionText: 'Dữ liệu được lưu trữ tự động trên đám mây', isCorrect: false, sortOrder: 3 },
      { questionId: q3_2.id, optionText: 'Mỗi bảng bắt buộc phải có một khóa chính duy nhất', isCorrect: false, sortOrder: 4 },
    ],
  })

  // Q3.3
  const q3_3 = await prisma.quizQuestion.create({
    data: {
      quizId: quiz3.id,
      questionText: 'Khi nào chúng ta NÊN đánh chỉ mục (Index) cho một cột trong cơ sở dữ liệu?',
      questionType: 'SINGLE_CHOICE',
      points: 2.5,
      explanation: 'Index tăng tốc độ đọc dữ liệu (WHERE, JOIN, ORDER BY) nhưng làm chậm thao tác ghi (INSERT, UPDATE). Do đó nên đánh index cho các cột thường xuyên xuất hiện trong điều kiện lọc.',
      sortOrder: 3,
    },
  })
  await prisma.quizQuestionOption.createMany({
    data: [
      { questionId: q3_3.id, optionText: 'Cột thường xuyên được sử dụng trong mệnh đề WHERE, JOIN và ORDER BY', isCorrect: true, sortOrder: 1 },
      { questionId: q3_3.id, optionText: 'Tất cả mọi cột trong mọi bảng đều phải đánh index', isCorrect: false, sortOrder: 2 },
      { questionId: q3_3.id, optionText: 'Chỉ các cột lưu dữ liệu văn bản dung lượng lớn (TEXT / BLOB)', isCorrect: false, sortOrder: 3 },
      { questionId: q3_3.id, optionText: 'Chỉ các cột có giá trị liên tục thay đổi mỗi giây', isCorrect: false, sortOrder: 4 },
    ],
  })

  // Q3.4
  const q3_4 = await prisma.quizQuestion.create({
    data: {
      quizId: quiz3.id,
      questionText: 'Hiện tượng "N+1 Query Problem" thường xảy ra khi nào trong các công cụ ORM?',
      questionType: 'SINGLE_CHOICE',
      points: 2.5,
      explanation: 'Khi truy vấn 1 danh sách N bản ghi cha, rồi lặp qua từng phần tử để gửi thêm N câu truy vấn lấy dữ liệu con thay vì dùng JOIN hoặc include.',
      sortOrder: 4,
    },
  })
  await prisma.quizQuestionOption.createMany({
    data: [
      { questionId: q3_4.id, optionText: 'Khi truy vấn 1 danh sách cha và gửi thêm N câu truy vấn con lặp lại trong vòng lặp', isCorrect: true, sortOrder: 1 },
      { questionId: q3_4.id, optionText: 'Khi cơ sở dữ liệu có hơn N+1 bảng liên kết', isCorrect: false, sortOrder: 2 },
      { questionId: q3_4.id, optionText: 'Khi số lượng người dùng vượt quá dung lượng RAM', isCorrect: false, sortOrder: 3 },
      { questionId: q3_4.id, optionText: 'Khi một bảng có N khóa ngoại và 1 khóa chính', isCorrect: false, sortOrder: 4 },
    ],
  })

  // ==========================================
  // MODULE 4: XÁC THỰC, RBAC & BẢO MẬT
  // ==========================================
  const mod4 = await prisma.courseModule.create({
    data: {
      courseId: course.id,
      title: 'Chương 4: Xác Thực (Authentication), Phân Quyền (RBAC) & Bảo Mật Web',
      sortOrder: 4,
    },
  })

  // Bài 4.1: Video
  await prisma.lesson.create({
    data: {
      moduleId: mod4.id,
      title: '4.1 Cơ Chế Xác Thực JWT: Access Token, Refresh Token & Token Rotation',
      description: 'Cấu trúc 3 phần của JSON Web Token (Header.Payload.Signature), giải pháp lưu trữ an toàn (HttpOnly Cookie vs Memory) và quy trình cấp phát lại token không gián đoạn.',
      lessonType: 'VIDEO',
      videoProvider: 'YOUTUBE',
      videoUrl: 'https://www.youtube.com/watch?v=mbsmsi7l3r4',
      videoDuration: 780,
      sortOrder: 1,
      isVisible: true,
    },
  })

  // Bài 4.2: Article
  await prisma.lesson.create({
    data: {
      moduleId: mod4.id,
      title: '4.2 Thiết Kế Hệ Thống Phân Quyền Động RBAC (Role-Based Access Control) & Data Scoping',
      description: 'Mô hình phân quyền doanh nghiệp: Phân tách User - Role - Permission, viết Middleware kiểm tra quyền requirePermission và cô lập dữ liệu theo chi nhánh (Store Data Scoping).',
      lessonType: 'ARTICLE',
      estimatedReadTime: 12,
      sortOrder: 2,
      isVisible: true,
      bodyHtml: `
<h2>1. Mô hình Phân Quyền Động (Dynamic RBAC)</h2>
<p>Thay vì hardcode vai trò tĩnh trong code (<code>if (user.role === 'ADMIN')</code>), hệ thống LogiX xây dựng bảng phân quyền linh hoạt theo mô hình:</p>
<p><strong>User</strong> $\leftrightarrow$ <strong>UserRole</strong> $\leftrightarrow$ <strong>Role</strong> $\leftrightarrow$ <strong>RolePermission</strong> $\leftrightarrow$ <strong>Permission</strong></p>

<h2>2. Viết Middleware Kiểm Tra Quyền (requirePermission)</h2>
<pre><code class="language-typescript">// middlewares/permission.middleware.ts
export const requirePermission = (permissionCode: string) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userRoles = await prisma.userRole.findMany({
      where: { userId: req.user!.id },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: { permission: true }
            }
          }
        }
      }
    })

    const hasPerm = userRoles.some(ur => 
      ur.role.rolePermissions.some(rp => rp.permission.permissionCode === permissionCode)
    )

    if (!hasPerm && req.user!.userType !== 'SYSTEM_ADMIN') {
      return res.status(403).json(ApiResponse.error('Bạn không có quyền thực hiện thao tác này', 403))
    }

    next()
  }
}
</code></pre>
      `,
    },
  })

  // Bài 4.3: Quiz
  const quizL4 = await prisma.lesson.create({
    data: {
      moduleId: mod4.id,
      title: '4.3 Bài kiểm tra: Bảo mật Web & Phân quyền RBAC',
      description: 'Kiểm tra kiến thức về các lỗ hổng OWASP Top 10 (SQL Injection, XSS, CSRF) và quy chuẩn mã hóa mật khẩu với Bcrypt.',
      lessonType: 'QUIZ',
      sortOrder: 3,
      isVisible: true,
    },
  })

  const quiz4 = await prisma.quiz.create({
    data: {
      lessonId: quizL4.id,
      title: 'Bài kiểm tra Chương 4: Bảo mật & Phân quyền',
      passScore: 80,
      timeLimitMinutes: 15,
      maxAttempts: 3,
      shuffleQuestions: true,
      showAnswerFeedback: true,
    },
  })

  // Q4.1
  const q4_1 = await prisma.quizQuestion.create({
    data: {
      quizId: quiz4.id,
      questionText: 'Tại sao Access Token JWT nên có thời gian hết hạn ngắn (ví dụ: 15 phút) thay vì vài tuần hoặc vài tháng?',
      questionType: 'SINGLE_CHOICE',
      points: 2.5,
      explanation: 'Access Token là token tự chứa thông tin (stateless). Nếu token bị rò rỉ hoặc đánh cắp, thời hạn ngắn sẽ giảm thiểu tối đa cửa sổ thời gian hacker có thể lợi dụng trước khi token vô hiệu lực.',
      sortOrder: 1,
    },
  })
  await prisma.quizQuestionOption.createMany({
    data: [
      { questionId: q4_1.id, optionText: 'Hạn chế thiệt hại nếu token bị kẻ xấu đánh cắp qua mạng', isCorrect: true, sortOrder: 1 },
      { questionId: q4_1.id, optionText: 'Để tiết kiệm dung lượng lưu trữ trên máy chủ', isCorrect: false, sortOrder: 2 },
      { questionId: q4_1.id, optionText: 'Vì trình duyệt tự động xóa token sau 15 phút', isCorrect: false, sortOrder: 3 },
      { questionId: q4_1.id, optionText: 'Để tăng tốc độ mã hóa mật khẩu Bcrypt', isCorrect: false, sortOrder: 4 },
    ],
  })

  // Q4.2
  const q4_2 = await prisma.quizQuestion.create({
    data: {
      quizId: quiz4.id,
      questionText: 'Kỹ thuật nào sau đây giúp phòng chống hiệu quả nhất cuộc tấn công XSS (Cross-Site Scripting) khi lưu trữ JWT Token?',
      questionType: 'SINGLE_CHOICE',
      points: 2.5,
      explanation: 'Cookie được gắn cờ HttpOnly sẽ ngăn cản JavaScript trên trình duyệt (kể cả mã độc XSS) truy cập vào token qua document.cookie.',
      sortOrder: 2,
    },
  })
  await prisma.quizQuestionOption.createMany({
    data: [
      { questionId: q4_2.id, optionText: 'Lưu trữ Token trong HttpOnly Cookie kèm cờ Secure và SameSite', isCorrect: true, sortOrder: 1 },
      { questionId: q4_2.id, optionText: 'Lưu trữ Token trong LocalStorage của trình duyệt', isCorrect: false, sortOrder: 2 },
      { questionId: q4_2.id, optionText: 'Mã hóa token bằng Base64 trước khi in ra HTML', isCorrect: false, sortOrder: 3 },
      { questionId: q4_2.id, optionText: 'Gửi token qua URL Query Parameter', isCorrect: false, sortOrder: 4 },
    ],
  })

  // Q4.3
  const q4_3 = await prisma.quizQuestion.create({
    data: {
      quizId: quiz4.id,
      questionText: 'Trong mô hình Dynamic RBAC, một Người dùng (User) sở hữu các quyền hạn (Permissions) thông qua đối tượng trung gian nào?',
      questionType: 'SINGLE_CHOICE',
      points: 2.5,
      explanation: 'User được gán các Vai trò (Roles), và mỗi Vai trò sở hữu một tập hợp các Quyền (Permissions).',
      sortOrder: 3,
    },
  })
  await prisma.quizQuestionOption.createMany({
    data: [
      { questionId: q4_3.id, optionText: 'Vai trò (Role)', isCorrect: true, sortOrder: 1 },
      { questionId: q4_3.id, optionText: 'Địa chỉ IP', isCorrect: false, sortOrder: 2 },
      { questionId: q4_3.id, optionText: 'Thời gian đăng nhập', isCorrect: false, sortOrder: 3 },
      { questionId: q4_3.id, optionText: 'Email cá nhân', isCorrect: false, sortOrder: 4 },
    ],
  })

  // Q4.4
  const q4_4 = await prisma.quizQuestion.create({
    data: {
      quizId: quiz4.id,
      questionText: 'Tham số "Salt Rounds" trong thuật toán băm mật khẩu Bcrypt có vai trò gì?',
      questionType: 'SINGLE_CHOICE',
      points: 2.5,
      explanation: 'Salt Rounds xác định chi phí tính toán (Work Factor) để làm chậm tốc độ băm, từ đó chống lại các cuộc tấn công Brute-force và Rainbow Table.',
      sortOrder: 4,
    },
  })
  await prisma.quizQuestionOption.createMany({
    data: [
      { questionId: q4_4.id, optionText: 'Tăng chi phí tính toán làm chậm kẻ tấn công dò vét cạn mật khẩu (Brute-force)', isCorrect: true, sortOrder: 1 },
      { questionId: q4_4.id, optionText: 'Xác định số ký tự tối đa của mật khẩu', isCorrect: false, sortOrder: 2 },
      { questionId: q4_4.id, optionText: 'Tự động gửi email thông báo khi mật khẩu bị lộ', isCorrect: false, sortOrder: 3 },
      { questionId: q4_4.id, optionText: 'Tăng tốc độ truy vấn cơ sở dữ liệu', isCorrect: false, sortOrder: 4 },
    ],
  })

  // ==========================================
  // MODULE 5: REALTIME SSE & SYSTEM DESIGN
  // ==========================================
  const mod5 = await prisma.courseModule.create({
    data: {
      courseId: course.id,
      title: 'Chương 5: Giao Tiếp Thời Gian Thực (Realtime SSE) & Tư Duy Mở Rộng Hệ Thống',
      sortOrder: 5,
    },
  })

  // Bài 5.1: Article
  await prisma.lesson.create({
    data: {
      moduleId: mod5.id,
      title: '5.1 Kiến Trúc Realtime: So Sánh Toàn Diện SSE vs WebSocket vs SignalR',
      description: 'Lựa chọn công nghệ truyền tin thời gian thực đúng đắn, kỹ thuật quản lý Connection Pool, Heartbeat Keep-Alive 25s và giải pháp không bị khóa chặt công nghệ (Zero-Lockin).',
      lessonType: 'ARTICLE',
      estimatedReadTime: 12,
      sortOrder: 1,
      isVisible: true,
      bodyHtml: `
<h2>1. Tại sao tính năng Thông Báo nên chọn Server-Sent Events (SSE)?</h2>
<p>Khi xây dựng tính năng Thông báo chuông (Notification Bell) hoặc Live Stream chữ như ChatGPT, luồng dữ liệu chỉ truyền <strong>1 chiều từ Server xuống Client</strong>. Nếu ta sử dụng WebSocket hoặc Socket.io, hệ thống phải gánh thêm chi phí duy trì kết nối 2 chiều và các giao thức bắt tay phức tạp.</p>

<h2>2. So Sánh Bảng Công Nghệ</h2>
<ul>
  <li><strong>Server-Sent Events (SSE):</strong> Dựa trên chuẩn HTTP gốc, trình duyệt có sẵn <code>EventSource</code> với khả năng tự động kết nối lại (Auto-reconnect), vượt qua tường lửa/Nginx dễ dàng. Khi chuyển từ Node.js sang C# ASP.NET Core, toàn bộ Frontend giữ nguyên vẹn 100%!</li>
  <li><strong>WebSocket:</strong> Kết nối 2 chiều liên tục (Full-duplex). Phù hợp cho Game Online, App chứng khoán nhảy giá theo mili-giây, hoặc phần mềm vẽ tương tác thời gian thực như Figma.</li>
  <li><strong>SignalR:</strong> Framework realtime cao cấp của hệ sinh thái Microsoft .NET, có cơ chế Fallback thông minh (WebSockets $\rightarrow$ SSE $\rightarrow$ Long Polling).</li>
</ul>

<h2>3. Cơ chế Heartbeat Keep-Alive 25 Giây</h2>
<p>Các Load Balancer (ELB của AWS) hoặc Nginx Reverse Proxy thường tự động ngắt kết nối HTTP nếu không thấy dữ liệu trong vòng 30 - 60 giây. Vì vậy, server cần phát tín hiệu định kỳ:</p>
<pre><code class="language-typescript">setInterval(() => {
  res.write(': keep-alive\\n\\n')
}, 25000)
</code></pre>
      `,
    },
  })

  // Bài 5.2: Article
  await prisma.lesson.create({
    data: {
      moduleId: mod5.id,
      title: '5.2 Chiến Lược Caching & Tư Duy Scale Hệ Thống (System Design)',
      description: 'Ứng dụng Redis Cache theo mẫu Cache-Aside, kỹ thuật Database Read/Write Replica và kinh nghiệm tái cấu trúc từ Node.js sang C# ASP.NET Core.',
      lessonType: 'ARTICLE',
      estimatedReadTime: 15,
      sortOrder: 2,
      isVisible: true,
      bodyHtml: `
<h2>1. Mô hình Cache-Aside (Lazy Loading)</h2>
<p>Khi có request đọc dữ liệu (ví dụ xem chi tiết khóa học):</p>
<ol>
  <li>Backend kiểm tra Redis Cache trước: <code>const cached = await redis.get(cacheKey)</code>.</li>
  <li>Nếu có (Cache Hit): Trả về dữ liệu ngay lập tức (&lt; 2ms).</li>
  <li>Nếu không có (Cache Miss): Truy vấn PostgreSQL, ghi kết quả vào Redis với TTL (Time-To-Live, ví dụ 3600s), rồi trả về cho client.</li>
  <li>Khi dữ liệu bị sửa/xóa (Mutation): Chủ động xóa cache tương ứng (Cache Invalidation).</li>
</ol>

<h2>2. Lộ Trình Chuyển Đổi từ Node.js sang C# (.NET)</h2>
<ul>
  <li><strong>Chia sẻ chung Database:</strong> Cả Express.js và ASP.NET Core đều kết nối vào chung một PostgreSQL database thông qua Entity Framework Core (EF Core) ánh xạ tương đương với Prisma.</li>
  <li><strong>Chuẩn hóa DTO & API Contract:</strong> Vì ta đã thiết kế DTO chặt chẽ và Response Envelope chuẩn (<code>isSuccess</code>, <code>statusCode</code>, <code>data</code>), việc viết lại Controller bằng C# sẽ có hợp đồng API khớp 100% với Frontend Next.js.</li>
</ul>
      `,
    },
  })

  // Bài 5.3: Quiz Capstone
  const quizL5 = await prisma.lesson.create({
    data: {
      moduleId: mod5.id,
      title: '5.3 Bài kiểm tra Tốt nghiệp: Backend Architecture & System Design',
      description: 'Đề thi tốt nghiệp gồm 5 câu hỏi tình huống thiết kế hệ thống, đánh giá năng lực của một Backend Engineer thực chiến.',
      lessonType: 'QUIZ',
      sortOrder: 3,
      isVisible: true,
    },
  })

  const quiz5 = await prisma.quiz.create({
    data: {
      lessonId: quizL5.id,
      title: 'Bài kiểm tra Tốt nghiệp: Backend System Design Capstone',
      passScore: 80,
      timeLimitMinutes: 20,
      maxAttempts: 3,
      shuffleQuestions: true,
      showAnswerFeedback: true,
    },
  })

  // Q5.1
  const q5_1 = await prisma.quizQuestion.create({
    data: {
      quizId: quiz5.id,
      questionText: 'Tại sao việc gửi ping ": keep-alive\\n\\n" định kỳ 25 giây lại cần thiết cho kết nối Server-Sent Events (SSE)?',
      questionType: 'SINGLE_CHOICE',
      points: 2.0,
      explanation: 'Các thiết bị mạng, tường lửa và Reverse Proxy như Nginx thường tự động đóng kết nối TCP nếu không phát hiện lưu lượng dữ liệu sau một khoảng thời gian timeout (thường là 30-60s).',
      sortOrder: 1,
    },
  })
  await prisma.quizQuestionOption.createMany({
    data: [
      { questionId: q5_1.id, optionText: 'Ngăn chặn các Reverse Proxy hoặc Router mạng ngắt kết nối do quá hạn timeout', isCorrect: true, sortOrder: 1 },
      { questionId: q5_1.id, optionText: 'Để mã hóa lại mật khẩu của người dùng', isCorrect: false, sortOrder: 2 },
      { questionId: q5_1.id, optionText: 'Để tải lại trang web trên trình duyệt', isCorrect: false, sortOrder: 3 },
      { questionId: q5_1.id, optionText: 'Để xóa sạch lịch sử thông báo cũ', isCorrect: false, sortOrder: 4 },
    ],
  })

  // Q5.2
  const q5_2 = await prisma.quizQuestion.create({
    data: {
      quizId: quiz5.id,
      questionText: 'Khi áp dụng chiến lược Cache-Aside với Redis, hành động nào cần được thực hiện khi một bản ghi trong Database được cập nhật (Update)?',
      questionType: 'SINGLE_CHOICE',
      points: 2.0,
      explanation: 'Cần xóa bản ghi cache tương ứng (Invalidate Cache) hoặc cập nhật lại để các request tiếp theo không đọc phải dữ liệu cũ (Stale Data).',
      sortOrder: 2,
    },
  })
  await prisma.quizQuestionOption.createMany({
    data: [
      { questionId: q5_2.id, optionText: 'Xóa (Invalidate) key tương ứng trong Redis Cache để tránh dữ liệu cũ bị sai lệch', isCorrect: true, sortOrder: 1 },
      { questionId: q5_2.id, optionText: 'Tắt máy chủ Redis ngay lập tức', isCorrect: false, sortOrder: 2 },
      { questionId: q5_2.id, optionText: 'Tăng thời gian sống TTL của key đó lên vô hạn', isCorrect: false, sortOrder: 3 },
      { questionId: q5_2.id, optionText: 'Không làm gì cả vì Redis tự động đồng bộ tức thì với PostgreSQL', isCorrect: false, sortOrder: 4 },
    ],
  })

  // Q5.3
  const q5_3 = await prisma.quizQuestion.create({
    data: {
      quizId: quiz5.id,
      questionText: 'Lợi ích lớn nhất của việc thiết kế API chuẩn hóa (Contract-first) khi lên kế hoạch chuyển đổi Backend từ Node.js sang C# (.NET) là gì?',
      questionType: 'SINGLE_CHOICE',
      points: 2.0,
      explanation: 'Khi hợp đồng API được giữ nguyên, ứng dụng Frontend (Next.js) hoàn toàn không cần phải sửa đổi giao diện hay logic xử lý khi thay đổi backend engine.',
      sortOrder: 3,
    },
  })
  await prisma.quizQuestionOption.createMany({
    data: [
      { questionId: q5_3.id, optionText: 'Toàn bộ mã nguồn giao diện Frontend (UI, React Hooks) được bảo toàn nguyên vẹn 100%', isCorrect: true, sortOrder: 1 },
      { questionId: q5_3.id, optionText: 'Tự động dịch mã nguồn TypeScript sang C# mà không cần lập trình viên', isCorrect: false, sortOrder: 2 },
      { questionId: q5_3.id, optionText: 'Không cần sử dụng cơ sở dữ liệu nữa', isCorrect: false, sortOrder: 3 },
      { questionId: q5_3.id, optionText: 'Giảm chi phí tiền điện của server', isCorrect: false, sortOrder: 4 },
    ],
  })

  // Q5.4
  const q5_4 = await prisma.quizQuestion.create({
    data: {
      quizId: quiz5.id,
      questionText: 'Header HTTP nào sau đây là BẮT BUỘC để kích hoạt luồng truyền tin Server-Sent Events (SSE)?',
      questionType: 'SINGLE_CHOICE',
      points: 2.0,
      explanation: 'Content-Type: text/event-stream báo cho client và các proxy biết đây là một luồng dữ liệu sự kiện mở liên tục.',
      sortOrder: 4,
    },
  })
  await prisma.quizQuestionOption.createMany({
    data: [
      { questionId: q5_4.id, optionText: 'Content-Type: text/event-stream', isCorrect: true, sortOrder: 1 },
      { questionId: q5_4.id, optionText: 'Content-Type: application/json', isCorrect: false, sortOrder: 2 },
      { questionId: q5_4.id, optionText: 'Content-Type: text/html', isCorrect: false, sortOrder: 3 },
      { questionId: q5_4.id, optionText: 'Content-Type: multipart/form-data', isCorrect: false, sortOrder: 4 },
    ],
  })

  // Q5.5: MULTIPLE_CHOICE
  const q5_5 = await prisma.quizQuestion.create({
    data: {
      quizId: quiz5.id,
      questionText: 'Những giải pháp nào sau đây giúp hệ thống Backend chịu tải cao (High Concurrency & Scalability)? (Chọn tất cả các đáp án đúng)',
      questionType: 'MULTIPLE_CHOICE',
      points: 2.0,
      explanation: 'Caching, Connection Pooling và Tách biệt Read/Write Replica là các mẫu thiết kế kinh điển giúp hệ thống mở rộng chịu tải.',
      sortOrder: 5,
    },
  })
  await prisma.quizQuestionOption.createMany({
    data: [
      { questionId: q5_5.id, optionText: 'Sử dụng Caching (Redis / Memcached) để giảm tải truy vấn trực tiếp vào Database', isCorrect: true, sortOrder: 1 },
      { questionId: q5_5.id, optionText: 'Thiết lập Database Connection Pooling hợp lý', isCorrect: true, sortOrder: 2 },
      { questionId: q5_5.id, optionText: 'Sử dụng mô hình Read Replica (Tách luồng Đọc và luồng Ghi)', isCorrect: true, sortOrder: 3 },
      { questionId: q5_5.id, optionText: 'Tăng kích thước ổ cứng nhưng không đánh index cho bảng', isCorrect: false, sortOrder: 4 },
    ],
  })

  console.log('🎉 [HOÀN THÀNH] Khởi tạo Khóa học Backend Chuyên Nghiệp thành công rực rỡ!')
  console.log(`- Mã khóa học: ${course.code}`)
  console.log(`- Tên khóa học: ${course.title}`)
  console.log(`- Số lượng Module (Chương): 5 chương`)
  console.log(`- Tổng số bài học: 16 bài học (gồm 4 Video, 7 Bài giảng chuyên sâu Article, 5 Đề thi Quiz)`)
}

seedBackendCourse()
  .catch((e) => {
    console.error('❌ Lỗi khi khởi tạo khóa học Backend:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    console.log('🏁 Tiến trình hoàn tất, đóng kết nối.')
    process.exit(0)
  })
