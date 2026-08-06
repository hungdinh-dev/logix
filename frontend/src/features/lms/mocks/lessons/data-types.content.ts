export const l30Content = `
<div class="space-y-4">
  <p>Trong JavaScript, các kiểu dữ liệu nguyên bản (primitive) như string, number, boolean,... không phải là đối tượng. Tuy nhiên, chúng ta vẫn có thể gọi các phương thức trên chúng như thể chúng là đối tượng.</p>
  <p>Khi ta truy cập một thuộc tính hoặc phương thức của một kiểu nguyên bản, JavaScript sẽ tạo ra một đối tượng bao bọc (object wrapper) đặc biệt, trả về giá trị hoặc chạy phương thức, và sau đó hủy đối tượng đó đi lập tức.</p>
  
  <h4 class="text-sm font-bold mt-4">Ví dụ gọi phương thức trên String và Number:</h4>
  <pre><code>let str = "hello";
console.log(str.toUpperCase()); // HELLO

let num = 1.23456;
console.log(num.toFixed(2)); // 1.23
</code></pre>
</div>
`;

export const l31Content = `
<div class="space-y-4">
  <p>Trong JavaScript hiện đại, tất cả các số đều được lưu dưới dạng định dạng 64-bit IEEE-754 (số thực dấu phẩy động).</p>
  
  <h4 class="text-sm font-bold mt-4">1. Các cách viết số lớn và hệ cơ số</h4>
  <p>Ta có thể sử dụng ký tự <code>e</code> để đại diện cho số mũ (nhân với 10 lũy thừa n), hoặc chuyển đổi hệ cơ số bằng <code>toString(base)</code>:</p>
  <pre><code>let billion = 1e9; // 1 tỷ
console.log(billion); // 1000000000

let num = 255;
console.log(num.toString(16)); // ff (hệ lục phân)
console.log(num.toString(2));  // 11111111 (hệ nhị phân)
</code></pre>

  <h4 class="text-sm font-bold mt-4">2. Làm tròn số (Rounding)</h4>
  <p>Có 4 phương thức làm tròn cơ bản trong đối tượng <code>Math</code>:</p>
  <ul class="list-disc pl-5 space-y-1">
    <li><code>Math.floor</code>: Làm tròn xuống.</li>
    <li><code>Math.ceil</code>: Làm tròn lên.</li>
    <li><code>Math.round</code>: Làm tròn đến số nguyên gần nhất.</li>
    <li><code>Math.trunc</code>: Lấy phần nguyên (cắt bỏ phần thập phân).</li>
  </ul>
  <pre><code>console.log(Math.floor(3.6)); // 3
console.log(Math.ceil(3.1));  // 4
console.log(Math.round(3.5)); // 4
console.log(Math.trunc(3.9)); // 3
</code></pre>

  <h4 class="text-sm font-bold mt-4">3. NaN và Infinity</h4>
  <p><code>NaN</code> đại diện cho một lỗi tính toán toán học. Nó có đặc điểm là không bằng bất kỳ thứ gì, kể cả chính nó. Ta phải dùng hàm <code>isNaN()</code> để kiểm tra:</p>
  <pre><code>console.log( 0 / 0 ); // NaN
console.log( isNaN(NaN) ); // true
console.log( NaN === NaN ); // false
</code></pre>
</div>
`;

export const l32Content = `
<div class="space-y-4">
  <p>Chuỗi ký tự trong JavaScript được biểu diễn bằng cặp nháy đơn, nháy kép hoặc nháy ngược (backticks).</p>
  
  <h4 class="text-sm font-bold mt-4">1. Nháy ngược (Backticks) và Template Literals</h4>
  <p>Nháy ngược cho phép chèn biến hoặc biểu thức và cho phép viết chuỗi trên nhiều dòng một cách tự nhiên:</p>
  <pre><code>let name = "John";
console.log(\`Hello \${name}!\`); // Hello John!

let multiline = \`Khách mời:
* Nguyễn Văn A
* Trần Thị B\`;
console.log(multiline);
</code></pre>

  <h4 class="text-sm font-bold mt-4">2. Các thao tác chuỗi cơ bản</h4>
  <pre><code>let str = "Widget with id";

// Lấy độ dài chuỗi:
console.log(str.length); // 14

// Tìm kiếm vị trí:
console.log(str.indexOf("id")); // 12

// Cắt chuỗi:
console.log(str.slice(0, 6)); // Widget
</code></pre>
</div>
`;

