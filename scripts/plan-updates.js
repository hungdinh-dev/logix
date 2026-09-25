const fs = require('fs');

const horeca = JSON.parse(fs.readFileSync('horeca_lms_full.json', 'utf8'));
const bahung = JSON.parse(fs.readFileSync('bahung_lms_full.json', 'utf8'));

// Plan changes for Horeca LMS
const horecaUpdates = [];
// R7: LMS-006 Gửi bình luận dưới bài học -> Done
horecaUpdates.push({ row: 7, code: 'LMS-006', changes: { H: '1', J: 'Done', K: 'Done', L: 'Done' }, reason: 'Đã hoàn thành module lesson-comments (nested replies, like, pin)' });
// R9: LMS-001 Đăng nhập / đăng ký tài khoản -> Set name if missing
if (!horeca[8][4] || horeca[8][4].trim() === '') {
  horecaUpdates.push({ row: 9, code: 'LMS-001', changes: { E: 'Đăng nhập / Đăng ký tài khoản' }, reason: 'Bổ sung tên chức năng bị trống' });
}
// R33: LMS-025 Cấp chứng chỉ cho khách hàng -> Done
horecaUpdates.push({ row: 33, code: 'LMS-025', changes: { H: '1', J: 'Done', K: 'Done', L: 'Done' }, reason: 'Đã hoàn thành module certificates & templates' });
// R37: LMS-029 Cảnh báo học viên chậm tiến độ -> Done
horecaUpdates.push({ row: 37, code: 'LMS-029', changes: { H: '1', J: 'Done', K: 'Done', L: 'Done' }, reason: 'Đã hoàn thành theo dõi tiến độ và thông báo cảnh báo' });
// R41: LMS-033 Báo cáo thời lượng xem video -> Done
horecaUpdates.push({ row: 41, code: 'LMS-033', changes: { H: '1', J: 'Done', K: 'Done', L: 'Done' }, reason: 'Đã hoàn thành ghi nhận learning time & lastPositionSeconds' });
// R44: LMS-036 Thống kê điểm số trung bình -> Done
horecaUpdates.push({ row: 44, code: 'LMS-036', changes: { H: '1', J: 'Done', K: 'Done', L: 'Done' }, reason: 'Đã hoàn thành thống kê quiz attempt scores & average trong progress' });
// R48: LMS-040 Import danh sách học viên -> Done
horecaUpdates.push({ row: 48, code: 'LMS-040', changes: { H: '1', J: 'Done', K: 'Done', L: 'Done' }, reason: 'Đã hoàn thành hỗ trợ import/quản lý danh sách người dùng' });

// New rows for Horeca LMS (starting after row 69, i.e. row 70):
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

// Plan changes for BaHung LMS
const bahungUpdates = [];

// Rows in BaHung where Phase was HỦY / CHƯA TRIỂN KHAI or HỦY, but BE, FE, All are Done -> Change Phase to 1, Test to Done
// Also R4: LMS-003 Sao chép khóa học -> Phase 1, BE: Done, FE: Done, All: Done, Test: Done
bahungUpdates.push({ row: 4, code: 'LMS-003', changes: { H: '1', J: 'Done', K: 'Done', L: 'Done', M: 'Done' }, reason: 'Đã hoàn thành tính năng nhân bản khóa học (POST /api/courses/:id/clone)' });

// Check all rows R8 through R112
for (let r = 8; r <= 112; r++) {
  const rowData = bahung[r - 1];
  const code = rowData[0];
  const name = rowData[4];
  const currentPhase = rowData[7];
  const be = rowData[9];
  const fe = rowData[10];
  const all = rowData[11];
  const test = rowData[12];

  // Specific rows that are already Done in LogiX
  const completedInLogix = [
    // R8-R21: LMS-007 to LMS-020
    8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    // R23-R29: LMS-022 to LMS-028 (ATTP)
    23, 24, 25, 26, 27, 28, 29,
    // R32-R33: LMS-031, LMS-032
    32, 33,
    // R34-R44: LMS-033 to LMS-043 (Onboarding)
    34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44,
    // R45-R53: LMS-044 to LMS-052 (Learner management, enrollment, web learning)
    45, 46, 47, 48, 49, 50, 51, 52, 53,
    // R55-R56: LMS-054, LMS-055 (Download resources, learning time)
    55, 56,
    // R57-R71: LMS-056 to LMS-070 (Quiz engine, question types, grading, pass/fail)
    57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71,
    // R91-R92: LMS-090, LMS-091 (SOP E-Sign)
    91, 92,
    // R95-R100: LMS-094 to LMS-099 (Reports)
    95, 96, 97, 98, 99, 100,
    // R102-R108: LMS-101 to LMS-107 (Admin, sync HRM, export Excel)
    102, 103, 104, 105, 106, 107, 108,
    // R110-R112: LMS-109 to LMS-111 (SSO, Audit log, Backup)
    110, 111, 112
  ];

  if (completedInLogix.includes(r)) {
    const ch = {};
    if (currentPhase !== '1') ch.H = '1';
    if (be !== 'Done') ch.J = 'Done';
    if (fe !== 'Done') ch.K = 'Done';
    if (all !== 'Done') ch.L = 'Done';
    if (test !== 'Done') ch.M = 'Done';

    if (Object.keys(ch).length > 0) {
      bahungUpdates.push({
        row: r,
        code,
        name,
        changes: ch,
        reason: 'Đã hoàn thành đầy đủ Backend, Frontend và Database trong LogiX'
      });
    }
  }
}

// New rows for BaHung LMS (starting after row 112, i.e. row 113):
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

console.log('=== HORECA LMS UPDATES ===');
console.log('Existing row updates:', horecaUpdates.length);
horecaUpdates.forEach(u => console.log(` Row ${u.row} [${u.code}]:`, JSON.stringify(u.changes), `-> ${u.reason}`));
console.log('New rows to append:', horecaNewRows.length);
horecaNewRows.forEach(r => console.log(` + [${r[0]}] ${r[4]}`));

console.log('\n=== BAHUNG LMS UPDATES ===');
console.log('Existing row updates:', bahungUpdates.length);
bahungUpdates.slice(0, 15).forEach(u => console.log(` Row ${u.row} [${u.code}] ${u.name}:`, JSON.stringify(u.changes)));
console.log(` ... and ${bahungUpdates.length - 15} more rows updated to Phase 1 & Done.`);
console.log('New rows to append:', bahungNewRows.length);
bahungNewRows.forEach(r => console.log(` + [${r[0]}] ${r[4]}`));
