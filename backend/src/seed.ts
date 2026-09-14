import prisma from './config/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  console.log('Seeding Database with ERP-v2 Auth & BaHung LMS Foundation Data...')

  // Clear existing data in reverse order of foreign key dependencies
  await prisma.lessonProgress.deleteMany({})
  await prisma.courseEnrollment.deleteMany({})
  await prisma.lesson.deleteMany({})
  await prisma.courseModule.deleteMany({})
  await prisma.course.deleteMany({})
  await prisma.category.deleteMany({})
  
  await prisma.rolePermission.deleteMany({})
  await prisma.userRole.deleteMany({})
  await prisma.permission.deleteMany({})
  await prisma.role.deleteMany({})
  await prisma.userAccount.deleteMany({})
  await prisma.user.deleteMany({})

  await prisma.store.deleteMany({})
  await prisma.department.deleteMany({})
  await prisma.position.deleteMany({})

  // 1. Create Org Structure
  const storeQ1 = await prisma.store.create({
    data: {
      storeCode: 'CH-QUAN1',
      storeName: 'Cửa hàng Ba Hưng - Quận 1',
      region: 'MIEN_NAM',
      storeType: 'RETAIL_STORE',
    },
  })

  const storeXuongKem = await prisma.store.create({
    data: {
      storeCode: 'XUONG-KEM',
      storeName: 'Xưởng Sản Xuất Kem Ba Hưng',
      region: 'MIEN_NAM',
      storeType: 'CENTRAL_FACTORY',
    },
  })

  const deptBanHang = await prisma.department.create({
    data: {
      deptCode: 'BP-BAN-HANG',
      deptName: 'Bộ phận Bán hàng Cửa hàng',
      isFactoryDept: false,
    },
  })

  const deptLamKem = await prisma.department.create({
    data: {
      deptCode: 'BP-LAM-KEM',
      deptName: 'Khâu Sản xuất Làm Kem',
      isFactoryDept: true,
    },
  })

  const posQLCH = await prisma.position.create({
    data: {
      positionCode: 'QLCH',
      positionName: 'Quản lý Cửa hàng',
      levelRank: 3,
    },
  })

  const posNhanVien = await prisma.position.create({
    data: {
      positionCode: 'NV-BAN-HANG',
      positionName: 'Nhân viên Bán hàng',
      levelRank: 1,
    },
  })

  console.log('Created Org Structure:', { storeQ1: storeQ1.storeName, storeXuongKem: storeXuongKem.storeName })

  // 2. Create System Permissions (Comprehensive Catalogue)
  const permissionsData = [
    // HRM & User Management
    { permissionCode: 'USER.READ', permissionName: 'Xem thông tin Nhân sự', module: 'HRM', action: 'READ', resource: 'USER' },
    { permissionCode: 'USER.CREATE', permissionName: 'Tạo nhân sự mới', module: 'HRM', action: 'CREATE', resource: 'USER' },
    { permissionCode: 'USER.UPDATE', permissionName: 'Cập nhật thông tin nhân sự', module: 'HRM', action: 'UPDATE', resource: 'USER' },
    { permissionCode: 'USER.LOCK', permissionName: 'Khóa / Mở khóa tài khoản nhân sự', module: 'HRM', action: 'LOCK', resource: 'USER' },
    
    // System Roles & Permissions
    { permissionCode: 'ROLE.MANAGE', permissionName: 'Quản lý Phân quyền & Vai trò', module: 'SYSTEM', action: 'MANAGE', resource: 'ROLE' },
    { permissionCode: 'PERMISSION.MANAGE', permissionName: 'Quản lý Danh mục Quyền hạn', module: 'SYSTEM', action: 'MANAGE', resource: 'PERMISSION' },

    // Organization Structure
    { permissionCode: 'ORG.MANAGE', permissionName: 'Quản lý Sơ đồ Tổ chức (CH, Xưởng, Chức danh)', module: 'ORGANIZATION', action: 'MANAGE', resource: 'ORG' },

    // Category & Course Management
    { permissionCode: 'CATEGORY.MANAGE', permissionName: 'Quản lý Danh mục Đào tạo', module: 'LMS', action: 'MANAGE', resource: 'CATEGORY' },
    { permissionCode: 'COURSE.READ', permissionName: 'Xem danh sách và chi tiết Khóa học', module: 'LMS', action: 'READ', resource: 'COURSE' },
    { permissionCode: 'COURSE.CREATE', permissionName: 'Tạo mới Khóa học', module: 'LMS', action: 'CREATE', resource: 'COURSE' },
    { permissionCode: 'COURSE.UPDATE', permissionName: 'Cập nhật nội dung Khóa học', module: 'LMS', action: 'UPDATE', resource: 'COURSE' },
    { permissionCode: 'COURSE.DELETE', permissionName: 'Xóa / Lưu trữ Khóa học', module: 'LMS', action: 'DELETE', resource: 'COURSE' },

    // Curriculum & Lessons (Video, Article, SOP)
    { permissionCode: 'MODULE.MANAGE', permissionName: 'Quản lý Chương học (Thêm/Sửa/Sắp xếp)', module: 'LMS', action: 'MANAGE', resource: 'MODULE' },
    { permissionCode: 'LESSON.READ', permissionName: 'Xem nội dung Bài học', module: 'LMS', action: 'READ', resource: 'LESSON' },
    { permissionCode: 'LESSON.CREATE', permissionName: 'Tạo Bài giảng (Video, Article, PDF)', module: 'LMS', action: 'CREATE', resource: 'LESSON' },
    { permissionCode: 'LESSON.UPDATE', permissionName: 'Chỉnh sửa nội dung Bài học', module: 'LMS', action: 'UPDATE', resource: 'LESSON' },
    { permissionCode: 'LESSON.DELETE', permissionName: 'Xóa Bài học', module: 'LMS', action: 'DELETE', resource: 'LESSON' },

    // Quiz & Assessment Builder
    { permissionCode: 'QUIZ.READ', permissionName: 'Xem và làm Bài kiểm tra', module: 'LMS', action: 'READ', resource: 'QUIZ' },
    { permissionCode: 'QUIZ.MANAGE', permissionName: 'Soạn đề thi & Ngân hàng câu hỏi', module: 'LMS', action: 'MANAGE', resource: 'QUIZ' },
    { permissionCode: 'QUIZ.GRADE', permissionName: 'Chấm điểm & Đánh giá bài kiểm tra', module: 'LMS', action: 'GRADE', resource: 'QUIZ' },

    // Enrollment, Reports & Compliance
    { permissionCode: 'ENROLLMENT.MANAGE', permissionName: 'Ghi danh học viên & Gán tự động', module: 'LMS', action: 'MANAGE', resource: 'ENROLLMENT' },
    { permissionCode: 'REPORT.VIEW', permissionName: 'Xem Báo cáo Đào tạo & Tiến độ', module: 'LMS', action: 'READ', resource: 'REPORT' },
    { permissionCode: 'ATTP.VIEW', permissionName: 'Xem và Quản lý Chứng chỉ ATTP', module: 'ATTP', action: 'READ', resource: 'ATTP' },
  ]

  const permissions = await Promise.all(
    permissionsData.map((p) =>
      prisma.permission.create({
        data: p,
      })
    )
  )

  // 3. Create System Roles
  const adminRole = await prisma.role.create({
    data: {
      roleName: 'ADMIN',
      displayName: 'Quản trị viên Hệ thống (Admin)',
      isSystemRole: true,
      bypassDataScope: true,
    },
  })

  const trainerRole = await prisma.role.create({
    data: {
      roleName: 'TRAINER',
      displayName: 'Giảng viên / Huấn luyện viên (Trainer)',
      isSystemRole: false,
      bypassDataScope: false,
    },
  })

  const studentRole = await prisma.role.create({
    data: {
      roleName: 'STUDENT',
      displayName: 'Học viên / Nhân sự (Learner)',
      isSystemRole: false,
      bypassDataScope: false,
    },
  })

  // Map Permissions to Admin Role (ALL PERMISSIONS)
  await Promise.all(
    permissions.map((p) =>
      prisma.rolePermission.create({
        data: {
          roleId: adminRole.id,
          permissionId: p.id,
        },
      })
    )
  )

  // Map Permissions to Trainer Role
  const trainerPermCodes = [
    'COURSE.READ', 'COURSE.CREATE', 'COURSE.UPDATE', 'CATEGORY.MANAGE',
    'MODULE.MANAGE', 'LESSON.READ', 'LESSON.CREATE', 'LESSON.UPDATE',
    'QUIZ.READ', 'QUIZ.MANAGE', 'QUIZ.GRADE', 'REPORT.VIEW', 'ATTP.VIEW',
  ]
  await Promise.all(
    permissions
      .filter((p) => trainerPermCodes.includes(p.permissionCode))
      .map((p) =>
        prisma.rolePermission.create({
          data: {
            roleId: trainerRole.id,
            permissionId: p.id,
          },
        })
      )
  )

  // Map Permissions to Student Role
  const studentPermCodes = ['COURSE.READ', 'LESSON.READ', 'QUIZ.READ', 'ATTP.VIEW']
  await Promise.all(
    permissions
      .filter((p) => studentPermCodes.includes(p.permissionCode))
      .map((p) =>
        prisma.rolePermission.create({
          data: {
            roleId: studentRole.id,
            permissionId: p.id,
          },
        })
      )
  )

  // 4. Create Users & UserAccounts
  const passwordHash = await bcrypt.hash('password123', 10)

  // Super Admin
  const adminUser = await prisma.user.create({
    data: {
      employeeCode: 'BH-ADMIN-001',
      fullName: 'Quản trị Ba Hưng',
      email: 'admin@bahung.com',
      status: 'ACTIVE',
      isActive: true,
      userType: 'EMPLOYEE',
      employmentStatus: 'OFFICIAL',
      storeId: storeQ1.id,
      departmentId: deptBanHang.id,
      positionId: posQLCH.id,
    },
  })

  await prisma.userAccount.create({
    data: {
      userId: adminUser.id,
      loginEmail: 'admin@bahung.com',
      passwordHash,
    },
  })

  await prisma.userRole.create({
    data: {
      userId: adminUser.id,
      roleId: adminRole.id,
    },
  })

  // Student User
  const studentUser = await prisma.user.create({
    data: {
      employeeCode: 'BH-NV-002',
      fullName: 'Alex Thompson',
      email: 'alex@logix.com',
      status: 'ACTIVE',
      isActive: true,
      userType: 'EMPLOYEE',
      employmentStatus: 'PROBATION',
      storeId: storeQ1.id,
      departmentId: deptBanHang.id,
      positionId: posNhanVien.id,
    },
  })

  await prisma.userAccount.create({
    data: {
      userId: studentUser.id,
      loginEmail: 'alex@logix.com',
      passwordHash,
    },
  })

  await prisma.userRole.create({
    data: {
      userId: studentUser.id,
      roleId: studentRole.id,
    },
  })

  console.log('Created Users:', { admin: adminUser.email, student: studentUser.email })

  // 5. Create Sample Course Categories & Courses (LMS-001 -> LMS-012)
  const catOnboarding = await prisma.category.create({
    data: {
      code: 'ONBOARDING',
      name: 'Chương trình Đào tạo Onboarding',
      description: 'Chương trình định hướng và quy trình bắt buộc cho nhân sự mới',
      sortOrder: 1,
    },
  })

  const catATTP = await prisma.category.create({
    data: {
      code: 'ATTP',
      name: 'An Toàn Thực Phẩm & Vệ Sinh',
      description: 'Tiêu chuẩn an toàn thực phẩm, bảo quản nguyên vật liệu và kiểm định vệ sinh',
      sortOrder: 2,
    },
  })

  const catStoreOps = await prisma.category.create({
    data: {
      code: 'STORE_OPS',
      name: 'Nghiệp Vụ Vận Hành Cửa Hàng',
      description: 'Quy trình phục vụ khách hàng, thu ngân, pha chế và quản lý cửa hàng',
      sortOrder: 3,
    },
  })

  const catFactory = await prisma.category.create({
    data: {
      code: 'FACTORY_PROD',
      name: 'Nghiệp Vụ Sản Xuất & Xưởng',
      description: 'Kỹ thuật làm kem, vận hành máy móc đóng gói và an toàn lao động xưởng',
      sortOrder: 4,
    },
  })

  const courseSOP = await prisma.course.create({
    data: {
      code: 'BH-ONB-01',
      title: 'Quy trình SOP Vận hành Cửa hàng Hàng ngày',
      slug: 'quy-trinh-sop-van-hanh-cua-hang',
      description: 'Khóa học bắt buộc dành cho Nhân viên Bán hàng mới onboarding.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800',
      categoryId: catOnboarding.id,
      courseType: 'ONBOARDING',
      isMandatory: true,
      durationDays: 14,
      progressionMode: 'LINEAR_LESSON',
      targetPositionId: posNhanVien.id,
      targetEmploymentStatus: 'PROBATION',
      isCommercial: false,
      isInternal: true,
      status: 'PUBLISHED',
    },
  })

  const courseATTP = await prisma.course.create({
    data: {
      code: 'BH-ATTP-01',
      title: 'Tiêu chuẩn Vệ sinh & An toàn Thực phẩm 2026',
      slug: 'tieu-chuan-ve-sinh-an-toan-thuc-pham-2026',
      description: 'Quy chuẩn an toàn thực phẩm bắt buộc định kỳ hàng năm cho toàn bộ nhân sự.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=800',
      categoryId: catATTP.id,
      courseType: 'ATTP',
      isMandatory: true,
      durationDays: 30,
      progressionMode: 'LINEAR_LESSON',
      isCommercial: false,
      isInternal: true,
      status: 'PUBLISHED',
    },
  })

  const courseFactoryKem = await prisma.course.create({
    data: {
      code: 'BH-SX-01',
      title: 'Quy trình Sản xuất & Tiệt trùng Khâu Làm Kem',
      slug: 'quy-trinh-san-xuat-tiet-trung-khau-lam-kem',
      description: 'Quy chuẩn vận hành máy làm kem và tiệt trùng dụng cụ xưởng.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800',
      categoryId: catFactory.id,
      courseType: 'STANDARD',
      isMandatory: false,
      durationDays: 20,
      progressionMode: 'LINEAR_MODULE',
      targetDepartmentId: deptLamKem.id,
      isCommercial: false,
      isInternal: true,
      status: 'PUBLISHED',
    },
  })

  const module1 = await prisma.courseModule.create({
    data: {
      courseId: courseSOP.id,
      title: 'Chương 1: Quy định chung & Vệ sinh an toàn thực phẩm',
      sortOrder: 1,
    },
  })

  // Bài 1: Video YouTube
  await prisma.lesson.create({
    data: {
      moduleId: module1.id,
      title: 'Bài 1: Giới thiệu Văn hóa Doanh nghiệp Ba Hưng',
      description: 'Tổng quan lịch sử hình thành, giá trị cốt lõi và tiêu chuẩn phục vụ khách hàng.',
      lessonType: 'VIDEO',
      videoProvider: 'YOUTUBE',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      videoDuration: 300,
      isVisible: true,
      sortOrder: 1,
    },
  })

  // Bài 2: Article Rich Text + SOP
  await prisma.lesson.create({
    data: {
      moduleId: module1.id,
      title: 'Bài 2: Checklist Vệ sinh & Mở Cửa hàng đúng giờ',
      description: 'Quy trình 6 bước chuẩn bị trước khi mở cửa đón khách tại cửa hàng.',
      lessonType: 'ARTICLE',
      bodyHtml: '<h3>Quy trình mở cửa:</h3><ol><li>Bật đèn và kiểm tra nhiệt độ tủ kem (đạt 2°C - 6°C).</li><li>Vệ sinh quầy thu ngân và khu vực đón khách.</li><li>Kiểm tra hạn sử dụng bánh tươi trong ngày.</li></ol>',
      estimatedReadTime: 5,
      sopCode: 'SOP-CH-01',
      sopType: 'STORE_SOP',
      requiresSignature: true,
      isVisible: true,
      sortOrder: 2,
    },
  })

  // Bài 3: Quiz Lesson (Coursera style)
  const quizLesson = await prisma.lesson.create({
    data: {
      moduleId: module1.id,
      title: 'Bài 3: Bài kiểm tra kiến thức Vệ sinh & Mở cửa',
      description: 'Đề thi trắc nghiệm gồm 3 câu hỏi. Cần đạt 80% điểm trở lên để hoàn thành bài học.',
      lessonType: 'QUIZ',
      isVisible: true,
      sortOrder: 3,
    },
  })

  // Tạo đề thi Quiz
  const quiz = await prisma.quiz.create({
    data: {
      lessonId: quizLesson.id,
      title: 'Bài kiểm tra: Vệ sinh & Tiêu chuẩn Mở Cửa hàng',
      description: 'Vui lòng chọn đáp án chính xác nhất cho từng câu hỏi bên dưới.',
      passScore: 80,
      maxAttempts: 3,
      timeLimitMinutes: 15,
      shuffleQuestions: true,
      showAnswerFeedback: true,
    },
  })

  // Câu hỏi 1: SINGLE_CHOICE
  const q1 = await prisma.quizQuestion.create({
    data: {
      quizId: quiz.id,
      questionText: 'Nhiệt độ bảo quản tủ kem tiêu chuẩn tại cửa hàng Ba Hưng là bao nhiêu?',
      questionType: 'SINGLE_CHOICE',
      points: 1.0,
      explanation: 'Theo tiêu chuẩn ATTP của Ba Hưng, tủ mát bảo quản kem và bánh lạnh phải duy trì từ 2°C đến 6°C.',
      sortOrder: 1,
    },
  })

  await prisma.quizQuestionOption.createMany({
    data: [
      { questionId: q1.id, optionText: 'Từ 2°C đến 6°C', isCorrect: true, sortOrder: 1 },
      { questionId: q1.id, optionText: 'Từ 10°C đến 15°C', isCorrect: false, sortOrder: 2 },
      { questionId: q1.id, optionText: 'Từ -5°C đến 0°C', isCorrect: false, sortOrder: 3 },
      { questionId: q1.id, optionText: 'Nhiệt độ phòng (25°C)', isCorrect: false, sortOrder: 4 },
    ],
  })

  // Câu hỏi 2: TRUE_FALSE
  const q2 = await prisma.quizQuestion.create({
    data: {
      quizId: quiz.id,
      questionText: 'Nhân viên có được phép mở cửa đón khách trước khi hoàn tất checklist vệ sinh quầy thu ngân không?',
      questionType: 'TRUE_FALSE',
      points: 1.0,
      explanation: 'Checklist vệ sinh bắt buộc phải hoàn thành 100% trước giờ mở cửa chính thức 15 phút.',
      sortOrder: 2,
    },
  })

  await prisma.quizQuestionOption.createMany({
    data: [
      { questionId: q2.id, optionText: 'Đúng (Được phép mở trước)', isCorrect: false, sortOrder: 1 },
      { questionId: q2.id, optionText: 'Sai (Bắt buộc hoàn tất checklist trước)', isCorrect: true, sortOrder: 2 },
    ],
  })

  // ==============================================================
  // MODULES & LESSONS CHO COURSE FACTORY KEM (BH-SX-01)
  // ==============================================================
  const modKem1 = await prisma.courseModule.create({
    data: {
      courseId: courseFactoryKem.id,
      title: 'Phần 1: Chuẩn bị & Nguyên tắc Vệ sinh An toàn Xưởng Làm Kem',
      sortOrder: 1,
    },
  })

  await prisma.lesson.create({
    data: {
      moduleId: modKem1.id,
      title: 'Bài 1: Quy định bảo hộ lao động và vệ sinh cá nhân 6 bước',
      description: 'Hướng dẫn quy chuẩn thực hành vệ sinh cá nhân và bảo hộ lao động trước khi vào khu vực sản xuất.',
      lessonType: 'ARTICLE',
      bodyHtml: '<h3>Quy chuẩn bảo hộ xưởng kem:</h3><ul><li>Mũ trùm tóc kín 100%, khẩu trang y tế 4 lớp.</li><li>Rửa tay sát khuẩn 6 bước theo tiêu chuẩn Bộ Y Tế.</li><li>Không đeo trang sức, móng tay cắt ngắn.</li></ul>',
      estimatedReadTime: 8,
      sopCode: 'SOP-SX-01',
      sopType: 'FACTORY_SOP',
      requiresSignature: true,
      isVisible: true,
      sortOrder: 1,
    },
  })

  await prisma.lesson.create({
    data: {
      moduleId: modKem1.id,
      title: 'Bài 2: Video hướng dẫn tiệt trùng máy làm kem Taylor C712',
      description: 'Các bước tháo lắp, ngâm rửa dung dịch S&R và chạy chu trình tiệt trùng nhiệt độ cao.',
      lessonType: 'VIDEO',
      videoProvider: 'YOUTUBE',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      videoDuration: 600,
      isVisible: true,
      sortOrder: 2,
    },
  })

  const modKem2 = await prisma.courseModule.create({
    data: {
      courseId: courseFactoryKem.id,
      title: 'Phần 2: Quy trình Phối trộn & Định lượng Nguyên Liệu',
      sortOrder: 2,
    },
  })

  await prisma.lesson.create({
    data: {
      moduleId: modKem2.id,
      title: 'Bài 3: Tỷ lệ pha bột nền kem và sữa tươi thanh trùng chuẩn Ba Hưng',
      description: 'Cách cân đo đúng sai số +/- 2g và kiểm soát nhiệt độ ủ lạnh dịch kem.',
      lessonType: 'VIDEO',
      videoProvider: 'YOUTUBE',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      videoDuration: 720,
      isVisible: true,
      sortOrder: 1,
    },
  })

  const quizLessonKem = await prisma.lesson.create({
    data: {
      moduleId: modKem2.id,
      title: 'Bài 4: Bài kiểm tra đánh giá kiến thức An toàn & Vận hành Khâu Làm Kem',
      description: 'Đề thi trắc nghiệm đánh giá kiến thức vận hành máy làm kem và an toàn vệ sinh.',
      lessonType: 'QUIZ',
      isVisible: true,
      sortOrder: 2,
    },
  })

  const quizKem = await prisma.quiz.create({
    data: {
      lessonId: quizLessonKem.id,
      title: 'Bài kiểm tra: Kỹ thuật Sản xuất & Tiệt trùng Khâu Làm Kem',
      description: 'Cần đạt 85% điểm trở lên để hoàn thành khóa đào tạo.',
      passScore: 85,
      maxAttempts: 3,
      timeLimitMinutes: 20,
      shuffleQuestions: true,
      showAnswerFeedback: true,
    },
  })

  const qk1 = await prisma.quizQuestion.create({
    data: {
      quizId: quizKem.id,
      questionText: 'Nhiệt độ bảo quản sữa tươi thanh trùng trước khi phối trộn kem chuẩn là bao nhiêu?',
      questionType: 'SINGLE_CHOICE',
      points: 1.0,
      explanation: 'Sữa thanh trùng phải được bảo quản nghiêm ngặt từ 2°C đến 4°C để tránh lên men chua.',
      sortOrder: 1,
    },
  })

  await prisma.quizQuestionOption.createMany({
    data: [
      { questionId: qk1.id, optionText: 'Từ 2°C đến 4°C', isCorrect: true, sortOrder: 1 },
      { questionId: qk1.id, optionText: 'Từ 10°C đến 15°C', isCorrect: false, sortOrder: 2 },
      { questionId: qk1.id, optionText: 'Nhiệt độ phòng (25°C)', isCorrect: false, sortOrder: 3 },
    ],
  })

  const qk2 = await prisma.quizQuestion.create({
    data: {
      quizId: quizKem.id,
      questionText: 'Khi máy làm kem báo lỗi kẹt trục xoay, thao tác khẩn cấp đầu tiên là gì?',
      questionType: 'SINGLE_CHOICE',
      points: 1.0,
      explanation: 'Phải ngắt cầu dao nguồn điện lập tức để đảm bảo an toàn cơ điện trước khi mở nắp kiểm tra.',
      sortOrder: 2,
    },
  })

  await prisma.quizQuestionOption.createMany({
    data: [
      { questionId: qk2.id, optionText: 'Ngắt nguồn điện ngay lập tức và báo quản lý xưởng', isCorrect: true, sortOrder: 1 },
      { questionId: qk2.id, optionText: 'Dùng tay thò vào gạt kem', isCorrect: false, sortOrder: 2 },
      { questionId: qk2.id, optionText: 'Đổ thêm nước nóng vào máy', isCorrect: false, sortOrder: 3 },
    ],
  })

  // Enroll studentUser to both courses
  await prisma.courseEnrollment.createMany({
    data: [
      {
        userId: studentUser.id,
        courseId: courseSOP.id,
        enrollmentSource: 'AUTO_RULE',
        status: 'ENROLLED',
        completionPercentage: 0.0,
      },
      {
        userId: studentUser.id,
        courseId: courseFactoryKem.id,
        enrollmentSource: 'AUTO_RULE',
        status: 'ENROLLED',
        completionPercentage: 0.0,
      },
    ],
  })

  console.log('Database seeded successfully with ERP-v2 Auth & BaHung LMS Coursera Curriculum & Quiz baseline!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
