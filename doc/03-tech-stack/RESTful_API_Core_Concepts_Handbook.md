# 📖 CẨM NANG ÔN TẬP TOÀN DIỆN VỀ RESTFUL API, HTTP, HEADERS & JWT TOKEN

> **Dành cho:** Lập trình viên Backend & Frontend dự án LogiX LMS  
> **Chủ đề:** Nắm vững toàn bộ bản chất kiến trúc RESTful API, HTTP Request/Response, Headers, Parameters, Token Authentication & Mapping với Swagger.  
> **Vị trí file:** `Practice/LogiX/doc/03-tech-stack/RESTful_API_Core_Concepts_Handbook.md`

---

## 📑 MỤC LỤC
1. [Bản chất kiến trúc RESTful API](#1-bản-chất-kiến-trúc-restful-api)
2. [Cấu tạo của một HTTP Request](#2-cấu-tạo-của-một-http-request)
   - [2.1. URL / Endpoint & Quy tắc đặt tên chuẩn REST](#21-url--endpoint--quy-tắc-đặt-tên-chuẩn-rest)
   - [2.2. Các HTTP Methods (Verbs) & CRUD](#22-các-http-methods-verbs--crud)
   - [2.3. HTTP Headers (Tiêu đề Request)](#23-http-headers-tiêu-đề-request)
   - [2.4. Phân biệt 4 kiểu truyền dữ liệu (Params, Query, Body, Headers)](#24-phân-biệt-4-kiểu-truyền-dữ-liệu-params-query-body-headers)
3. [Cơ chế Xác thực (Auth), JWT & Bearer Token](#3-cơ-chế-xác-thực-auth-jwt--bearer-token)
4. [Cấu tạo của một HTTP Response & Status Codes](#4-cấu-tạo-của-một-http-response--status-codes)
5. [Bảng ánh xạ trực quan: Code Express ↔ Swagger ↔ HTTP Giao thức](#5-bảng-ánh-xạ-trực-quan-code-express--swagger--http-giao-thức)

---

## 1. BẢN CHẤT KIẾN TRÚC RESTFUL API

### REST là gì?
**REST (Representational State Transfer)** là một kiểu kiến trúc phần mềm định nghĩa các nguyên tắc để Client (Frontend, Mobile App, Postman) và Server (Backend Express) trao đổi dữ liệu với nhau thông qua giao thức **HTTP/HTTPS**.

### 3 Đặc tính quan trọng nhất của REST:
1. **Stateless (Phi trạng thái):** Server **không lưu trạng thái phiên làm việc** của Client trong bộ nhớ RAM máy chủ. Mọi Request từ Client gửi lên đều phải mang đầy đủ thông tin cần thiết (ví dụ: Token định danh người dùng).
2. **Client-Server độc lập:** Frontend (React/Next.js) và Backend (Node/Express) hoàn toàn tách biệt. Backend chỉ trả về dữ liệu chuẩn (JSON), không can thiệp vào giao diện.
3. **Uniform Interface (Giao diện đồng nhất):** Tài nguyên (Resources) được định danh rõ ràng bằng URI và thao tác qua các phương thức HTTP chuẩn (`GET`, `POST`, `PUT`, `DELETE`).

---

## 2. CẤU TẠO CỦA MỘT HTTP REQUEST

Khi Client gửi một yêu cầu tới Server, một gói tin HTTP Request gồm 3 phần chính:
```
┌─────────────────────────────────────────────────────────────┐
│ 1. REQUEST LINE:  POST /api/courses?category=lms HTTP/1.1   │
├─────────────────────────────────────────────────────────────┤
│ 2. HEADERS:                                                 │
│    Host: localhost:5000                                     │
│    Content-Type: application/json                           │
│    Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR...         │
├─────────────────────────────────────────────────────────────┤
│ 3. BODY (PAYLOAD):                                          │
│    {                                                        │
│      "title": "An Toàn Vệ Sinh Thực Phẩm 2026",             │
│      "code": "ATTP-2026"                                    │
│    }                                                        │
└─────────────────────────────────────────────────────────────┘
```

---

### 2.1. URL / Endpoint & Quy tắc đặt tên chuẩn REST

> [!TIP]
> **Quy tắc vàng:** Endpoint trong REST đại diện cho **TÀI NGUYÊN (Danh từ)**, tuyệt đối **KHÔNG DÙNG ĐỘNG TỪ** trong đường dẫn. Hành động được thể hiện qua **HTTP Method**.

|  Chuẩn RESTful (Dự án LogiX) | ❌ Sai quy chuẩn (Anti-pattern) | Giải thích |
| :--- | :--- | :--- |
| `GET /api/courses` | `GET /api/getAllCourses` | Lấy danh sách khóa học (Dùng `GET` + Danh từ số nhiều) |
| `GET /api/courses/123` | `GET /api/getCourseDetail?id=123` | Lấy chi tiết khóa học 123 (Dùng Path Param) |
| `POST /api/courses` | `POST /api/createNewCourse` | Tạo mới khóa học (Dùng `POST`) |
| `PUT /api/courses/123` | `POST /api/updateCourse/123` | Cập nhật toàn bộ khóa học 123 (Dùng `PUT`) |
| `DELETE /api/courses/123` | `GET /api/deleteCourse?id=123` | Xóa khóa học 123 (Dùng `DELETE`) |

---

### 2.2. Các HTTP Methods (Verbs) & CRUD

| HTTP Method | Hành động CRUD | Ý nghĩa | Đặc tính Idempotent* |
| :--- | :--- | :--- | :---: |
| **`GET`** | **R**ead | Lấy dữ liệu về từ Server (không làm thay đổi DB). |  Có |
| **`POST`** | **C**reate | Tạo mới tài nguyên trong DB. | ❌ Không |
| **`PUT`** | **U**pdate (Replace) | Cập nhật/Ghi đè toàn bộ bản ghi theo ID. |  Có |
| **`PATCH`** | **U**pdate (Partial) | Cập nhật một vài trường cụ thể (không ghi đè toàn bộ). | ❌ Không |
| **`DELETE`** | **D**elete | Xóa tài nguyên khỏi DB. |  Có |

*\*Idempotent nghĩa là: Nếu bạn bấm gửi cùng 1 request đó 10 lần liên tiếp, trạng thái dữ liệu trong DB vẫn không bị nhân bản hay sai lệch so với gửi 1 lần.*

---

### 2.3. HTTP Headers (Tiêu đề Request)

Headers là nơi chứa **siêu dữ liệu (Metadata)** về Request / Client.

| Header phổ biến | Giá trị mẫu | Mục đích sử dụng |
| :--- | :--- | :--- |
| **`Content-Type`** | `application/json` | Báo cho Server biết: Dữ liệu gửi trong **Body** là định dạng JSON. |
| **`Accept`** | `application/json` | Báo cho Server biết: Client mong muốn nhận về kết quả dạng JSON. |
| **`Authorization`** | `Bearer <access_token>` | Gửi mã định danh / quyền hạn của người dùng (JWT Token). |
| **`Origin`** | `http://localhost:3000` | Trình duyệt tự gắn để thông báo nguồn gốc web gọi tới (liên quan đến **CORS**). |
| **`User-Agent`** | `Mozilla/5.0 ...` | Thông tin về trình duyệt / thiết bị của người dùng. |

---

### 2.4. Phân biệt 4 kiểu truyền dữ liệu (Params, Query, Body, Headers)

Đây là phần quan trọng nhất cần nắm chắc khi viết code Backend Express và cấu hình Swagger:

```
           ┌─────────────────────────────────────────────────────────────┐
           │                      CÁC KIỂU TRUYỀN DỮ LIỆU                │
           └──────────────────────────────┬──────────────────────────────┘
                                          │
       ┌──────────────────┬───────────────┴───────────────┬──────────────────┐
       ▼                  ▼                               ▼                  ▼
1. Path Parameters   2. Query Parameters           3. Request Body     4. Headers
(/api/courses/:id)   (/api/courses?page=1)         ({ "name": "..." }) (Authorization)
```

| Loại Parameter | Nơi xuất hiện | Cách lấy trong Express | Khi nào sử dụng? | Ví dụ thực tế |
| :--- | :--- | :--- | :--- | :--- |
| **1. Path Params** | Nằm cố định trên URL path | `req.params.id` | Dùng để **định danh chính xác 1 bản ghi** cụ thể theo ID / Slug. | `GET /api/courses/c4f2-uuid`<br>`DELETE /api/roles/12` |
| **2. Query Params** | Nằm sau dấu `?` và nối bằng `&` (Key-Value) | `req.query.page`<br>`req.query.search` | Dùng để **Lọc (Filter), Tìm kiếm (Search), Phân trang (Paging), Sắp xếp (Sorting)**. | `GET /api/users?department=HR&page=2&limit=10` |
| **3. Request Body** | Nằm ẩn trong Payload (thân gói tin) | `req.body.title`<br>`req.body.email` | Dùng để gửi dữ liệu lớn, phức tạp, form nhập liệu (`POST`, `PUT`, `PATCH`). | `{ "email": "admin@bahung.com", "password": "123" }` |
| **4. Header Params** | Nằm ở phần Tiêu đề Request | `req.headers.authorization` | Dùng cho **Bảo mật, Token, API Key, Ngôn ngữ, Metadata**. | `Authorization: Bearer eyJhbG...` |

---

## 3. CƠ CHẾ XÁC THỰC (AUTH), JWT & BEARER TOKEN

### 3.1. Tại sao lại gọi là "Bearer Token"?
- Từ **"Bearer"** trong tiếng Anh nghĩa là *"Người cầm giữ"*.
- Cơ chế Bearer Token quy định: **Ai cầm giữ Token này thì người đó có quyền truy cập**. Vì vậy Token phải được bảo mật tuyệt đối, không chia sẻ cho người khác.
- Định dạng header gửi lên Backend:
  ```http
  Authorization: Bearer <chuỗi_token_jwt>
  ```

---

### 3.2. Cấu trúc của JWT (JSON Web Token)
Một mã JWT gồm 3 phần ngăn cách bởi dấu chấm `.` (`Header.Payload.Signature`):

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMiLCJyb2xlIjoiQURNSU4ifQ.dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk
└─────────────────┬─────────────────┘ └──────────────────────┬──────────────────────┘ └──────────────────────┬─────────────────────┘
             1. HEADER                                 2. PAYLOAD                               3. SIGNATURE
     (Thuật toán mã hóa: HS256)             (Dữ liệu người dùng: id, email, role)       (Chữ ký bí mật chống giả mạo)
```

---

### 3.3. Cơ chế Access Token vs. Refresh Token trong LogiX

```
[ Frontend: React ]                                                [ Backend: Express ]
        │                                                                    │
        │ 1. POST /api/auth/login (email + pass)                             │
        ├───────────────────────────────────────────────────────────────────>│
        │ 2. Trả về: accessToken (sống 15 phút) + refreshToken (sống 7 ngày) │
        │<───────────────────────────────────────────────────────────────────┤
        │                                                                    │
        │ 3. Gọi API: GET /api/courses (Kèm Header Authorization)            │
        ├───────────────────────────────────────────────────────────────────>│ (Xác thực JWT hợp lệ)
        │<───────────────────────────────────────────────────────────────────┤ (Trả data 200 OK)
        │                                                                    │
        │ ... (Sau 15 phút, accessToken hết hạn) ...                        │
        │ 4. Gọi API: GET /api/courses                                       │
        ├───────────────────────────────────────────────────────────────────>│
        │<───────────────────────────────────────────────────────────────────┤ (Báo lỗi 401 Token Expired)
        │                                                                    │
        │ 5. Tự động gọi: POST /api/auth/refresh (Gửi kèm refreshToken)      │
        ├───────────────────────────────────────────────────────────────────>│ (Kiểm tra DB Supabase)
        │ 6. Cấp lại: accessToken MỚI                                        │
        │<───────────────────────────────────────────────────────────────────┤
        │ 7. Thử lại gọi API /api/courses với Token mới                      │
        ├───────────────────────────────────────────────────────────────────>│ (Thành công 200 OK)
```

---

## 4. CẤU TẠO CỦA MỘT HTTP RESPONSE & STATUS CODES

Khi Server xử lý xong, nó sẽ đóng gói HTTP Response gồm:
1. **HTTP Status Code:** Đại diện cho kết quả ở cấp giao thức mạng.
2. **Response Headers:** `Content-Type: application/json`,...
3. **Response Body:** Dữ liệu trả về (thường dạng JSON).

---

### 4.1. Bản đồ các nhóm mã HTTP Status Code

```
┌─────────┬───────────────────┬────────────────────────────────────────────────────────┐
│ Mã HTTP │ Nhóm trạng thái   │ Ý nghĩa cốt lõi                                        │
├─────────┼───────────────────┼────────────────────────────────────────────────────────┤
│  2xx    │ Success           │ Yêu cầu được tiếp nhận và xử lý THÀNH CÔNG.            │
│  3xx    │ Redirection       │ Cần chuyển hướng tới URL khác (ví dụ: Redirect Swagger)│
│  4xx    │ Client Error      │ Lỗi do PHÍA CLIENT gửi dữ liệu sai / thiếu / sai quyền.│
│  5xx    │ Server Error      │ Lỗi do PHÍA SERVER bị sập, bug code, lỗi kết nối DB.   │
└─────────┴───────────────────┴────────────────────────────────────────────────────────┘
```

#### Các mã thường dùng nhất trong thực tế:
- **`200 OK`**: Lấy dữ liệu thành công (`GET`), cập nhật thành công (`PUT`).
- **`201 Created`**: Tạo mới bản ghi thành công (`POST`).
- **`204 No Content`**: Xóa thành công và không cần trả thêm dữ liệu (`DELETE`).
- **`400 Bad Request`**: Dữ liệu gửi lên sai quy chuẩn (ví dụ: Zod báo thiếu trường).
- **`401 Unauthorized`**: Chưa đăng nhập hoặc Token sai/hết hạn.
- **`403 Forbidden`**: Đã đăng nhập nhưng **tài khoản bị khóa/tạm ngưng** hoặc **không có quyền (Permission)**.
- **`404 Not Found`**: ID hoặc URL không tồn tại.
- **`409 Conflict`**: Dữ liệu bị trùng (ví dụ: email hoặc mã nhân viên đã có sẵn).
- **`500 Internal Server Error`**: Lỗi code Backend bị crash / mất mạng DB Supabase.

---

### 4.2. Chuẩn hóa Response Body trong dự án LogiX (`ApiResponse`)

Dự án LogiX luôn trả về cấu trúc JSON đồng nhất 100% cho mọi API:

```json
// Trường hợp THÀNH CÔNG (HTTP 200 / 201)
{
  "isSuccess": true,
  "statusCode": 200,
  "message": "Lấy danh sách khóa học thành công",
  "data": [
    { "id": "1", "title": "ATTP 2026", "code": "ATTP-2026" }
  ]
}
```

```json
// Trường hợp THẤT BẠI (HTTP 400 / 401 / 403 / 404 / 500)
{
  "isSuccess": false,
  "statusCode": 403,
  "message": "Mật khẩu sai quá 5 lần. Tài khoản vừa bị tự động khóa.",
  "errors": null
}
```

---

## 5. BẢNG ÁNH XẠ TRỰC QUAN: CODE EXPRESS ↔ SWAGGER ↔ HTTP GIAO THỨC

Dưới đây là bảng đối chiếu giúp bạn thấy rõ sự liên kết chặt chẽ giữa 3 thành phần:

| Khái niệm HTTP | Trong Code Express Backend | Trong Swagger Spec (`*.swagger.ts`) | Trong Giao diện Swagger UI |
| :--- | :--- | :--- | :--- |
| **Endpoint & Method** | `router.post('/login', ...)` | `paths: { '/api/auth/login': { post: { ... } } }` | Khối màu xanh lá `POST /api/auth/login` |
| **Path Param** | `router.get('/:id', (req) => req.params.id)` | `parameters: [{ name: 'id', in: 'path', required: true }]` | Ô nhập liệu `id * (string)` |
| **Query Param** | `req.query.search` | `parameters: [{ name: 'search', in: 'query' }]` | Ô nhập liệu `search (string)` |
| **Request Body** | `validateRequest(loginSchema)`, `req.body` | `requestBody: { content: { 'application/json': { schema: ... } } }` | Ô soạn thảo JSON **Request body** |
| **JWT Bearer Token** | `authenticateToken` middleware | `security: [{ BearerAuth: [] }]` | Biểu tượng ổ khóa 🔒 bên cạnh API |
| **Response Code** | `res.status(200).json(...)` | `responses: { 200: { description: '...' } }` | Bảng liệt kê mã **Responses: 200, 400, 403** |
