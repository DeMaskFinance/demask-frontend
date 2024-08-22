// format number if <1 0.0000..., >1 1000->1,000
const formatNumber = (number: string | number) => {
  const roundedNumber = Number(number);
  if (roundedNumber === 0) {
    return 0;
  } else if (roundedNumber < 1) {
    const decimalPlaces = Math.max(
      0,
      -Math.floor(Math.log10(Math.abs(roundedNumber)) - 3)
    );
    return parseFloat(roundedNumber.toFixed(decimalPlaces)).toString();
  } else {
    return Number(roundedNumber.toFixed(2)).toLocaleString("de-DE");
  }
};
export default formatNumber;
