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
import { BackgroundDefault } from "@/components/Backgrounds";
import { AvatarCustom } from "@/components/Avatars";
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
      <div className="py-8 min-h-[94vh] max-w-[1048px] mx-auto flex flex-col gap-y-4 lg:gap-y-10 relative">
        <div className="w-[655px] h-[150px] bg-linear-g2 absolute top-0 right-1/4 blur-[100px] opacity-20 rounded-full rotate-25 -z-10"></div>

        <div className="flex flex-col justify-center gap-y-8">
          <h1 className="text-4xl font-semibold text-center text-white ">
            Season 1
          </h1>
          <div className="w-[257px] mx-auto">
            <TabGroups
              choices={["Current Season", "Previous Season"]}
              activeChoice={activeChoice}
              onChoiceChange={handleChoiceChange}
            />
          </div>
        </div>
        <Cards />
        <TableRank />
      </div>
    </div>
  );
};

export default LeaderBoard;
