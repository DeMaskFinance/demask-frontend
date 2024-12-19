import utilsStarknet from "@/utils/utils.starknet";

const handleApproveDML = async (
  account: string,
  wallet: string,
  dmlAddress: string,
  setIsOpenTransaction: any,
  routerAddress721: string
) => {
  if (account && wallet) {
    try {
      setIsOpenTransaction(true);
      await utilsStarknet.approve({
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
