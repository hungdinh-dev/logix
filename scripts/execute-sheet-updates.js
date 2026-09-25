const fs = require('fs');
const service = require('./sheets-service.js');

const SPREADSHEET_ID = '12RLN5E-ptEI6NcNBEtyZMnwy_6JRORrutR27O5p97J4';

async function executeUpdates() {
  console.log('=== BẮT ĐẦU CẬP NHẬT GOOGLE SHEETS ===');
  const token = await service.getAccessToken();

  // 1. BACKUP CURRENT DATA
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const horecaCurrent = await (await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Horeca%20LMS!A1:Z200`, {
    headers: { Authorization: `Bearer ${token}` }
  })).json();
  const bahungCurrent = await (await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/BaHung%20LMS!A1:Z200`, {
    headers: { Authorization: `Bearer ${token}` }
  })).json();

  fs.writeFileSync(`backup_horeca_${timestamp}.json`, JSON.stringify(horecaCurrent.values, null, 2), 'utf8');
  fs.writeFileSync(`backup_bahung_${timestamp}.json`, JSON.stringify(bahungCurrent.values, null, 2), 'utf8');
  console.log(`[Backup] Đã sao lưu dữ liệu hiện tại vào backup_horeca_${timestamp}.json và backup_bahung_${timestamp}.json`);

  // ==========================================
  // 2. PREPARE HORECA LMS UPDATES
  // ==========================================
  console.log('\n--- Chuẩn bị dữ liệu cập nhật Horeca LMS ---');
  const horecaBatchData = [];

  // Update R7: LMS-006 (Gửi bình luận)
  horecaBatchData.push({
    range: "'Horeca LMS'!H7:L7",
    values: [['1', '4', 'Done', 'Done', 'Done']]
  });
  // Update R9: LMS-001 (Đăng nhập / Đăng ký)
  horecaBatchData.push({
    range: "'Horeca LMS'!E9",
    values: [['Đăng nhập / Đăng ký tài khoản']]
  });
  // Update R21: LMS-013 (Tạo phòng học trực tuyến -> HỦY)
  horecaBatchData.push({
    range: "'Horeca LMS'!H21:L21",
    values: [['HỦY', '7', 'Cancelled', 'Cancelled', 'Cancelled']]
  });
  // Update R22: LMS-014 (Quản lý người tham gia -> HỦY)
  horecaBatchData.push({
    range: "'Horeca LMS'!H22:L22",
    values: [['HỦY', '6', 'Cancelled', 'Cancelled', 'Cancelled']]
  });
  // Update R33: LMS-025 (Cấp chứng chỉ cho khách hàng)
  horecaBatchData.push({
    range: "'Horeca LMS'!H33:L33",
    values: [['1', '5', 'Done', 'Done', 'Done']]
  });
  // Update R37: LMS-029 (Cảnh báo học viên chậm tiến độ)
  horecaBatchData.push({
    range: "'Horeca LMS'!H37:L37",
    values: [['1', '4', 'Done', 'Done', 'Done']]
  });
  // Update R41: LMS-033 (Báo cáo thời lượng xem video)
  horecaBatchData.push({
    range: "'Horeca LMS'!H41:L41",
    values: [['1', '4', 'Done', 'Done', 'Done']]
  });
  // Update R44: LMS-036 (Thống kê điểm số trung bình)
  horecaBatchData.push({
    range: "'Horeca LMS'!H44:L44",
    values: [['1', '4', 'Done', 'Done', 'Done']]
  });
  // Update R48: LMS-040 (Import danh sách học viên)
  horecaBatchData.push({
    range: "'Horeca LMS'!H48:L48",
    values: [['1', '4', 'Done', 'Done', 'Done']]
  });

  // Horeca New Rows (Rows 70 to 77)
  const horecaNewRows = [
    [
      'LMS-062', 'LMS', 'Quản lý Thông báo', 'Thông báo Hệ thống',
      'Quản lý thông báo Realtime & In-app',
      'Hệ thống thông báo thời gian thực (SSE), đếm số thông báo chưa đọc, đánh dấu đã đọc/tất cả đã đọc, thông báo khi có phản hồi bình luận, gán khóa học, chứng chỉ mới.',
      'Admin / Trainer / Học viên', '1', '5', 'Done', 'Done', 'Done',
      'Đã phát triển hoàn thiện trong LogiX (backend/src/modules/notifications, frontend/src/features/notifications)'
    ],
    [
      'LMS-063', 'LMS', 'Kiểm tra & đánh giá', 'Ngân hàng câu hỏi',
      'Quản lý Ngân hàng câu hỏi tập trung (Question Bank)',
      'Quản lý ngân hàng câu hỏi độc lập theo danh mục, mức độ khó (Dễ/TB/Khó), gắn tags, import từ CSV/Excel và đồng bộ hai chiều Google Sheets.',
      'Admin / Trainer', '1', '6', 'Done', 'Done', 'Done',
      'Đã phát triển hoàn thiện trong LogiX (backend/src/modules/question-banks, frontend/src/features/lms/question-banks)'
    ],
    [
      'LMS-064', 'LMS', 'Chứng chỉ & Tốt nghiệp', 'Chứng chỉ',
      'Quản lý Mẫu phôi & Tra cứu xác thực chứng chỉ công khai',
      'Thiết kế mẫu phôi chứng chỉ linh hoạt, tự động sinh mã QR/mã xác thực CERT-YYYY-BH-XXXXX, cổng verify công khai chống làm giả, hỗ trợ thu hồi và gia hạn.',
      'Admin / Giảng viên / Học viên / Nhà tuyển dụng', '1', '6', 'Done', 'Done', 'Done',
      'Đã phát triển hoàn thiện trong LogiX (backend/src/modules/certificates, frontend/src/features/lms/certificates-admin)'
    ],
    [
      'LMS-065', 'LMS', 'Quản lý khóa học', 'Khóa học',
      'Nhân bản khóa học (Course Cloning)',
      'Cho phép sao chép nhanh toàn bộ thông tin khóa học, chương mục, bài giảng và cấu hình quiz chỉ với 1 click giúp nhân bản chương trình đào tạo nhanh chóng.',
      'Admin / Trainer', '1', '4', 'Done', 'Done', 'Done',
      'Đã phát triển hoàn thiện trong LogiX (POST /api/courses/:id/clone)'
    ],
    [
      'LMS-066', 'LMS', 'Kiểm tra & đánh giá', 'Quiz',
      'Chế độ xem trước bài kiểm tra (Quiz Preview Mode)',
      'Cho phép Giảng viên và Admin xem trước đề thi với giao diện và luồng làm bài thực tế của học viên mà không tạo lượt thi giả lập.',
      'Admin / Trainer', '1', '4', 'Done', 'Done', 'Done',
      'Đã phát triển hoàn thiện trong LogiX (GET /api/quizzes/:id/preview)'
    ],
    [
      'LMS-067', 'LMS', 'Giám sát & Báo cáo', 'Activity Log',
      'Nhật ký hoạt động học tập thời gian thực (LMS Activity Feed)',
      'Theo dõi toàn bộ dòng sự kiện học tập của học viên theo thời gian thực (ghi danh, bắt đầu học, hoàn thành bài, nộp quiz, nhận chứng chỉ).',
      'Admin / Quản lý', '1', '5', 'Done', 'Done', 'Done',
      'Đã phát triển hoàn thiện trong LogiX (backend/src/modules/activity-logs, frontend/src/features/lms/activities)'
    ],
    [
      'LMS-068', 'LMS', 'Quản lý bài giảng', 'Video',
      'Tự động trích xuất thông tin video YouTube (Video Parser)',
      'Tự động bóc tách Video ID, thumbnail chất lượng cao và thời lượng video trực tiếp từ đường link YouTube khi tạo bài giảng.',
      'Admin / Trainer', '1', '3', 'Done', 'Done', 'Done',
      'Đã phát triển hoàn thiện trong LogiX (POST /api/lessons/parse-youtube)'
    ],
    [
      'LMS-069', 'LMS', 'Quản trị hệ thống', 'Audit Log',
      'Hệ thống Kiểm toán Thao tác Dữ liệu (System Audit Log)',
      'Ghi vết toàn bộ hành vi CRUD trên hệ thống (TableName, EntityId, Action, OldValue, NewValue, Diff JSON, UserId, Timestamp) phục vụ bảo mật & kiểm toán.',
      'Admin / Quản trị viên', '1', '6', 'Done', 'Done', 'Done',
      'Đã phát triển hoàn thiện trong LogiX (backend/src/modules/audit-logs, tương thích C# .NET AuditLog)'
    ]
  ];

  horecaBatchData.push({
    range: "'Horeca LMS'!A70:M77",
    values: horecaNewRows
  });

  // Execute Horeca Batch Update
  const resHoreca = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values:batchUpdate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      valueInputOption: 'USER_ENTERED',
      data: horecaBatchData
    })
  });
  const dataHoreca = await resHoreca.json();
  if (dataHoreca.error) {
    throw new Error(`Horeca Update Error: ${dataHoreca.error.message}`);
  }
  console.log(`[Horeca LMS] Cập nhật thành công ${dataHoreca.totalUpdatedRows || dataHoreca.responses.length} phạm vi dữ liệu!`);

  // ==========================================
  // 3. PREPARE BAHUNG LMS UPDATES
  // ==========================================
  console.log('\n--- Chuẩn bị dữ liệu cập nhật BaHung LMS ---');
  const bahungBatchData = [];

  // Update R4: LMS-003 (Sao chép khóa học)
  bahungBatchData.push({
    range: "'BaHung LMS'!H4:M4",
    values: [['1', '4', 'Done', 'Done', 'Done', 'Done']]
  });

  // Update R54: LMS-053 (Học trên App di động -> HỦY)
  bahungBatchData.push({
    range: "'BaHung LMS'!H54:M54",
    values: [['HỦY', '8', 'Cancelled', 'Cancelled', 'Cancelled', 'Cancelled']]
  });

  // Completed rows in BaHung to set Phase: 1, BE: Done, FE: Done, All: Done, Test: Done
  const bahungCompletedRows = [
    // R8 to R21: LMS-007 to LMS-020
    8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    // R23 to R29: LMS-022 to LMS-028 (ATTP)
    23, 24, 25, 26, 27, 28, 29,
    // R32, R33: LMS-031, LMS-032
    32, 33,
    // R34 to R44: LMS-033 to LMS-043 (Onboarding)
    34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44,
    // R45 to R53: LMS-044 to LMS-052 (Learner management & Web learning)
    45, 46, 47, 48, 49, 50, 51, 52, 53,
    // R55 to R56: LMS-054, LMS-055
    55, 56,
    // R57 to R71: LMS-056 to LMS-070 (Quiz engine, all question types, auto/manual grading, pass/fail)
    57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71,
    // R91 to R92: LMS-090, LMS-091 (SOP E-Sign)
    91, 92,
    // R95 to R100: LMS-094 to LMS-099 (Reports)
    95, 96, 97, 98, 99, 100,
    // R102 to R108: LMS-101 to LMS-107 (Admin, sync HRM, export Excel)
    102, 103, 104, 105, 106, 107, 108,
    // R110 to R112: LMS-109 to LMS-111 (SSO, Audit log, Backup)
    110, 111, 112
  ];

  // For consecutive rows, group them for efficiency
  // Let's do row-by-row or grouped range updates:
  bahungCompletedRows.forEach(r => {
    // Columns H, I, J, K, L, M
    // Note: preserve column I (difficulty) from current row
    const diff = bahungCurrent.values[r - 1][8] || '4';
    bahungBatchData.push({
      range: `'BaHung LMS'!H${r}:M${r}`,
      values: [['1', diff, 'Done', 'Done', 'Done', 'Done']]
    });
  });

  // BaHung New Rows (Rows 113 to 122)
  const bahungNewRows = [
    [
      'LMS-112', 'LMS', 'Thông báo & Tương tác', 'Thông báo',
      'Quản lý thông báo Realtime & In-app qua SSE',
      'Hệ thống thông báo thời gian thực, tự động gửi cảnh báo khi được gán khóa học bắt buộc, nhắc nhở hạn hoàn thành khóa học, thông báo khi chứng chỉ ATTP sắp hết hạn (30/15/7 ngày).',
      'Toàn bộ nhân sự / Quản trị viên', '1', '5', 'Done', 'Done', 'Done', 'Done',
      'Đã phát triển hoàn thiện trong LogiX (backend/src/modules/notifications, frontend/src/features/notifications)'
    ],
    [
      'LMS-113', 'LMS', 'Đào tạo & Tương tác', 'Bình luận',
      'Hệ thống Bình luận & Thảo luận tương tác dưới Bài giảng',
      'Học viên và Trainer trao đổi trực tiếp dưới bài giảng, hỗ trợ bình luận phân cấp nhiều tầng (nested replies), thả tim (like), Trainer ghim (pin) câu trả lời quan trọng lên đầu.',
      'Học viên / Trainer', '1', '5', 'Done', 'Done', 'Done', 'Done',
      'Đã phát triển hoàn thiện trong LogiX (backend/src/modules/lesson-comments, frontend/src/features/lms/comments)'
    ],
    [
      'LMS-114', 'LMS', 'ATTP & Chứng chỉ', 'Chứng chỉ',
      'Quản lý Mẫu phôi chứng chỉ & Cổng tra cứu xác thực công khai',
      'Tạo và cấu hình các mẫu phôi chứng chỉ (ATTP, Nghiệp vụ, An toàn lao động), cấu hình thời hạn hiệu lực, tổ chức cấp, người ký; cấp mã định danh CERT-YYYY-BH-XXXXX và cổng verify công khai.',
      'Admin LMS / Nhân sự / Ban Giám Đốc', '1', '6', 'Done', 'Done', 'Done', 'Done',
      'Đã phát triển hoàn thiện trong LogiX (backend/src/modules/certificates, frontend/src/features/lms/certificates-admin)'
    ],
    [
      'LMS-115', 'LMS', 'ATTP & Chứng chỉ', 'Chứng chỉ',
      'Thu hồi và Gia hạn Chứng chỉ Đào tạo / ATTP',
      'Cho phép Quản trị viên thu hồi chứng chỉ khi vi phạm quy định (lưu rõ lý do thu hồi) hoặc gia hạn chứng chỉ khi nhân sự hoàn thành kỳ sát hạch định kỳ.',
      'Admin LMS / Trainer', '1', '5', 'Done', 'Done', 'Done', 'Done',
      'Đã phát triển hoàn thiện trong LogiX (CertificateService revoke & renew methods)'
    ],
    [
      'LMS-116', 'LMS', 'Kiểm tra & đánh giá', 'Ngân hàng câu hỏi',
      'Quản lý Ngân hàng câu hỏi tập trung & Luật bốc đề thi ngẫu nhiên (Pool Rules)',
      'Ngân hàng câu hỏi phân cấp theo chuyên đề (Bếp, Bar, Thu ngân, ATTP), độ khó (Dễ/TB/Khó), tags; hỗ trợ import CSV/Excel, đồng bộ Google Sheets; Quiz tự động bốc ngẫu nhiên N câu theo luật.',
      'Admin LMS / Trainer', '1', '6', 'Done', 'Done', 'Done', 'Done',
      'Đã phát triển hoàn thiện trong LogiX (backend/src/modules/question-banks, frontend/src/features/lms/question-banks)'
    ],
    [
      'LMS-117', 'LMS', 'Kiểm tra & đánh giá', 'Quiz',
      'Chế độ xem trước bài kiểm tra (Quiz Preview Mode)',
      'Cho phép Giảng viên/Admin xem trước đề thi với giao diện và luồng làm bài thực tế của học viên mà không tạo lượt thi giả lập.',
      'Admin LMS / Trainer', '1', '4', 'Done', 'Done', 'Done', 'Done',
      'Đã phát triển hoàn thiện trong LogiX (GET /api/quizzes/:id/preview)'
    ],
    [
      'LMS-118', 'LMS', 'Quản trị hệ thống', 'Audit Log',
      'Hệ thống Kiểm toán Thao tác Dữ liệu Chi tiết (System Audit Log)',
      'Ghi vết toàn bộ hành vi CRUD trên hệ thống (TableName, EntityId, Action, OldValue, NewValue, Diff JSON, UserId, Timestamp) phục vụ bảo mật & kiểm toán, tương thích C# .NET AuditLog.',
      'Admin / Quản trị viên', '1', '6', 'Done', 'Done', 'Done', 'Done',
      'Đã phát triển hoàn thiện trong LogiX (backend/src/modules/audit-logs, tương thích C# .NET AuditLog)'
    ],
    [
      'LMS-119', 'LMS', 'Quản lý bài giảng', 'Video',
      'Tự động trích xuất thông tin video YouTube (Video Parser)',
      'Tự động bóc tách Video ID, thumbnail chất lượng cao và thời lượng video trực tiếp từ đường link YouTube khi tạo bài giảng.',
      'Admin LMS / Trainer', '1', '3', 'Done', 'Done', 'Done', 'Done',
      'Đã phát triển hoàn thiện trong LogiX (POST /api/lessons/parse-youtube)'
    ],
    [
      'LMS-120', 'LMS', 'Quản trị hệ thống', 'Hồ sơ nhân sự',
      'Quản lý Định nghĩa Trường Dữ liệu Tùy chỉnh (Dynamic Custom Fields)',
      'Cho phép mở rộng hồ sơ nhân sự/học viên với các trường dữ liệu động (text, number, select, date) linh hoạt mà không cần đổi cấu trúc bảng cơ sở dữ liệu cứng.',
      'Admin LMS / HR', '1', '5', 'Done', 'Done', 'Done', 'Done',
      'Đã phát triển hoàn thiện trong LogiX (backend/src/modules/custom-fields, frontend/src/app/(protected)/admin/custom-fields)'
    ],
    [
      'LMS-121', 'LMS', 'Quản trị hệ thống', 'Phân quyền',
      'Quản trị Phân cấp Vai trò & Cây Phòng ban Tổ chức (Role Hierarchy & Org Tree)',
      'Giao diện trực quan sơ đồ phân cấp vai trò (Role Hierarchy) và cây cơ cấu tổ chức phòng ban (Department Tree), quản lý ma trận phân quyền chi tiết cho từng nghiệp vụ LMS.',
      'Admin LMS / Ban Giám Đốc', '1', '6', 'Done', 'Done', 'Done', 'Done',
      'Đã phát triển hoàn thiện trong LogiX (backend/src/modules/roles, permissions, departments)'
    ]
  ];

  bahungBatchData.push({
    range: "'BaHung LMS'!A113:N122",
    values: bahungNewRows
  });

  // Execute BaHung Batch Update
  const resBahung = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values:batchUpdate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      valueInputOption: 'USER_ENTERED',
      data: bahungBatchData
    })
  });
  const dataBahung = await resBahung.json();
  if (dataBahung.error) {
    throw new Error(`BaHung Update Error: ${dataBahung.error.message}`);
  }
  console.log(`[BaHung LMS] Cập nhật thành công ${dataBahung.totalUpdatedRows || dataBahung.responses.length} phạm vi dữ liệu!`);

  console.log('\n=== HOÀN TẤT TOÀN BỘ CẬP NHẬT TRÊN GOOGLE SHEETS! ===');
}

executeUpdates().catch(err => {
  console.error('LỖI CẬP NHẬT:', err);
  process.exit(1);
});
