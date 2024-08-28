import { BackgroundDefault } from "@/components/Backgrounds";
import Back from "@/components/Common/Back";
import TopNft from "@/components/Explorer/TopNft/TopCollection";
import { NextSeo } from "next-seo";
import { SEO } from "../../next-seo.config";
const updateMeta = {
  ...SEO,
  title: "Trending",
};
const Trending = () => {
  return (
    <BackgroundDefault>
      <div className=" min-h-[94vh] max-w-screen-lg mx-auto px-3">
        <NextSeo {...updateMeta} />
        <Back />
        <TopNft />
      </div>
    </BackgroundDefault>
  );
};

export default Trending;