export const l33Content = `
<div class="space-y-4">
  <p>Mảng (Array) là một kiểu cấu trúc dữ liệu đặc biệt dùng để lưu trữ danh sách các phần tử có thứ tự sắp xếp.</p>
  
  <h4 class="text-sm font-bold mt-4">1. Thao tác ở cuối mảng: push và pop</h4>
  <p>Các phương thức này chạy rất nhanh vì không cần dịch chuyển chỉ số của các phần tử khác:</p>
  <pre><code>let fruits = ["Apple", "Orange"];

fruits.push("Plum"); // Thêm vào cuối mảng
console.log(fruits); // ["Apple", "Orange", "Plum"]

let last = fruits.pop(); // Lấy ra phần tử cuối
console.log(last); // "Plum"
console.log(fruits); // ["Apple", "Orange"]
</code></pre>

  <h4 class="text-sm font-bold mt-4">2. Thao tác ở đầu mảng: shift và unshift</h4>
  <pre><code>let fruits = ["Apple", "Orange"];

fruits.unshift("Plum"); // Thêm vào đầu mảng
console.log(fruits); // ["Plum", "Apple", "Orange"]

let first = fruits.shift(); // Lấy ra phần tử đầu
console.log(first); // "Plum"
console.log(fruits); // ["Apple", "Orange"]
</code></pre>
</div>
`;

export const l34Content = `
<div class="space-y-4">
  <p>Mảng trong JavaScript cung cấp rất nhiều phương thức mạnh mẽ phục vụ cho duyệt, lọc và biến đổi dữ liệu.</p>
  
  <h4 class="text-sm font-bold mt-4">1. splice (Thêm, xóa, thay thế phần tử ở vị trí bất kỳ)</h4>
  <pre><code>let arr = ["I", "study", "JavaScript", "right", "now"];

// Xóa 3 phần tử bắt đầu từ chỉ số 1
arr.splice(1, 3);
console.log(arr); // ["I", "now"]
</code></pre>

  <h4 class="text-sm font-bold mt-4">2. Duyệt mảng: forEach</h4>
  <pre><code>let arr = ["Bilbo", "Gandalf", "Nazgul"];
arr.forEach((item, index) => {
  console.log(\`Phần tử \${item} ở vị trí \${index}\`);
});
</code></pre>

  <h4 class="text-sm font-bold mt-4">3. Biến đổi mảng: map</h4>
  <pre><code>let users = ["John", "Pete", "Mary"];
let lengths = users.map(name => name.length);
console.log(lengths); // [4, 4, 4]
</code></pre>
</div>
`;

export const l35Content = `
<div class="space-y-4">
  <p>Đối tượng iterable là các đối tượng có thể sử dụng được trong vòng lặp <code>for..of</code> (ví dụ: Array, String).</p>
  <p>Ta có thể tùy biến biến một đối tượng bình thường thành iterable bằng cách triển khai phương thức <code>Symbol.iterator</code>.</p>
  
  <h4 class="text-sm font-bold mt-4">Ví dụ định nghĩa Iterator cho Object:</h4>
  <pre><code>let range = {
  from: 1,
  to: 5,
  [Symbol.iterator]() {
    return {
      current: this.from,
      last: this.to,
      next() {
        if (this.current <= this.last) {
          return { done: false, value: this.current++ };
        } else {
          return { done: true };
        }
      }
    };
  }
};

for (let num of range) {
  console.log(num); // In từ 1 đến 5
}
</code></pre>
</div>
`;

