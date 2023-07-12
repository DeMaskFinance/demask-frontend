const formatNumber = (number: string) => {
  const roundedNumber = Number(number);
  if (roundedNumber === 0) {
    return 0;
  } else if (roundedNumber < 0.01) {
    return roundedNumber.toExponential(4);
  } else {
    return Number(roundedNumber.toFixed(2)).toLocaleString("en");
  }
  // return Number(roundedNumber.toFixed(2)).toLocaleString("en");
};
export default formatNumber;