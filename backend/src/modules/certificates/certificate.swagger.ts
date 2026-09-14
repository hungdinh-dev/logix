export const certificateSwagger = {
  tags: [{ name: 'Certificates', description: 'Quản lý Chứng chỉ Đào tạo & Tuân thủ ATTP' }],
  paths: {
    '/api/certificates/stats': {
      get: {
        tags: ['Certificates'],
        summary: 'Thống kê KPI chứng chỉ (Tổng, Còn hạn, Sắp hết hạn, Đã thu hồi)',
        responses: { 200: { description: 'Thống kê thành công' } },
      },
    },
    '/api/certificates': {
      get: {
        tags: ['Certificates'],
        summary: 'Lấy danh sách chứng chỉ đã cấp (kèm phân trang, lọc)',
        responses: { 200: { description: 'Danh sách chứng chỉ' } },
      },
    },
    '/api/certificates/issue': {
      post: {
        tags: ['Certificates'],
        summary: 'Cấp chứng chỉ đào tạo cho học viên',
        responses: { 201: { description: 'Cấp chứng chỉ thành công' } },
      },
    },
    '/api/certificates/{id}/revoke': {
      patch: {
        tags: ['Certificates'],
        summary: 'Thu hồi chứng chỉ',
        responses: { 200: { description: 'Thu hồi thành công' } },
      },
    },
    '/api/certificates/{id}/renew': {
      patch: {
        tags: ['Certificates'],
        summary: 'Gia hạn chứng chỉ',
        responses: { 200: { description: 'Gia hạn thành công' } },
      },
    },
    '/api/certificates/templates': {
      get: {
        tags: ['Certificates'],
        summary: 'Lấy danh sách mẫu phôi chứng chỉ',
        responses: { 200: { description: 'Danh sách mẫu phôi' } },
      },
      post: {
        tags: ['Certificates'],
        summary: 'Tạo mới mẫu phôi chứng chỉ',
        responses: { 201: { description: 'Tạo mẫu phôi thành công' } },
      },
    },
    '/api/certificates/verify/{code}': {
      get: {
        tags: ['Certificates'],
        summary: 'Tra cứu & xác thực chứng chỉ công khai qua mã QR',
        responses: { 200: { description: 'Thông tin xác thực' } },
      },
    },
  },
}
