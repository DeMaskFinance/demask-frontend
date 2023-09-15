import abiRouter from "@/abi/abiRouter.json";
import TransitionURL from "@/components/Toast/TransionURL";
import BigNumber from "bignumber.js";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getProvider } from "../connection/getProvider";
interface BuyNFTProps {
  e: React.MouseEvent<HTMLButtonElement, MouseEvent>;
  account: string | null;
  inputNFT: string;
  setShowRequiredMessage: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setInputNFT:React.Dispatch<React.SetStateAction<string>>;
  isSufficientNFT: boolean;
  isSufficientTokenBuy: boolean;
  reserves: string[]; 
  tokenAddress: string;
  nftAddress: string;
  idNFT: string;
  wallet: string; 
  amountBuy: BigNumber;
  routerAddress: string
}
const handleBuyNFT = async ({
  e,
  account,
  inputNFT,
  setShowRequiredMessage,
  setIsOpen,
  setInputNFT,
  isSufficientNFT,
  isSufficientTokenBuy,
  reserves,
  tokenAddress,
  nftAddress,
  idNFT,
  wallet,
  amountBuy,
  routerAddress,
}: BuyNFTProps) => {
  e.preventDefault();
  if (!account) {
    setIsOpen(true);
    return;
  }
  if (inputNFT === "") {
    setShowRequiredMessage(true);
  } else {
    setShowRequiredMessage(false);
    if (
      isSufficientNFT &&
      isSufficientTokenBuy &&
      Number(reserves[1].toString()) > 1 &&
      Number(reserves[0].toString()) > 0
    ) {
      const providerChoice = getProvider(wallet);
      const provider = new ethers.providers.Web3Provider(providerChoice);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(routerAddress, abiRouter, signer);
      try {
        let result;
        if (tokenAddress === "MATIC") {
          result = await contract.buyETH(
            nftAddress,
            idNFT,
            inputNFT,
            account,
            Math.floor((new Date().getTime() + 20 * 60000) / 1000),
            { gasLimit: 8000000, value: amountBuy.toFixed(0) }
          );
        } else {
          result = await contract.buy(
            tokenAddress,
            nftAddress,
            idNFT,
            inputNFT,
            amountBuy.toFixed(0),
            account,
            Math.floor((new Date().getTime() + 20 * 60000) / 1000),
            { gasLimit: 8000000 }
          );
        }
        toast.success(
          <TransitionURL type={"Buy NFT"} transactionHash={result.hash} />,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          }
        );
        setInputNFT("");
      } catch (error) {
        console.error(error);
      }
    }
  }
};

export default handleBuyNFT;
