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
import AccountContext from "@/context/AccountContext";
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
      <div className="py-8 min-h-[75vh] max-w-[1048px] mx-auto flex flex-col gap-y-10 mb-[100px] text-center">
        {chainId == "168587773" ? (
          <div>
            <h1 className="text-3xl font-medium leading-normal lg:text-5xl bg-gradient-to-b text-center from-[#BA8DE6] to-[#7B54E8] bg-clip-text text-transparent whitespace-nowrap">
              Blast Big Bang Season
            </h1>
            {/* <h2 className="flex flex-wrap items-center justify-center mt-3 text-base italic font-normal lg:text-xl gap-x-2">
              <span className="text-dark1">Sharing</span>
              <span className="text-yellow whitespace-nowrap">100% Blast points, 0.5% Total Supply BleBle</span>
              <span className="text-dark1">&</span>
              <span className="text-purple whitespace-nowrap">100 OG Demask NFTs</span>
            </h2> */}
          </div>
        ) : (
          <div>
            <h1 className="text-4xl leading-normal font-semibold bg-gradient-to-b text-center from-[#BA8DE6] to-[#7B54E8] bg-clip-text text-transparent">
              Season 1
            </h1>
            <div className="flex justify-center mt-10">
              <TabGroups
                choices={["Current Season", "Previous Season"]}
                activeChoice={activeChoice}
                onChoiceChange={handleChoiceChange}
              />
            </div>
          </div>
        )}
        <Cards />
        <TableRank />
      </div>
    </div>
  );
};

export default LeaderBoard;
