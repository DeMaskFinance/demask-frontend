import utilsStarknet from "@/utils/utils.starknet";

const handleApproveDML = async (
  account: string,
  wallet: string,
  dmlAddress: string,
  setIsOpenTransaction: any,
  routerAddress721: string,
  bigNumberBalance: any
) => {
  if (account && wallet) {
    try {
      setIsOpenTransaction(true);
      await utilsStarknet.approve({
        contractAddress: dmlAddress,
        balance: bigNumberBalance || 1 * 1e18,
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
