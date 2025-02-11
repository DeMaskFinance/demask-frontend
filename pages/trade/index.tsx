import ComingSoonPage from "@/components/ComingSoonPage";
import SwapDefault from "@/components/Trade/TradeDefault";
import { SEO } from "@/next-seo.config";
import { NextSeo } from "next-seo";
const updateMeta = {
  ...SEO,
  title: "Trade",
};
export default function Swap() {
  return (
    <>
      <NextSeo {...updateMeta} />
      {/* <SwapDefault /> */}
      <ComingSoonPage />
    </>
  );
}
