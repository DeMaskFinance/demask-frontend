const formatNumber = (number: string) => {
  const roundedNumber = Number(number);
  if (roundedNumber < 0.0001) {
    return roundedNumber.toExponential();
  }
  return Number(roundedNumber.toFixed(2)).toLocaleString("en");
};
export default formatNumber;
