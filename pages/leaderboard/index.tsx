import { TabGroups } from "@/components/NavChoice";
import { useContext, useState } from "react";
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
import BackgroundParticles from "@/components/Backgrounds/BackGroundParticles";
const updateMeta = {
  ...SEO,
  title: "Leaderboard",
};
const LeaderBoard = () => {
  const [activeChoice, setActiveChoice] = useState<string>("Current Season");
  const { chainId } = useContext(AccountContext);
  const handleChoiceChange = (choice: string) => {
    setActiveChoice("Current Season");
  };

  return (
    <div>
      <NextSeo {...updateMeta} />
      <BackgroundDefault>
        <div className="min-h-[94vh] max-w-7xl mx-auto flex flex-col gap-y-4 lg:gap-y-10 relative px-3">
          <div className="flex flex-col justify-center ">
            <h1 className="title_page ">Season 1</h1>
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
        <BackgroundParticles value={800} id="particle-container1" />
      </BackgroundDefault>
    </div>
  );
};

export default LeaderBoard;
