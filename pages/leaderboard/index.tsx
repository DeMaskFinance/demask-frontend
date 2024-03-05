import { TabGroups } from "@/components/NavChoice";
import { useState } from "react";
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { SEO } from "@/next-seo.config";
import { NextSeo } from "next-seo";
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import TableRank from "@/components/LeaderBoard/TableRank";
import Cards from "@/components/LeaderBoard/Cards";
const updateMeta = {
  ...SEO,
  title: "Leaderboard",
};
const LeaderBoard = () => {
  const [activeChoice, setActiveChoice] = useState<string>("Current Season");
  const handleChoiceChange = (choice: string) => {
    setActiveChoice("Current Season");
  };

  return (
    <div>
      <NextSeo {...updateMeta} />
      <div className="py-8 min-h-[75vh] max-w-[1048px] mx-auto flex flex-col gap-y-10 mb-[100px] text-center">
        <div>
          <h1 className="text-4xl font-medium lg:text-5xl text-dark1">
            Blast Big Bang Season
          </h1>
          <h2 className="flex items-center justify-center mt-3 text-2xl italic font-normal gap-x-2">
            <span className="text-dark1">Airdrop</span>
            <span className="text-yellow">100% Blast points</span>
            <span className="text-dark1">&</span>
            <span className="text-purple">100 OG Demask NFTs</span>
          </h2>
        </div>
        {/* <div className="flex justify-center">
          <TabGroups
            choices={["Current Season", "Previous Season"]}
            activeChoice={activeChoice}
            onChoiceChange={handleChoiceChange}
          />
        </div> */}
        <Cards />
        <TableRank />
      </div>
    </div>
  );
};

export default LeaderBoard;
