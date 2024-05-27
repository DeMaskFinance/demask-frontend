import { BackgroundDefault } from "@/components/Backgrounds";
import SwapDefault from "@/components/Swap/SwapDefault";
import { SEO } from "@/next-seo.config";
import { NextSeo } from "next-seo";
const updateMeta = {
  ...SEO,
  title: "Swap",
};
export default function Swap() {
  return (
    <>
      <NextSeo {...updateMeta} />
      <SwapDefault />
    </>
  );
}
