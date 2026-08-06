import { Code2, Globe, Laptop } from 'lucide-react'
import {
  l11Content,
  l12Content,
  l30Content,
  l31Content,
  l32Content,
  l33Content,
  l34Content,
  l35Content,
  l36Content,
  l37Content,
  l38Content,
  l39Content,
  l40Content,
  l41Content,
} from './lessons'

export interface JSInfoLesson {
  id: string
  title: string
  duration: string
  type: 'video' | 'document' | 'quiz'
  content?: string // HTML or text article for document lessons
  videoUrl?: string
}

export interface JSInfoSection {
  id: string
  number: number
  title: string
  lessons: JSInfoLesson[]
}

export interface JSInfoCourse {
  id: string
  title: string
  subtitle: string
  category: 'Technical' | 'Browser' | 'Advanced'
  instructor: {
    name: string
    title: string
    bio: string
  }
  duration: string
  enrolled: number
  rating: number
  reviews: number
  accentColor: string
  categoryIcon: any
  learningOutcomes: string[]
  requirements: string[]
  targetAudience: string[]
  sections: JSInfoSection[]
}

export const JS_INFO_COURSES: JSInfoCourse[] = [
  {
    id: '1',
    title: 'The JavaScript Language (Part 1)',
    subtitle: 'Học ngôn ngữ JavaScript từ cơ bản đến nâng cao bao gồm lập trình hướng đối tượng (OOP), closures, promises, và async/await.',
    category: 'Technical',
    instructor: {
      name: 'Ilya Kantor (iliakan)',
      title: 'Sáng lập JavaScript.info & Kỹ sư Phần mềm Cựu trào',
      bio: 'Ilya Kantor là tác giả của loạt bài giảng The Modern JavaScript Tutorial (javascript.info), một trong những tài liệu học lập trình JS uy tín nhất thế giới với hàng triệu lượt truy cập mỗi tháng. Ông có hơn 15 năm kinh nghiệm giảng dạy và phát triển các hệ thống web quy mô lớn.'
    },
    duration: '32h 00m',
    enrolled: 15420,
    rating: 4.9,
    reviews: 2450,
    accentColor: 'var(--primary)',
    categoryIcon: Code2,
    learningOutcomes: [
      'Hiểu sâu sắc về cú pháp và các kiểu dữ liệu cốt lõi trong JavaScript',
      'Nắm vững cách hoạt động của Object, Garbage Collection và con trỏ "this"',
      'Làm chủ lập trình hướng đối tượng (OOP) thông qua Prototype và Class',
      'Xử lý bất đồng bộ thành thạo bằng Promise và từ khóa Async/Await',
      'Ứng dụng Scope và Closures để viết code tối ưu, bảo mật',
      'Tạo và sử dụng Generators phục vụ cho lập trình nâng cao'
    ],
    requirements: [
      'Không yêu cầu kiến thức lập trình trước đó — khóa học bắt đầu từ con số 0',
      'Có máy tính kết nối internet và trình duyệt web hiện đại (Chrome, Edge hoặc Firefox)'
    ],
    targetAudience: [
      'Người mới bắt đầu học lập trình muốn chọn JavaScript làm ngôn ngữ đầu tiên',
      'Lập trình viên Frontend/Backend muốn hệ thống hóa kiến thức JS cốt lõi',
      'Sinh viên CNTT muốn nâng cao kỹ năng thực chiến phục vụ cho công việc tương lai'
    ],
    sections: [
      {
        id: 'p1_s1',
        number: 1,
        title: 'An Introduction',
        lessons: [
          {
            id: 'l1',
            title: 'An Introduction to JavaScript',
            duration: '10:00',
            type: 'document',
            content: `
              <h3 class="text-base font-bold mb-2">1. JavaScript là gì?</h3>
              <p class="mb-4">JavaScript ban đầu được tạo ra để "làm cho các trang web trở nên sống động". Các chương trình viết bằng ngôn ngữ này được gọi là <strong>scripts</strong>. Chúng có thể được viết trực tiếp trong mã HTML của trang web và tự động chạy khi trang tải.</p>
              <p class="mb-4">Ngày nay, JavaScript là một ngôn ngữ lập trình đa năng, an toàn và cực kỳ phổ biến. Nó không chỉ chạy trong trình duyệt mà còn chạy được trên server (Node.js) và bất kỳ thiết bị nào có trình thông dịch JavaScript (JavaScript engine).</p>
              
              <h3 class="text-base font-bold mb-2">2. Một "engine" trong trình duyệt hoạt động thế nào?</h3>
              <p class="mb-2">Mỗi trình duyệt có một trình thông dịch riêng (ví dụ: V8 trong Chrome/Opera, SpiderMonkey trong Firefox). Cách thức hoạt động cơ bản bao gồm 3 bước:</p>
              <ul class="list-disc pl-5 mb-4 space-y-1">
                <li>Đọc (parse) mã nguồn script.</li>
                <li>Biên dịch (compile) script sang ngôn ngữ máy.</li>
                <li>Thực thi mã máy một cách nhanh chóng.</li>
              </ul>

              <h3 class="text-base font-bold mb-2">3. Điểm mạnh của JavaScript trên trình duyệt</h3>
              <p class="mb-2">JavaScript trên trình duyệt có thể làm mọi việc liên quan đến thao tác trang web, tương tác với người dùng và server:</p>
              <ul class="list-disc pl-5 mb-4 space-y-1">
                <li>Thêm mã HTML mới, sửa đổi nội dung và kiểu dáng (CSS) hiện tại.</li>
                <li>Phản hồi các hành động của người dùng (click chuột, gõ phím, di chuyển trang).</li>
                <li>Gửi yêu cầu qua mạng (AJAX/Fetch) để tải thêm dữ liệu mà không cần tải lại toàn bộ trang.</li>
                <li>Lưu trữ dữ liệu ở phía client (cookies, localStorage).</li>
              </ul>
            `
          },
          {
            id: 'l2',
            title: 'Manuals and specifications',
            duration: '08:00',
            type: 'document',
            content: `
              <h3 class="text-base font-bold mb-2">Tài liệu và Đặc tả JavaScript</h3>
              <p class="mb-4">Khi học hoặc làm việc với JavaScript, việc biết nơi tra cứu thông tin chính xác và cập nhật là cực kỳ quan trọng.</p>
              
              <h4 class="text-sm font-semibold mb-1">1. Đặc tả ECMA-262 (Specification)</h4>
              <p class="mb-4">Đặc tả ECMAScript là tài liệu chính thức định nghĩa ngôn ngữ JavaScript. Nó chứa các mô tả chi tiết và khắt khe nhất về cách ngôn ngữ hoạt động. Tuy nhiên, tài liệu này hướng tới những người viết trình duyệt nên khá khó đọc đối với lập trình viên thông thường.</p>
              
              <h4 class="text-sm font-semibold mb-1">2. Hướng dẫn MDN (Mozilla Developer Network)</h4>
              <p class="mb-4">MDN Web Docs là cuốn cẩm nang tra cứu tốt nhất cho các lập trình viên hàng ngày. Nó cung cấp các định nghĩa chi tiết, ví dụ trực quan và bảng tra cứu mức độ tương thích của trình duyệt cho các hàm, đối tượng trong JS.</p>
            `
          },
          { id: 'l3', title: 'Code editors', duration: '12:00', type: 'video', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { id: 'l4', title: 'Developer console', duration: '06:00', type: 'video', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
        ]
      },
      {
        id: 'p1_s2',
        number: 2,
        title: 'JavaScript Fundamentals',
        lessons: [
          { id: 'l5', title: 'Hello, world!', duration: '07:30', type: 'document', content: '<p>Bài học Hello World viết code Javascript đầu tiên...</p>' },
          { id: 'l6', title: 'Code structure', duration: '09:00', type: 'document', content: '<p>Tìm hiểu cấu trúc mã nguồn, dấu chấm phẩy và xuống dòng trong JS.</p>' },
          { id: 'l7', title: 'The modern mode, "use strict"', duration: '10:15', type: 'document' },
          { id: 'l8', title: 'Variables', duration: '11:00', type: 'video', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { id: 'l9', title: 'Data types', duration: '14:20', type: 'video', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { id: 'l10', title: 'Interaction: alert, prompt, confirm', duration: '08:50', type: 'video', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
        ]
      },
      {
        id: 'p1_s3',
        number: 3,
        title: 'Objects: the basics',
        lessons: [
          {
            id: 'l11',
            title: 'Objects',
            duration: '15:00',
            type: 'document',
            content: l11Content
          },
          {
            id: 'l12',
            title: 'Object references and copying',
            duration: '12:30',
            type: 'document',
            content: l12Content
          },
          { id: 'l13', title: 'Garbage collection', duration: '10:00', type: 'document', content: '<p>Cách Javascript tự động dọn dẹp bộ nhớ thông qua cơ chế reachability...</p>' },
          { id: 'l14', title: 'Object methods, "this"', duration: '15:10', type: 'video', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { id: 'l15', title: 'Constructor, operator "new"', duration: '13:40', type: 'video', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { id: 'l16', title: 'Optional chaining \'?.\'', duration: '09:15', type: 'document' },
          { id: 'l17', title: 'Symbol type', duration: '11:00', type: 'document' },
          { id: 'l18', title: 'Object to primitive conversion', duration: '14:00', type: 'video', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
        ]
      },
      {
        id: 'p1_s4',
        number: 4,
        title: 'Data types',
        lessons: [
          { id: 'l30', title: 'Methods of primitives', duration: '08:00', type: 'document', content: l30Content },
          { id: 'l31', title: 'Numbers', duration: '12:00', type: 'document', content: l31Content },
          { id: 'l32', title: 'Strings', duration: '10:00', type: 'document', content: l32Content },
          { id: 'l33', title: 'Arrays', duration: '12:00', type: 'document', content: l33Content },
          { id: 'l34', title: 'Array methods', duration: '15:00', type: 'document', content: l34Content },
          { id: 'l35', title: 'Iterables', duration: '10:00', type: 'document', content: l35Content },
          { id: 'l36', title: 'Map and Set', duration: '12:00', type: 'document', content: l36Content },
          { id: 'l37', title: 'WeakMap and WeakSet', duration: '09:00', type: 'document', content: l37Content },
          { id: 'l38', title: 'Object.keys, values, entries', duration: '08:00', type: 'document', content: l38Content },
          { id: 'l39', title: 'Destructuring assignment', duration: '11:00', type: 'document', content: l39Content },
          { id: 'l40', title: 'Date and time', duration: '10:00', type: 'document', content: l40Content },
          { id: 'l41', title: 'JSON methods, toJSON', duration: '09:00', type: 'document', content: l41Content }
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'Browser: Document, Events, Interfaces (Part 2)',
    subtitle: 'Học cách quản lý trang trình duyệt: thêm sửa xóa phần tử HTML, thao tác kích thước/vị trí, tương tác với người dùng và xây dựng giao diện động.',
    category: 'Browser',
    instructor: {
      name: 'Ilya Kantor (iliakan)',
      title: 'Sáng lập JavaScript.info & Kỹ sư Phần mềm Cựu trào',
      bio: 'Ilya Kantor là tác giả của loạt bài giảng The Modern JavaScript Tutorial (javascript.info), một trong những tài liệu học lập trình JS uy tín nhất thế giới với hàng triệu lượt truy cập mỗi tháng. Ông có hơn 15 năm kinh nghiệm giảng dạy và phát triển các hệ thống web quy mô lớn.'
    },
    duration: '18h 30m',
    enrolled: 9850,
    rating: 4.8,
    reviews: 1890,
    accentColor: 'var(--primary)',
    categoryIcon: Globe,
    learningOutcomes: [
      'Hiểu rõ cấu trúc cây DOM và cách duyệt các nút trong tài liệu',
      'Thao tác thay đổi thuộc tính, class và nội dung phần tử HTML bằng JS',
      'Làm chủ hệ thống Sự kiện (Events) của trình duyệt: click, submit, hover...',
      'Hiểu sâu cơ chế Bubbling (Lan truyền) và Capturing của sự kiện',
      'Áp dụng mẫu thiết kế Event Delegation để viết code tối ưu hiệu năng',
      'Thao tác tọa độ và xử lý kéo thả (Drag and Drop) mượt mà'
    ],
    requirements: [
      'Đã hoàn thành hoặc có kiến thức tương đương khóa học Part 1 (JavaScript Core)',
      'Hiểu biết cơ bản về HTML và CSS'
    ],
    targetAudience: [
      'Lập trình viên muốn xây dựng các hiệu ứng giao diện tương tác thuần túy không phụ thuộc framework',
      'Frontend Developer muốn làm chủ API Web Browser cốt lõi'
    ],
    sections: [
      {
        id: 'p2_s1',
        number: 1,
        title: 'Document',
        lessons: [
          { id: 'l19', title: 'Browser environment, specs', duration: '11:00', type: 'document', content: '<p>Tổng quan về môi trường trình duyệt: window, DOM, BOM...</p>' },
          { id: 'l20', title: 'DOM tree', duration: '13:00', type: 'document', content: '<p>Cấu trúc cây DOM và cách biểu diễn các thẻ HTML thành đối tượng JS.</p>' },
          { id: 'l21', title: 'Walking the DOM', duration: '10:45', type: 'video', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { id: 'l22', title: 'Searching: getElement*, querySelector*', duration: '15:20', type: 'video', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
        ]
      },
      {
        id: 'p2_s2',
        number: 2,
        title: 'Introduction to Events',
        lessons: [
          { id: 'l23', title: 'Introduction to browser events', duration: '12:00', type: 'document' },
          { id: 'l24', title: 'Bubbling and capturing', duration: '14:30', type: 'video', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { id: 'l25', title: 'Event delegation', duration: '16:00', type: 'video', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
        ]
      }
    ]
  },
  {
    id: '3',
    title: 'Additional Articles (Part 3)',
    subtitle: 'Tuyển tập các chủ đề nâng cao và bổ trợ, giúp bạn trở thành chuyên gia làm việc với dữ liệu nhị phân, mạng kết nối, lưu trữ cục bộ và biểu thức chính quy (Regex).',
    category: 'Advanced',
    instructor: {
      name: 'Ilya Kantor (iliakan)',
      title: 'Sáng lập JavaScript.info & Kỹ sư Phần mềm Cựu trào',
      bio: 'Ilya Kantor là tác giả của loạt bài giảng The Modern JavaScript Tutorial (javascript.info), một trong những tài liệu học lập trình JS uy tín nhất thế giới với hàng triệu lượt truy cập mỗi tháng. Ông có hơn 15 năm kinh nghiệm giảng dạy và phát triển các hệ thống web quy mô lớn.'
    },
    duration: '15h 15m',
    enrolled: 5400,
    rating: 4.7,
    reviews: 980,
    accentColor: 'var(--primary)',
    categoryIcon: Laptop,
    learningOutcomes: [
      'Giao tiếp liên cửa sổ (Cross-window communication) và chống tấn công Clickjacking',
      'Xử lý dữ liệu nhị phân chuyên sâu với ArrayBuffer và Blob',
      'Thực hiện các kết nối mạng phức tạp qua API Fetch, WebSocket và SSE',
      'Sử dụng các cơ chế lưu trữ cục bộ tiên tiến (IndexedDB)',
      'Làm chủ biểu thức chính quy (Regular Expressions/Regex) từ căn bản đến nâng cao'
    ],
    requirements: [
      'Nắm chắc kiến thức về JavaScript Core (Part 1) và Browser API (Part 2)'
    ],
    targetAudience: [
      'Lập trình viên giàu kinh nghiệm muốn đi sâu vào các khía cạnh kỹ thuật phức tạp của trình duyệt và truyền tải dữ liệu'
    ],
    sections: [
      {
        id: 'p3_s1',
        number: 1,
        title: 'Frames and windows',
        lessons: [
          { id: 'l26', title: 'Popups and window methods', duration: '10:00', type: 'document' },
          { id: 'l27', title: 'Cross-window communication', duration: '13:00', type: 'video', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
        ]
      },
      {
        id: 'p3_s2',
        number: 2,
        title: 'Network requests',
        lessons: [
          { id: 'l28', title: 'Fetch', duration: '15:00', type: 'document', content: '<p>Học cách sử dụng hàm fetch để gửi yêu cầu mạng HTTP trong JS hiện đại.</p>' },
          { id: 'l29', title: 'FormData', duration: '12:00', type: 'video', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
        ]
      }
    ]
  }
]

export function getCourseAndLessonByLessonId(lessonId: string) {
  for (const course of JS_INFO_COURSES) {
    for (const section of course.sections) {
      const lesson = section.lessons.find((l) => l.id === lessonId)
      if (lesson) {
        return { course, section, lesson }
      }
    }
  }
  return null
}