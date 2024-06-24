import Image from "next/image";
import React from "react";
import Marquee from "react-fast-marquee";

const Funtions = () => {
  const functionList = [
    {
      title: "Decentralized",
      des: "On-chain, open-source, extensible smart contracts.",
      img: "/Pool.png",
    },
    {
      title: "Liquidity Pool",
      des: "Automated market maker (AMM) protocol – x.y=k",
      img: "/Pool.png",
    },
    {
      title: "Save Fees",
      des: "Trade NFTs with low gas costs and zezo platform fees",
      img: "/SaveFees.png",
    },
    {
      title: "All Assets",
      des: "List ERC721 or ERC1155 listed in ERC20.",
      img: "/Pool.png",
    },
    {
      title: "Fee Sharing",
      des: "With liquidity provider, farmer & referral program. Share fees from pools.",
      img: "/SaveFees.png",
    },
    {
      title: "Earn royalties",
      des: "With ERC2981 - Earn fees on every sale",
      img: "/Earn.png",
    },
  ];
  return (
    <Marquee
      autoFill
      gradient
      gradientColor="#13151A"
      className="mt-14"
      gradientWidth={300}
    >
      <div className="flex ">
        {functionList.map((item, index) => (
          <div
            key={index}
            className="flex flex-col mr-4 p-6 h-[240px] w-[400px] shadow-xl bg-shader_800 border border-shader_500 transition-all duration-300 ease-in-out group  rounded-xl "
          >
            <Image src={item.img} alt="funtion_Img" width={104} height={104} />
            <h2 className="mt-4 mb-1 text-xl text-primary_200 font-bold">
              {item.title}
            </h2>
            <p className="font-normal">{item.des}</p>
          </div>
        ))}
      </div>
    </Marquee>
  );
};

export default Funtions;
