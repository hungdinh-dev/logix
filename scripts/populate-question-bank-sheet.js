const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SPREADSHEET_ID = '1Iwjkuvwx2EF4r5XoHpZgOaN4K5OAEKfiFi-hrE2Z_ec';
const KEY_FILE = path.resolve(__dirname, '../lms-list-functions-a6929ed66987.json');

if (!fs.existsSync(KEY_FILE)) {
  console.error('Key file not found at:', KEY_FILE);
  process.exit(1);
}

const credentials = JSON.parse(fs.readFileSync(KEY_FILE, 'utf8'));

function createJWT() {
  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: credentials.client_email,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  };
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signatureInput = `${encodedHeader}.${encodedPayload}`;
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(signatureInput);
  const signature = signer.sign(credentials.private_key, 'base64url');
  return `${signatureInput}.${signature}`;
}

async function getAccessToken() {
  const jwt = createJWT();
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt
    })
  });
  const data = await res.json();
  if (data.error) {
    throw new Error(`Google Auth Failed: ${data.error_description || data.error}`);
  }
  return data.access_token;
}

const HEADERS = [
  'code',
  'question',
  'type',
  'difficulty',
  'points',
  'option_a',
  'option_b',
  'option_c',
  'option_d',
  'correct_answer',
  'explanation',
  'tags'
];

// Data Tab 1: JavaScript_Core
const JS_DATA = [
  HEADERS,
  [
    'JS_CORE_01',
    'Kết quả của typeof NaN trong JavaScript là gì?',
    'SINGLE_CHOICE',
    'EASY',
    '1',
    'number',
    'NaN',
    'undefined',
    'object',
    'A',
    'NaN (Not a Number) là giá trị đại số thuộc kiểu dữ liệu number trong chuẩn ECMAScript.',
    'javascript, types, basics'
  ],
  [
    'JS_CORE_02',
    'Từ khóa nào dùng để khai báo biến có phạm vi khối (block scope) và không thể gán lại giá trị?',
    'SINGLE_CHOICE',
    'EASY',
    '1',
    'var',
    'let',
    'const',
    'static',
    'C',
    'const tạo hằng số có phạm vi khối và không thể gán lại bằng toán tử =.',
    'javascript, es6, variables'
  ],
  [
    'JS_CORE_03',
    'Phương thức nào dưới đây dùng để chuyển đổi đối tượng JavaScript thành chuỗi JSON?',
    'SINGLE_CHOICE',
    'EASY',
    '1',
    'JSON.parse()',
    'JSON.stringify()',
    'JSON.toString()',
    'JSON.objectify()',
    'B',
    'JSON.stringify() tuần tự hóa JavaScript object/array thành chuỗi JSON.',
    'javascript, json'
  ],
  [
    'JS_CORE_04',
    'Phương thức Array nào tạo ra một mảng mới với các phần tử thỏa mãn điều kiện kiểm tra của hàm callback?',
    'SINGLE_CHOICE',
    'MEDIUM',
    '1',
    'map()',
    'filter()',
    'forEach()',
    'reduce()',
    'B',
    'filter() duyệt mảng và trả về mảng mới chỉ chứa các phần tử thỏa mãn predicate.',
    'javascript, array, es6'
  ],
  [
    'JS_CORE_05',
    'Closure trong JavaScript cho phép hàm con truy cập vào phạm vi (scope) nào?',
    'SINGLE_CHOICE',
    'MEDIUM',
    '1',
    'Chỉ các biến cục bộ khai báo bên trong nó',
    'Chỉ các biến toàn cục (global)',
    'Các biến của hàm cha bao bọc nó ngay cả khi hàm cha đã kết thúc thực thi',
    'Không thể truy cập bất kỳ biến nào ngoài tham số của nó',
    'C',
    'Closure là sự kết hợp giữa hàm và môi trường lexical nơi hàm đó được khai báo.',
    'javascript, closure, advanced'
  ],
  [
    'JS_CORE_06',
    'Phương thức Promise.all() sẽ trả về trạng thái rejected khi nào?',
    'SINGLE_CHOICE',
    'MEDIUM',
    '2',
    'Khi tất cả các Promise trong mảng đều bị reject',
    'Khi có ít nhất một Promise trong mảng bị reject',
    'Khi quá thời gian timeout mặc định 5 giây',
    'Promise.all() không bao giờ bị reject',
    'B',
    'Promise.all tuân theo nguyên lý fail-fast, chỉ cần 1 Promise reject là toàn bộ reject ngay.',
    'javascript, async, promise'
  ],
  [
    'JS_CORE_07',
    'Kết quả in ra màn hình của biểu thức: [1, 2, 3] + [4, 5, 6] là gì?',
    'SINGLE_CHOICE',
    'HARD',
    '2',
    '[1, 2, 3, 4, 5, 6]',
    '"1,2,34,5,6"',
    'NaN',
    'TypeError',
    'B',
    'Toán tử + ép kiểu 2 mảng thành chuỗi: "1,2,3" + "4,5,6" = "1,2,34,5,6".',
    'javascript, type-coercion, tricky'
  ],
  [
    'JS_CORE_08',
    'Event Loop xử lý các tác vụ bất đồng bộ theo thứ tự ưu tiên nào?',
    'SINGLE_CHOICE',
    'HARD',
    '2',
    'Call Stack -> MacroTask Queue (setTimeout) -> MicroTask Queue (Promise)',
    'Call Stack -> MicroTask Queue (Promise/process.nextTick) -> MacroTask Queue (setTimeout/I/O)',
    'MacroTask Queue -> MicroTask Queue -> Call Stack',
    'Xử lý ngẫu nhiên theo thời gian đến',
    'B',
    'Sau khi Call Stack rỗng, Event Loop ưu tiên giải phóng toàn bộ hàng đợi MicroTask trước khi lấy 1 tác vụ từ MacroTask.',
    'javascript, event-loop, asynchronous'
  ],
  [
    'JS_CORE_09',
    'Những phương thức nào dưới đây thuộc Array.prototype trong JavaScript làm biến đổi (mutate) mảng gốc? (Chọn tất cả đáp án đúng)',
    'MULTIPLE_CHOICE',
    'HARD',
    '2',
    'push()',
    'splice()',
    'map()',
    'sort()',
    'A, B, D',
    'push(), splice() và sort() trực tiếp biến đổi mảng ban đầu, trong khi map() tạo ra mảng mới mà không làm thay đổi mảng ban đầu.',
    'javascript, array, mutation, es6'
  ]
];

