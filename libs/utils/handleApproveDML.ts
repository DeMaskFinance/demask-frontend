import abiDML from "@/abi/abiDML.json";
import ercContract from "./erc/erc.contract";
import BigNumber from "bignumber.js";

const handleApproveDML = async (
  account: string,
  wallet: string,
  dmlAddress: string,
  inputLiquidity: string,
  setIsOpenTransaction: any,
  routerAddress: string
) => {
  if (account && wallet) {
    const contract = await ercContract.erc(wallet, dmlAddress, abiDML);
    const inputLiquidityBN = new BigNumber(inputLiquidity)
      .times(new BigNumber(10).pow(18))
      .toFixed(0);
    console.log(inputLiquidityBN);

    try {
      const result = await contract.approve(routerAddress, inputLiquidityBN);
      setIsOpenTransaction(true);
      await result.wait();
      setIsOpenTransaction(false);
    } catch (error) {
      setIsOpenTransaction(false);
      console.error(error);
    }
  }
};
export default handleApproveDML;