export const l36Content = `
<div class="space-y-4">
  <p>Map là tập hợp các phần tử dạng khóa-giá trị (giống Object), nhưng điểm khác biệt lớn nhất là Map cho phép khóa có <strong>bất kỳ kiểu dữ liệu nào</strong> (kể cả Object, Boolean,...).</p>
  
  <h4 class="text-sm font-bold mt-4">1. Các phương thức của Map</h4>
  <pre><code>let map = new Map();

map.set("1", "str1");   // Khóa dạng chuỗi
map.set(1, "num1");     // Khóa dạng số
map.set(true, "bool1"); // Khóa dạng boolean

console.log(map.get(1));    // "num1"
console.log(map.get("1"));  // "str1"
console.log(map.size);      // 3
</code></pre>

  <h4 class="text-sm font-bold mt-4">2. Dùng Object làm Khóa của Map</h4>
  <pre><code>let john = { name: "John" };
let visitsCountMap = new Map();

visitsCountMap.set(john, 123);
console.log(visitsCountMap.get(john)); // 123
</code></pre>

  <h4 class="text-sm font-bold mt-4">3. Set (Tập hợp các phần tử duy nhất)</h4>
  <p>Set là một tập hợp các giá trị không có khóa, trong đó mỗi giá trị chỉ có thể xuất hiện <strong>duy nhất một lần</strong>.</p>
  <pre><code>let set = new Set();

let john = { name: "John" };
let pete = { name: "Pete" };

set.add(john);
set.add(pete);
set.add(john); // thêm lại john

console.log(set.size); // 2 (chỉ lưu 1 john duy nhất)
</code></pre>

- Đã biết Objects sử dụng để lưu trữ tập hợp các keys



- Array dùng để lưu trữ tập hợp có sắp xếp



Nhưng nó chưa đủ -> Nên Map và Set ra đời



Map

Map là tập hợp của các dữ liệu items có chứa key, như là Object. Như dự khác biệt lớn nhất là Map cho phép key ở bất kỳ kiểu dữ liệu nào

Methods và properties là 

new Map() - tạo một map

map.set(key, value) - lưu trữ value bằng key

map.get(key) - trả về value qua tên key input, undefined nếu key không tồn tại trên map

map.has(key) - returns true nếu key tồn tại, còn lại thì false

map.delete(key) - Xóa item bằng key (xóa cả value và key)

map.clear() - xóa tất cả mọi thứ trong map

map.size - size hiện tại của map

let map = new Map();

map.set('1', 'str1');   // a string key
map.set(1, 'num1');     // a numeric key
map.set(true, 'bool1'); // a boolean key

// remember the regular Object? it would convert keys to string
// Map keeps the type, so these two are different:
alert( map.get(1)   ); // 'num1'
alert( map.get('1') ); // 'str1'

alert( map.size ); // 3

Kết quả cho thấy, không như object, key sẽ không tự động bị convert sang strings. Có thể dùng bất kì kiểu dữ liệu nào



Lưu ý: 

map[key] không phải cách để xài map. 

Mặc dù map[key] sẽ hoạt động nhưng kết quả sẽ không như mong đợi, viết như vậy sẽ đưa map thành object, thì nó sẽ quay ngược vấn đề ban đầu là object sẽ chỉ giới hạn bởi một số key nhất đinh

-> Map hãy dùng với set, get, ...



Map có thể dùng object như 1 key

let john = { name: "John" };

// for every user, let's store their visits count
let visitsCountMap = new Map();

// john is the key for the map
visitsCountMap.set(john, 123);

alert( visitsCountMap.get(john) ); // 123

Object không thể dùng là key của Object, nhưng map có thể dùng object làm key của map



Thử lấy Object làm key????

let john = { name: "John" };
let ben = { name: "Ben" };

let visitsCountObj = {}; // try to use an object

visitsCountObj[ben] = 234; // try to use ben object as the key
visitsCountObj[john] = 123; // try to use john object as the key, ben object will get replaced

// That's what got written!
alert( visitsCountObj["[object Object]"] ); // 123

Kết quả: Mỗi key được truyền vào trong object sẽ được convert thành string dưới dạng [object Object], đó là lý do alert được vì truyền string dưới dạng trên đồng thời in 123, vì ben đã bị join ghi đè với cùng tên [object Object]





Vậy Map so sánh keys thế nào

SameValueZero - giống như so sánh sâu ===, điều khác biệt là NaN được coi là bằng với NaN, và có thể được dùng làm key

-> Method thuộc JS Engine không thể thay đổi





Ta được phép lồng map.set

map.set('1', 'str1')
  .set(1, 'num1')
  .set(true, 'bool1');



<h2>Interaction over Map</h2>



</div>
`;

