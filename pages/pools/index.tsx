import { BackgroundDefault } from "@/components/Backgrounds";
import Button from "@/components/Buttons/Button";
import PoolUser from "@/components/Liquidity/StaticUser";
import AccountContext from "@/context/AccountContext";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useContext } from "react";
import { SEO } from "../../next-seo.config";
import Pools from "@/components/Liquidity/Pools";
const updateMeta = {
  ...SEO,
  title: "Liquidity",
};
export default function Liquidity() {
  const { demask } = useContext(AccountContext);
  const router = useRouter();
  const { NATIVE_ADDRESS: nativeAddress } = demask;
  const handleAddLiquidity = () => {
    const nftAddress = demask.CREATOR;
    const tokenAddress = nativeAddress;
    const idNFT = demask.IDNFT;
    router.push(`/add/${nftAddress}/${tokenAddress}/${idNFT}`);
  };

  return (
    <BackgroundDefault>
      <NextSeo {...updateMeta} />
      <div className="py-8 max-w-[908px]  mx-auto min-h-[94vh] pb-40 lg:pb-0 px-4 md:px-0">
        <div className="w-full">
          <div className="flex flex-wrap justify-between w-full gap-y-2">
            <div>
              <h2 className="text-lg font-bold text-primary_300">
                Liquidity Pools
              </h2>
              <p className="mt-2 text-shader_200">
                Add liquidity and earn rewards
              </p>
            </div>
            <Button
              type="button"
              primary
              className="h-[34px] w-[130px] text-sm font-semibold"
              onClick={handleAddLiquidity}
            >
              + Add Liquidity
            </Button>
          </div>
          <PoolUser />
          <Pools />
        </div>
      </div>
    </BackgroundDefault>
  );
}
