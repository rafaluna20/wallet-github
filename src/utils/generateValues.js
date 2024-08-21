export const generateAcountNumber = value => {
  const serial = Math.trunc(value / 1000000) + 1;
  const subserial = Math.trunc(value % 53);
  const zero = "0".repeat(7 - `${serial}${subserial}`.length);
  return `${serial}${subserial}${zero}${value}`;
};

export const generateOperationNumber = value => {
  const serie = Math.trunc(value / 1000000) + 1;
  const zero = "0".repeat(6 - `${value}`.length);
  return `${serie}-${zero}${value}`;
};
