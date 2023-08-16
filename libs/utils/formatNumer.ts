const formatNumber = (number: string) => {
  const roundedNumber = Number(number);
  // if (roundedNumber === 0) {
  //   return 0;
  // } else if (roundedNumber < 0.01) {
  //   return roundedNumber.toExponential(4);
  // } else {
  //   return Number(roundedNumber.toFixed(2)).toLocaleString("en");
  // }
  if (roundedNumber === 0) {
    return 0;
  } else if (roundedNumber < 1) {
    const decimalPlaces = Math.max(0, -Math.floor(Math.log10(Math.abs(roundedNumber)) - 3));
    return parseFloat(roundedNumber.toFixed(decimalPlaces)).toString();
  } else {
    return Number(roundedNumber.toFixed(2)).toLocaleString("en");
  }
};
export default formatNumber;