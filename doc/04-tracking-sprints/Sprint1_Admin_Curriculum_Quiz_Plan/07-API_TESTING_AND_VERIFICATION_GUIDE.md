# KẾ HOẠCH MỞ RỘNG SPRINT 1: ADMIN CURRICULUM & QUIZ BUILDER
## 07. HƯỚNG DẪN KIỂM THỬ API VÀ ĐỐI CHIẾU DỮ LIỆU SUPABASE (API TESTING & VERIFICATION GUIDE)

> **Mục tiêu:** Cung cấp tài liệu kịch bản kiểm thử (Test Cases), bộ lệnh cURL / REST Client và hướng dẫn đối chiếu trực tiếp trên Dashboard Supabase Cloud để xác thực toàn bộ tính năng Backend đã hoạt động chính xác 100%.  
> **Thư mục:** `Practice/LogiX/doc/04-tracking-sprints/Sprint1_Admin_Curriculum_Quiz_Plan/`  

---

## 1. TỔNG HỢP CÁC ENDPOINT BACKEND ĐÃ TRIỂN KHAI

| Module | Method | Endpoint | Quyền hạn (RBAC) | Chức năng |
|---|---|---|---|---|
| **Curriculum Tree** | `GET` | `/api/courses/:id/curriculum` | Public / Learner / Admin | Lấy toàn bộ cây Chương & Bài học (kèm Quiz metadata) |
| **Modules** | `POST` | `/api/courses/:id/modules` | `COURSE.CREATE` | Tạo Chương học mới |
| **Modules** | `PUT` | `/api/courses/modules/:moduleId` | `COURSE.CREATE` | Cập nhật tên/thứ tự Chương |
| **Modules** | `DELETE` | `/api/courses/modules/:moduleId` | `COURSE.CREATE` | Xóa Chương (Cascade xóa bài học & quiz bên trong) |
| **Modules** | `POST` | `/api/courses/:id/modules/reorder` | `COURSE.CREATE` | Sắp xếp lại thứ tự các Chương |
| **Lessons** | `POST` | `/api/lessons/modules/:moduleId` | `COURSE.CREATE` | Tạo Bài học mới (Video YouTube/Upload, Article, Quiz) |
| **Lessons** | `GET` | `/api/lessons/:id` | Public / Learner / Admin | Lấy chi tiết bài học (kèm đầy đủ đề thi nếu là QUIZ) |
| **Lessons** | `PUT` | `/api/lessons/:id` | `COURSE.CREATE` | Cập nhật bài học |
| **Lessons** | `DELETE` | `/api/lessons/:id` | `COURSE.CREATE` | Xóa bài học |
| **Lessons** | `POST` | `/api/lessons/modules/:moduleId/reorder`| `COURSE.CREATE` | Sắp xếp lại thứ tự bài học trong Chương |
| **Lessons** | `POST` | `/api/lessons/parse-youtube` | Public | Utility trích xuất Video ID, Embed URL và Thumbnail |
| **Quiz Config** | `GET` | `/api/quizzes/lessons/:lessonId` | Public / Trainer | Lấy Quiz theo Bài học (Tự khởi tạo nếu chưa có) |
| **Quiz Config** | `GET` | `/api/quizzes/:id` | Public / Trainer | Lấy chi tiết bài kiểm tra |
| **Quiz Config** | `PUT` | `/api/quizzes/:id` | `COURSE.CREATE` | Cập nhật điểm đạt (Pass score), số lần thi, thời gian |
| **Quiz Questions**| `POST` | `/api/quizzes/:quizId/questions` | `COURSE.CREATE` | Thêm câu hỏi mới kèm danh sách lựa chọn đáp án |
| **Quiz Questions**| `PUT` | `/api/quizzes/questions/:questionId` | `COURSE.CREATE` | Sửa nội dung câu hỏi & danh sách đáp án |
| **Quiz Questions**| `DELETE` | `/api/quizzes/questions/:questionId` | `COURSE.CREATE` | Xóa câu hỏi khỏi đề thi |
| **Quiz Questions**| `POST` | `/api/quizzes/:quizId/questions/reorder`| `COURSE.CREATE` | Sắp xếp lại thứ tự câu hỏi |
| **Quiz Preview** | `GET` | `/api/quizzes/:id/preview` | Public / Trainer | Xem trước đề thi hoàn chỉnh (Preview Mode) |

