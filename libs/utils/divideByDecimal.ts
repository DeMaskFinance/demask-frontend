import BigNumber from "bignumber.js";

const divideByDecimal = (number:string, decimalPlaces:string) => {
    const bigNumber = new BigNumber(number);
    const divisor = new BigNumber(10).exponentiatedBy(decimalPlaces);
    const result = bigNumber.dividedBy(divisor);
    return result.toString();
  }
export default divideByDecimal;