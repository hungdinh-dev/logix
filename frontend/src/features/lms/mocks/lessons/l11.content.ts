export const l11Content = `
<div class="space-y-4">
  <p>Như chúng ta đã biết ở chương "Kiểu dữ liệu", có 8 kiểu dữ liệu trong JavaScript. Trong đó, 7 kiểu được gọi là <strong>"nguyên bản" (primitive)</strong> vì giá trị của chúng chỉ chứa một thứ duy nhất (chẳng hạn như một chuỗi chữ hoặc một con số).</p>
  <p>Ngược lại, <strong>Object (đối tượng)</strong> được sử dụng để lưu trữ các bộ sưu tập khóa-giá trị (keyed collections) của nhiều dữ liệu và các thực thể phức tạp hơn. Trong JavaScript, đối tượng len lỏi vào hầu như mọi khía cạnh của ngôn ngữ. Vì vậy, chúng ta phải hiểu rõ chúng trước khi đi sâu vào bất cứ nơi nào khác.</p>
  
  <p class="font-medium text-xs mb-2">Ví dụ cú pháp khởi tạo đối tượng rỗng:</p>
  <pre><code>let user = new Object(); // Cú pháp Object Constructor
let user2 = {};            // Cú pháp Object Literal (phổ biến hơn)</code></pre>

  <h4 class="text-sm font-bold mt-4">1. Thuộc tính (Properties)</h4>
  <p>Chúng ta có thể lập tức đưa các thuộc tính vào bên trong cặp ngoặc nhọn dạng <code>key: value</code>, ngăn cách nhau bởi dấu phẩy:</p>
  <pre><code>let user = {
  name: "John",  // thuộc tính "name" lưu giá trị chuỗi "John"
  age: 30        // thuộc tính "age" lưu giá trị số 30
};</code></pre>

  <h4 class="text-sm font-bold mt-4">2. Truy cập thuộc tính bằng dấu chấm (Dot Notation)</h4>
  <p>Để lấy dữ liệu ra hoặc thêm thuộc tính mới, ta dùng dấu chấm:</p>
  <pre><code>let user = {
  name: "John",
  age: 30
};

// Lấy giá trị:
console.log(user.name); // John
console.log(user.age);  // 30

// Thêm thuộc tính mới:
user.isAdmin = true;
console.log(user.isAdmin); // true

// Xóa thuộc tính bằng từ khóa delete:
delete user.age;
console.log(user.age); // undefined</code></pre>

  <h4 class="text-sm font-bold mt-4">3. Ngoặc vuông (Square brackets) dùng cho thuộc tính nhiều từ</h4>
  <p>Đối với các khóa có chứa khoảng trắng, truy cập bằng dấu chấm sẽ báo lỗi cú pháp. Ta phải dùng ngoặc vuông:</p>
  <pre><code>let user = {};

// Gán giá trị:
user["likes birds"] = true;

// Đọc giá trị:
alert(user["likes birds"]); // true

// Xóa giá trị:
delete user["likes birds"];</code></pre>
</div>
`;
