import ChartTradingViewSwap from "@/components/Charts/ChartTradingViewSwap";
import MediaNFT from "@/components/Common/MediaNFT";
import { BackIcon } from "@/components/Icons";
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
    <div className="px-4 py-8 mx-auto max-w-screen-3xl swap lg:px-primary md:px-14">
      <NextSeo {...updateMeta} />
      {isLoading || isFetching ? (
        <SkeletonSwap />
      ) : isSuccess ? (
        <div className="min-h-[80vh]">
          <div className="flex items-center mb-6 text-xl font-semibold gap-x-2 text-dark0 ">
            <Link href={`/swap?chain=${chainId}`}>
              <BackIcon
                width={24}
                height={24}
                className="cursor-pointer hover:fill-secondary5"
              />
            </Link>
            <div className="w-[30px] h-[30px]">
              <MediaNFT data={data} isControls={false} />
            </div>
            <p>{data?.metadata?.name}</p>
            <p>({data?.metadata?.symbol}/ETH)</p>
          </div>
          <div className="flex flex-col-reverse gap-x-10 md:flex-row">
            <div className="lg:w-[62%] md:w-2/4 w-full flex flex-col items-center ">
                {data && (
                  <ChartTradingViewSwap dataSwap={data} typeERC="erc1155" />
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