// Data Tab 2: An_Toan_Ve_Sinh_Thuc_Pham
const ATTP_DATA = [
  HEADERS,
  [
    'ATTP_FNB_01',
    'Vùng nhiệt độ nguy hiểm (Danger Zone) vi khuẩn sinh sôi nhanh nhất trong thực phẩm là dải nhiệt nào?',
    'SINGLE_CHOICE',
    'EASY',
    '1',
    'Từ 0°C đến 5°C',
    'Từ 5°C đến 60°C',
    'Từ 70°C đến 100°C',
    'Dưới -18°C',
    'B',
    'Dải 5°C - 60°C là Danger Zone, vi khuẩn có thể nhân đôi số lượng sau mỗi 20 phút.',
    'fnb, hygiene, storage'
  ],
  [
    'ATTP_FNB_02',
    'Thời gian rửa tay đúng chuẩn vệ sinh tối thiểu theo khuyến nghị của Bộ Y Tế là bao lâu?',
    'SINGLE_CHOICE',
    'EASY',
    '1',
    '5 giây',
    '10 giây',
    '30 giây',
    '60 giây',
    'C',
    'Quy trình rửa tay 6 bước cần thực hiện tối thiểu 30 giây với xà phòng và nước sạch.',
    'fnb, personal-hygiene'
  ],
  [
    'ATTP_FNB_03',
    'Nguyên tắc quản lý hàng tồn kho FIFO trong nhà hàng viết tắt của cụm từ nào?',
    'SINGLE_CHOICE',
    'MEDIUM',
    '1',
    'Fast In, Fast Out (Vào nhanh, ra nhanh)',
    'First In, First Out (Nhập trước, xuất trước)',
    'Final In, First Out (Nhập sau, xuất trước)',
    'Fixed In, Free Out (Vào cố định, ra tự do)',
    'B',
    'FIFO (First In, First Out): Nguyên liệu nhập kho trước phải được ưu tiên sơ chế và sử dụng trước.',
    'fnb, warehouse, fifo'
  ],
  [
    'ATTP_FNB_04',
    'Thớt màu vàng trong quy chuẩn bếp nhà hàng chuyên nghiệp thường dùng để cắt thực phẩm nào?',
    'SINGLE_CHOICE',
    'MEDIUM',
    '1',
    'Thịt đỏ sống (bò, heo)',
    'Thịt gia cầm sống (gà, vịt)',
    'Rau củ quả tươi',
    'Hải sản sống',
    'B',
    'Màu vàng: Gia cầm sống; Màu đỏ: Thịt sống; Màu xanh dương: Hải sản sống; Màu xanh lá: Rau củ quả.',
    'fnb, cross-contamination, kitchen'
  ],
  [
    'ATTP_FNB_05',
    'Nhiệt độ tâm (core temperature) tối thiểu khi nấu chín thịt gia cầm để tiêu diệt Salmonella là bao nhiêu?',
    'SINGLE_CHOICE',
    'HARD',
    '2',
    '60°C trong 10 phút',
    '65°C trong 5 phút',
    '74°C (165°F) giữ trong ít nhất 15 giây',
    '100°C liên tục 30 phút',
    'C',
    'Nhiệt độ tâm tối thiểu 74°C (165°F) đảm bảo tiêu diệt vi khuẩn Salmonella trong thịt gà/vịt.',
    'fnb, cooking-safety, microbiology'
  ],
  [
    'ATTP_FNB_06',
    'Những triệu chứng lâm sàng phổ biến nhất khi bị ngộ độc thực phẩm cấp tính là gì? (Chọn tất cả đáp án đúng)',
    'MULTIPLE_CHOICE',
    'MEDIUM',
    '2',
    'Buồn nôn và nôn mửa liên tục',
    'Đau quặn bụng dữ dội và tiêu chảy',
    'Sốt cao, ớn lạnh và mệt mỏi suy nhược',
    'Tăng huyết áp đột ngột không kiểm soát',
    'A, B, C',
    'Ngộ độc thực phẩm cấp gây rối loạn tiêu hóa nghiêm trọng (nôn, tiêu chảy, đau bụng) kèm sốt do phản ứng với độc tố sinh vật; không điển hình gây tăng huyết áp cấp tính.',
    'fnb, attp, poisoning, symptoms'
  ],
  [
    'ATTP_FNB_07',
    'Những thực phẩm nào dưới đây thuộc nhóm thực phẩm có nguy cơ ngộ độc cao cần kiểm soát nhiệt độ nghiêm ngặt (TCS Foods)? (Chọn tất cả đáp án đúng)',
    'MULTIPLE_CHOICE',
    'HARD',
    '2',
    'Sữa tươi thanh trùng và các chế phẩm từ sữa',
    'Thịt gia cầm sống, thịt bò và hải sản tươi',
    'Gạo khô thô chưa nấu và mì ăn liền đóng gói kín',
    'Trứng gà tươi sống và nước sốt làm từ trứng sống',
    'A, B, D',
    'TCS Foods (Time/Temperature Control for Safety) bao gồm sữa, thịt cá tươi sống, trứng sống. Gạo khô bảo quản độ ẩm thấp không nằm trong nhóm TCS.',
    'fnb, tcs-foods, food-safety, storage'
  ]
];

