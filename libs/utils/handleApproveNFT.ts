import utilsStarknet from "@/utils/utils.starknet";

const handleApproveNFT = async (
  account: string,
  wallet: string,
  nftAddress: string,
  setIsOpenTransaction: any,
  routerAddress: string
) => {
  if (account && wallet) {
    try {
      setIsOpenTransaction(true);
      const result = await utilsStarknet.setApproveForAll({
        target: nftAddress,
        operator: routerAddress,
      });

      console.log(result);
      setIsOpenTransaction(false);
    } catch (error) {
      console.error(error);
      setIsOpenTransaction(false);
    }
  }
};
export default handleApproveNFT;
