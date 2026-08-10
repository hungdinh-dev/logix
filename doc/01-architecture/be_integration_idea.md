# Hướng dẫn Tích hợp Backend (BE) cho Khóa học JavaScript.info

Tài liệu này đề xuất phương án và thiết kế chi tiết để lưu trữ, truy vấn dữ liệu các khóa học JavaScript.info (Part 1, 2, 3) vào cơ sở dữ liệu SQLite thông qua Prisma ORM khi hệ thống Backend sẵn sàng.

---

## 1. Bản đồ ánh xạ cấu trúc dữ liệu (Data Mapping)

Cơ sở dữ liệu hiện tại trong [schema.prisma](file:///c:/Projects/DigiFnb/Practice/LogiX/backend/prisma/schema.prisma) đã được thiết kế rất chuẩn mực và khớp hoàn toàn với cấu trúc của `JS_INFO_COURSES`.

| Thực thể Mock Frontend (`JS_INFO_COURSES`) | Bảng cơ sở dữ liệu Prisma | Ghi chú |
| :--- | :--- | :--- |
| `JSInfoCourse` | `Course` | Lưu thông tin tổng quan khóa học (Part 1, 2, 3) |
| `JSInfoSection` | `Section` | Phân chương học (ví dụ: "Objects: the basics") |
| `JSInfoLesson` | `Lesson` | Bài học chi tiết (dạng video hoặc tài liệu đọc) |
| `content` | `Lesson.content` | Lưu trữ nội dung HTML/Markdown của bài học văn bản |
| `type` | `Lesson.videoUrl` / `Lesson.content` | Nếu type là `video` thì lưu `videoUrl`, nếu là `document` thì lưu `content` |

---

## 2. Kịch bản nạp dữ liệu mẫu (Database Seeding)

Chúng ta có thể tạo một script seed trong thư mục `backend/prisma/seed.ts` để tự động nạp dữ liệu từ frontend vào SQLite khi chạy lệnh `npx prisma db seed`.

### Đoạn mã ví dụ cho `seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const JS_INFO_SEEDS = [
  {
    id: "course_p1",
    title: "The JavaScript Language (Part 1)",
    description: "Học ngôn ngữ JavaScript từ cơ bản đến nâng cao bao gồm OOP, closures, promises...",
    category: "Technical",
    duration: "32h 00m",
    sections: [
      {
        id: "sec_p1_s3",
        title: "Objects: the basics",
        order: 3,
        lessons: [
          {
            id: "les_obj_1",
            title: "Objects",
            content: `<div class="space-y-4">...</div>`,
            duration: "15:00",
            order: 1
          },
          {
            id: "les_obj_2",
            title: "Object references and copying",
            content: `<div class="space-y-4">...</div>`,
            duration: "12:30",
            order: 2
          }
        ]
      }
    ]
  }
];

async function main() {
  console.log("Bắt đầu nạp dữ liệu khóa học...");
  for (const c of JS_INFO_SEEDS) {
    const course = await prisma.course.upsert({
      where: { id: c.id },
      update: {},
      create: {
        id: c.id,
        title: c.title,
        description: c.description,
        category: c.category,
        duration: c.duration,
      }
    });

    for (const s of c.sections) {
      const section = await prisma.section.create({
        data: {
          id: s.id,
          title: s.title,
          order: s.order,
          courseId: course.id
        }
      });

      for (const l of s.lessons) {
        await prisma.lesson.create({
          data: {
            id: l.id,
            title: l.title,
            content: l.content,
            duration: l.duration,
            order: l.order,
            sectionId: section.id
          }
        });
      }
    }
  }
  console.log("Hoàn thành nạp dữ liệu.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

---

## 3. Thiết kế các Endpoint API trên Backend (Express)

Khi cấu hình Backend hoạt động, chúng ta sẽ cung cấp 3 endpoint cốt lõi cho Frontend:

### A. Lấy danh sách khóa học (Course Catalog)
*   **Method**: `GET`
*   **Path**: `/api/courses`
*   **Response**:
    ```json
    [
      {
        "id": "course_p1",
        "title": "The JavaScript Language (Part 1)",
        "description": "...",
        "category": "Technical",
        "duration": "32h 00m"
      }
    ]
    ```

### B. Chi tiết khóa học và Danh sách chương học
*   **Method**: `GET`
*   **Path**: `/api/courses/:id`
*   **Response**:
    ```json
    {
      "id": "course_p1",
      "title": "The JavaScript Language (Part 1)",
      "sections": [
        {
          "id": "sec_p1_s3",
          "title": "Objects: the basics",
          "lessons": [
            { "id": "les_obj_1", "title": "Objects", "duration": "15:00", "type": "document" }
          ]
        }
      ]
    }
    ```

### C. Chi tiết bài học (Lesson Content)
*   **Method**: `GET`
*   **Path**: `/api/lessons/:id`
*   **Response**:
    ```json
    {
      "id": "les_obj_1",
      "title": "Objects",
      "content": "<div class=\"space-y-4\">...</div>",
      "videoUrl": null,
      "duration": "15:00"
    }
    ```

---

## 4. Phương án thay thế trên Frontend (FE Migration)

Khi BE đã sẵn sàng và cung cấp các API trên:
1. Thay thế các import từ [javascript-info.mock.ts](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/features/lms/mocks/javascript-info.mock.ts) bằng các cuộc gọi API thực tế qua thư viện Fetch hoặc Axios.
2. Thiết lập `useEffect` hoặc các giải pháp quản lý trạng thái (như React Query, SWR) trong `CourseCatalog.tsx`, `CourseDetailPage.tsx` và `LessonPlayerPage.tsx` để fetch dữ liệu động từ server.
