import Image from "next/image";
import React, { Fragment } from "react";
import Marquee from "react-fast-marquee";

const Funtions = () => {
  const functionList = [
    {
      title: "All Assets",
      des: "List ERC721 or ERC1155 listed in ERC20.",
      img: "/Assets.svg",
    },
    {
      title: "Decentralized",
      des: "An on-chain AMM Protocol for Trading between an NFT Collection and an ERC20 Token.",
      img: "/Decentralized.svg",
    },
    {
      title: "Save Fees",
      des: "Trade NFTs with low gas costs and zezo platform fees",
      img: "/SaveFees.svg",
    },
    {
      title: "Liquidity Pool",
      des: "Automated market maker (AMM) protocol – x.y=k",
      img: "/Pool.png",
    },
    {
      title: "Earn royalties",
      des: "With ERC2981 - Earn fees on every sale",
      img: "/Earn.svg",
    },

    {
      title: "Fee Sharing",
      des: "With liquidity provider, farmer & referral program. Share fees from pools.",
      img: "/Sharing.svg",
    },
  ];
  return (
    <div>
      {/* <div className="">
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
                className="flex flex-col mr-4 p-6 h-[246px] w-[400px] shadow-xl bg-shader_800 border border-shader_500 transition-all duration-300 ease-in-out group  rounded-xl "
              >
                <div className="p-2">
                  <Image
                    src={item.img}
                    alt="funtion_Img"
                    width={300}
                    height={300}
                    className="object-cover w-[88px] h-[88px]"
                  />
                </div>
                <h2 className="mt-4 text-xl text-primary_200 font-bold">
                  {item.title}
                </h2>
                <p className="font-normal">{item.des}</p>
              </div>
            ))}
          </div>
        </Marquee>
      </div> */}
      {/* Mobile */}
      <div className="mt-10 px-4 md:hidden ">
        {functionList.map((item, index) => (
          <div
            key={index}
            className="flex flex-col p-4 mb-4 w-full shadow-xl bg-shader_800 border border-shader_500 transition-all duration-300 ease-in-out group  rounded-xl "
          >
            <Image
              src={item.img}
              alt="funtion_Img"
              width={300}
              height={300}
              className="object-cover w-16 h-16"
            />
            <h2 className="mt-4 text-xl text-primary_200 font-bold">
              {item.title}
            </h2>
            <p className="font-normal text-sm">{item.des}</p>
          </div>
        ))}
      </div>
      {/* PC */}
      <div className="w-full max-w-screen-xl mx-auto px-4 md:px-6 pt-14 hidden md:block">
        <div
          x-data="{}"
          x-init="$nextTick(() => {
                        let ul = $refs.logos;
                        ul.insertAdjacentHTML('afterend', ul.outerHTML);
                        ul.nextSibling.setAttribute('aria-hidden', 'true');
                    })"
          className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]"
        >
          <ul
            x-ref="logos"
            className="flex items-center justify-center md:justify-start [&amp;_li]:mx-8 [&amp;_img]:max-w-none animate-infinite-scroll "
          >
            {functionList.map((item, index) => (
              <div
                key={index}
                className="flex flex-col mr-4 cursor-pointer p-6 h-[246px] w-[400px] shadow-xl bg-shader_800 border border-shader_500 transition-all duration-300 ease-in-out group  rounded-xl "
              >
                <div className="p-2">
                  <Image
                    src={item.img}
                    alt="funtion_Img"
                    width={300}
                    height={300}
                    className="object-cover w-[88px] h-[88px]"
                  />
                </div>
                <h2 className="mt-4 text-xl text-primary_200 font-bold">
                  {item.title}
                </h2>
                <p className="font-normal">{item.des}</p>
              </div>
            ))}
          </ul>
          <ul
            x-ref="logos"
            className="flex items-center justify-center cursor-pointer md:justify-start [&amp;_li]:mx-8 [&amp;_img]:max-w-none animate-infinite-scroll"
            aria-hidden="true"
          >
            {functionList.map((item, index) => (
              <div
                key={index}
                className="flex flex-col mr-4 p-6 h-[246px] w-[400px] shadow-xl bg-shader_800 border border-shader_500 transition-all duration-300 ease-in-out group  rounded-xl "
              >
                <div className="p-2">
                  <Image
                    src={item.img}
                    alt="funtion_Img"
                    width={300}
                    height={300}
                    className="object-cover w-[88px] h-[88px]"
                  />
                </div>
                <h2 className="mt-4 text-xl text-primary_200 font-bold">
                  {item.title}
                </h2>
                <p className="font-normal">{item.des}</p>
              </div>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Funtions;
