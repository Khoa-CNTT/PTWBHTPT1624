export const convertVietnamese = (value:any) => {
  return value
    ?.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    ?.replaceAll(" ", "-");
};

export const convertDecimal = (percent:any, name:string) => {
  const maxNumber = name === "price" ? 15 : 90;
  const result =
    (((percent * maxNumber) / 100) * 10 -
      ((((percent * maxNumber) / 100) * 10) % 5)) /
    10;
  return name === "price" ? result : Math.ceil((percent * maxNumber) / 100);
};

export const splitStringToNumber = (string:string) => {
  return string?.match(/\d+/g)?.filter((e) => Number(e));
};

export const getNumberPrice = (min:any, max:any) => {
  if (min || max) {
    let min1 = min < max ? min : max;
    let max1 = min > max ? min : max;
    if (min1 === 15) {
      max1 = 9999;
    } else {
      min1 = 0;
    }
    return [min1, max1];
  }
};

export const getNumberArea = (min:any, max:any) => {
  if (min || max) {
    let min1 = min < max ? min : max;
    let max1 = min > max ? min : max;
    if (min1 === 90) {
      max1 = 9999;
    } else {
      min1 = 0;
    }
    return [min1, max1];
  }
};
