export const l12Content = `
<div class="space-y-4">
  <p>Một trong những điểm khác biệt cơ bản giữa Object và các kiểu dữ liệu nguyên bản là <strong>Object được lưu trữ và sao chép theo "tham chiếu" (reference)</strong>, trong khi dữ liệu nguyên bản sao chép theo "giá trị" (value).</p>
  
  <h4 class="text-sm font-bold mt-4">1. Bản chất của Tham chiếu</h4>
  <p>Hãy tưởng tượng biến không phải là chiếc hộp chứa đối tượng, mà chỉ là một chiếc chìa khóa chứa địa chỉ vùng nhớ của đối tượng đó. Khi sao chép một biến đối tượng, chúng ta chỉ sao chép chiếc chìa khóa, chứ không nhân bản đối tượng gốc.</p>
  
  <pre><code>let user = { name: "John" };
let admin = user; // Sao chép tham chiếu

admin.name = "Pete"; // Thay đổi thuộc tính qua biến admin

console.log(user.name); // "Pete" - Đối tượng gốc đã bị thay đổi!</code></pre>

  <h4 class="text-sm font-bold mt-4">2. So sánh đối tượng</h4>
  <p>Hai đối tượng chỉ bằng nhau khi và chỉ khi chúng trỏ cùng vào một đối tượng thực tế (cùng chung tham chiếu):</p>
  <pre><code>let a = {};
let b = a; // gán chung tham chiếu
console.log( a == b ); // true

let x = {};
let y = {}; // hai đối tượng rỗng độc lập
console.log( x == y ); // false (vì tham chiếu khác nhau)</code></pre>
</div>
`;
