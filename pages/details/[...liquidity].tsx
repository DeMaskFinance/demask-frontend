import { BackgroundDefault } from "@/components/Backgrounds";
import { NextSeo } from "next-seo";
import { SEO } from "../../next-seo.config";
import { DetailLiquidity } from "@/components/Liquidity";
const updateMeta = {
  ...SEO,
  title: "Detail Liquidity",
};
export default function DetailPool() {
  return (
    <BackgroundDefault>
      <div className="py-8 min-h-[94vh] max-w-screen-sm md:max-w-screen-xl mx-auto">
        <NextSeo {...updateMeta} />
        <DetailLiquidity />
      </div>
    </BackgroundDefault>
  );
}
