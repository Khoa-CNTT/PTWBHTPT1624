export function roundNumber(num:number) {
    if (num > Math.floor(num) && num <= Math.floor(num) + 0.5) {
      return Math.floor(num) + 0.5;
    } else {
      return Math.ceil(num);
    }
  } 
  