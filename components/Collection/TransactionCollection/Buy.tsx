import { Button } from "@/components/Buttons";
import ModalBuyNFT from "@/components/Modal/ModalBuyNFT";
import {
  ModalError,
  ModalTransation,
} from "@/components/Modal/ModalTransation";
import { ModalSuccess } from "@/components/Modal/ModalTransation/ModalSuccess";
import { ModalWallet } from "@/components/Modal/ModalWallet";
import { SkeletonItemTransaction } from "@/components/Skeleton/SkeletonCategory";
import { StaticDetailBuy } from "@/components/Trade/TradeTransaction/StaticDetail";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AccountContext from "@/context/AccountContext";
import useDebounce from "@/hooks/useDebounce";
import { fetchDataBuyNFTs } from "@/libs/service/collectionService";
import { erc721TradingBuy } from "@/libs/service/tradeService";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import NFTGrid from "./NFTsGrids";
import { queryClient } from "@/libs/constants";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import useInformationToken from "@/hooks/useInformationToken";
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
  const collectionAddress = (router.query.erc as string) || "";
  const debouncedIdNFT = useDebounce(idNFT, 1500);
  const [version] = useQueryParam("version", withDefault(StringParam, "v1"));
  const { bigNumberBalance } = useInformationToken(account, wallet, chainId);
  const { isLoading, data, isSuccess, refetch, isFetching } = useQuery({
    queryKey: ["collectionNFTBUY", chainId, collectionAddress, version],
    queryFn: async () => {
      const res = await fetchDataBuyNFTs(collectionAddress, chainId, version);
      return res;
    },
  });
  const contracts = queryClient.getQueryData<ContractAddresses>([
    "contracts",
    chainId,
    version,
  ]);

  const { data: data721Trading, isFetching: isFetching721Trading } =
    useQuery<DataBuy>({
      queryKey: [
        "721TradingBuy",
        chainId,
        collectionAddress,
        slippage,
        debouncedIdNFT,
        version,
      ],
      queryFn: async () => {
        const res = await erc721TradingBuy(
          collectionAddress,
          chainId,
          debouncedIdNFT.length,
          slippage,
          version
        );
        return res.data;
      },
    });

  useEffect(() => {
    if (Number(data721Trading?.maxAmountDecimals) > Number(bigNumberBalance)) {
      setIsSufficientTokenBuy(false);
    } else {
      setIsSufficientTokenBuy(true);
    }
  }, [account, data721Trading, bigNumberBalance]);

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
              <StaticDetailBuy
                data={data721Trading}
                inputNFTValue={idNFT.length}
                isFetching={isFetching721Trading}
              />
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
                      isFetching ||
                      !isSufficientTokenBuy ||
                      data721Trading?.maxAmountDecimals === 0
                    }
                    primary={
                      idNFT.length !== 0 &&
                      isSufficientTokenBuy &&
                      data721Trading?.maxAmountDecimals !== 0 &&
                      !isFetching
                    }
                    className="w-full py-4"
                    active={
                      idNFT.length === 0 ||
                      isFetching ||
                      !isSufficientTokenBuy ||
                      data721Trading?.maxAmountDecimals === 0
                    }
                  >
                    BUY {idNFT.length} NFTs
                  </Button>
                </DialogTrigger>
                <DialogContent className="p-0 border-none">
                  {data721Trading && contracts && (
                    <ModalBuyNFT
                      isOpenBuyNFT={isOpenBuyNFT}
                      isOpenTransaction={isOpenTransaction}
                      setIsOpenTransaction={setIsOpenTransaction}
                      tokenAddress={contracts.WETH_ADDRESS}
                      nftAddress={collectionAddress}
                      idNFT={debouncedIdNFT}
                      routerAddress={contracts.ERC721_ROUTER_ADDRESS}
                      /* 
          // @ts-ignore */
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
