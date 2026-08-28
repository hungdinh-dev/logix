# 📘 HƯỚNG DẪN KIỂM TRA & TEST CÁC CHỨC NĂNG (DOMAIN: QUẢN LÝ KHÓA HỌC) - BA HÙNG LMS

> **Mã Domain:** Quản lý khóa học (Khóa học)  
> **Phạm vi chức năng:** `LMS-001` $\rightarrow$ `LMS-012`  
> **Kiến trúc áp dụng:** Monorepo LogiX (Next.js 15 App Router + Express TypeScript + PostgreSQL/Prisma)

---

## 📑 MỤC LỤC TỔNG QUAN

1. [LMS-001: Quản lý danh mục khóa học](#lms-001-quản-lý-danh-mục-khóa-học)
2. [LMS-002: Tạo mới khóa học](#lms-002-tạo-mới-khóa-học)
3. [LMS-003: Sao chép khóa học (Clone course)](#lms-003-sao-chép-khóa-học-clone-course)
4. [LMS-004: Xóa / Ẩn khóa học (Bật/Tắt Course)](#lms-004-xóa--ẩn-khóa-học-bậttắt-course)
5. [LMS-005: Gán khóa học theo Chức danh (Position)](#lms-005-gán-khóa-học-theo-chức-danh-position)
6. [LMS-006: Gán khóa học theo Loại nhân sự (Employment Status)](#lms-006-gán-khóa-học-theo-loại-nhân-sự-employment-status)
7. [LMS-007: Gán khóa học theo Cửa hàng (Store)](#lms-007-gán-khóa-học-theo-cửa-hàng-store)
8. [LMS-008: Gán khóa học theo Bộ phận sản xuất (Department / Factory)](#lms-008-gán-khóa-học-theo-bộ-phận-sản-xuất-department--factory)
9. [LMS-009: Đặt khóa học bắt buộc (Mandatory Course)](#lms-009-đặt-khóa-học-bắt-buộc-mandatory-course)
10. [LMS-010: Đặt khóa học tùy chọn (Optional Course)](#lms-010-đặt-khóa-học-tùy-chọn-optional-course)
11. [LMS-011: Cấu hình thời hạn hoàn thành khóa học (Duration Days / Due Date)](#lms-011-cấu-hình-thời-hạn-hoàn-thành-khóa-học-duration-days--due-date)
12. [LMS-012: Cấu hình điểm đạt khóa học (Pass Score)](#lms-012-cấu-hình-điểm-đạt-khóa-học-pass-score)

---

## 🛠️ THIẾT LẬP MÔI TRƯỜNG CHUNG ĐỂ KIỂM THỬ

### 1. Khởi động Backend API
```bash
# Mở terminal tại thư mục backend
cd Practice/LogiX/backend
npm run dev
# Swagger API UI chạy tại: http://localhost:5000/api-docs
```

### 2. Khởi động Frontend Web App
```bash
# Mở terminal tại thư mục frontend
cd Practice/LogiX/frontend
npm run dev
# Truy cập giao diện tại: http://localhost:3000
```

### 3. Tài khoản quản trị mặc định (Seed Data)
* **Tài khoản Admin:** `admin@bahung.vn` / `Admin@123456`
* **Quyền hạn:** `SYSTEM_ADMIN` (Toàn quyền CRUD khóa học & phân quyền)

---

---

## 1. LMS-001: QUẢN LÝ DANH MỤC KHÓA HỌC

> **Mô tả:** Tạo, chỉnh sửa, xóa và sắp xếp thứ tự các danh mục/chuyên mục đào tạo (ví dụ: *Onboarding Hội nhập*, *An toàn thực phẩm ATTP*, *Nghiệp vụ Cửa hàng*, *Khối Sản xuất - Bánh/Kem/Cắt*...).

### 📌 1.1. Điều kiện cần (Prerequisites)
* Đã đăng nhập tài khoản có quyền `COURSE.CREATE` hoặc role `Admin`.
* Database đã chạy migrate bảng `crs_categories`.

### 📂 1.2. Luồng mở file Backend (BE)
1. **Model Database:** [`backend/prisma/schema.prisma`](file:///c:/Projects/DigiFnb/Practice/LogiX/backend/prisma/schema.prisma) $\rightarrow$ Tìm model `Category` (Dòng ~203).
2. **DTO & Validate:** [`backend/src/modules/courses/course.dto.ts`](file:///c:/Projects/DigiFnb/Practice/LogiX/backend/src/modules/courses/course.dto.ts) $\rightarrow$ `createCategorySchema`, `updateCategorySchema`.
3. **Business Logic:** [`backend/src/modules/courses/course.service.ts`](file:///c:/Projects/DigiFnb/Practice/LogiX/backend/src/modules/courses/course.service.ts) $\rightarrow$ Các hàm:
   * `getAllCategories()`
   * `getCategoryById(id)`
   * `createCategory(dto)`
   * `updateCategory(id, dto)`
   * `deleteCategory(id)` (Soft delete `isActive = false`)
4. **Controller & Routes:** 
   * Controller: [`backend/src/modules/courses/course.controller.ts`](file:///c:/Projects/DigiFnb/Practice/LogiX/backend/src/modules/courses/course.controller.ts)
   * Route Endpoint: [`backend/src/modules/courses/course.routes.ts`](file:///c:/Projects/DigiFnb/Practice/LogiX/backend/src/modules/courses/course.routes.ts) $\rightarrow$ `GET/POST /api/courses/categories`, `PUT/DELETE /api/courses/categories/:id`.

### 🖥️ 1.3. Luồng mở file Frontend (FE)
1. **API Service:** [`frontend/src/features/lms/services/course.service.ts`](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/features/lms/services/course.service.ts) $\rightarrow$ `getCategories()`, `createCategory()`.
2. **Hook State:** [`frontend/src/features/lms/hooks/use-courses.ts`](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/features/lms/hooks/use-courses.ts) $\rightarrow$ Quản lý mảng `categories`.
3. **Trang Giao diện Quản trị:** [`frontend/src/features/admin/pages/CoursesAdminPage.tsx`](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/features/admin/pages/CoursesAdminPage.tsx) $\rightarrow$ Thẻ Dropdown lọc danh mục & Card thống kê số lượng danh mục.
4. **Trang Portal Học viên:** [`frontend/src/features/lms/components/course-catalog/CategoryPillTabs.tsx`](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/features/lms/components/course-catalog/CategoryPillTabs.tsx) $\rightarrow$ Các tab danh mục viên thuốc (Pill tabs).

### 🧪 1.4. Các bước Test trên UI
1. Truy cập URL: `http://localhost:3000/admin/courses`.
2. Quan sát card **"Danh mục đào tạo"** hiển thị tổng số danh mục hiện có.
3. Bấm vào dropdown **"Danh mục"** trên thanh tìm kiếm $\rightarrow$ Danh sách các danh mục (*Onboarding, ATTP, Nghiệp vụ CH, SX*) được hiển thị đầy đủ.
4. Chuyển sang URL Portal: `http://localhost:3000/lms/courses` $\rightarrow$ Nhấp vào từng tab danh mục để kiểm tra việc lọc khóa học theo danh mục tương ứng.

---

---

## 2. LMS-002: TẠO MỚI KHÓA HỌC

> **Mô tả:** Tạo khóa học mới với các thông tin cốt lõi (Mã khóa học, Tên khóa học, Slug, Danh mục, Mô tả, Loại khóa học, Pass score, Thời hạn).

### 📌 2.1. Điều kiện cần (Prerequisites)
* Phải có ít nhất **1 Danh mục khóa học** (Category) tồn tại sẵn trong hệ thống.
* Mã khóa học (Code) và Đường dẫn (Slug) là duy nhất, không được trùng lặp.

### 📂 2.2. Luồng mở file Backend (BE)
1. **Model Database:** [`backend/prisma/schema.prisma`](file:///c:/Projects/DigiFnb/Practice/LogiX/backend/prisma/schema.prisma) $\rightarrow$ Model `Course` (Dòng ~218).
2. **DTO & Schema:** [`backend/src/modules/courses/course.dto.ts`](file:///c:/Projects/DigiFnb/Practice/LogiX/backend/src/modules/courses/course.dto.ts) $\rightarrow$ `createCourseSchema`.
3. **Service Logic:** [`backend/src/modules/courses/course.service.ts`](file:///c:/Projects/DigiFnb/Practice/LogiX/backend/src/modules/courses/course.service.ts) $\rightarrow$ Hàm `createCourse(dto)`:
   * Tự động kiểm tra trùng `code` hoặc `slug`.
   * Khởi tạo trạng thái mặc định `DRAFT` và `isActive = true`.
4. **Route Endpoint:** `POST /api/courses` (Bảo vệ bởi `authenticateToken` + `requirePermission('COURSE.CREATE')`).

### 🖥️ 2.3. Luồng mở file Frontend (FE)
1. **Page Quản trị:** [`frontend/src/features/admin/pages/CoursesAdminPage.tsx`](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/features/admin/pages/CoursesAdminPage.tsx) $\rightarrow$ State `isCreateOpen`, `formData`, hàm `handleCreateSubmit`.
2. **Modal Form UI:** Xem thẻ `<Dialog open={isCreateOpen}>` (Dòng ~373-508).
3. **Route Page Next.js:** [`frontend/src/app/(protected)/admin/courses/page.tsx`](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/app/(protected)/admin/courses/page.tsx).

### 🧪 2.4. Các bước Test trên UI
1. Truy cập `http://localhost:3000/admin/courses`.
2. Nhấn nút **"+ Tạo Khóa Học Mới"** ở góc phải trên.
3. Điền các trường thông tin:
   * **Mã khóa học:** `BH-TEST-01`
   * **Danh mục:** Chọn một danh mục (ví dụ: *Nghiệp vụ Cửa hàng*)
   * **Tên khóa học:** *Quy trình Vận hành Máy Pha Cà Phê Chuyên Nghiệp*
   * **Mô tả:** *Hướng dẫn vệ sinh và vận hành máy đầu ca*
   * **Loại khóa học:** *Tiêu chuẩn*
   * **Thời hạn hoàn thành:** `15` ngày
   * **Điểm đạt (Pass score):** `85`
4. Bấm nút **"Tạo Khóa Học"** $\rightarrow$ Thông báo *"Tạo khóa học thành công!"* xuất hiện, modal đóng lại và khóa học mới xuất hiện ngay trên bảng.

---

---

## 3. LMS-003: SAO CHÉP KHÓA HỌC (CLONE COURSE)

> **Mô tả:** Tạo bản sao nhân bản (Clone) từ một khóa học có sẵn để tái sử dụng toàn bộ cấu trúc chương mục, bài giảng và câu hỏi kiểm tra cho đối tượng/kỳ học khác.

### 📌 3.1. Điều kiện cần (Prerequisites)
* Phải có ít nhất **1 khóa học gốc** đã tồn tại trong danh sách.

### 📂 3.2. Luồng mở file Backend (BE)
1. **Service Logic:** [`backend/src/modules/courses/course.service.ts`](file:///c:/Projects/DigiFnb/Practice/LogiX/backend/src/modules/courses/course.service.ts) $\rightarrow$ Hàm `cloneCourse(id)`:
   * Đọc khóa học gốc cùng toàn bộ `modules`, `lessons`, `quiz`, `questions`, `options`.
   * Tạo khóa học mới với mã: `${originalCode}_CLONE_${Date.now()}` và tiêu đề: `[Bản sao] ${originalTitle}`.
   * Nhân bản sâu (Deep clone) cây bài học và bài kiểm tra vào database qua Prisma Transaction.
2. **Route Endpoint:** `POST /api/courses/:id/clone` trong [`course.routes.ts`](file:///c:/Projects/DigiFnb/Practice/LogiX/backend/src/modules/courses/course.routes.ts#L73-L78).

### 🖥️ 3.3. Luồng mở file Frontend (FE)
1. **Component Nút Clone:** [`frontend/src/features/admin/pages/CoursesAdminPage.tsx`](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/features/admin/pages/CoursesAdminPage.tsx) $\rightarrow$ Nút icon `<Copy />` ở cột *Thao Tác* (Dòng ~345-352).
2. **Handler Function:** Hàm `handleClone(course)` gọi `useCourses().cloneCourse(course.id)`.

### 🧪 3.4. Các bước Test trên UI
1. Truy cập `http://localhost:3000/admin/courses`.
2. Tìm dòng của một khóa học bất kỳ (ví dụ: *Quy trình Vận hành Cửa hàng*).
3. Bấm vào icon **Sao chép (Copy)** ở cột ngoài cùng bên phải.
4. Hộp thoại xác nhận hiện ra: *"Bạn có chắc chắn muốn sao chép khóa học '...'?"* $\rightarrow$ Bấm **OK**.
5. Danh sách tự động làm mới, xuất hiện khóa học mới mang tên `[Bản sao] ...` với trạng thái `Bản nháp (Draft)`.

---

---

## 4. LMS-004: XÓA / ẨN KHÓA HỌC (BẬT/TẮT COURSE)

> **Mô tả:** Bật/Tắt phát hành khóa học (`PUBLISHED` $\leftrightarrow$ `DRAFT`), hoặc Xóa (Archive/Soft Delete) khóa học để không cho hiển thị trên cổng học viên.

### 📌 4.1. Điều kiện cần (Prerequisites)
* Có ít nhất 1 khóa học trên bảng.

### 📂 4.2. Luồng mở file Backend (BE)
1. **Service Logic:** [`backend/src/modules/courses/course.service.ts`](file:///c:/Projects/DigiFnb/Practice/LogiX/backend/src/modules/courses/course.service.ts) $\rightarrow$
   * `updateCourseStatus(id, { status })`: Cập nhật `status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED'`.
   * `deleteCourse(id)`: Soft-delete cập nhật `isActive = false`, `status = 'ARCHIVED'`.
2. **Route Endpoints:**
   * `PATCH /api/courses/:id/status` (Đổi trạng thái Publish/Draft)
   * `DELETE /api/courses/:id` (Xóa/Archive khóa học)

### 🖥️ 4.3. Luồng mở file Frontend (FE)
1. **Pill Badge Toggle Status:** [`frontend/src/features/admin/pages/CoursesAdminPage.tsx`](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/features/admin/pages/CoursesAdminPage.tsx) $\rightarrow$ Nút bấm trực tiếp tại cột *Trạng Thái* (Dòng ~314-326) gọi hàm `handleToggleStatus(course)`.
2. **Nút Xóa:** Icon `<Trash2 />` (Dòng ~353-361) gọi hàm `handleDelete(course)`.

### 🧪 4.4. Các bước Test trên UI
1. **Test Ẩn/Hiện (Toggle Status):**
   * Bấm vào nút màu xanh **"Đang phát hành"** của một khóa học $\rightarrow$ Nút chuyển sang màu vàng **"Bản nháp (Draft)"**.
   * Mở tab ẩn danh / Cổng học viên `http://localhost:3000/lms/courses` $\rightarrow$ Khóa học đó không còn xuất hiện trên Catalog học viên.
   * Bấm lại vào nút màu vàng trên trang Admin $\rightarrow$ Chuyển lại thành **"Đang phát hành"** $\rightarrow$ Khóa học xuất hiện trở lại trên Catalog.
2. **Test Xóa (Delete):**
   * Bấm icon **Thùng rác (Trash)** $\rightarrow$ Bấm Xác nhận $\rightarrow$ Khóa học biến mất khỏi danh sách.

---

---

## 5. LMS-005: GÁN KHÓA HỌC THEO CHỨC DANH (POSITION)

> **Mô tả:** Thiết lập quy tắc gán khóa học tự động: Nhân viên mang chức danh cụ thể (ví dụ: *Quản lý cửa hàng (QLCH)*, *Trưởng ca*, *Thu ngân*) sẽ tự động được ghi danh vào khóa học này.

### 📌 5.1. Điều kiện cần (Prerequisites)
* Phải có dữ liệu chức danh trong bảng `org_positions` (ví dụ: `POS_STORE_MGR`, `POS_BARISTA`).
* Phải có một khóa học cần gán.

### 📂 5.2. Luồng mở file Backend (BE)
1. **Model Database:** [`backend/prisma/schema.prisma`](file:///c:/Projects/DigiFnb/Practice/LogiX/backend/prisma/schema.prisma) $\rightarrow$ `Course.targetPositionId` liên kết với `Position.id`.
2. **Service Logic:** [`backend/src/modules/courses/course.service.ts`](file:///c:/Projects/DigiFnb/Practice/LogiX/backend/src/modules/courses/course.service.ts) $\rightarrow$ Hàm `assignToPosition(courseId, positionId)`:
   * Gán `targetPositionId` vào Course.
   * Quét toàn bộ nhân viên (`auth_users`) có `positionId = targetPositionId` và tự động tạo bản ghi ghi danh `CourseEnrollment` với `enrollmentSource = 'AUTO_RULE'`.
3. **Route Endpoint:** `POST /api/courses/:id/assign-position` trong [`course.routes.ts`](file:///c:/Projects/DigiFnb/Practice/LogiX/backend/src/modules/courses/course.routes.ts#L97-L103).

### 🖥️ 5.3. Luồng mở file Frontend (FE)
1. **Modal Gán tự động:** [`frontend/src/features/admin/pages/CoursesAdminPage.tsx`](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/features/admin/pages/CoursesAdminPage.tsx) $\rightarrow$ `<Dialog open={isAssignOpen}>` (Dòng ~511-582).
2. **Icon kích hoạt:** Nút icon `<Users />` tại cột Thao Tác.

### 🧪 5.4. Các bước Test trên UI
1. Bấm vào icon **Users (Gán tự động)** tại dòng khóa học mong muốn.
2. Chọn **Tiêu chí gán tự động:** *"Theo Chức danh công việc (LMS-005)"*.
3. Nhập ID hoặc chọn Chức danh (ví dụ: `POS-QLCH`).
4. Bấm **"Xác Nhận Gán Khóa"** $\rightarrow$ Thông báo thành công hiện ra, số lượng học viên ghi danh (Cột *Ghi Danh*) tăng lên tương ứng với số nhân sự có chức danh đó.

---

---

## 6. LMS-006: GÁN KHÓA HỌC THEO LOẠI NHÂN SỰ (EMPLOYMENT STATUS)

> **Mô tả:** Tự động gán khóa học theo loại hình nhân sự: *Nhân viên Học việc (Probation)*, *Nhân viên Chính thức (Official)*, hoặc *Đội ngũ Tăng cường (Temporary)*.

### 📌 6.1. Điều kiện cần (Prerequisites)
* Các tài khoản nhân sự trong database có trường `employmentStatus` (`PROBATION` / `OFFICIAL` / `TEMPORARY`).

### 📂 6.2. Luồng mở file Backend (BE)
1. **Model Database:** `Course.targetEmploymentStatus` trong `schema.prisma`.
2. **Service Logic:** [`course.service.ts`](file:///c:/Projects/DigiFnb/Practice/LogiX/backend/src/modules/courses/course.service.ts) $\rightarrow$ Hàm `assignToEmploymentStatus(courseId, status)`:
   * Cập nhật `Course.targetEmploymentStatus = status`.
   * Tự động quét và ghi danh toàn bộ user có `employmentStatus` khớp.
3. **Route Endpoint:** `POST /api/courses/:id/assign-employment-status`.

### 🖥️ 6.3. Luồng mở file Frontend (FE)
* Trong modal Gán khóa học (`CoursesAdminPage.tsx`), khi chọn loại *"Theo Loại nhân sự Học việc / Chính thức (LMS-006)"*, xuất hiện Select chọn:
  * `PROBATION` (Học việc)
  * `OFFICIAL` (Chính thức)
  * `TEMPORARY` (Tăng cường)
  * `ALL` (Tất cả)

### 🧪 6.4. Các bước Test trên UI
1. Bấm icon **Users (Gán tự động)**.
2. Chọn tiêu chí: *"Theo Loại nhân sự Học việc / Chính thức (LMS-006)"*.
3. Chọn loại nhân sự: *"Nhân viên Học việc (Probation)"*.
4. Bấm **Xác Nhận Gán Khóa** $\rightarrow$ Kiểm tra tất cả nhân viên học việc đã được thêm vào khóa học.

---

---

## 7. LMS-007: GÁN KHÓA HỌC THEO CỬA HÀNG (STORE)

> **Mô tả:** Gán khóa học đặc thù cho toàn bộ nhân viên thuộc một Chi nhánh / Cửa hàng cụ thể (ví dụ: *Ba Hưng 01 - Lê Duẩn*, *Ba Hưng 02 - Nguyễn Văn Linh*).

### 📌 7.1. Điều kiện cần (Prerequisites)
* Bảng `org_stores` đã có danh sách cửa hàng.

### 📂 7.2. Luồng mở file Backend (BE)
1. **Model Database:** `Course.targetStoreId` liên kết với `Store.id`.
2. **Service Logic:** [`course.service.ts`](file:///c:/Projects/DigiFnb/Practice/LogiX/backend/src/modules/courses/course.service.ts) $\rightarrow$ `assignToStore(courseId, storeId)`.
3. **Route Endpoint:** `POST /api/courses/:id/assign-store`.

### 🖥️ 7.3. Luồng mở file Frontend (FE)
* Modal Gán khóa học (`CoursesAdminPage.tsx`) $\rightarrow$ Option `"STORE"`.

### 🧪 7.4. Các bước Test trên UI
1. Bấm icon **Users** $\rightarrow$ Chọn *"Theo Cửa hàng / Chi nhánh (LMS-007)"*.
2. Nhập ID Store (ví dụ: `STORE-BH-01`).
3. Bấm **Xác Nhận Gán Khóa** $\rightarrow$ Hệ thống gán khóa học cho toàn bộ nhân viên cửa hàng này.

---

---

## 8. LMS-008: GÁN KHÓA HỌC THEO BỘ PHẬN SẢN XUẤT (DEPARTMENT)

> **Mô tả:** Gán khóa học chuyên biệt cho các bộ phận xưởng sản xuất (ví dụ: *Khâu làm bánh kem*, *Khâu đóng gói*, *Khâu cắt bánh*, *Khâu nướng*...).

### 📌 8.1. Điều kiện cần (Prerequisites)
* Bảng `org_departments` có các phòng ban với cờ `isFactoryDept = true`.

### 📂 8.2. Luồng mở file Backend (BE)
1. **Model Database:** `Course.targetDepartmentId` liên kết với `Department.id`.
2. **Service Logic:** [`course.service.ts`](file:///c:/Projects/DigiFnb/Practice/LogiX/backend/src/modules/courses/course.service.ts) $\rightarrow$ `assignToDepartment(courseId, departmentId)`.
3. **Route Endpoint:** `POST /api/courses/:id/assign-department`.

### 🖥️ 8.3. Luồng mở file Frontend (FE)
* Modal Gán khóa học (`CoursesAdminPage.tsx`) $\rightarrow$ Option `"DEPARTMENT"`.

### 🧪 8.4. Các bước Test trên UI
1. Bấm icon **Users** $\rightarrow$ Chọn *"Theo Bộ phận / Khâu xưởng sản xuất (LMS-008)"*.
2. Nhập ID Bộ phận (ví dụ: `DEPT-SX-KEM`).
3. Bấm **Xác Nhận Gán Khóa** $\rightarrow$ Toàn bộ thợ/công nhân khâu làm kem được ghi danh vào khóa học.

---

---

## 9. LMS-009: ĐẶT KHÓA HỌC BẮT BUỘC (MANDATORY COURSE)

> **Mô tả:** Đánh dấu khóa học là Bắt buộc (`isMandatory = true`). Khóa học này sẽ có huy hiệu đỏ, hiển thị ưu tiên hàng đầu và là điều kiện tiên quyết (Gate) để nhân sự qua kỳ thử việc hoặc được xếp ca làm việc.

### 📌 9.1. Điều kiện cần (Prerequisites)
* Tạo mới hoặc chỉnh sửa một khóa học.

### 📂 9.2. Luồng mở file Backend (BE)
1. **Model Database:** `Course.isMandatory: Boolean @default(false)`.
2. **Filter API:** `GET /api/courses?isMandatory=true`.

### 🖥️ 9.3. Luồng mở file Frontend (FE)
1. **Switch Bật/Tắt trong Form:** [`frontend/src/features/admin/pages/CoursesAdminPage.tsx`](file:///c:/Projects/DigiFnb/Practice/LogiX/frontend/src/features/admin/pages/CoursesAdminPage.tsx#L485-L496) $\rightarrow$ `<Switch checked={formData.isMandatory} />`.
2. **Badge hiển thị:** Badge màu đỏ `Bắt buộc` (Dòng ~296-300).
3. **Thống kê Card:** Card *"Khóa bắt buộc (Mandatory)"* ở đầu trang Admin.
4. **Portal Học viên:** Thẻ khóa học có nhãn đỏ `"Bắt buộc"` trên Catalog.

### 🧪 9.4. Các bước Test trên UI
1. Khi tạo hoặc sửa khóa học, gạt công tắc **"Khóa học bắt buộc (Mandatory Course)"** sang trạng thái BẬT (Xanh).
2. Lưu khóa học $\rightarrow$ Kiểm tra trên bảng quản trị hiển thị Badge đỏ **"Bắt buộc"**.
3. Card thống kê *"Khóa bắt buộc"* tăng số lượng lên 1.
4. Đăng nhập tài khoản học viên $\rightarrow$ Khóa học bắt buộc được đưa lên đầu danh sách Dashboard.

---

---

## 10. LMS-010: ĐẶT KHÓA HỌC TÙY CHỌN (OPTIONAL COURSE)

> **Mô tả:** Đặt khóa học ở chế độ Tùy chọn (`isMandatory = false`) dành cho các khóa học kỹ năng mở rộng, kiến thức khuyến nghị nhân sự học nâng cao tay nghề tự nguyện.

### 📌 10.1. Điều kiện cần & 10.2. Luồng file BE/FE
* Tương tự LMS-009 nhưng với cờ `isMandatory: false`.
* Trên UI hiển thị Badge xám: `Tùy chọn`.

### 🧪 10.3. Các bước Test trên UI
1. Tạo khóa học và để công tắc **"Khóa học bắt buộc"** ở trạng thái TẮT.
2. Lưu khóa học $\rightarrow$ Trên bảng hiển thị Badge xám **"Tùy chọn"**.

---

---

## 11. LMS-011: CẤU HÌNH THỜI HẠN HOÀN THÀNH (DURATION DAYS / DUE DATE)

> **Mô tả:** Cấu hình số ngày tối đa kể từ khi ghi danh để hoàn thành khóa học (ví dụ: `15 ngày`, `30 ngày`). Hệ thống tự động tính ngày hết hạn `dueDate = enrolledAt + durationDays` và cảnh báo khi quá hạn.

### 📂 11.1. Luồng mở file Backend (BE)
1. **Model Database:**
   * `Course.durationDays: Int? @default(30)` trong `schema.prisma`.
   * `CourseEnrollment.dueDate: DateTime?`.
2. **Service Auto-calc Due Date:** [`course.service.ts`](file:///c:/Projects/DigiFnb/Practice/LogiX/backend/src/modules/courses/course.service.ts) $\rightarrow$ Khi hàm `enrollCourse` hoặc auto-assign chạy:
   ```typescript
   const dueDate = new Date();
   dueDate.setDate(dueDate.getDate() + (course.durationDays || 30));
   ```

### 🖥️ 11.2. Luồng mở file Frontend (FE)
* Input `durationDays` trong Modal Create/Edit (`CoursesAdminPage.tsx` Dòng ~460-469).
* Hiển thị thời hạn tại cột *Hạn / Điểm Đạt* trên bảng quản trị: `30 ngày`.

### 🧪 11.3. Các bước Test trên UI
1. Mở modal Tạo/Sửa khóa học $\rightarrow$ Nhập **Thời hạn hoàn thành (ngày):** `7`.
2. Bấm Lưu $\rightarrow$ Cột *Hạn / Điểm Đạt* hiển thị `7 ngày`.
3. Ghi danh 1 học viên $\rightarrow$ Kiểm tra trong database bản ghi `enr_course_enrollments.dueDate` đúng bằng ngày hiện tại + 7 ngày.

---

---

## 12. LMS-012: CẤU HÌNH ĐIỂM ĐẠT KHÓA HỌC (PASS SCORE)

> **Mô tả:** Cấu hình mức điểm tối thiểu (theo thang điểm 100 hoặc %) mà học viên phải vượt qua ở các bài kiểm tra trắc nghiệm Quiz để được công nhận Hoàn thành khóa học (ví dụ: `80đ`, `90đ`).

### 📂 12.1. Luồng mở file Backend (BE)
1. **Model Database:**
   * `Course.passScore: Int @default(80)`.
   * `Quiz.passScore: Int @default(80)`.
   * `CourseEnrollment.isPassed: Boolean @default(false)`.
2. **Service Kiểm tra Đạt/Không đạt:** [`backend/src/modules/quizzes/quiz.service.ts`](file:///c:/Projects/DigiFnb/Practice/LogiX/backend/src/modules/quizzes/quiz.service.ts) $\rightarrow$ Khi học viên submit bài thi:
   ```typescript
   const isPassed = earnedScore >= quiz.passScore;
   ```

### 🖥️ 12.2. Luồng mở file Frontend (FE)
* Input `passScore` trong Modal Form (`CoursesAdminPage.tsx` Dòng ~472-481).
* Hiển thị điểm đạt tại cột *Hạn / Điểm Đạt* trên bảng quản trị (màu xanh lá đậm): `80đ`.

### 🧪 12.3. Các bước Test trên UI
1. Mở modal Tạo/Sửa khóa học $\rightarrow$ Nhập **Điểm đạt yêu cầu (Pass score):** `85`.
2. Lưu khóa học $\rightarrow$ Cột hiển thị `85đ`.
3. Đăng nhập tài khoản học viên $\rightarrow$ Làm bài kiểm tra Quiz của khóa học đó:
   * Đạt 80đ $(< 85đ) \rightarrow$ Hệ thống báo **"Chưa đạt yêu cầu (Failed)"**, chưa mở khóa chứng nhận.
   * Đạt 90đ $(\ge 85đ) \rightarrow$ Hệ thống báo **"Đạt (Passed)"**, cập nhật trạng thái hoàn thành khóa học.

---

## 🎯 BẢNG CHECKLIST TỔNG HỢP KIỂM TRA NHANH (QUICK SMOKE TEST)

| STT | Mã CN | Chức năng kiểm tra | Điểm kiểm tra Backend (BE) | Điểm kiểm tra Frontend (FE) | Kết quả mong đợi |
| :---: | :---: | :--- | :--- | :--- | :--- |
| 1 | **LMS-001** | Quản lý danh mục | `GET/POST /api/courses/categories` | Dropdown Category & Pill tabs | Lọc đúng danh mục khóa học |
| 2 | **LMS-002** | Tạo mới khóa học | `POST /api/courses` | Dialog "Tạo Khóa Học Mới" | Thêm khóa học thành công vào DB |
| 3 | **LMS-003** | Sao chép khóa học | `POST /api/courses/:id/clone` | Icon Copy ở cột Thao tác | Nhân bản đầy đủ module + quiz |
| 4 | **LMS-004** | Bật/Tắt khóa học | `PATCH /api/courses/:id/status` | Badge Click Toggle Status | Đổi giữa Published $\leftrightarrow$ Draft |
| 5 | **LMS-005** | Gán theo Chức danh | `POST /api/courses/:id/assign-position` | Modal Users $\rightarrow$ Option Position | Auto-enroll đúng theo Position ID |
| 6 | **LMS-006** | Gán theo Loại nhân sự | `POST /api/courses/:id/assign-employment-status` | Modal Users $\rightarrow$ Option Employment | Gán đúng Học việc / Chính thức |
| 7 | **LMS-007** | Gán theo Cửa hàng | `POST /api/courses/:id/assign-store` | Modal Users $\rightarrow$ Option Store | Gán đúng nhân sự thuộc Store |
| 8 | **LMS-008** | Gán theo Bộ phận SX | `POST /api/courses/:id/assign-department` | Modal Users $\rightarrow$ Option Dept | Gán đúng thợ/công nhân xưởng SX |
| 9 | **LMS-009** | Khóa học bắt buộc | Cờ `isMandatory: true` | Switch & Badge đỏ "Bắt buộc" | Khóa ưu tiên hàng đầu, gate onboard |
| 10 | **LMS-010** | Khóa học tùy chọn | Cờ `isMandatory: false` | Badge xám "Tùy chọn" | Học viên tự nguyện đăng ký |
| 11 | **LMS-011** | Hạn hoàn thành | Cột `durationDays` & `dueDate` | Input số ngày & Cột hiển thị | Tự tính ngày hết hạn kể từ khi học |
| 12 | **LMS-012** | Cấu hình điểm đạt | Cột `passScore` trong DB | Input điểm đạt & Cột hiển thị | So khớp điểm quiz để cấp Pass/Fail |
