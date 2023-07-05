import Image from "next/image";
import { ActiveIcon } from "../Icons";
import React, { useState, useRef, useEffect } from "react";
import useInformationDML from "@/hooks/useInformationDML";
import useFetchReservesDML from "@/hooks/useFetchReservesDML";
import { ethers } from "ethers";
import abiErc20 from "@/abi/abiErc20.json";
interface NFTItemsProps {
  nftItem: any;
  idNFT:any;
}

const NFTItems: React.FunctionComponent<NFTItemsProps> = ({ nftItem,idNFT }) => {
  const [heightDescription, setHeightDescription] = useState(0);
  const [isMore, setIsMore] = useState<boolean>(false);
  const [reserve,setReserve] = useState();
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (descriptionRef.current) {
      setHeightDescription(descriptionRef.current.clientHeight);
    }
  }, []);
  useEffect(() => {
    const getInforDML = async (dmlToken: string) => {
      const provider = new ethers.providers.JsonRpcProvider(
        "https://rpc.ankr.com/polygon_mumbai"
      );
      const contract = new ethers.Contract(dmlToken, abiErc20, provider);
      try {
        const reserves = await contract.getReserves();
        const decimals = await contract.decimals();
        const idNFT = await contract.id();
        console.log(decimals);
        console.log(idNFT);
  
        const nftAddress = await contract.nft();
        const reserveNFT = await contract.reservenft();
        const reserveToken = await contract.reservetoken();
        console.log(nftAddress);
        console.log(reserveNFT);
        console.log(reserveToken);
  
        const tokenAddress = await contract.token();
        console.log(tokenAddress);
      } catch (error) {
        console.error(error);
      }
    };
    getInforDML("0x5c8f68cb10ed912d72de0ae48675fcdc7fb645e2");
  }, []);
  const formattedDescription = nftItem.metadata.description
    .split("\\n")
    .map((line: any, index: any) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));

  // const {tokenAddress} = useInformationDML('0x5c8f68cb10ed912d72de0ae48675fcdc7fb645e2')
  // console.log(tokenAddress);
 
  // console.log(reserve);
  
  return (
    <div className="p-2 mt-6 rounded-lg shadow-home">
      <div className="flex items-center justify-between">
        <div className="flex justify-between mb-2">
          <h2 className="text-2xl font-medium text-dark1">
            {nftItem.metadata.name}{" "}
          </h2>
          <ActiveIcon width={24} height={24} className="mr-4" />
          {nftItem.metadata.category.map((item: any, index: number) => (
            <div
              key={index}
              className="h-[30px] flex items-center px-2 mr-4 text-xs font-medium text-center border rounded-lg border-secondary5 text-dark1"
            >
              <p>{item}</p>
            </div>
          ))}
        </div>
        <div className="text-[34px] font-medium text-secondary3 leading-[14px]">
          100 ETH
        </div>
        {/* <p>{idNFT}</p> */}
      </div>
      <div className="flex items-center mb-2 text-dark2">
        <div className="w-6 h-6 mr-2 bg-black rounded-full"></div>
        <p className="font-medium text-dark2">TOCA</p>
        <p className="-translate-y-[4px] mx-1">.</p>
        <p className="text-xs">19 Mins</p>
      </div>
      <p
        className={`font-light text-dark2 ${
          isMore ? "line-clamp-0" : "line-clamp-3"
        }`}
        ref={descriptionRef}
      >
        {formattedDescription}
      </p>
      {heightDescription >= 84 && !isMore && (
        <p
          className="text-sm font-light cursor-pointer text-secondary4"
          onClick={() => setIsMore(true)}
        >
          Read more
        </p>
      )}
      <div className="relative mt-6">
        {nftItem.metadata.image && (
          <Image
            width={1031}
            height={1049}
            src={nftItem.metadata.image}
            alt="NFT Image"
            unoptimized
            className="rounded-2xl"
          />
        )}
        {nftItem.metadata.animation_url && !nftItem.metadata.image && (
          <video
            src={nftItem.metadata.animation_url}
            autoPlay
            loop
            muted
            controls
            className="mx-auto rounded-2xl"
          />
        )}
        {nftItem.metadata.image && nftItem.metadata.animation_url && (
          <audio
            autoPlay
            loop
            muted
            controls
            src={nftItem.metadata.animation_url}
            className="absolute bottom-0 mx-auto mt-4 mb-2 translate-x-1/2 right-2/4 w-[80%]"
          >
            Your browser does not support the
            <code>audio</code> element.
          </audio>
        )}
      </div>
    </div>
  );
};

export default NFTItems;
