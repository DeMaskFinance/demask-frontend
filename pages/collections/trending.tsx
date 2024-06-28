import { BackgroundDefault } from "@/components/Backgrounds";
import TopNft from "@/components/Collections/TopNft/TopNft";
import { LeftIcon } from "@/components/Icons";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { SEO } from "../../next-seo.config";
const updateMeta = {
  ...SEO,
  title: "Trending",
};
const Trending = () => {
  const router = useRouter();
  return (
    <BackgroundDefault>
      <div className="py-4 md:py-8 min-h-[94vh] max-w-screen-lg mx-auto px-3">
        <NextSeo {...updateMeta} />
        <div
          className="flex items-center cursor-pointer gap-x-2"
          onClick={() => router.back()}
        >
          <LeftIcon width={20} height={20} />

          <p className="font-semibold text-white">Back</p>
        </div>
        <TopNft />
      </div>
    </BackgroundDefault>
  );
};

export default Trending;
