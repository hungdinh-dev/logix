# PHÂN TÍCH HẠ TẦNG, DATABASE MONSTERASP & FILE ENV
# ENV & INFRASTRUCTURE AUDIT SPECIFICATION

> **Mã tài liệu:** `INFRA-AUDIT-2026-09-25`  
> **Chủ trì:** Multi-Agent Orchestrator (`[Doc-Agent]`, `[BE-Agent]`, `[QA-QC-Agent]`)  
> **Tài liệu nguồn:** [[e:/Projects/DigiFnb/Horeca/LMS-Solution/env|Horeca LMS-Solution/env (155 lines)]]  
> **Đích triển khai:** [[e:/Projects/DigiFnb/Horeca/LMS-Solution/BE/src/API/.env|BE/src/API/.env]]  

---

## 1. TỔNG QUAN PHÂN TÍCH FILE CẤU HÌNH MÔI TRƯỜNG (`.env`)

Tệp cấu hình môi trường bạn cung cấp (`e:\Projects\DigiFnb\Horeca\LMS-Solution\env`) đã được hệ thống **sao chép và đưa vào đúng vị trí** mà `EnvLoader.cs` của Backend yêu cầu:
- `e:\Projects\DigiFnb\Horeca\LMS-Solution\BE\src\API\.env` (Vị trí gốc của `contentRoot`)
- `e:\Projects\DigiFnb\Horeca\LMS-Solution\BE\.env` (Vị trí dự phòng khi chạy từ thư mục root của BE)

Dưới đây là bóc tách chuyên sâu từng phân vùng cấu hình:

---

## 2. CHI TIẾT 9 CƠ SỞ DỮ LIỆU SQL SERVER (MONSTERASP / DATABASEASP)

Toàn bộ 9 phân hệ của Horeca ERP được host trên hạ tầng điện toán đám mây **DatabaseASP / MonsterASP** (`*.public.databaseasp.net`), sử dụng giao thức bảo mật `Encrypt=True; TrustServerCertificate=True; MultipleActiveResultSets=True;`:

| Phân hệ | Tên biến môi trường | Server Host | Database Name | User ID | Vai trò phân hệ trong hệ sinh thái |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **SYSTEM** | `SYSTEM_CONNECTION_STRING` | `db58351.public.databaseasp.net` | `db58351` | `db58351` | Nền tảng lõi: User, Role, Permission, Tenant, Org Structure. |
| **HRM** | `HRM_CONNECTION_STRING` | `db58350.public.databaseasp.net` | `db58350` | `db58350` | Quản trị nhân sự: Nhân viên, Phòng ban, Chấm công, Tiền lương. |
| **LMS** | `LMS_CONNECTION_STRING` | `db58356.public.databaseasp.net` | `db58356` | `db58356` | **Phân hệ Đào tạo LMS (Trọng tâm hiện tại)**: Khóa học, Bài học, Đề cương, Khảo thí. |
| **CRM** | `CRM_CONNECTION_STRING` | `db58349.public.databaseasp.net` | `db58349` | `db58349` | Khách hàng, Lead, Cơ hội bán hàng, Chăm sóc hội viên. |
| **POS** | `POS_CONNECTION_STRING` | `db69534.public.databaseasp.net` | `db69534` | `db69534` | Bán hàng tại quầy F&B, Order, Ca làm, Két tiền thu ngân. |
| **FSM** | `FSM_CONNECTION_STRING` | `db58353.public.databaseasp.net` | `db58353` | `db58353` | Dịch vụ kỹ thuật hiện trường: Kỹ thuật viên bảo trì máy pha cafe. |
| **SCM** | `SCM_CONNECTION_STRING` | `db58352.public.databaseasp.net` | `db58352` | `db58352` | Chuỗi cung ứng: Mua hàng, Quản lý nhà cung cấp, Tồn kho nguyên liệu. |
| **MES** | `MES_CONNECTION_STRING` | `db58347.public.databaseasp.net` | `db58347` | `db58347` | Sản xuất chế tạo: Lệnh rang hạt cà phê, Định mức BOM xưởng bánh. |
| **FIN** | `FIN_CONNECTION_STRING` | `db58355.public.databaseasp.net` | `db58355` | `db58355` | Tài chính kế toán: Bút toán sổ cái, Thu chi, Doanh thu ca. |

> [!IMPORTANT]
> **Điểm cốt lõi cho LMS Backend**: Khi chạy phân hệ LMS (`LMS-Solution/BE`), quyền ghi (`Write-Permission`) **chỉ được phép thực hiện trên `db58356`** thông qua `ILmsUnitOfWork`. Tất cả 8 cơ sở dữ liệu còn lại chỉ được đọc thông qua `AsNoTracking()` để hiển thị thông tin tham chiếu.

---

## 3. CẤU HÌNH BẢO MẬT & XÁC THỰC (JWT TOKEN)

