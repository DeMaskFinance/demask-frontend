import { NextSeo } from "next-seo";
import { SEO } from "../../next-seo.config";
import AddLiquidity from "@/components/Liquidity/AddLiquidity";
const updateMeta = {
  ...SEO,
  title: "Add Liquidity",
};
export default function AddLiquidityPage() {
  return (
    <div>
      <NextSeo {...updateMeta} />
      <AddLiquidity />
    </div>
  );
}
