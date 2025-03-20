export const   formatNumber= (number:any)=> {
    if (number >= 1000000) {
      // Chia cho 1 triệu, làm tròn đến 1 chữ số sau dấu phẩy
      return (number / 1000000).toFixed(1).replace(/\.0$/, '') + ' triệu';
    } else if (number >= 1000) {
      // Chia cho 1 nghìn, làm tròn đến 1 chữ số sau dấu phẩy
      return (number / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    } else {
      // Trả về số nguyên nếu nhỏ hơn 1000
      return number ;
    }
  }
  
 