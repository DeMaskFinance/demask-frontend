import abiDML from "@/abi/abiDML.json";
import ercContract from "./erc/erc.contract";
import BigNumber from "bignumber.js";
import utilsStarknet from "@/utils/utils.starknet";

const handleApproveDML = async (
  account: string,
  wallet: string,
  dmlAddress: string,
  inputLiquidity: string,
  setIsOpenTransaction: any,
  routerAddress721: string
) => {
  if (account && wallet) {
    const contract = await ercContract.erc(wallet, dmlAddress, abiDML);
    const inputLiquidityBN = new BigNumber(inputLiquidity)
      .times(new BigNumber(10).pow(18))
      .toFixed(0);

    try {
      // const result = await contract.approve(routerAddress, inputLiquidityBN);
      setIsOpenTransaction(true);

      console.log({
        contractAddress: dmlAddress,
        balance: String(1 * 1e18),
        target: routerAddress721,
      });

      const result = await utilsStarknet.approve({
        contractAddress: dmlAddress,
        balance: String(1 * 1e18),
        target: routerAddress721,
      });
      setIsOpenTransaction(false);
    } catch (error) {
      setIsOpenTransaction(false);
      console.error(error);
    }
  }
};
export default handleApproveDML;
