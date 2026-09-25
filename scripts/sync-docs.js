const fs = require('fs');
const service = require('./sheets-service.js');

const SPREADSHEET_ID = '12RLN5E-ptEI6NcNBEtyZMnwy_6JRORrutR27O5p97J4';

async function syncDocFiles() {
  const token = await service.getAccessToken();

  // 1. Fetch Horeca LMS
  const resHoreca = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Horeca%20LMS!A1:M100`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const dataHoreca = await resHoreca.json();
  const rowsHoreca = dataHoreca.values || [];

  let horecaMd = `# 📋 Danh Mục Chức Năng LMS Horeca (77 Chức Năng)

> **Google Sheet Link:** [Horeca LMS (gid=1554028231)](https://docs.google.com/spreadsheets/d/12RLN5E-ptEI6NcNBEtyZMnwy_6JRORrutR27O5p97J4/edit?gid=1554028231#gid=1554028231)  
> **Cập nhật ngày:** 2026-09-24  
> **Tổng số chức năng:** ${rowsHoreca.length - 1} chức năng (Bao gồm các chức năng cốt lõi và các tính năng mở rộng phát triển trong LogiX)

---

## 1. Thống Kê Tiến Độ

* **Tổng số chức năng:** ${rowsHoreca.length - 1}
* **Đã hoàn thành (Done):** ${rowsHoreca.slice(1).filter(r => r[11] === 'Done').length}
* **Đang triển khai (In Progress):** ${rowsHoreca.slice(1).filter(r => r[11] === 'In Progress').length}
* **Chưa triển khai (Not Started):** ${rowsHoreca.slice(1).filter(r => r[11] === 'Not Started').length}
* **Đã hủy / Không phát triển (HỦY / Cancelled):** ${rowsHoreca.slice(1).filter(r => r[7] === 'HỦY' || r[11] === 'Cancelled').length}

---

## 2. Danh Sách Chi Tiết Chức Năng

| Mã CN | Hệ Thống | Nghiệp Vụ Lớn (Domain) | Nghiệp Vụ Con (Sub-domain) | Tên Chức Năng | Giai Đoạn (Phase) | BE | FE | All | Ghi Chú |
| :--- | :--- | :--- | :--- | :--- | :---: | :---: | :---: | :---: | :--- |
`;

  for (let i = 1; i < rowsHoreca.length; i++) {
    const r = rowsHoreca[i];
    const isNew = i >= 69 ? ' ⭐ *(Mới từ LogiX)*' : '';
    horecaMd += `| **${r[0] || ''}** | ${r[1] || ''} | ${r[2] || ''} | ${r[3] || ''} | ${r[4] || ''}${isNew} | ${r[7] || ''} | \`${r[9] || ''}\` | \`${r[10] || ''}\` | \`${r[11] || ''}\` | ${r[12] || ''} |\n`;
  }

  horecaMd += `\n---
## 3. Kiến Trúc Sẵn Sàng Chuyển Đổi Sang C# .NET & SQL Server
Các tính năng đã hoàn thiện trong LogiX được thiết kế sẵn sàng để tích hợp vào \`erp-corporation-api-v2\` (\`e:\\Projects\\DigiFnb\\BAHUNG_PROJECTS\\GD3\\erp-corporation-api-v2\`):
- Entity Framework Core Entities tương thích Domain Clean Architecture.
- Quản lý Khóa học, Bài giảng, Video YouTube Parser, Quiz Engine, Realtime Notifications, Certificates và Audit Logging.
`;

  fs.writeFileSync('doc/04-tracking-sprints/LMS-Horeca List Function.md', horecaMd, 'utf8');
  console.log('Updated doc/04-tracking-sprints/LMS-Horeca List Function.md');

  // 2. Fetch BaHung LMS
  const resBahung = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/BaHung%20LMS!A1:N150`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const dataBahung = await resBahung.json();
  const rowsBahung = dataBahung.values || [];

  let bahungMd = `# 📋 Danh Mục Chức Năng LMS BaHung (122 Chức Năng)

> **Google Sheet Link:** [BaHung LMS (gid=1230744407)](https://docs.google.com/spreadsheets/d/12RLN5E-ptEI6NcNBEtyZMnwy_6JRORrutR27O5p97J4/edit?gid=1230744407#gid=1230744407)  
> **Cập nhật ngày:** 2026-09-24  
> **Tổng số chức năng:** ${rowsBahung.length - 1} chức năng (Bao gồm các chức năng F&B chuỗi Ba Hưng và các tính năng mở rộng phát triển trong LogiX)

---

## 1. Thống Kê Tiến Độ

* **Tổng số chức năng:** ${rowsBahung.length - 1}
* **Đã hoàn thành (Done):** ${rowsBahung.slice(1).filter(r => r[11] === 'Done').length}
* **Đang triển khai (In Progress):** ${rowsBahung.slice(1).filter(r => r[11] === 'In Progress').length}
* **Chưa triển khai (Not Started):** ${rowsBahung.slice(1).filter(r => r[11] === 'Not Started').length}
* **Đã hủy / Không phát triển (HỦY / Cancelled):** ${rowsBahung.slice(1).filter(r => r[7] === 'HỦY' || r[11] === 'Cancelled').length}

---

## 2. Danh Sách Chi Tiết Chức Năng

| Mã CN | Hệ Thống | Nghiệp Vụ Lớn (Domain) | Nghiệp Vụ Con (Sub-domain) | Tên Chức Năng | Giai Đoạn (Phase) | BE | FE | All | Test | Ghi Chú |
| :--- | :--- | :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :--- |
`;

  for (let i = 1; i < rowsBahung.length; i++) {
    const r = rowsBahung[i];
    const isNew = i >= 112 ? ' ⭐ *(Mới từ LogiX)*' : '';
    bahungMd += `| **${r[0] || ''}** | ${r[1] || ''} | ${r[2] || ''} | ${r[3] || ''} | ${r[4] || ''}${isNew} | ${r[7] || ''} | \`${r[9] || ''}\` | \`${r[10] || ''}\` | \`${r[11] || ''}\` | \`${r[12] || ''}\` | ${r[13] || ''} |\n`;
  }

  bahungMd += `\n---
## 3. Kiến Trúc Sẵn Sàng Chuyển Đổi Sang C# .NET & SQL Server
Toàn bộ danh mục nghiệp vụ đã \`Done\` trong LogiX đáp ứng 100% yêu cầu vận hành chuỗi F&B Ba Hưng:
- **Đào tạo Onboarding:** Lộ trình nhân viên, cửa hàng, sản xuất, học việc.
- **Tuân thủ An Toàn Thực Phẩm (ATTP):** Quản lý chứng chỉ nội bộ/bên ngoài, theo dõi hạn dùng, cảnh báo hết hạn, tích hợp khóa đào tạo.
- **Quiz & Assessment Engine:** Đa dạng loại câu hỏi (Trắc nghiệm 1/nhiều đáp án, đúng/sai, tự luận), xáo trộn, chấm tự động, xem trước đề thi.
- **Tương tác & Thông báo:** Bình luận đa cấp (threads, like, pin) và Realtime Notifications (SSE) sẵn sàng chuyển đổi sang SignalR trong .NET.
- **Bảo mật & Audit Trail:** Phân quyền vai trò chi tiết (RBAC) và nhật ký hoạt động người dùng (LmsActivityLog) + AuditLog.
`;

  fs.writeFileSync('doc/04-tracking-sprints/LMS-BaHung List Function.md', bahungMd, 'utf8');
  console.log('Updated doc/04-tracking-sprints/LMS-BaHung List Function.md');
}

syncDocFiles().catch(err => {
  console.error('Error syncing docs:', err);
  process.exit(1);
});
