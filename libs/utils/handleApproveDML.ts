import utilsStarknet from "@/utils/utils.starknet";

const handleApproveDML = async (
  account: string,
  wallet: string,
  dmlAddress: string,
  setIsOpenTransaction: (open: boolean) => void,
  routerAddress721: string,
  bigNumberBalance: any,
  callback: any
) => {
  if (!account || !wallet) {
    console.error("Account or wallet is missing!");
    return;
  }

  try {
    setIsOpenTransaction(true);
    await utilsStarknet.approve({
      contractAddress: dmlAddress,
      balance: bigNumberBalance || 1 * 1e18,
      target: routerAddress721,
    });
    callback();
  } catch (error) {
    console.error("Error during approval:", error);
  } finally {
    setIsOpenTransaction(false);
  }
};

export default handleApproveDML;