// Data Tab 3: Dich_Vu_Khach_Hang
const SERVICE_DATA = [
  HEADERS,
  [
    'CS_FNB_01',
    'Quy tắc ứng xử khi đón khách bước vào nhà hàng cần thực hiện trong vòng bao nhiêu giây?',
    'SINGLE_CHOICE',
    'EASY',
    '1',
    'Trong vòng 5 giây kèm nụ cười và lời chào thân thiện',
    'Chờ khách ngồi vào bàn rồi mới tiến lại',
    'Trong vòng 60 giây',
    'Khi khách gọi nhân viên mới ra chào',
    'A',
    'Quy tắc 5 giây tạo ấn tượng đầu tiên tích cực và chuyên nghiệp cho thực khách.',
    'service, greeting, standard'
  ],
  [
    'CS_FNB_02',
    'Khi nhận được phản hồi món ăn bị nguội hoặc mặn từ thực khách, bước đầu tiên nhân viên cần làm là gì?',
    'SINGLE_CHOICE',
    'MEDIUM',
    '1',
    'Giải thích công thức nhà hàng từ trước đến nay vẫn nấu như vậy',
    'Chân thành lắng nghe, xin lỗi về trải nghiệm chưa tốt và đề xuất đổi món mới ngay',
    'Bảo khách chờ để hỏi ý kiến bếp trưởng',
    'Yêu cầu khách tiếp tục dùng món',
    'B',
    'Quy tắc xử lý phàn nàn: Lắng nghe không ngắt lời, xin lỗi vì trải nghiệm không vui, đưa ra giải pháp ngay.',
    'service, complaint-handling'
  ],
  [
    'CS_FNB_03',
    'Nguyên tắc phục vụ món ăn và đồ uống theo chuẩn nhà hàng quốc tế là phục vụ từ phía nào của khách?',
    'SINGLE_CHOICE',
    'HARD',
    '2',
    'Món ăn đưa từ bên trái, đồ uống phục vụ từ bên phải',
    'Mọi món đưa từ bên phải khách',
    'Mọi món đưa từ bên trái khách',
    'Đưa phía nào tiện cho nhân viên nhất',
    'A',
    'Chuẩn phục vụ phương Tây: Serve food from the left, serve drinks and clear from the right.',
    'service, fine-dining, etiquette'
  ]
];

