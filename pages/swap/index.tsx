import SwapDefault from "@/components/Swap/SwapDefault";
import { SEO } from "@/next-seo.config";
import { NextSeo } from "next-seo";

export default function Swap() {
  const updateMeta = {
    ...SEO,
    title: "Swap",
  };
  return (
    <div>
      <NextSeo {...updateMeta} />
      <SwapDefault />
    </div>
  );
}
