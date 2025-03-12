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
import BackgroundParticles from "@/components/Backgrounds/BackGroundParticles";
import { leaderBoardAPI } from "@/libs/service/leaderBoard";
import { GetServerSideProps } from "next";
const updateMeta = {
  ...SEO,
  title: "Leaderboard",
};
const LeaderBoard = ({ leaderboardData }: { leaderboardData: any }) => {
  const [activeChoice, setActiveChoice] = useState<string>("Current Season");
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
          <Cards leaderboardData={leaderboardData} />
          <TableRank />
        </div>
        <BackgroundParticles value={800} id="particle-container1" />
      </BackgroundDefault>
    </div>
  );
};

export default LeaderBoard;

export const getServerSideProps: GetServerSideProps = async () => {
  try {

    const chainId = "10143";
    const leaderboardData = await leaderBoardAPI(chainId, 1, "");

    return {
      props: { leaderboardData },
    };
  } catch (error) {
    console.error("Failed to fetch leaderboard data:", error);
    return {
      props: { leaderboardData: null },
    };
  }
};
