const shortid = require('shortid');
const crypto = require('crypto');

// shortid đã được thiết kế để giảm thiểu va chạm (collision)
// và tạo ra các ID ngắn, thân thiện với URL.
function generateUniqueId() {
  // Có thể tùy chỉnh ký tự nếu muốn: shortid.characters('...');
  return shortid.generate();
}

// module.exports = generateUniqueId;

// // --- Phiên bản cũ (giữ lại để tham khảo) ---
// function makeID(length) {
//     let result = '';
//     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     const charactersLength = characters.length;
//     let counter = 0;
//     while (counter < length) {
//         result += characters.charAt(Math.floor(Math.random() * charactersLength));
//         counter += 1;
//     }
//     return result;
// }
// module.exports = () => makeID(7); // Tạo ID dài hơn (ví dụ 7 ký tự) để giảm va chạm

function makeSecureID(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let result = '';

  for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(0, charactersLength);
      result += characters.charAt(randomIndex);
  }

  return result;
}

module.exports = () => makeSecureID(7); // Tạo ID dài hơn (ví dụ 7 ký tự) để giảm va chạm