- **`JWT_KEY`**: Chuỗi secret 64 ký tự chuẩn HMAC-SHA256 (`RpzGgg7v5VVJ23KTNJcgVwiA1054jhsVOQycn8Auefxzk11Tbtz8qXD5wTWhktnR`).
  - *Đặc điểm:* Được dùng chung giữa System API và LMS API để LMS API tự kiểm tra tính hợp lệ của Token mà không cần gọi mạng về System API.
- **`JWT_ISSUER`**: `https://localhost:7001/` (Lưu ý: Port 7001 là HRM, cần thống nhất xem Issuer từ System là `7000` hay `7001`).
- **`JWT_AUDIENCE`**: `User`.
- **`JWT_ACCESS_TOKEN_EXPIRATION`**: `1200` phút (20 tiếng).
- **`JWT_REFRESH_TOKEN_EXPIRATION`**: `30` ngày.

---

## 4. CÁC TÍCH HỢP BÊN NGOÀI (EXTERNAL SERVICES)

File env chứa sẵn thông tin kết nối các dịch vụ đối tác quan trọng:
1. **Hóa đơn điện tử MISA (MISA meInvoice)**:
   - Base URL: `https://testapi.meinvoice.vn/api/integration`
   - Test App ID: `fbf2e20c-95ec-4832-b8c8-a05ae70c919b`
   - Mã số thuế test: `6868686868-882`
   - Dùng cho xuất hóa đơn thanh toán hợp đồng đào tạo hoặc mua combo máy kèm khóa học.
2. **Cổng thanh toán quầy MPOS (NextPay)**:
   - Base URL: `https://dev-pushpayment.nextpay.vn/`
   - Test Merchant ID: `50729242`, Terminal POSID: `SP022207080197`
   - Phục vụ quẹt thẻ thanh toán tại chỗ.
3. **Redis & Azure Blob Storage**:
   - Hiện đang để trống trong development (`REDIS_CONNECTION=`, `AZURE_BLOB_STORAGE=`).
   - Cần đảm bảo mã nguồn Backend C# không văng lỗi (NullReferenceException) khi các biến này rỗng.

---

## 5. RÀ SOÁT CÁC BẪY KHỞI ĐỘNG (STARTUP TRAPS) & GIẢI PHÁP ĐỀ XUẤT

Trong quá trình kiểm tra mã nguồn `Program.cs` và `DependencyInjection.cs` của Horeca LMS BE, phát hiện **2 điểm nghẽn kỹ thuật** cần tinh chỉnh để dự án khởi động an toàn:

### 5.1. Bẫy số 1: Tự động chạy `MigrateAsync()` cả 9 Database khi khởi động
- **Hiện trạng trong `src/API/Program.cs` (Dòng 95-112)**:
  ```csharp
  if (app.Environment.IsDevelopment())
  {
      using var scope = app.Services.CreateScope();
      var dbContexts = new DbContext[]
      {
          scope.ServiceProvider.GetRequiredService<SystemDbContext>(),
          scope.ServiceProvider.GetRequiredService<HrmDbContext>(),
          scope.ServiceProvider.GetRequiredService<LmsDbContext>(),
          scope.ServiceProvider.GetRequiredService<CrmDbContext>(),
          scope.ServiceProvider.GetRequiredService<PosDbContext>(),
          scope.ServiceProvider.GetRequiredService<FsmDbContext>(),
          scope.ServiceProvider.GetRequiredService<ScmDbContext>(),
          scope.ServiceProvider.GetRequiredService<MesDbContext>(),
          scope.ServiceProvider.GetRequiredService<FinDbContext>()
      };
      foreach (var db in dbContexts)
      {
          await db.Database.MigrateAsync();
      }
  }
  ```
- **Rủi ro**: Nếu đường truyền mạng đến một trong các DB của MonsterASP bị timeout hoặc chập chờn, toàn bộ Backend LMS sẽ bị crash ngay lúc boot! Hơn nữa, phân hệ LMS chỉ nên có quyền chạy migration cho **`LmsDbContext`**, không nên tự động can thiệp migration vào Crm, Pos, Mes, Fin.
- **Giải pháp**: Tinh chỉnh lại đoạn code này: Bọc `try/catch` từng DB, và trong LMS API thì ưu tiên migrate `LmsDbContext` và `SystemDbContext`.

### 5.2. Bẫy số 2: Kiểm tra bắt buộc 9 Connection Strings
- Nhờ việc đưa file cấu hình môi trường vào `BE/src/API/.env`, hiện tại cả 9 chuỗi kết nối đã có đầy đủ giá trị.
- [DependencyInjection.cs](file:///e:/Projects/DigiFnb/Horeca/LMS-Solution/BE/src/Infrastructure/DependencyInjection.cs) sẽ đọc thành công 9 chuỗi kết nối từ `EnvLoader` mà không còn bị văng `InvalidOperationException`.
