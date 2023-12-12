import { getProvider } from "@/libs/connection/getProvider";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import abiRoyalty from "@/abi/abiRoyalty.json";
const useRoyalty = (
  account: string,
  nftAddress: string,
  idToken: string,
  wallet: string,
  inputNFT: string,
  royaltyAddress: string
) => {
  const [royaltyView, setRoyaltyView] = useState<string | null>(null);
  useEffect(() => {
    const getData = async () => {
      if (account && wallet) {
        const providerChoice = getProvider(wallet);
        const provider = new ethers.providers.Web3Provider(providerChoice);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          royaltyAddress,
          abiRoyalty,
          signer
        );
        try {
          const res = await contract.getRoyaltyView(
            nftAddress,
            idToken,
            inputNFT
          );
          setRoyaltyView(res);
        } catch (error) {
          console.error(error);
        }
      } else {
        console.log("No account");
      }
    };

    getData();
  }, [account, nftAddress, idToken, wallet, inputNFT]);

  return royaltyView;
};
export default useRoyalty;
