import { ethers } from "ethers";
import abiErc1155 from "@/abi/abiErc1155.json";
import React, { useState, useEffect, useContext } from "react";
const useMetadata = (nftAddress: string, idNFT: string) => {
  const [nameNFT, setNameNFT] = useState<string>("");
  const [imageNFT, setImageNFT] = useState("");
  const [symbolNFT, setSymbolNFT] = useState<string>("");
  const [category, setCategory] = useState<string[]>([]);
  const [attributes, setAttributes] = useState<string[]>([]);
  const [animationUrl, setAnimationUrl] = useState('');
  const [description, setDescription] = useState<string>("");
  const [uri, setUri] = useState("");
  const [metadata, setMetadata] = useState(null);
  useEffect(() => {
    const handleSearch = async () => {
      const provider = new ethers.providers.JsonRpcProvider(
        "https://rpc.ankr.com/polygon_mumbai"
      );
      const contract = new ethers.Contract(nftAddress, abiErc1155, provider);
      try {
        const uri = await contract.uri(idNFT);
        setUri(uri);
        const res = await fetch(uri);
        const metadata = await res.json();
        setMetadata(metadata);

        if (metadata !== null) {
          const {
            name,
            symbol,
            image,
            description,
            animation_url,
            attributes,
            category,
          } = metadata;
          setNameNFT(name);
          setSymbolNFT(symbol);
          setImageNFT(image);
          setDescription(description);
          setAnimationUrl(animation_url);
          setAttributes(attributes);
          setCategory(category);
        } else {
          console.log("Metadata is null");
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (idNFT && nftAddress) {
      handleSearch();
    }
  }, [nftAddress, idNFT]);
  return {
    nameNFT,
    imageNFT,
    symbolNFT,
    category,
    attributes,
    animationUrl,
    description,
    uri,
    metadata,
  };
};
export default useMetadata;
