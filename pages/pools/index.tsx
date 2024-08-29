import { BackgroundDefault } from "@/components/Backgrounds";
import Pools from "@/components/Liquidity/Pools";
import { NextSeo } from "next-seo";
import { SEO } from "../../next-seo.config";
import { RpcProvider, WalletAccount } from "starknet";
const updateMeta = {
  ...SEO,
  title: "Liquidity",
};
export default function Liquidity() {
  return (
    <BackgroundDefault>
      <NextSeo {...updateMeta} />
      <div className="py-8 max-w-[908px]  mx-auto min-h-[94vh] pb-40 lg:pb-0 px-4 md:px-0">
        <Pools />
      </div>
    </BackgroundDefault>
  );
}