---

## 2. CHẠY KIỂM THỬ TỰ ĐỘNG END-TO-END (AUTOMATED TEST SCRIPT)

Backend đã tích hợp sẵn script kiểm thử tự động toàn diện [test-curriculum-quiz.ts](file:///c:/Projects/DigiFnb/Practice/LogiX/backend/src/test-curriculum-quiz.ts). Bạn có thể chạy ngay lệnh sau tại thư mục `backend/`:

```bash
cd backend
npx ts-node-dev --transpile-only src/test-curriculum-quiz.ts
```

### Kết quả mong đợi trên Terminal:
```
🚀 Bắt đầu Kiểm thử Tự động Toàn diện: Curriculum Tree & Quiz Builder (Coursera-Style)...

✅ [1/8] Tìm thấy các khóa học trong Database Supabase.
✅ [2/8] Tải Cây Chương trình học (GET /curriculum) thành công 100%.
✅ [3/8] Tạo Chương học mới (Module 2) thành công.
✅ [4/8] Tạo Bài học 1: Video MP4 Tự Upload thành công.
✅ [5/8] Tạo Bài học 2: QUIZ Lesson thành công (Tự động khởi tạo Quiz ID).
✅ [6/8] Đã thêm 2 câu hỏi trắc nghiệm vào Đề thi (Single Choice + True/False).
✅ [7/8] Preview Đề thi hiển thị hoàn hảo (Đáp án đúng, Giải thích, Điểm số).
✅ [8/8] Trích xuất YouTube link (VideoID, EmbedUrl, Thumbnail) thành công.

🎉 TẤT CẢ 8 HẠNG MỤC KIỂM THỬ END-TO-END ĐỀU ĐẠT CHUẨN 100%!
```

---

## 3. BỘ LỆNH CURL TEST TỪNG API (THỦ CÔNG / POSTMAN)

### Bước 1: Đăng nhập Admin lấy JWT Access Token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "loginEmail": "admin@bahung.com",
    "password": "Password123"
  }'
```
> 👉 *Sao chép chuỗi `accessToken` nhận được trong `data.accessToken` và gán vào Header: `Authorization: Bearer <TOKEN>` cho các request dưới đây.*

---

### Bước 2: Lấy Cây Chương trình học Khóa học (`Curriculum Tree`)
```bash
curl -X GET http://localhost:5000/api/courses/{COURSE_ID}/curriculum \
  -H "Authorization: Bearer <TOKEN>"
```

---

### Bước 3: Tạo Chương học mới trong Khóa học
```bash
curl -X POST http://localhost:5000/api/courses/{COURSE_ID}/modules \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Chương 2: Quy trình Phục vụ & Thu ngân Cửa hàng"
  }'
```

---

### Bước 4: Tạo Bài học dạng Video (YouTube Embed)
```bash
curl -X POST http://localhost:5000/api/lessons/modules/{MODULE_ID} \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Bài 1: Video Văn hóa phục vụ Ba Hưng",
    "description": "Video tổng quan về tinh thần tận tâm và thái độ niềm nở với khách hàng.",
    "lessonType": "VIDEO",
    "videoProvider": "YOUTUBE",
    "videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "videoDuration": 300,
    "isVisible": true
  }'
```

---

### Bước 5: Tạo Bài học dạng Bài viết Rich Text & SOP
```bash
curl -X POST http://localhost:5000/api/lessons/modules/{MODULE_ID} \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Bài 2: Hướng dẫn sử dụng Máy tính tiền POS",
    "description": "Tài liệu quy trình 5 bước thanh toán và in hóa đơn cho khách.",
    "lessonType": "ARTICLE",
    "bodyHtml": "<h3>Hướng dẫn thao tác:</h3><p>Bước 1: Quét mã vạch sản phẩm. Bước 2: Nhập số lượng...</p>",
    "estimatedReadTime": 4,
    "sopCode": "SOP-CH-TN-02",
    "sopType": "STORE_SOP",
    "requiresSignature": true
  }'
