# Danh sách Tài khoản & Sơ đồ Tổ chức Nhân sự (LogiX LMS)

Tài liệu ghi nhận danh sách toàn bộ các phòng ban, chức vụ, vai trò và tài khoản nhân sự được định danh trên hệ thống **LogiX LMS & ERP-v2**.

> [!NOTE]
> - **Mật khẩu mặc định cho tất cả tài khoản**: `password123`
> - **Cơ chế xác thực**: Email + Password Hash (bcrypt), phân quyền theo bảng `auth_roles` & `auth_permissions`.
> - **Lệnh thêm/cập nhật dữ liệu vào DB**: `pnpm --filter logix-backend seed:personnel`

---

## 🏢 1. Danh mục Sơ đồ Phòng ban (Departments)

| Mã phòng ban (`deptCode`) | Tên phòng ban (`deptName`) | Khối nhà xưởng (`isFactoryDept`) | Cấp quản lý trực tiếp | Ghi chú |
| :--- | :--- | :---: | :--- | :--- |
| `EXEC` | **Ban Giám Đốc** | ❌ Không | SangTQ (`SANGTQ`) | Cơ quan điều hành cấp cao |
| `CUA-HANG` | **Cửa Hàng** | ❌ Không | Ban Giám Đốc | Chuỗi bán lẻ & tiếp xúc khách hàng |
| `SX` | **Sản Xuất** | ✅ Có | Ban Giám Đốc | Khâu chế biến, xưởng kem & ATTP |
| `VP` | **Văn Phòng** | ❌ Không | Ban Giám Đốc | Khối hành chính, nhân sự, kế toán & đào tạo |

---

## 👥 2. Danh sách Tài khoản Nhân sự & Đăng nhập (Personnel Accounts)

### 2.1 Quản trị viên & Cấp Quản lý (Admin & Executive)

| STT | Họ và Tên | Mã nhân sự | Email đăng nhập | Mật khẩu | Phòng ban | Vai trò (Role) | Trạng thái |
| :---: | :--- | :--- | :--- | :---: | :--- | :---: | :---: |
| 1 | **System Admin** | `ADMIN001` | `admin@gmail.com` | `password123` | Ban Giám Đốc (`EXEC`) | **ADMIN** | Chính thức (Official) |
| 2 | **SangTQ** | `SANGTQ` | `SangTQ@gmail.com` | `password123` | Ban Giám Đốc (`EXEC`) | **ADMIN** | Chính thức (Official) |
| 3 | **Quản trị Ba Hưng** (Demo) | `BH-ADMIN-001` | `admin@bahung.com` | `password123` | Cửa Hàng | **ADMIN** | Chính thức (Official) |

---

### 2.2 Giảng viên & Huấn luyện viên đào tạo (Trainers)

| STT | Họ và Tên | Mã nhân sự | Email đăng nhập | Mật khẩu | Phòng ban | Vai trò (Role) | Trạng thái |
| :---: | :--- | :--- | :--- | :---: | :--- | :---: | :---: |
| 4 | **HungDNB** | `HUNGDNB` | `   ` | `password123` | Văn Phòng (`VP`) | **TRAINER** | Chính thức (Official) |
| 5 | **HuyTQ** | `HUYTQ` | `HuyTQ@gmail.com` | `password123` | Văn Phòng (`VP`) | **TRAINER** | Chính thức (Official) |

---

### 2.3 Khối Cửa Hàng & Bán lẻ (Retail Stores)

