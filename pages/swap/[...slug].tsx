import ChartTradingViewSwap from "@/components/Charts/ChartTradingViewSwap";
import MediaNFT from "@/components/Common/MediaNFT";
import { SkeletonSwap } from "@/components/Skeleton";
import HistorySwap from "@/components/Swap/History";
import SwapTransaction from "@/components/Swap/SwapTransaction/SwapTransaction";
import AccountContext from "@/context/AccountContext";
import { swapAPI } from "@/libs/service";
import { useQuery } from "@tanstack/react-query";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { SEO } from "../../next-seo.config";
const updateMeta = {
  ...SEO,
  title: "Swap",
};
const Swap: React.FC = () => {
  const router = useRouter();
  const [nftAddress, setNftAddress] = useState<string>("");
  const [tokenAddress, setTokenAddress] = useState<string>("");
  const [idNFT, setIdNFT] = useState<string>("");
  const { chainId } = useContext(AccountContext);
  const { slug } = router.query;
  const { isLoading, data, isFetching, isSuccess, refetch } = useQuery({
    queryKey: ["swap", idNFT, nftAddress, chainId, tokenAddress],
    queryFn: async () => {
      const res = await swapAPI(
        tokenAddress.toLocaleLowerCase(),
        chainId,
        nftAddress.toLowerCase(),
        idNFT
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
      // setInputNFT("");
    }
  }, [slug]);

  return (
    <div className="">
      <NextSeo {...updateMeta} />
      {isLoading || isFetching ? (
        <SkeletonSwap />
      ) : isSuccess ? (
        <div className="min-h-[80vh]">
          <div className="flex flex-col-reverse border-y md:flex-row border-shader_600">
            <div className="flex flex-col items-center w-full md:w-[75%]">
              {data && (
                <ChartTradingViewSwap
                  dataSwap={data}
                  typeERC="erc1155"
                  height={468}
                />
              )}
            </div>
            <SwapTransaction
              data={data}
              tokenAddress={tokenAddress}
              idNFT={idNFT}
              nftAddress={nftAddress}
              refetch={refetch}
            />
          </div>
          <HistorySwap data={data} typeERC="erc1155" />
        </div>
      ) : (
        <SkeletonSwap />
      )}
    </div>
  );
};

export default Swap;