```

---

### Bước 6: Tạo Bài học dạng Quiz (Bài kiểm tra đánh giá)
```bash
curl -X POST http://localhost:5000/api/lessons/modules/{MODULE_ID} \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Bài 3: Bài kiểm tra Kỹ năng Thu ngân",
    "description": "Cần đạt 80% điểm trở lên để hoàn thành bài học này.",
    "lessonType": "QUIZ",
    "isVisible": true
  }'
```
> 👉 *API sẽ trả về Lesson kèm `quiz.id` được tự động khởi tạo.*

---

### Bước 7: Cập nhật cấu hình Đề thi Quiz
```bash
curl -X PUT http://localhost:5000/api/quizzes/{QUIZ_ID} \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Đề kiểm tra Nghiệp vụ Thu ngân Ba Hưng",
    "passScore": 80,
    "maxAttempts": 3,
    "timeLimitMinutes": 15,
    "shuffleQuestions": true,
    "showAnswerFeedback": true
  }'
```

---

### Bước 8: Thêm Câu hỏi trắc nghiệm (Single Choice)
```bash
curl -X POST http://localhost:5000/api/quizzes/{QUIZ_ID}/questions \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "questionText": "Khi khách thanh toán chuyển khoản QR, nhân viên cần kiểm tra điều gì trước khi đưa bánh?",
    "questionType": "SINGLE_CHOICE",
    "points": 1.0,
    "explanation": "Nhân viên phải kiểm tra màn hình máy POS/App báo 'Giao dịch thành công' và số tiền trùng khớp.",
    "options": [
      { "optionText": "Màn hình POS báo Ting Ting thành công và đúng số tiền", "isCorrect": true },
      { "optionText": "Chỉ cần khách giơ màn hình điện thoại cho xem", "isCorrect": false },
      { "optionText": "Không cần kiểm tra nếu khách quen", "isCorrect": false }
    ]
  }'
```

---

### Bước 9: Xem trước Đề thi (Preview Mode cho Trainer)
```bash
curl -X GET http://localhost:5000/api/quizzes/{QUIZ_ID}/preview \
  -H "Authorization: Bearer <TOKEN>"
```

---

### Bước 10: Parse Link YouTube tự động
```bash
curl -X POST http://localhost:5000/api/lessons/parse-youtube \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  }'
```

---

## 4. HƯỚNG DẪN ĐỐI CHIẾU TRỰC TIẾP TRÊN SUPABASE CLOUD DASHBOARD

Sau khi chạy kiểm thử hoặc gọi API, bạn có thể đăng nhập vào **Supabase Studio (Table Editor)** để quan sát dữ liệu đã được lưu trữ hoàn hảo:

1. **Bảng `crs_modules` (Chương học)**:
   - Cột `course_id`: Khóa ngoại trỏ về khóa học.
   - Cột `title`: Tên chương học (*Chương 1: Quy định chung...*, *Chương 2: Kỹ năng Phục vụ...*).
   - Cột `sort_order`: Số nguyên thứ tự ($1, 2, 3...$).

2. **Bảng `crs_lessons` (Bài học)**:
   - Cột `lesson_type`: Enum `VIDEO`, `ARTICLE`, `QUIZ`, `PDF`.
   - Cột `video_provider`: `YOUTUBE` hoặc `DIRECT_UPLOAD`.
   - Cột `video_url`, `video_duration`: Thời lượng video.
   - Cột `description`: Mô tả bài học.
   - Cột `body_html`, `estimated_read_time`: Dữ liệu bài đọc.

3. **Bảng `quiz_quizzes` (Bài kiểm tra)**:
   - Cột `lesson_id`: Khóa ngoại 1-1 với bài học có `lesson_type = 'QUIZ'`.
   - Cột `pass_score`: `80`.
   - Cột `max_attempts`: `3`.
   - Cột `time_limit_minutes`: `15` hoặc `30`.

4. **Bảng `quiz_questions` & `quiz_question_options` (Câu hỏi & Đáp án)**:
   - Cột `question_type`: `SINGLE_CHOICE`, `TRUE_FALSE`...
   - Cột `points`: `1.0`.
   - Cột `explanation`: Giải thích đáp án.
   - Bảng Options chứa các lựa chọn với cờ `is_correct = true / false`.
