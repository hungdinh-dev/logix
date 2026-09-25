# 🗄️ CƠ SỞ DỮ LIỆU LMS-BAHUNG — THIẾT KẾ & ĐẶC TẢ 111 CHỨC NĂNG (DATABASE DESIGN DOCUMENT v2.0)

> **Dự án:** LMS-BaHung (Đào tạo Nội bộ F&B Chuỗi Cửa hàng & Xưởng Sản xuất)  
> **Nguồn danh mục chức năng:** [Google Sheet - BaHung LMS (111 Chức năng)](https://docs.google.com/spreadsheets/d/12RLN5E-ptEI6NcNBEtyZMnwy_6JRORrutR27O5p97J4/edit?gid=1230744407#gid=1230744407)  
> **Nguồn chân lý Database (Source of Truth):** [`backend/prisma/schema.prisma`](file:///c:/Projects/DigiFnb/Practice/LogiX/backend/prisma/schema.prisma) & [`backend/src/modules/`](file:///c:/Projects/DigiFnb/Practice/LogiX/backend/src/modules/)  
> **Phiên bản:** v2.0.0 (Cập nhật đồng bộ 100% với Codebase & Google Sheet)  
> **Ngày cập nhật:** 2026-08-28

---

## 1. NGUYÊN TẮC VÀ CHIẾN LƯỢC THIẾT KẾ CƠ SỞ DỮ LIỆU

### 1.1. Mục tiêu cốt lõi của LMS-BaHung
1. **Phủ trọn vẹn 111 chức năng theo Google Sheet (`LMS-001` $\rightarrow$ `LMS-111`):** Bao gồm Đào tạo Khóa học & Học liệu SOP, An toàn Thực phẩm (ATTP) có thời hạn, Lộ trình Onboarding theo chức danh, Đánh giá thực hành tại điểm (Mentor & QLCH), Ký xác nhận quy trình SOP, Lớp học tập trung, Gamification và Báo cáo.
2. **Tích hợp HRM Chặt chẽ (HRM Gatekeeper & Auto-Assign):** Hỗ trợ tự động gán khóa học theo Sơ đồ tổ chức (Cửa hàng / Xưởng sản xuất / Chức danh / Trạng thái nhân sự) và **cổng chặn xếp ca làm việc HRM nếu vi phạm/hết hạn chứng chỉ ATTP**.
3. **Mở rộng linh hoạt sang LMS-Horeca (Commercial Sales & Migration):** Mọi bảng Core đều tích hợp cờ phân loại (`isCommercial`, `isInternal`, `userType`) sẵn sàng kết nối phân hệ Bán khóa học & Migration Engine mà không cần thay đổi cấu trúc bảng cốt lõi.

### 1.2. Phân vùng Thực thể (Logical Schemas & Table Prefixes)
1. `auth_`: Quản trị Hệ thống, Tài khoản, Phân quyền RBAC chuẩn ERP-v2 (`auth_users`, `auth_user_accounts`, `auth_roles`, `auth_permissions`, `auth_user_roles`, `auth_role_permissions`).
2. `org_`: Sơ đồ Tổ chức F&B (`org_stores`, `org_departments`, `org_positions`).
3. `crs_`: Quản lý Khóa học, Chương & Bài học đa hình thái (`crs_categories`, `crs_courses`, `crs_modules`, `crs_lessons`).
4. `quiz_`: Ngân hàng câu hỏi, Đánh giá trắc nghiệm & Lịch sử thi (`quiz_quizzes`, `quiz_questions`, `quiz_question_options`, `quiz_attempts`, `quiz_attempt_answers`).
5. `enr_`: Ghi danh học viên & Theo dõi tiến độ chi tiết (`enr_course_enrollments`, `enr_lesson_progress`).
6. `cert_` *(Phase 2)*: Quản lý Tuân thủ ATTP, Hạn hiệu lực & Cổng chặn ca HRM (`cert_types`, `cert_user_certificates`).
7. `path_` *(Phase 2)*: Lộ trình Onboarding theo khối & Quy tắc tự động gán (`path_learning_paths`, `path_auto_assign_rules`).
8. `eval_` & `cls_` *(Phase 3)*: Đánh giá Thực hành On-the-Job (Mentor/QLCH) & Lớp đào tạo tập trung (`eval_templates`, `eval_submissions`, `cls_classes`, `cls_attendances`).
9. `sop_`, `srv_` & `gam_` *(Phase 3)*: Ký xác nhận SOP, Khảo sát chất lượng & Gamification (`sop_confirmations`, `srv_surveys`, `gam_leaderboard`, `gam_points`).

---

## 2. MA TRẬN 111 CHỨC NĂNG VỚI CƠ SỞ DỮ LIỆU (THEO GOOGLE SHEET BAHUNG LMS)

> [!NOTE]
> Bảng dưới đây đối soát chính xác 1-to-1 từng mã chức năng từ **LMS-001** đến **LMS-111** trong Google Sheet với Thực thể / Bảng CSDL Prisma tương ứng.

| Mã CN | Nghiệp vụ lớn (Domain) | Tên Chức Năng (Google Sheet) | Mô Tả Chi Tiết | Đối Tượng | Bảng CSDL Prisma & Cột Ánh Xạ Tương Ứng | Trạng Thái |
|:---:|---|---|---|---|---|:---:|
| **LMS-001** | Quản lý khóa học | Quản lý danh mục khóa học | Tạo, sửa, xóa danh mục khóa học (Onboarding, ATTP, Nghiệp vụ CH, SX...) | Admin LMS / Nhân sự | `crs_categories` (`code`, `name`, `sortOrder`, `isActive`) | ✅ Done |
| **LMS-002** | Quản lý khóa học | Tạo mới khóa học | Tạo khóa học với các thông tin cơ bản | Admin LMS / Trainer | `crs_courses` (`code`, `title`, `slug`, `categoryId`, `courseType`, `status`) | ✅ Done |
| **LMS-003** | Quản lý khóa học | Sao chép khóa học | Clone course để tái sử dụng | Admin LMS | `CourseService.cloneCourse()` $\rightarrow$ Deep clone `Course`, `CourseModule`, `Lesson`, `Quiz` | 🔄 In Progress |
| **LMS-004** | Quản lý khóa học | Xóa / Ẩn khóa học | Ẩn khóa học không cho hiển thị | Admin LMS | `crs_courses.status` (`'DRAFT'`, `'PUBLISHED'`, `'ARCHIVED'`) & `isActive` | ✅ Done |
| **LMS-005** | Quản lý khóa học | Gán khóa học theo chức danh | Rule: QLCH phải học khóa X | Admin LMS | `crs_courses.targetPositionId` (FK $\rightarrow$ `org_positions.id`) | ✅ Done |
| **LMS-006** | Quản lý khóa học | Gán khóa học theo loại nhân sự | Học việc / Chính thức / TC học khác nhau | Admin LMS | `crs_courses.targetEmploymentStatus` (`'PROBATION'`, `'OFFICIAL'`, `'TEMPORARY'`, `'ALL'`) | ✅ Done |
| **LMS-007** | Quản lý khóa học | Gán khóa học theo cửa hàng | Khóa đặc thù CH / khu vực | Admin LMS | `crs_courses.targetStoreId` (FK $\rightarrow$ `org_stores.id`) | ✅ Done |
| **LMS-008** | Quản lý khóa học | Gán khóa học theo bộ phận sản xuất | Khóa theo khâu kem / bao / cắt... | Admin LMS / Trưởng BP | `crs_courses.targetDepartmentId` (FK $\rightarrow$ `org_departments.id` - `isFactoryDept = true`) | ✅ Done |
| **LMS-009** | Quản lý khóa học | Đặt khóa học bắt buộc | Bắt buộc hoàn thành mới qua cổng onboarding | Admin LMS | `crs_courses.isMandatory = true` | ✅ Done |
| **LMS-010** | Quản lý khóa học | Đặt khóa học tùy chọn | Khóa khuyến nghị | Admin LMS | `crs_courses.isMandatory = false` | ✅ Done |
| **LMS-011** | Quản lý khóa học | Cấu hình thời hạn hoàn thành khóa học | Deadline học | Admin LMS | `crs_courses.durationDays`, `enr_course_enrollments.dueDate` | ✅ Done |
| **LMS-012** | Quản lý khóa học | Cấu hình điểm đạt khóa học | Pass score | Admin LMS | `crs_courses.passScore`, `quiz_quizzes.passScore` | ✅ Done |
| **LMS-013** | Quản lý video đào tạo | Tải lên video | Upload video bài giảng trực tiếp lên server | Trainer / Admin LMS | `crs_lessons` (`lessonType = 'VIDEO'`, `videoProvider`, `videoUrl`, `videoDuration`) | ✅ Done |
| **LMS-014** | Quản lý video đào tạo | Tạo bài giảng dạng tài liệu PDF | Upload PDF / slide | Trainer / Admin LMS | `crs_lessons` (`lessonType = 'PDF'`, `documentUrl`, `allowDownload`) | ✅ Done |
| **LMS-015** | Quản lý video đào tạo | Tạo bài giảng dạng trang văn bản | Rich text lesson | Trainer / Admin LMS | `crs_lessons` (`lessonType = 'ARTICLE'`, `bodyHtml`, `estimatedReadTime`) | ✅ Done |
| **LMS-016** | Quản lý video đào tạo | Tạo bài giảng dạng hình ảnh / checklist | Ảnh quy trình, SOP | Trainer / Admin LMS | `crs_lessons` (`lessonType = 'CHECKLIST'`, `checklistItems` JSON string) | ✅ Done |
| **LMS-017** | Quản lý video đào tạo | Sắp xếp thứ tự bài giảng trong khóa | Ordering modules / lessons | Admin LMS | `crs_modules.sortOrder`, `crs_lessons.sortOrder` | ✅ Done |
| **LMS-018** | Quản lý video đào tạo | Ẩn / hiện bài giảng | Kiểm soát nội dung phát hành | Admin LMS | `crs_lessons.isVisible` (`Boolean`) | ✅ Done |
| **LMS-019** | Quản lý video đào tạo | Gắn tài liệu SOP vận hành cửa hàng | Gắn SOP CH vào khóa | Vận hành / LMS | `crs_lessons.sopCode`, `crs_lessons.sopType = 'STORE_SOP'`, `requiresSignature` | ✅ Done |
| **LMS-020** | Quản lý video đào tạo | Gắn tài liệu SOP sản xuất | Gắn SOP xưởng vào khóa | SX / LMS | `crs_lessons.sopCode`, `crs_lessons.sopType = 'FACTORY_SOP'`, `requiresSignature` | ✅ Done |
| **LMS-021** | Quản lý video đào tạo | Phiên bản hóa học liệu | Version document / lesson | Admin LMS | `crs_lessons` (`videoDuration`, `estimatedReadTime`, `createdAt`, `updatedAt`) | 🟡 Not Started |
| **LMS-022** | ATTP & chứng chỉ | Tạo khóa đào tạo ATTP bắt buộc | Khóa an toàn thực phẩm | Admin LMS / QA | `crs_courses` (`courseType = 'ATTP'`, `isMandatory = true`) | ✅ Done |
| **LMS-023** | ATTP & chứng chỉ | Ghi nhận hoàn thành khóa ATTP nội bộ | Pass khóa nội bộ | Hệ thống / Trainer | `enr_course_enrollments` (`isPassed = true`) $\rightarrow$ Cấp `cert_user_certificates` | 🔄 In Progress |
| **LMS-024** | ATTP & chứng chỉ | Ghi nhận chứng chỉ ATTP bên ngoài | Upload / ghi chứng chỉ đi học ngoài | Nhân sự / LMS Admin | `cert_user_certificates` (`isExternal = true`, `certificateFileUrl`, `issuingOrganization`) | 🔄 In Progress |
| **LMS-025** | ATTP & chứng chỉ | Lưu ngày cấp chứng chỉ ATTP | Effective date | Nhân sự / LMS | `cert_user_certificates.issueDate` | 🔄 In Progress |
| **LMS-026** | ATTP & chứng chỉ | Lưu ngày hết hạn chứng chỉ ATTP | Expiry date | Nhân sự / LMS | `cert_user_certificates.expiryDate` | 🔄 In Progress |
| **LMS-027** | ATTP & chứng chỉ | Cảnh báo chứng chỉ ATTP sắp hết hạn | Notify trước hạn 30/15/7 ngày | Hệ thống | `cert_user_certificates.status = 'EXPIRING_SOON'`, CronJob Alert | 🔄 In Progress |
| **LMS-028** | ATTP & chứng chỉ | Cảnh báo chứng chỉ ATTP đã hết hạn | Block / cảnh báo mạnh | Hệ thống | `cert_user_certificates.status = 'EXPIRED'` | 🔄 In Progress |
| **LMS-029** | ATTP & chứng chỉ | Chặn xếp ca nếu thiếu ATTP còn hiệu lực | Gate với HRM lịch ca | Hệ thống tích hợp HRM | API Gate Check `GET /api/compliance/attp-check/:userId` | 🟡 Not Started |
| **LMS-030** | ATTP & chứng chỉ | In / xuất giấy xác nhận ATTP | Export certificate | Nhân sự / QA | PDF Generator Service (`certificateCode`, QR Code verification) | 🟡 Not Started |
| **LMS-031** | ATTP & chứng chỉ | Quản lý loại chứng chỉ khác ngoài ATTP | Chứng chỉ nghề / khác | Admin LMS | `cert_types` (`code`, `name`, `defaultValidMonths`) | 🟡 Not Started |
| **LMS-032** | ATTP & chứng chỉ | Gắn chứng chỉ vào hồ sơ học viên | Profile certificates | Hệ thống | `cert_user_certificates.userId` FK $\rightarrow$ `auth_users.id` | 🔄 In Progress |
| **LMS-033** | Onboarding học tập | Tạo lộ trình onboarding cho nhân viên cửa hàng | Learning path CH | Admin LMS / Nhân sự | `path_learning_paths` (`targetScope = 'STORE_STAFF'`) | ✅ Done |
| **LMS-034** | Onboarding học tập | Tạo lộ trình onboarding cho nhân viên sản xuất | Learning path SX | Admin LMS / SX | `path_learning_paths` (`targetScope = 'FACTORY_STAFF'`) | ✅ Done |
| **LMS-035** | Onboarding học tập | Tạo lộ trình onboarding cho quản lý cửa hàng | Learning path QLCH | Admin LMS | `path_learning_paths` (`targetScope = 'STORE_MANAGER'`) | ✅ Done |
| **LMS-036** | Onboarding học tập | Tạo lộ trình onboarding cho nhân viên tăng cường | Learning path TC | Admin LMS / Nhân sự | `path_learning_paths` (`targetScope = 'REINFORCEMENT'`) | ✅ Done |
| **LMS-037** | Onboarding học tập | Tạo lộ trình onboarding cho học việc | Path riêng giai đoạn học việc | Admin LMS | `path_learning_paths` (`targetScope = 'PROBATION'`) | ✅ Done |
| **LMS-038** | Onboarding học tập | Tự gán lộ trình khi nhân sự vào status Học việc | Auto-enroll từ HRM status | Hệ thống tích hợp HRM | `path_auto_assign_rules` (`triggerStatus = 'PROBATION'`) | ✅ Done |
| **LMS-039** | Onboarding học tập | Tự gán lộ trình khi nhận việc chính thức | Auto-enroll khi chính thức | Hệ thống tích hợp HRM | `path_auto_assign_rules` (`triggerStatus = 'OFFICIAL'`) | ✅ Done |
| **LMS-040** | Onboarding học tập | Theo dõi % hoàn thành lộ trình onboarding | Progress % | NV / QL / Nhân sự | `path_user_progress.completionPercentage` | ✅ Done |
| **LMS-041** | Onboarding học tập | Cảnh báo học viên chậm tiến độ onboarding | Reminder | Hệ thống | `path_user_reminders` | 🔄 In Progress |
| **LMS-042** | Onboarding học tập | Xác nhận hoàn tất onboarding học tập | Mark learning onboarding done $\rightarrow$ gửi HRM | Hệ thống / QL | `path_user_progress.status = 'COMPLETED'` | ✅ Done |
| **LMS-043** | Onboarding học tập | Checklist học tập song song checklist HR | Phân biệt hạng mục học vs giấy tờ HR | Nhân sự / LMS | `path_onboarding_checklists` (`type = 'LEARNING'` vs `'HR'`) | ✅ Done |
| **LMS-044** | Quản lý học viên | Thêm mới học viên | Tạo tài khoản học viên thủ công | Admin LMS / Nhân sự | `POST /api/users` $\rightarrow$ Insert `auth_users` & `auth_user_accounts` | ✅ Done |
| **LMS-045** | Quản lý học viên | Ghi danh hàng loạt theo cửa hàng | Bulk enroll CH | Admin LMS | `CourseService.assignToStore()` $\rightarrow$ Bulk insert `enr_course_enrollments` | ✅ Done |
| **LMS-046** | Quản lý học viên | Ghi danh hàng loạt theo bộ phận | Bulk enroll BP | Admin LMS | `CourseService.assignToDepartment()` $\rightarrow$ Bulk insert `enr_course_enrollments` | ✅ Done |
| **LMS-047** | Quản lý học viên | Hủy ghi danh học viên | Unenroll | Admin LMS | `enr_course_enrollments.status = 'CANCELLED'` | ✅ Done |
| **LMS-048** | Quản lý học viên | Xem danh sách khóa của tôi | My courses | Học viên | Query `enr_course_enrollments` JOIN `crs_courses` (Portal Dashboard) | ✅ Done |
| **LMS-049** | Quản lý học viên | Mở bài giảng để học | Launch lesson | Học viên | `enr_lesson_progress` record initialization | ✅ Done |
| **LMS-050** | Quản lý học viên | Đánh dấu hoàn thành bài giảng | Complete lesson (auto/manual) | Hệ thống / Học viên | `enr_lesson_progress.isCompleted = true`, `completedAt = now()` | ✅ Done |
| **LMS-051** | Quản lý học viên | Lưu tiến độ học dở | Resume learning | Hệ thống | `enr_lesson_progress.lastPositionSeconds` | ✅ Done |
| **LMS-052** | Quản lý học viên | Học trên web | Desktop learning portal | Học viên | Next.js App Router (`/lms/lessons/[id]`) | ✅ Done |
| **LMS-053** | Quản lý học viên | Học trên APP di động | Mobile learning | Học viên | Mobile Responsive PWA / API Endpoints | 🟡 Not Started |
| **LMS-054** | Quản lý học viên | Tải tài liệu học (nếu được phép) | Download handout | Học viên | `crs_lessons.allowDownload = true` | ✅ Done |
| **LMS-055** | Quản lý học viên | Ghi nhận thời gian học (learning time) | Tracking duration | Hệ thống | `ProgressService.updateLessonProgress()` | ✅ Done |
| **LMS-056** | Kiểm tra & đánh giá | Tạo ngân hàng câu hỏi | Question bank | Trainer / Admin LMS | `quiz_questions` (`quizId`, `questionText`, `points`, `sortOrder`) | ✅ Done |
| **LMS-057** | Kiểm tra & đánh giá | Tạo câu hỏi trắc nghiệm một đáp án | Single choice | Trainer | `quiz_questions` (`questionType = 'SINGLE_CHOICE'`), `quiz_question_options` | ✅ Done |
| **LMS-058** | Kiểm tra & đánh giá | Tạo câu hỏi trắc nghiệm nhiều đáp án | Multiple choice | Trainer | `quiz_questions` (`questionType = 'MULTIPLE_CHOICE'`), `quiz_question_options` | ✅ Done |
| **LMS-059** | Kiểm tra & đánh giá | Tạo câu hỏi đúng/sai | True/false | Trainer | `quiz_questions` (`questionType = 'TRUE_FALSE'`) | ✅ Done |
| **LMS-060** | Kiểm tra & đánh giá | Tạo câu hỏi tự luận ngắn | Short answer | Trainer | `quiz_questions` (`questionType = 'SHORT_ANSWER'`) | ✅ Done |
| **LMS-061** | Kiểm tra & đánh giá | Tạo bài kiểm tra (quiz) gắn khóa học | Attach quiz to course / lesson | Trainer / Admin LMS | `quiz_quizzes` (`lessonId` 1-to-1 với `crs_lessons`) | ✅ Done |
| **LMS-062** | Kiểm tra & đánh giá | Cấu hình số lần được làm lại bài kiểm tra | Retake limit | Admin LMS | `quiz_quizzes.maxAttempts` (mặc định 3 lần) | ✅ Done |
| **LMS-063** | Kiểm tra & đánh giá | Cấu hình thời gian làm bài | Time limit | Admin LMS | `quiz_quizzes.timeLimitMinutes` (mặc định 30 phút) | ✅ Done |
| **LMS-064** | Kiểm tra & đánh giá | Xáo trộn câu hỏi | Shuffle questions | Admin LMS | `quiz_quizzes.shuffleQuestions = true` | ✅ Done |
| **LMS-065** | Kiểm tra & đánh giá | Học viên làm bài kiểm tra | Take quiz | Học viên | Next.js Quiz Interface (`/lms/quizzes/[id]`) | ✅ Done |
| **LMS-066** | Kiểm tra & đánh giá | Chấm điểm tự động bài trắc nghiệm | Auto grading | Hệ thống | `QuizService.submitQuiz()` $\rightarrow$ Tính điểm so khớp `QuizQuestionOption.isCorrect` | ✅ Done |
| **LMS-067** | Kiểm tra & đánh giá | Chấm điểm thủ công câu tự luận | Manual grading | Trainer | `quiz_attempt_answers.earnedPoints` do Trainer chấm | 🔄 In Progress |
| **LMS-068** | Kiểm tra & đánh giá | Xem kết quả bài kiểm tra | Score report for learner | Học viên | `quiz_attempts` (`score`, `isPassed`, `submittedAt`) | ✅ Done |
| **LMS-069** | Kiểm tra & đánh giá | Xem lịch sử làm bài | Attempt history | Học viên / Trainer | Query `quiz_attempts` JOIN `quiz_attempt_answers` | ✅ Done |
| **LMS-070** | Kiểm tra & đánh giá | Đạt / không đạt khóa theo điểm kiểm tra | Pass/fail course | Hệ thống | `QuizAttempt.isPassed` $\rightarrow$ Cập nhật `CourseEnrollment.isPassed = true` | ✅ Done |
| **LMS-071** | Kiểm tra & đánh giá | Tạo bảng xếp hạng điểm học tập | Leaderboard theo điểm quiz/học | Admin LMS | `gam_leaderboard` (`userId`, `totalPoints`, `rank`) | 🟡 Not Started |
| **LMS-072** | Kiểm tra & đánh giá | Tạo thử thách học tập theo tuần/tháng | Challenge kỳ | Admin LMS | `gam_challenges` (`startDate`, `endDate`, `rewardPoints`) | 🟡 Not Started |
| **LMS-073** | Kiểm tra & đánh giá | Cộng điểm thưởng khi hoàn thành khóa đúng hạn | Bonus points | Hệ thống | `gam_point_transactions` (`points`, `reason = 'EARLY_COMPLETION'`) | 🟡 Not Started |
| **LMS-074** | Kiểm tra & đánh giá | Hiển thị huy hiệu hoàn thành khóa | Badges | Hệ thống | `gam_badges`, `gam_user_badges` | 🟡 Not Started |
| **LMS-075** | Kiểm tra & đánh giá | Báo cáo người dẫn đầu theo cửa hàng | Leaderboard theo CH | QL / Nhân sự | View `v_gam_store_leaderboard` | 🟡 Not Started |
| **LMS-076** | Đánh giá thực hành & mentor | Tạo phiếu đánh giá thực hành tại cửa hàng | Checklist kỹ năng on-the-job | Admin LMS / Vận hành | `eval_templates` (`category = 'STORE'`, `checklistSchema`) | 🟡 Not Started |
| **LMS-077** | Đánh giá thực hành & mentor | Tạo phiếu đánh giá thực hành tại sản xuất | Checklist kỹ năng xưởng | Admin LMS / SX | `eval_templates` (`category = 'FACTORY'`, `checklistSchema`) | 🟡 Not Started |
| **LMS-078** | Đánh giá thực hành & mentor | Mentor chấm đánh giá học việc trên LMS | Mentor submit evaluation | Mentor / QLCH | `eval_submissions` (`mentorUserId`, `score`, `result = 'PENDING'`) | 🟡 Not Started |
| **LMS-079** | Đánh giá thực hành & mentor | QLCH xác nhận đánh giá thực hành | Confirm evaluation | QLCH | `eval_submissions.managerApprovalStatus = 'APPROVED'` | 🟡 Not Started |
| **LMS-080** | Đánh giá thực hành & mentor | Gửi kết quả đánh giá thực hành sang HRM | Tín hiệu đạt để chuyển status | Hệ thống tích hợp | Webhook `int_outbound_events` (`eventType = 'PRACTICAL_EVAL_PASSED'`) | 🟡 Not Started |
| **LMS-081** | Đánh giá thực hành & mentor | Lưu lịch sử đánh giá thực hành | History evaluations | LMS / Nhân sự | Query `eval_submissions` theo `studentUserId` | 🟡 Not Started |
| **LMS-082** | Đánh giá thực hành & mentor | Gán mentor trong LMS (đồng bộ từ HRM) | Hiển thị mentor–mentee | Hệ thống | `org_mentor_mentee_mappings` (`mentorUserId`, `menteeUserId`) | 🟡 Not Started |
| **LMS-083** | Lớp học & lịch đào tạo | Tạo lớp đào tạo tập trung | Offline / online class session | Admin LMS / Trainer | `cls_classes` (`title`, `location`, `scheduleTime`, `trainerUserId`) | 🟡 Not Started |
| **LMS-084** | Lớp học & lịch đào tạo | Mở điểm danh lớp đào tạo | Attendance for training class | Trainer | `cls_classes.isAttendanceOpen = true` | 🟡 Not Started |
| **LMS-085** | Lớp học & lịch đào tạo | Ghi nhận tham dự lớp đào tạo | Mark present / absent | Trainer | `cls_attendances` (`classId`, `userId`, `status = 'PRESENT'`) | 🟡 Not Started |
| **LMS-086** | Lớp học & lịch đào tạo | Gắn lớp với khóa học | Class linked to course | Admin LMS | `cls_classes.courseId` FK $\rightarrow$ `crs_courses.id` | 🟡 Not Started |
| **LMS-087** | Lớp học & lịch đào tạo | Thông báo lịch học cho học viên | Notify schedule | Hệ thống | `cls_notifications` | 🟡 Not Started |
| **LMS-088** | Lớp học & lịch đào tạo | Đăng ký tham gia lớp học | Learner register class | Học viên | `cls_attendances.registeredAt = now()` | 🟡 Not Started |
| **LMS-089** | Lớp học & lịch đào tạo | Giới hạn sĩ số lớp | Capacity | Admin LMS | `cls_classes.maxCapacity` | 🟡 Not Started |
| **LMS-090** | Khảo sát & xác nhận | Tạo form xác nhận đã đọc quy trình | Acknowledge SOP | Admin LMS | `crs_lessons` (`sopCode`, `requiresSignature = true`) | ✅ Done |
| **LMS-091** | Khảo sát & xác nhận | Học viên ký xác nhận đã hiểu quy định | E-sign / confirm understanding | Học viên | `sop_confirmations` (`userId`, `lessonId`, `signatureData`, `signedAt`) | ✅ Done |
| **LMS-092** | Khảo sát & xác nhận | Tạo khảo sát mức độ hiểu bài | Feedback survey | Admin LMS | `srv_surveys` (`category = 'LESSON_FEEDBACK'`) | 🟡 Not Started |
| **LMS-093** | Khảo sát & xác nhận | Tạo khảo sát chất lượng khóa học | Course rating | Admin LMS | `srv_surveys` (`courseId`, `ratingScale`) | 🟡 Not Started |
| **LMS-094** | Phân tích hiệu quả | Báo cáo tỷ lệ hoàn thành khóa theo cửa hàng | % complete by store | Nhân sự / QL / GD | Query `enr_course_enrollments` GROUP BY `User.storeId` | ✅ Done |
| **LMS-095** | Phân tích hiệu quả | Báo cáo tỷ lệ hoàn thành khóa theo bộ phận sản xuất | % complete by dept | SX / Nhân sự | Query `enr_course_enrollments` GROUP BY `User.departmentId` | ✅ Done |
| **LMS-096** | Phân tích hiệu quả | Báo cáo học viên chưa hoàn thành onboarding | List overdue | Nhân sự / QLCH | Query `enr_course_enrollments` WHERE `dueDate < now()` AND `status != 'COMPLETED'` | ✅ Done |
| **LMS-097** | Phân tích hiệu quả | Báo cáo chứng chỉ ATTP còn hạn / hết hạn | Certificate status | QA / Nhân sự | Query `cert_user_certificates` GROUP BY `status` | 🔄 In Progress |
| **LMS-098** | Phân tích hiệu quả | Báo cáo kết quả quiz theo khóa | Score analytics | Trainer / Nhân sự | Query `quiz_attempts` (`avgScore`, `passRate`) | ✅ Done |
| **LMS-099** | Phân tích hiệu quả | Báo cáo thời gian đào tạo theo kỳ | Learning hours | Nhân sự / GD | Sum `LessonProgress.lastPositionSeconds` by Period | 🔄 In Progress |
| **LMS-100** | Phân tích hiệu quả | Báo cáo mentor – số học việc đang kèm | Mentor workload | Nhân sự | Query `org_mentor_mentee_mappings` COUNT `menteeUserId` | 🟡 Not Started |
| **LMS-101** | Phân tích hiệu quả | Xuất báo cáo đào tạo ra Excel | Export | Nhân sự / Admin LMS | Export Service (ExcelJS / SheetJS) | 🔄 In Progress |
| **LMS-102** | Phân tích hiệu quả | Phân quyền Admin LMS | Role quản trị nội dung | Admin hệ thống | `Role.roleName = 'ADMIN'`, `Permission.permissionCode = 'COURSE.CREATE'` | ✅ Done |
| **LMS-103** | Quản trị & tích hợp | Phân quyền Trainer | Role tạo bài / chấm | Admin hệ thống | `Role.roleName = 'TRAINER'`, `Permission.permissionCode = 'QUIZ.GRADE'` | ✅ Done |
| **LMS-104** | Quản trị & tích hợp | Phân quyền xem báo cáo đào tạo | Role report viewer | Admin hệ thống | `Role.roleName = 'REPORT_VIEWER'`, `Permission.permissionCode = 'REPORT.VIEW'` | ✅ Done |
| **LMS-105** | Quản trị & tích hợp | Đồng bộ danh sách nhân sự từ HRM sang LMS | Sync users / org from HRM | Hệ thống | Inbound Sync API $\rightarrow$ Upsert `auth_users`, `org_stores`, `org_departments` | ✅ Done |
| **LMS-106** | Quản trị & tích hợp | Đồng bộ trạng thái nhân sự từ HRM | Sync status Học việc / Chính thức / Nghỉ | Hệ thống | Webhook Receiver $\rightarrow$ Update `User.employmentStatus` | ✅ Done |
| **LMS-107** | Quản trị & tích hợp | Gửi sự kiện hoàn thành khóa sang HRM | Webhook / event completed course | Hệ thống | Outbound Event Bus (`eventType = 'COURSE_COMPLETED'`) | 🔄 In Progress |
| **LMS-108** | Quản trị & tích hợp | Gửi sự kiện đạt đánh giá thực hành sang HRM | Event practical pass | Hệ thống | Outbound Event Bus (`eventType = 'EVAL_PASSED'`) | 🔄 In Progress |
| **LMS-109** | Quản trị & tích hợp | Single Sign-On với APP nhân viên | Một tài khoản học + HR | IT | JWT Auth Shared Secret / SSO Token Handler | 🔄 In Progress |
| **LMS-110** | Quản trị & tích hợp | Nhật ký thao tác LMS (audit log) | Ai sửa khóa / điểm... | Admin | `sys_audit_logs` (`userId`, `action`, `resource`, `timestamp`) | 🔄 In Progress |
| **LMS-111** | Quản trị & tích hợp | Sao lưu nội dung đào tạo | Backup courses / materials | Admin / IT | Backup Engine (`pg_dump` & S3 snapshot) | 🔄 In Progress |

---

## 3. TOÀN BỘ PRISMA SCHEMA CỐT LÕI (PRODUCTION SCHEMA)

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ==========================================
// 1. AUTHENTICATION & RBAC (ERP-v2 1-to-1)
// ==========================================

model User {
  id               String   @id @default(uuid())
  employeeCode     String?  @unique
  fullName         String
  email            String?  @unique
  status           String   @default("ACTIVE") // 'ACTIVE', 'LOCKED', 'PENDING'
  isActive         Boolean  @default(true)
  userType         String   @default("EMPLOYEE") // 'EMPLOYEE', 'CUSTOMER', 'SYSTEM_ADMIN'
  employmentStatus String   @default("PROBATION") // 'PROBATION', 'OFFICIAL', 'TEMPORARY', 'RESIGNED'

  // Org Structure Links
  storeId      String?
  store        Store?      @relation(fields: [storeId], references: [id])
  departmentId String?
  department   Department? @relation(fields: [departmentId], references: [id])
  positionId   String?
  position     Position?   @relation(fields: [positionId], references: [id])

  // Relations
  userAccount    UserAccount?
  userRoles      UserRole[]
  enrollments    CourseEnrollment[]
  lessonProgress LessonProgress[]
  quizAttempts   QuizAttempt[]

  createdAt DateTime @default(now())
  updatedAt DateTime @default(now()) @updatedAt

  @@map("auth_users")
}

model UserAccount {
  id                    String    @id @default(uuid())
  userId                String    @unique
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  loginEmail            String    @unique
  passwordHash          String
  isLocked              Boolean   @default(false)
  failedLoginCount      Int       @default(0)
  refreshToken          String?
  refreshTokenExpiresAt DateTime?
  lastLoginAt           DateTime?

  createdAt DateTime @default(now())
  updatedAt DateTime @default(now()) @updatedAt

  @@map("auth_user_accounts")
}

model Role {
  id              String   @id @default(uuid())
  roleName        String   @unique
  displayName     String
  isSystemRole    Boolean  @default(false)
  bypassDataScope Boolean  @default(false)
  isActive        Boolean  @default(true)

  userRoles       UserRole[]
  rolePermissions RolePermission[]

  createdAt DateTime @default(now())
  updatedAt DateTime @default(now()) @updatedAt

  @@map("auth_roles")
}

model Permission {
  id             String   @id @default(uuid())
  permissionCode String   @unique // e.g. 'USER.READ', 'COURSE.CREATE', 'ATTP.VIEW'
  permissionName String
  module         String
  action         String
  resource       String
  isActive       Boolean  @default(true)

  rolePermissions RolePermission[]

  createdAt DateTime @default(now())
  updatedAt DateTime @default(now()) @updatedAt

  @@map("auth_permissions")
}

model UserRole {
  id         String    @id @default(uuid())
  userId     String
  user       User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  roleId     String
  role       Role      @relation(fields: [roleId], references: [id], onDelete: Cascade)
  assignedAt DateTime  @default(now())
  expiresAt  DateTime?
  revokedAt  DateTime?
  isActive   Boolean   @default(true)

  @@map("auth_user_roles")
}

model RolePermission {
  id           String     @id @default(uuid())
  roleId       String
  role         Role       @relation(fields: [roleId], references: [id], onDelete: Cascade)
  permissionId String
  permission   Permission @relation(fields: [permissionId], references: [id], onDelete: Cascade)
  assignedAt   DateTime   @default(now())

  @@unique([roleId, permissionId])
  @@map("auth_role_permissions")
}

// ==========================================
// 2. ORG STRUCTURE MODULE
// ==========================================

model Store {
  id            String   @id @default(uuid())
  storeCode     String   @unique
  storeName     String
  region        String   @default("MIEN_NAM")
  storeType     String   @default("RETAIL_STORE") // 'RETAIL_STORE', 'CENTRAL_FACTORY'
  isActive      Boolean  @default(true)
  users         User[]
  targetCourses Course[]

  createdAt DateTime @default(now())
  updatedAt DateTime @default(now()) @updatedAt

  @@map("org_stores")
}

model Department {
  id            String   @id @default(uuid())
  deptCode      String   @unique
  deptName      String
  isFactoryDept Boolean  @default(false)
  isActive      Boolean  @default(true)
  users         User[]
  targetCourses Course[]

  createdAt DateTime @default(now())
  updatedAt DateTime @default(now()) @updatedAt

  @@map("org_departments")
}

model Position {
  id            String   @id @default(uuid())
  positionCode  String   @unique
  positionName  String
  levelRank     Int      @default(1)
  isActive      Boolean  @default(true)
  users         User[]
  targetCourses Course[]

  createdAt DateTime @default(now())
  updatedAt DateTime @default(now()) @updatedAt

  @@map("org_positions")
}

// ==========================================
// ENUMS FOR CURRICULUM & QUIZ
// ==========================================

enum LessonType {
  VIDEO
  ARTICLE
  QUIZ
  PDF
  CHECKLIST
}

enum VideoProvider {
  YOUTUBE
  DIRECT_UPLOAD
  EXTERNAL_URL
}

enum QuestionType {
  SINGLE_CHOICE
  MULTIPLE_CHOICE
  TRUE_FALSE
  SHORT_ANSWER
}

// ==========================================
// 3. COURSE & CURRICULUM MODULE
// ==========================================

model Category {
  id          String   @id @default(uuid())
  code        String   @unique
  name        String
  description String?
  sortOrder   Int      @default(0)
  isActive    Boolean  @default(true)
  courses     Course[]

  createdAt DateTime @default(now())
  updatedAt DateTime @default(now()) @updatedAt

  @@map("crs_categories")
}

model Course {
  id           String   @id @default(uuid())
  code         String   @unique
  title        String
  slug         String   @unique
  description  String?
  thumbnailUrl String?
  categoryId   String
  category     Category @relation(fields: [categoryId], references: [id])

  courseType   String   @default("STANDARD") // 'ATTP', 'ONBOARDING', 'STANDARD'
  isMandatory  Boolean  @default(false)
  durationDays Int?     @default(30)
  passScore    Int      @default(80)

  // Target fields for auto-assign rules (LMS-005 -> LMS-008)
  targetPositionId       String?
  targetPosition         Position?   @relation(fields: [targetPositionId], references: [id])
  targetDepartmentId     String?
  targetDepartment       Department? @relation(fields: [targetDepartmentId], references: [id])
  targetStoreId          String?
  targetStore            Store?      @relation(fields: [targetStoreId], references: [id])
  targetEmploymentStatus String?     // 'PROBATION', 'OFFICIAL', 'TEMPORARY', 'ALL'

  isCommercial Boolean  @default(false)
  isInternal   Boolean  @default(true)
  status       String   @default("DRAFT") // 'DRAFT', 'PUBLISHED', 'ARCHIVED'
  isActive     Boolean  @default(true)

  modules     CourseModule[]
  enrollments CourseEnrollment[]

  createdAt DateTime @default(now())
  updatedAt DateTime @default(now()) @updatedAt

  @@index([categoryId])
  @@index([status, isActive])
  @@map("crs_courses")
}

model CourseModule {
  id        String   @id @default(uuid())
  courseId  String
  course    Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  title     String
  sortOrder Int      @default(1)
  lessons   Lesson[]

  createdAt DateTime @default(now())
  updatedAt DateTime @default(now()) @updatedAt

  @@index([courseId, sortOrder])
  @@map("crs_modules")
}

model Lesson {
  id                String         @id @default(uuid())
  moduleId          String
  module            CourseModule   @relation(fields: [moduleId], references: [id], onDelete: Cascade)
  title             String
  description       String?
  lessonType        LessonType     @default(VIDEO)
  
  // 1. Video content (YouTube & Upload)
  videoProvider     VideoProvider? @default(YOUTUBE)
  videoUrl          String?
  videoStoragePath  String?
  videoDuration     Int            @default(0) // Giây
  
  // 2. Article & Document content
  bodyHtml          String?
  documentUrl       String?
  estimatedReadTime Int            @default(5) // Phút
  checklistItems    String?        // JSON string
  
  // 3. SOP & Compliance
  sopCode           String?
  sopType           String?        // 'STORE_SOP', 'FACTORY_SOP'
  requiresSignature Boolean        @default(false)
  
  // 4. Settings
  allowDownload     Boolean        @default(false)
  isVisible         Boolean        @default(true)
  sortOrder         Int            @default(1)

  // 5. Relations
  quiz              Quiz?
  progressRecords   LessonProgress[]

  createdAt DateTime @default(now())
  updatedAt DateTime @default(now()) @updatedAt

  @@index([moduleId, sortOrder])
  @@map("crs_lessons")
}

// ==========================================
// 4. QUIZ & ASSESSMENT MODULE
// ==========================================

model Quiz {
  id                 String         @id @default(uuid())
  lessonId           String         @unique
  lesson             Lesson         @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  
  title              String
  description        String?
  passScore          Int            @default(80) // % điểm đạt
  maxAttempts        Int            @default(3)  // 0 = không giới hạn
  timeLimitMinutes   Int?           @default(30) // null = không giới hạn
  shuffleQuestions   Boolean        @default(true)
  showAnswerFeedback Boolean        @default(true)

  questions          QuizQuestion[]
  attempts           QuizAttempt[]

  createdAt DateTime @default(now())
  updatedAt DateTime @default(now()) @updatedAt

  @@map("quiz_quizzes")
}

model QuizQuestion {
  id           String             @id @default(uuid())
  quizId       String
  quiz         Quiz               @relation(fields: [quizId], references: [id], onDelete: Cascade)
  
  questionText String
  questionType QuestionType       @default(SINGLE_CHOICE)
  points       Float              @default(1.0)
  explanation  String?
  sortOrder    Int                @default(1)
  
  options      QuizQuestionOption[]
  answers      QuizAttemptAnswer[]

  createdAt DateTime @default(now())
  updatedAt DateTime @default(now()) @updatedAt

  @@index([quizId, sortOrder])
  @@map("quiz_questions")
}

model QuizQuestionOption {
  id          String       @id @default(uuid())
  questionId  String
  question    QuizQuestion @relation(fields: [questionId], references: [id], onDelete: Cascade)
  
  optionText  String
  isCorrect   Boolean      @default(false)
  sortOrder   Int          @default(1)

  @@index([questionId, sortOrder])
  @@map("quiz_question_options")
}

model QuizAttempt {
  id            String              @id @default(uuid())
  quizId        String
  quiz          Quiz                @relation(fields: [quizId], references: [id], onDelete: Cascade)
  userId        String
  user          User                @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  attemptNumber Int                 @default(1)
  score         Float               @default(0.0) // % điểm đạt
  isPassed      Boolean             @default(false)
  startedAt     DateTime            @default(now())
  submittedAt   DateTime?

  answers       QuizAttemptAnswer[]

  createdAt DateTime @default(now())
  updatedAt DateTime @default(now()) @updatedAt

  @@index([quizId, userId])
  @@index([userId, isPassed])
  @@map("quiz_attempts")
}

model QuizAttemptAnswer {
  id               String       @id @default(uuid())
  attemptId        String
  attempt          QuizAttempt  @relation(fields: [attemptId], references: [id], onDelete: Cascade)
  questionId       String
  question         QuizQuestion @relation(fields: [questionId], references: [id], onDelete: Cascade)
  
  selectedOptionId String?
  textAnswer       String?
  isCorrect        Boolean?
  earnedPoints     Float        @default(0.0)

  createdAt DateTime @default(now())

  @@index([attemptId])
  @@map("quiz_attempt_answers")
}

// ==========================================
// 5. ENROLLMENT & PROGRESS MODULE
// ==========================================

model CourseEnrollment {
  id                   String           @id @default(uuid())
  userId               String
  user                 User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  courseId             String
  course               Course           @relation(fields: [courseId], references: [id], onDelete: Cascade)

  enrollmentSource     String           @default("MANUAL") // 'AUTO_RULE', 'MANUAL', 'PURCHASE'
  status               String           @default("ENROLLED") // 'ENROLLED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'
  dueDate              DateTime?
  completionPercentage Float            @default(0.0)
  isPassed             Boolean          @default(false)

  enrolledAt           DateTime         @default(now())
  completedAt          DateTime?

  lessonProgress       LessonProgress[]

  createdAt DateTime @default(now())
  updatedAt DateTime @default(now()) @updatedAt

  @@unique([userId, courseId])
  @@index([userId, status])
  @@map("enr_course_enrollments")
}

model LessonProgress {
  id                  String           @id @default(uuid())
  enrollmentId        String
  enrollment          CourseEnrollment @relation(fields: [enrollmentId], references: [id], onDelete: Cascade)
  userId              String
  user                User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  lessonId            String
  lesson              Lesson           @relation(fields: [lessonId], references: [id], onDelete: Cascade)

  isCompleted         Boolean          @default(false)
  lastPositionSeconds Int              @default(0)
  quizHighestScore    Float?           // Điểm cao nhất nếu bài học là Quiz
  completedAt         DateTime?

  createdAt DateTime @default(now())
  updatedAt DateTime @default(now()) @updatedAt

  @@unique([userId, lessonId])
  @@index([enrollmentId])
  @@map("enr_lesson_progress")
}
```

Phân khu Module|Số lượng Model|Các Bảng Database (@@map) trong Prisma|Trạng thái đồng bộ
1. Auth & RBAC (Chuẩn ERP-v2)|6 Models |auth_users, auth_user_accounts, auth_roles, auth_permissions, auth_user_roles, auth_role_permissions|✅ Khớp 100%
2. Sơ đồ Tổ chức F&B (Org)|3 Models |org_stores, org_departments, org_positions|✅ Khớp 100%
3. Khóa học & Học liệu (Curriculum)|4 Models + 2 Enums |crs_categories, crs_courses, crs_modules, crs_lessons (Enums: LessonType, VideoProvider)|✅ Khớp 100%
4. Quiz & Ngân hàng câu hỏi|5 Models + 1 Enum |quiz_quizzes, quiz_questions, quiz_question_options, quiz_attempts, quiz_attempt_answers (Enum: QuestionType)|✅ Khớp 100%
5. Ghi danh & Tiến độ học|2 Models |enr_course_enrollments, enr_lesson_progress|✅ Khớp 100%
