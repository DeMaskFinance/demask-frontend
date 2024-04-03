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
import { BackgroundFog } from "@/components/Backgrounds";
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
      <BackgroundFog>
        <div className="py-8 min-h-[75vh] max-w-[1048px] mx-auto flex flex-col gap-y-4 lg:gap-y-10">
          <h1 className="text-4xl h-[60px] lg:text-[60px] font-semibold bg-gradient-to-b text-center from-[#BA8DE6] to-[#7B54E8] bg-clip-text text-transparent">
            Season 1
          </h1>
          <div className="flex justify-center">
            <TabGroups
              choices={["Current Season", "Previous Season"]}
              activeChoice={activeChoice}
              onChoiceChange={handleChoiceChange}
            />
          </div>
          <Cards />
          <TableRank />
        </div>
      </BackgroundFog>
    </div>
  );
};

export default LeaderBoard;
