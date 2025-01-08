export function validateNumber(n: string) {
  return !isNaN(Number(n));
}

export function validatePositiveNumber(n: string) {
  const hasHyphen = /-/.test(n);
  return !hasHyphen && validateNumber(n) && Number(n) >= 0;
}