export const l37Content = `
<div class="space-y-4">
  <p>WeakMap và WeakSet là phiên bản đặc biệt của Map và Set, giúp ngăn ngừa rò rỉ bộ nhớ (memory leaks).</p>
  <p>Điểm khác biệt chính:</p>
  <ul class="list-disc pl-5 space-y-1">
    <li>Khóa của WeakMap bắt buộc phải là <strong>đối tượng (Object)</strong>, không được dùng kiểu nguyên bản.</li>
    <li>Nếu đối tượng làm khóa bị hủy tham chiếu bên ngoài, nó sẽ tự động bị dọn dẹp khỏi WeakMap bởi Garbage Collector.</li>
  </ul>
  
  <h4 class="text-sm font-bold mt-4">Ví dụ WeakMap hoạt động:</h4>
  <pre><code>let john = { name: "John" };
let weakMap = new WeakMap();
weakMap.set(john, "dữ liệu bí mật");

console.log(weakMap.get(john)); // "dữ liệu bí mật"

john = null; // Đối tượng john được giải phóng khỏi bộ nhớ, dữ liệu trong weakMap cũng tự động bị hủy theo!
</code></pre>
</div>
`;

export const l38Content = `
<div class="space-y-4">
  <p>Đối với các đối tượng thông thường, JavaScript cung cấp các phương thức tĩnh hữu ích để trích xuất danh sách khóa, giá trị hoặc cặp khóa-giá trị dưới dạng mảng thực tế.</p>
  
  <h4 class="text-sm font-bold mt-4">Ví dụ Object.keys, values, entries:</h4>
  <pre><code>let user = {
  name: "John",
  age: 30
};

// Object.keys(user) = ["name", "age"]
console.log(Object.keys(user)); 

// Object.values(user) = ["John", 30]
console.log(Object.values(user)); 

// Object.entries(user) = [ ["name", "John"], ["age", 30] ]
console.log(Object.entries(user)); 
</code></pre>
</div>
`;

export const l39Content = `
<div class="space-y-4">
  <p>Cú pháp Destructuring cho phép chúng ta giải nén (unpack) mảng hoặc đối tượng thành các biến riêng biệt một cách cực kỳ ngắn gọn.</p>
  
  <h4 class="text-sm font-bold mt-4">1. Destructuring Array (Mảng)</h4>
  <pre><code>let arr = ["John", "Smith"];

// firstName gán cho arr[0], surname gán cho arr[1]
let [firstName, surname] = arr;

console.log(firstName); // John
console.log(surname);   // Smith
</code></pre>

  <h4 class="text-sm font-bold mt-4">2. Destructuring Object (Đối tượng)</h4>
  <pre><code>let options = {
  title: "Menu",
  width: 100,
  height: 200
};

// Khai báo biến khớp với tên thuộc tính của đối tượng
let { title, width, height } = options;

console.log(title);  // "Menu"
console.log(width);  // 100
</code></pre>
</div>
`;

export const l40Content = `
<div class="space-y-4">
  <p>Đối tượng Date dùng để lưu trữ ngày giờ và cung cấp các phương thức quản lý thời gian.</p>
  
  <h4 class="text-sm font-bold mt-4">Ví dụ khởi tạo và lấy thông tin thời gian:</h4>
  <pre><code>// Khởi tạo thời điểm hiện tại:
let now = new Date();
console.log("Hôm nay là ngày:", now.getDate());

// Khởi tạo một ngày cụ thể (Năm, Tháng (0-11), Ngày):
let Jan1_2011 = new Date(2011, 0, 1);
console.log("Năm khởi tạo:", Jan1_2011.getFullYear());

// Lấy dấu thời gian Miliseconds (Timestamp):
console.log("Timestamp hiện tại:", now.getTime());
</code></pre>
</div>
`;

export const l41Content = `
<div class="space-y-4">
  <p>JSON (JavaScript Object Notation) là định dạng trao đổi dữ liệu tiêu chuẩn. JavaScript cung cấp các phương thức chuyển đổi đối tượng qua lại với chuỗi JSON.</p>
  
  <h4 class="text-sm font-bold mt-4">1. JSON.stringify và JSON.parse</h4>
  <pre><code>let user = {
  name: "John",
  age: 30,
  skills: ["html", "css", "js"]
};

// Chuyển đổi đối tượng sang chuỗi JSON:
let jsonString = JSON.stringify(user);
console.log(jsonString); 

// Chuyển đổi ngược lại chuỗi JSON thành đối tượng:
let parsedUser = JSON.parse(jsonString);
console.log(parsedUser.name); // John
</code></pre>
</div>
`;