async function populate() {
  const token = await getAccessToken();
  console.log('✅ Obtained Google Access Token');

  // 1. Get current spreadsheet metadata
  const metaRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const meta = await metaRes.json();
  const existingSheets = meta.sheets || [];
  console.log(`Current sheets: ${existingSheets.map(s => s.properties.title).join(', ')}`);

  // 2. Prepare batchUpdate requests
  const requests = [];
  const firstSheet = existingSheets[0];
  if (firstSheet && firstSheet.properties.title !== 'JavaScript_Core') {
    requests.push({
      updateSheetProperties: {
        properties: {
          sheetId: firstSheet.properties.sheetId,
          title: 'JavaScript_Core'
        },
        fields: 'title'
      }
    });
  }

  // Check if An_Toan_Ve_Sinh_Thuc_Pham exists
  const hasAttp = existingSheets.some(s => s.properties.title === 'An_Toan_Ve_Sinh_Thuc_Pham');
  if (!hasAttp) {
    requests.push({
      addSheet: {
        properties: { title: 'An_Toan_Ve_Sinh_Thuc_Pham' }
      }
    });
  }

  // Check if Dich_Vu_Khach_Hang exists
  const hasService = existingSheets.some(s => s.properties.title === 'Dich_Vu_Khach_Hang');
  if (!hasService) {
    requests.push({
      addSheet: {
        properties: { title: 'Dich_Vu_Khach_Hang' }
      }
    });
  }

  if (requests.length > 0) {
    console.log(`Executing ${requests.length} structure updates (rename & add sheets)...`);
    const batchRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ requests })
    });
    const batchData = await batchRes.json();
    if (batchData.error) {
      console.error('Batch error:', batchData.error);
    } else {
      console.log('✅ Sheets structure updated successfully!');
    }
  }

  // 3. Write data to each tab
  const tabsData = [
    { range: `'JavaScript_Core'!A1:L${JS_DATA.length}`, values: JS_DATA },
    { range: `'An_Toan_Ve_Sinh_Thuc_Pham'!A1:L${ATTP_DATA.length}`, values: ATTP_DATA },
    { range: `'Dich_Vu_Khach_Hang'!A1:L${SERVICE_DATA.length}`, values: SERVICE_DATA },
  ];

  for (const tab of tabsData) {
    console.log(`Writing data to ${tab.range}...`);
    const putRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(tab.range)}?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ values: tab.values })
      }
    );
    const putData = await putRes.json();
    if (putData.error) {
      console.error(`Error writing ${tab.range}:`, putData.error);
    } else {
      console.log(`✅ ${tab.range} updated: ${putData.updatedRows} rows, ${putData.updatedCells} cells`);
    }
  }

  // 4. Read back sheet IDs (gid) for documentation
  const updatedMetaRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const updatedMeta = await updatedMetaRes.json();
  console.log('\n=========================================');
  console.log('🎉 GOOGLE SPREADSHEET POPULATION COMPLETED!');
  console.log('Spreadsheet URL:', `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`);
  console.log('\nDanh sách các Tab và Link Sync tương ứng:');
  updatedMeta.sheets.forEach((s) => {
    const title = s.properties.title;
    const gid = s.properties.sheetId;
    console.log(`- Tab [${title}]:`);
    console.log(`  Link: https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit#gid=${gid}`);
  });
  console.log('=========================================\n');
}

populate().catch(console.error);
