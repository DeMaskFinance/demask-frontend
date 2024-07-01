import React from "react";
import TitleMain from "../TitleMain";
import Image from "next/image";
import { StartIcon } from "../Icons";

const Features = () => {
  const featureList = [
    {
      title: "Creation Center",
      des: () => <p>The world’s simple NFT creation tool.</p>,
      img: "/Create.svg",
    },
    {
      title: "Launchpad",
      des: () => (
        <div>
          <span>Launch your NFT collection with no coding required, </span>
          <span className="text-primary_300 font-bold">100% Free.</span>
        </div>
      ),
      img: "/Launchpad.svg",
    },
    {
      title: "DEX",
      des: () => (
        <div>
          <p>An AMM protocol for NFTs, NFT-to-token swaps </p>
          <p>using customizable bonding curves</p>
        </div>
      ),
      img: "/Swaps.svg",
    },
    {
      title: "Leaderboard & Referral",
      des: () => (
        <div>
          <p>
            Share income with active traders at the top of the leaderboard.{" "}
          </p>
          <p> Share fees from swap..</p>
        </div>
      ),
      img: "/Leaderboard.svg",
    },
  ];
  return (
    <div className="pb-16 pt-0 md:py-[143px] px-4" id="features">
      <TitleMain
        title="OUR FEATURES"
        description="An on-chain AMM Protocol for Trading between an NFT Collection and an Native Token"
        id="tsparticles-2"
        icon={<StartIcon />}
        className="shadow-features border-[#99E0FF] border-opacity-35"
      />
      <div
        className="grid grid-cols-1  md:grid-cols-2 gap-4 mt-14 "
        data-aos="fade-up"
        data-aos-duration="1500"
      >
        {featureList.map((item, index) => (
          <div
            key={index}
            className="text-center bg-feature-gradient  rounded-xl border border-shader_400 overflow-hidden"
          >
            <div className="px-6 pt-6 flex flex-col items-center justify-center mb-8">
              <p className="text-xl font-bold text-white">{item.title}</p>
              <div className="font-normal">
                <item.des />
              </div>
            </div>
            <div className="w-[592px] h-[275px]">
              <Image
                src={item.img}
                alt="img_features"
                width={450}
                height={300}
                className=" w-full h-full"
                quality={100}
                priority={true}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
