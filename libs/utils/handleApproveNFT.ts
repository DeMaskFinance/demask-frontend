import utilsStarknet from "@/utils/utils.starknet";

const handleApproveNFT = async (
  account: string,
  wallet: string,
  nftAddress: string,
  setIsOpenTransaction: any,
  routerAddress: string,
  setIsOpenAddLiquidity?: any
) => {
  if (account && wallet) {
    try {
      setIsOpenTransaction(true);
      const result = await utilsStarknet.setApproveForAll({
        target: nftAddress,
        operator: routerAddress,
      });

      setIsOpenTransaction(false);
    } catch (error) {
      console.error(error);
      setIsOpenTransaction(false);
    }
  }
};
export default handleApproveNFT;
