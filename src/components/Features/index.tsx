import React from "react";
import TitleMain from "../TitleMain";
import Image from "next/image";

const Features = () => {
  const featureList = [
    {
      title: "Creation Center",
      des: () => <p>The world’s simple NFT creation tool.</p>,
      img: "/create.png",
    },
    {
      title: "Launchpad",
      des: () => (
        <div>
          <span>Launch your NFT collection with no coding required, </span>
          <span>100% Free.</span>
        </div>
      ),
      img: "/Launchpad.png",
    },
    {
      title: "DEX",
      des: () => (
        <div>
          <span>An AMM protocol for NFTs, NFT-to-token swaps </span>
          <span className="font-bold text-primary_300">100% Free.</span>
        </div>
      ),
      img: "/Dex.png",
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
      img: "/Leaderboard.png",
    },
  ];
  return (
    <div className="py-[143px]">
      <TitleMain />
      <div className="grid grid-cols-2 gap-4 mt-14">
        {featureList.map((item, index) => (
          <div
            key={index}
            className="text-center bg-feature-gradient rounded-xl border border-shader_400 "
          >
            <div className="px-6 pt-6 flex flex-col items-center justify-center mb-8">
              <p className="text-xl font-bold text-white">{item.title}</p>
              <div className="font-normal">
                <item.des />
              </div>
            </div>
            <Image
              src={item.img}
              alt="img_features"
              width={1000}
              height={500}
              className="object-cover w-[592px] h-[275px]"
              quality={100}
              priority={true}
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
