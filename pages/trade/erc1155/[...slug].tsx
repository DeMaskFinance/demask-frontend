import ChartTradingViewSwap from "@/components/Charts/ChartTradingViewSwap";
import { SkeletonSwap } from "@/components/Skeleton";
import HistorySwap from "@/components/Trade/History";
import SwapTransaction from "@/components/Trade/TradeTransaction";
import AccountContext from "@/context/AccountContext";
import { swapAPI } from "@/libs/service";
import { getMetadata } from "@/libs/service/nftService";
import { SEO } from "@/next-seo.config";
import { useQuery } from "@tanstack/react-query";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
const updateMeta = {
  ...SEO,
  title: "Trade",
};
const Swap: React.FC = () => {
  const router = useRouter();
  const [nftAddress, setNftAddress] = useState<string>("");
  const [tokenAddress, setTokenAddress] = useState<string>("");
  const [idNFT, setIdNFT] = useState<string>("");
  const { chainId } = useContext(AccountContext);
  const { slug } = router.query;
  const { isLoading, data, isFetching, isSuccess, refetch } = useQuery({
    queryKey: ["metadata", idNFT, nftAddress, chainId, tokenAddress],
    queryFn: async () => {
      const res = await getMetadata(
        chainId,
        nftAddress.toLowerCase(),
        idNFT,
        tokenAddress
      );
      return res;
    },
    keepPreviousData: true,
  });
  useEffect(() => {
    if (slug) {
      setNftAddress(slug[0]);
      setTokenAddress(slug[1]);
      setIdNFT(slug[2]);
    }
  }, [slug]);
  console.log(data);

  return (
    <div className="">
      <NextSeo {...updateMeta} />
      {isLoading || isFetching ? (
        <SkeletonSwap />
      ) : isSuccess ? (
        <div className="flex min-h-[94vh] flex-col-reverse border-y md:flex-row border-shader_600 ">
          <div className="flex flex-col items-center flex-auto border-r border-shader_600 min-w-[160px] z-0">
            {data && (
              <ChartTradingViewSwap
                dataSwap={data}
                typeERC="erc1155"
                height={518}
              />
            )}
            <HistorySwap data={data} typeERC="erc1155" />
          </div>
          <SwapTransaction
            data={data}
            tokenAddress={tokenAddress}
            idNFT={idNFT}
            nftAddress={nftAddress}
            refetch={refetch}
          />
        </div>
      ) : (
        <SkeletonSwap />
      )}
    </div>
  );
};

export default Swap;
