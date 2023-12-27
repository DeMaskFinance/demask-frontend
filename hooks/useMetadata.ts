import { ethers } from "ethers";
import abiCreator from "@/abi/abiCreator.json";
import React, { useState, useEffect, useContext } from "react";
import { getProvider } from "@/libs/connection/getProvider";
const useMetadata = (
  nftAddress: string,
  idNFT: number | undefined,
  wallet: string
) => {
  const [uri, setUri] = useState("");
  const [metadata, setMetadata] = useState(null);
  const [isLoadingMeta, setIsLoadingMeta] = useState(false);
  useEffect(() => {
    const handleSearch = async () => {
      const providerChoice = await getProvider(wallet);
      const provider = new ethers.providers.Web3Provider(providerChoice);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(nftAddress, abiCreator, signer);
      try {
        setIsLoadingMeta(true);
        const uri = await contract.uri(idNFT);
        setUri(uri);
        const res = await fetch(uri);
        const metadata = await res.json();
        setMetadata(metadata);
        setIsLoadingMeta(false);
      } catch (error) {
        console.error(error);
      }
    };

    if (idNFT && nftAddress) {
      handleSearch();
    }
  }, [nftAddress, idNFT]);
  return {
    uri,
    metadata,
    isLoadingMeta,
  };
};
export default useMetadata;
