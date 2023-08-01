import abiErc20  from '@/abi/abiErc20.json';
import { ethers } from "ethers";
import { getProvider } from "../connection/getProvider";

const handleApproveToken = async (account:string,wallet:string,tokenAddress:string,inputToken:string,setIsApprovedToken:any,setIsOpen:any) => {
    if (account) {
      const providerChoice = getProvider(wallet);
      const provider = new ethers.providers.Web3Provider(providerChoice);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(tokenAddress, abiErc20, signer);
      const routerAddress = process.env.NEXT_PUBLIC_ROUTER || "";
      try {
        await contract.approve(routerAddress, inputToken);
        setIsApprovedToken(true);
      } catch (error) {
        console.error(error);
      }
    } else {
      setIsOpen(true);
    }
  };
  export default handleApproveToken;