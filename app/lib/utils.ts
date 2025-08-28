export const formatNumberWithCommas = (num: number | string): string => {
  const number = Number(num);
  if (isNaN(number)) return '';
  return number.toLocaleString('en-US');
};
