import Image from "next/image";
import { ActiveIcon } from "../Icons";
import images from "@/public/images";
import React from "react";
interface NFTItemsProps {
  nftItem:any,
}

const NFTItems: React.FunctionComponent<NFTItemsProps> = ({nftItem}) => {
  const formattedDescription = nftItem.metadata.description.split('\\n').map((line:any, index:any) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));
  return (
    <div className="p-2 mt-6 rounded-lg shadow-home">
      <div className="flex items-center justify-between">
        <div className="flex justify-between mb-2">
          <h2 className="text-2xl font-medium text-dark1">{nftItem.metadata.name} </h2>
          <ActiveIcon width={24} height={24} />
        </div>
        <div className="text-[34px] font-medium text-secondary3 leading-[14px]">100 ETH</div>
      </div>
      <div className="flex items-center mb-2 text-dark2">
        <div className="w-6 h-6 mr-2 bg-black rounded-full"></div>
        <p className="font-medium text-dark2">TOCA</p>
        <p className="-translate-y-[4px] mx-1">.</p>
        <p className="text-xs">19 Mins</p>
      </div>
      <p className="mb-6 font-light text-dark2">
      {formattedDescription} 
      </p>
      <Image width={1031} height={1049} src={nftItem.metadata.image} alt="NFT Image" unoptimized/>
    </div>
  );
};

export default NFTItems;
