import { BackgroundDefault } from "@/components/Backgrounds";
import TopNft from "@/components/Collections/TopNft/TopNft";
import { LeftIcon } from "@/components/Icons";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { SEO } from "../../next-seo.config";
import Back from "@/components/Common/Back";
const updateMeta = {
  ...SEO,
  title: "Trending",
};
const Trending = () => {
  const router = useRouter();
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
