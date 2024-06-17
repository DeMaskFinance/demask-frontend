import React from "react";
import { BackgroundDefault } from "@/components/Backgrounds";
import { NextSeo } from "next-seo";
import { SEO } from "../../next-seo.config";
import { LeftIcon } from "@/components/Icons";
import { useRouter } from "next/router";
import TopNft from "@/components/Collections/TopNft/TopNft";
import ListTracsaction from "@/components/Collections/Transaction/ListTracsaction";
const updateMeta = {
  ...SEO,
  title: "Trending",
};
const Trending = () => {
  const router = useRouter();
  return (
    <BackgroundDefault>
      <div className="py-8 min-h-[94vh] max-w-screen-lg mx-auto">
        <NextSeo {...updateMeta} />
        <div
          className="flex items-center cursor-pointer gap-x-2"
          onClick={() => router.back()}
        >
          <LeftIcon width={20} height={20} />

          <p className="font-semibold text-white">Back</p>
        </div>
        <ListTracsaction />
      </div>
    </BackgroundDefault>
  );
};

export default Trending;
