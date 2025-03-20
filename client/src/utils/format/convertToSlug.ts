export function convertToSlug(text: string): string {
   // Loại bỏ các từ "Thành phố", "Tỉnh", "Quận" mà không dùng từ giới hạn
   text = text.replace(/(Thành phố|Tỉnh|Quận)/gi, '').trim();

   // Chuyển đổi chuỗi thành chữ thường
   text = text.toLowerCase();

   // Loại bỏ dấu tiếng Việt
   text = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

   // Thay thế khoảng trắng và các ký tự không phải là chữ cái, số bằng dấu "-"
   text = text.replace(/[^a-z0-9]+/g, '-');

   // Loại bỏ dấu "-" ở đầu và cuối nếu có
   text = text.replace(/^-+|-+$/g, '');

   return text;
}
