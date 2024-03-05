import abiErc20 from "@/abi/abiErc20.json";
import ercContract from "./erc/erc721.contract";

const approveToken = async (
  account: string,
  wallet: string,
  tokenAddress: string,
  routerAddress: string
) => {
  if (account && tokenAddress && wallet) {
    // const providerChoice = await getProvider(wallet);
    // const provider = new ethers.providers.Web3Provider(providerChoice);
    // const signer = provider.getSigner();
    // const contract = new ethers.Contract(tokenAddress, abiErc20, signer);
    const contract = await ercContract.erc(wallet, tokenAddress, abiErc20);
    try {
      const tokenAllowance = await contract.allowance(account, routerAddress);
      const currentAllowance = tokenAllowance.toString();

      return currentAllowance;
    } catch (error) {
      console.error(error);
      return false;
    }
  } else {
    console.log("No account");
    return false;
  }
};
export default approveToken;
