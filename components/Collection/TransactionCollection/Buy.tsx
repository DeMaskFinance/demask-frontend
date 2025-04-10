import { Button } from "@/components/Buttons";
import ModalBuyNFT from "@/components/Modal/ModalBuyNFT";
import {
  ModalError,
  ModalTransation,
} from "@/components/Modal/ModalTransation";
import { ModalSuccess } from "@/components/Modal/ModalTransation/ModalSuccess";
import { SkeletonItemTransaction } from "@/components/Skeleton/SkeletonCategory";
import { StaticDetailBuy } from "@/components/Trade/TradeTransaction/StaticDetail";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AccountContext from "@/context/AccountContext";
import useDebounce from "@/hooks/useDebounce";
import useInformationToken from "@/hooks/useInformationToken";
import { queryClient } from "@/libs/constants";
import { fetchDataBuyNFTs } from "@/libs/service/collectionService";
import { erc721TradingBuy } from "@/libs/service/tradeService";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { BsExclamationOctagon } from "react-icons/bs";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import NFTGrid from "./NFTsGrids";

const Buy = () => {
  const { account, chainId, slippage, wallet } = useContext(AccountContext);
  const [isOpenBuyNFT, setIsOpenBuyNFT] = useState<boolean>(false);
  const [isOpenTransaction, setIsOpenTransaction] = useState<boolean>(false);
  const [idNFT, setIdNFT] = useState<number[]>([]);
  const [isOpenSuccessBuy, setIsOpenSuccessBuy] = useState<boolean>(false);
  const [isOpenErrorBuy, setIsOpenErrorBuy] = useState<boolean>(false);
  const [hash, setHash] = useState<string>("");
  const [isSufficientTokenBuy, setIsSufficientTokenBuy] =
    useState<boolean>(false);
  const router = useRouter();


  const slug = router.query.slug as string[] || [];
  const collectionAddress = slug[0] || "";
  const tokenAddress = slug[1] || "";

  const debouncedIdNFT = useDebounce(idNFT, 1500);
  const [version] = useQueryParam("version", withDefault(StringParam, "v1"));
  const { bigNumberBalance } = useInformationToken(account, wallet, chainId);
  const {
    data,
    isLoading,
    isFetching,
    isSuccess,
  } = useInfiniteQuery({
    queryKey: ["collectionNFTBUY", chainId, collectionAddress, version, tokenAddress],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetchDataBuyNFTs(
        collectionAddress,
        tokenAddress,
        chainId,
        version,
        pageParam,
        500
      );
      return res;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage?.hasNextPage && lastPage.currentPage < lastPage.totalPages
        ? lastPage.currentPage + 1
        : undefined,
  });



  const contracts = queryClient.getQueryData<ContractAddresses>([
    "contracts",
    chainId,
    version,
  ]);


  const { data: data721Trading, isFetching: isFetching721Trading } = useQuery({
    queryKey: [
      "721TradingBuy",
      tokenAddress,
      chainId,
      collectionAddress,
      slippage,
      debouncedIdNFT,
      version,
    ],
    queryFn: async () => {
      const res = await erc721TradingBuy(
        collectionAddress,
        tokenAddress,
        chainId,
        debouncedIdNFT.length,
        slippage,
        version
      );
      return res.data;
    },
    enabled: debouncedIdNFT.length > 0,
  });

  useEffect(() => {
    setIsSufficientTokenBuy(
      Number(data721Trading?.maxAmountDecimals) <= Number(bigNumberBalance)
    );
  }, [account, data721Trading, bigNumberBalance]);


  const dataFake = {
    dmlAddress: data?.pages[0].data?.dmlAddress,
    tokenDecimals: "18",
    metadata: {
      image: data?.pages[0].data?.avatar,
    },
  };

  return (
    <div>

      {data &&
        <div className="flex items-center justify-between w-full pb-2 pt-4">
          <p className="text-xs text-[#F9BE76] flex gap-1 items-center">
            <BsExclamationOctagon className="inline-block" />
            The maximum transaction limit's 500 NFTs.</p>
          <p className="text-white text-sm font-semibold">{data?.pages[0].data?.length}/{data?.pages[0]?.totalRecords}</p>
        </div>
      }

      {isLoading || isFetching ? (
        <div className="grid grid-cols-3 gap-6 mt-4 lg:grid-cols-4">
          <SkeletonItemTransaction />
        </div>
      ) : isSuccess && data?.pages?.length > 0 ? (
        <div className="flex flex-col ">
          <NFTGrid data={data.pages.flatMap(page => page.data)} idNFT={idNFT} isSearch setIdNFT={setIdNFT} />

          <div className="w-full mt-4">
            {idNFT.length > 0 && (
              <StaticDetailBuy
                data={data721Trading}
                inputNFTValue={idNFT.length}
                isFetching={isFetching721Trading}
              />
            )}

            <Dialog open={isOpenBuyNFT} onOpenChange={setIsOpenBuyNFT}>
              <DialogTrigger asChild>
                <Button
                  disabled={
                    !isSufficientTokenBuy ||
                    idNFT.length === 0 ||
                    isFetching ||
                    data721Trading?.maxAmountDecimals === 0
                  }
                  primary={
                    isSufficientTokenBuy &&
                    data721Trading?.maxAmountDecimals !== 0 &&
                    !isFetching
                  }
                  className={`w-full py-4 ${!isSufficientTokenBuy ||
                    idNFT.length === 0 ||
                    isFetching ||
                    data721Trading?.maxAmountDecimals === 0 ? "bg-slate-400/20" : ""}`}
                >
                  BUY {idNFT.length} NFTs
                </Button>
              </DialogTrigger>
              <DialogContent className="p-0 border-none">
                {data721Trading && contracts && (
                  <ModalBuyNFT
                    isFetching={isFetching}
                    isOpenTransaction={isOpenTransaction}
                    setIsOpenTransaction={setIsOpenTransaction}
                    tokenAddress={tokenAddress}
                    nftAddress={collectionAddress}
                    idNFT={debouncedIdNFT}
                    routerAddress={contracts.ERC721_ROUTER_ADDRESS}
                    //@ts-expect-error:errror
                    data={dataFake}
                    dataBuy={data721Trading}
                    setIsOpenBuyNFT={setIsOpenBuyNFT}
                    inputNFT={""}
                    setInputNFT={setIdNFT}
                    setHash={setHash}
                    setIsOpenSuccess={setIsOpenSuccessBuy}
                    setIsOpenError={setIsOpenErrorBuy}
                  />
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      ) : (
        <p className="mt-4">No data available.</p>
      )}

      <ModalSuccess
        isOpenSuccess={isOpenSuccessBuy}
        transactionHash={hash}
        type="Buy NFT Success"
        setIsOpenSuccess={setIsOpenSuccessBuy}
      />
      <ModalError
        isOpenError={isOpenErrorBuy}
        transactionHash={hash}
        type="Buy NFT Failed"
        setIsOpenError={setIsOpenErrorBuy}
      />
      <ModalTransation
        isOpenTransation={isOpenTransaction}
        setIsOpenTransaction={setIsOpenTransaction}
      />
    </div>
  );
};

export default Buy;
