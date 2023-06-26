import { ethers } from "ethers";

const handleBignumbertoDec = (value: any, decimals: any) => {
  const decimalsInt = Number(decimals);
  const divisor = ethers.BigNumber.from(10).pow(decimalsInt);
  const bigNumberValue = ethers.BigNumber.from(value); 
  const balance = bigNumberValue.div(divisor);
  return balance.toString();
};

export default handleBignumbertoDec;
