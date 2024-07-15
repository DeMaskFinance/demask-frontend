import { Button } from "@/components/Buttons";
import FormatNumber from "@/components/Common/FormatNumber";
import { EtherIcon, NFTIcon } from "@/components/Icons";
import ModalBuyNFT from "@/components/Modal/ModalBuyNFT";
import {
  ModalError,
  ModalTransation,
} from "@/components/Modal/ModalTransation";
import { ModalSuccess } from "@/components/Modal/ModalTransation/ModalSuccess";
import { ModalWallet } from "@/components/Modal/ModalWallet";
import { SkeletonItemTransaction } from "@/components/Skeleton/SkeletonCategory";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AccountContext from "@/context/AccountContext";
import useAmountInMax from "@/hooks/useAmountInMax";
import { fetchDataBuyNFTs } from "@/libs/service/collectionService";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import NFTGrid from "./NFTsGrids";
import useDebounce from "@/hooks/useDebounce";
import useFee from "@/hooks/useFee";
const Buy = () => {
  const { account, chainId, demask, wallet, slippage, bigNumberBalance } =
    useContext(AccountContext);
  const [isOpenBuyNFT, setIsOpenBuyNFT] = useState<boolean>(false);
  const [isOpenTransaction, setIsOpenTransaction] = useState<boolean>(false);
  const [idNFT, setIdNFT] = useState<number[]>([]);
  const [isOpenSuccessBuy, setIsOpenSuccessBuy] = useState<boolean>(false);
  const [isOpenErrorBuy, setIsOpenErrorBuy] = useState<boolean>(false);
  const [amountInMax, setAmountInMax] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [loadingPrice, setLoadingPrice] = useState<boolean>(false);
  const [hash, setHash] = useState<string>("");
  const [isSufficientTokenBuy, setIsSufficientTokenBuy] =
    useState<boolean>(false);
  const {
    ROUTER_721: routerAddress,
    RPC: rpc,
    NATIVE_ADDRESS: nativeAddress,
  } = demask;
  const router = useRouter();
  const collectionAddress = (router.query.erc as string) || "";
  const debouncedIdNFT = useDebounce(idNFT, 1500);

  const { isLoading, data, isSuccess, refetch, isFetching } = useQuery({
    queryKey: ["collectionNFTBUY", chainId, collectionAddress],
    queryFn: async () => {
      const res = await fetchDataBuyNFTs(collectionAddress, chainId);
      return res;
    },
  });

  const dmlToken = data?.dmlAddress;
  const { amountTokenBuy, isLoadingBuy } = useAmountInMax(
    "",
    dmlToken,
    nativeAddress,
    collectionAddress,
    debouncedIdNFT,
    wallet,
    account,
    rpc,
    routerAddress,
    true
  );
  const { totalFee } = useFee(
    amountTokenBuy,
    dmlToken,
    wallet,
    account,
    rpc,
    demask.FEE_MANAGER,
    true
  );
  useEffect(() => {
    if (Number(amountInMax) > Number(bigNumberBalance)) {
      setIsSufficientTokenBuy(false);
    } else {
      setIsSufficientTokenBuy(true);
    }
  }, [account, amountInMax, data, bigNumberBalance]);
  useEffect(() => {
    if (data && amountTokenBuy) {
      setLoadingPrice(true);
      setAmountInMax(amountTokenBuy * (1 + slippage / 100));
      setTotalPrice(+amountTokenBuy + +totalFee);
    } else {
      // setAmountInMax(0);
      setLoadingPrice(false);
      setTotalPrice(0);
    }
    setLoadingPrice(false);
  }, [data, slippage, amountTokenBuy, totalFee]);

  const dataFake = {
    dmlAddress: data?.dmlAddress,
    tokenDecimals: "18",
    metadata: {
      image: data?.avatar,
    },
  };

  return (
    <div>
      {isLoading || isFetching ? (
        <div className="grid grid-cols-3 gap-6 mt-4 lg:grid-cols-4">
          <SkeletonItemTransaction />
        </div>
      ) : isSuccess && data?.data?.length > 0 ? (
        <div className="flex flex-col ">
          <NFTGrid data={data} idNFT={idNFT} isSearch setIdNFT={setIdNFT} />
          <div className="w-full mt-4">
            {idNFT.length > 0 && (
              <ul className="text-sm text-shader_200">
                <li className="flex items-center justify-between mb-1">
                  Send:
                  <div className="flex items-center font-bold text-white gap-x-1">
                    <div className="flex items-center font-bold text-white gap-x-1">
                      {isLoadingBuy ? (
                        <p className="rounded-full animate-pulse bg-slate-600 w-16 h-3"></p>
                      ) : (
                        <FormatNumber
                          number={(amountInMax / 1e18).toString()}
                        />
                      )}

                      <EtherIcon width={16} height={16} />
                    </div>
                  </div>
                </li>
                <li className="flex items-center justify-between mb-1">
                  Receive: NFTs
                  <div className="flex items-center font-bold text-white gap-x-1">
                    {idNFT.length}
                    <NFTIcon width={16} height={16} />
                  </div>
                </li>
                <li className="flex items-center justify-between mb-4">
                  Price:
                  <div className="flex items-center font-bold text-white gap-x-1">
                    {isLoadingBuy ? (
                      <p className="rounded-full animate-pulse bg-slate-600 w-20 h-3"></p>
                    ) : (
                      <FormatNumber
                        number={
                          totalPrice
                            ? (totalPrice / 1e18 / idNFT.length).toString()
                            : "0"
                        }
                      />
                    )}

                    <EtherIcon width={16} height={16} />
                  </div>
                </li>
                <li>
                  <div className="relative flex items-center justify-between w-full h-11 pl-2 mb-4 text-base font-semibold rounded-lg bg-primary_500 bg-opacity-10">
                    <div className="">Total Pay</div>
                    <div className="flex items-center px-2 py-1 text-white gap-x-1">
                      {isLoadingBuy ? (
                        <p className="rounded-full animate-pulse bg-slate-600 w-16 h-3"></p>
                      ) : (
                        <FormatNumber number={(totalPrice / 1e18).toString()} />
                      )}
                      <EtherIcon width={16} height={16} />
                    </div>
                  </div>
                </li>
              </ul>
            )}

            {!account ? (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full py-4" primary>
                    Connect Wallet
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[350px] p-0 border-none">
                  <ModalWallet />
                </DialogContent>
              </Dialog>
            ) : (
              <Dialog open={isOpenBuyNFT} onOpenChange={setIsOpenBuyNFT}>
                <DialogTrigger asChild>
                  <Button
                    disabled={
                      idNFT.length === 0 ||
                      isLoadingBuy ||
                      !isSufficientTokenBuy ||
                      Math.floor(amountInMax) === 0
                    }
                    primary={
                      idNFT.length !== 0 &&
                      isSufficientTokenBuy &&
                      Math.floor(amountInMax) !== 0 &&
                      !isLoadingBuy
                    }
                    className="w-full py-4"
                    active={
                      idNFT.length === 0 ||
                      isLoadingBuy ||
                      !isSufficientTokenBuy ||
                      Math.floor(amountInMax) === 0
                    }
                  >
                    BUY {idNFT.length} NFTs
                  </Button>
                </DialogTrigger>
                <DialogContent className="p-0 border-none">
                  <ModalBuyNFT
                    isOpenBuyNFT={isOpenBuyNFT}
                    isOpenTransaction={isOpenTransaction}
                    setIsOpenTransaction={setIsOpenTransaction}
                    tokenAddress={nativeAddress}
                    nftAddress={collectionAddress}
                    idNFT={debouncedIdNFT}
                    routerAddress={routerAddress}
                    /* 
          // @ts-ignore */
                    data={dataFake}
                    setIsOpenBuyNFT={setIsOpenBuyNFT}
                    inputNFT={""}
                    setInputNFT={setIdNFT}
                    setHash={setHash}
                    setIsOpenSuccess={setIsOpenSuccessBuy}
                    setIsOpenError={setIsOpenErrorBuy}
                  />
                </DialogContent>
              </Dialog>
            )}
            {!isSufficientTokenBuy && account && idNFT.length !== 0 && (
              <p className="text-xs text-red" key="Tokenbalance">
                Insufficient Token balance
              </p>
            )}
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