| STT | Họ và Tên | Mã nhân sự | Email đăng nhập | Mật khẩu | Phòng ban | Vai trò (Role) | Trạng thái |
| :---: | :--- | :--- | :--- | :---: | :--- | :---: | :---: |
| 6 | **DaiLT** | `DAILT` | `DaiLT@gmail.com` | `password123` | Cửa Hàng (`CUA-HANG`) | **STUDENT** | 🟡 Thử việc (Probation) |
| 7 | **HuongLTT** | `HUONGLTT` | `HuongLTT@gmail.com` | `password123` | Cửa Hàng (`CUA-HANG`) | **STUDENT** | Chính thức (Official) |
| 8 | **LongNVH** | `NV0001` | `LongNVH@gmail.com` | `password123` | Cửa Hàng (`CUA-HANG`) | **STUDENT** | Chính thức (Official) |
| 9 | **PhuongHTK** | `PHUONGHTK` | `PhuongHTK@gmail.com` | `password123` | Cửa Hàng (`CUA-HANG`) | **STUDENT** | Chính thức (Official) |
| 10 | **TrangNTT** | `TRANGNTT` | `TrangNTT@gmail.com` | `password123` | Cửa Hàng (`CUA-HANG`) | **STUDENT** | Chính thức (Official) |
| 11 | **TuyetTHA** | `TUYETTHA` | `TuyetTHA@gmail.com` | `password123` | Cửa Hàng (`CUA-HANG`) | **STUDENT** | Chính thức (Official) |
| 12 | **Alex Thompson** (Demo) | `BH-NV-002` | `alex@logix.com` | `password123` | Cửa Hàng (`CUA-HANG`) | **STUDENT** | Thử việc (Probation) |

---

### 2.4 Khối Xưởng & Sản Xuất (Production & Factory)

| STT | Họ và Tên | Mã nhân sự | Email đăng nhập | Mật khẩu | Phòng ban | Vai trò (Role) | Trạng thái |
| :---: | :--- | :--- | :--- | :---: | :--- | :---: | :---: |
| 13 | **HungNDM** | `HUNGNDM` | `HungNDM@gmail.com` | `password123` | Sản Xuất (`SX`) | **STUDENT** | Chính thức (Official) |
| 14 | **HungPT** | `HUNGPT` | `HungPT@gmail.com` | `password123` | Sản Xuất (`SX`) | **STUDENT** | Chính thức (Official) |
| 15 | **LuongTND** | `LUONGTND` | `LuongTND@gmail.com` | `password123` | Sản Xuất (`SX`) | **STUDENT** | Chính thức (Official) |
| 16 | **PhuongVT** | `PHUONGVT` | `PhuongVT@gmail.com` | `password123` | Sản Xuất (`SX`) | **STUDENT** | Chính thức (Official) |
| 17 | **ThaiTD** | `THAITD` | `ThaiTD@gmail.com` | `password123` | Sản Xuất (`SX`) | **STUDENT** | Chính thức (Official) |

---

### 2.5 Khối Văn Phòng (Headquarters & Office)

| STT | Họ và Tên | Mã nhân sự | Email đăng nhập | Mật khẩu | Phòng ban | Vai trò (Role) | Trạng thái |
| :---: | :--- | :--- | :--- | :---: | :--- | :---: | :---: |
| 18 | **HanhTTH** | `HANHTTH` | `HanhTTH@gmail.com` | `password123` | Văn Phòng (`VP`) | **STUDENT** | Chính thức (Official) |
| 19 | **HaNTC** | `HANTC` | `HaNTC@gmail.com` | `password123` | Văn Phòng (`VP`) | **STUDENT** | Chính thức (Official) |
| 20 | **NgocNTH** | `NGOCNTH` | `NgocNTH@gmail.com` | `password123` | Văn Phòng (`VP`) | **STUDENT** | Chính thức (Official) |
| 21 | **TrangVTH** | `TRANGVTH` | `TrangVTH@gmail.com` | `password123` | Văn Phòng (`VP`) | **STUDENT** | Chính thức (Official) |

---

## 🔐 3. Phân quyền Hệ thống (Role-Based Access Control)

1. **`ADMIN` (Quản trị viên Hệ thống)**:
   - Toàn quyền quản trị khóa học, phân hệ đào tạo, tạo và cấp phát chứng chỉ, quản lý nhân sự, gán phòng ban & xem toàn bộ báo cáo phân tích.
2. **`TRAINER` (Giảng viên / Huấn luyện viên)**:
   - Soạn thảo giáo trình, tạo bài học Video / Article / SOP, soạn đề thi trắc nghiệm, chấm bài và quản lý danh mục đào tạo.
3. **`STUDENT` (Học viên / Nhân sự)**:
   - Tham gia các khóa học hội nhập (Onboarding), an toàn thực phẩm (ATTP/HSE) và chuyên môn nghiệp vụ được phân bổ tự động theo phòng ban & vị trí làm việc.