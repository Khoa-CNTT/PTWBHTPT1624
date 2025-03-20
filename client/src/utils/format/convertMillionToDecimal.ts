export function convertMillionToDecimal(num: number) {
  const result = (num / 1000000).toFixed(1);
  return parseFloat(result) % 1 === 0 ? parseInt(result) : parseFloat(result);
}
