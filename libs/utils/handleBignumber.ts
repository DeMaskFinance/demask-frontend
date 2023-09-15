import BigNumber from "bignumber.js";

const handleBignumber = (price: number, decimals: number) => {
  return new BigNumber(price)
    .times(new BigNumber(10).pow(Number(decimals)))
    .toFixed();
};
export default handleBignumber;
