// format number to K,B,M,T ex:1000->1k
const formatToUnit = (number: string) => {
  const n = Number(number);
  if (n < 0.001) return "<0.001";
  if (n < 1e3) return n.toFixed(2);
  if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K";
  if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M";
  if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + "B";
  if (n >= 1e12 && n < 1e15) return +(n / 1e12).toFixed(1) + "T";
  if (n >= 1e15 && n < 1e18) return +(n / 1e15).toFixed(1) + "Q";
  if (n >= 1e18) return +(n / 1e18).toFixed(1) + "S";
};

export default formatToUnit;
