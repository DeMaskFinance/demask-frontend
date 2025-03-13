import { Button } from "@/components/Buttons";
import ModalSellNFT from "@/components/Modal/ModalSellNFT";
import {
  ModalError,
  ModalTransation,
} from "@/components/Modal/ModalTransation";
import { ModalSuccess } from "@/components/Modal/ModalTransation/ModalSuccess";
import { ModalWallet } from "@/components/Modal/ModalWallet";
import { SkeletonItemTransaction } from "@/components/Skeleton/SkeletonCategory";
import { StaticDetailSell } from "@/components/Trade/TradeTransaction/StaticDetail";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AccountContext from "@/context/AccountContext";
import useCheckApproveNFT from "@/hooks/useCheckApproveNFT";
import useDebounce from "@/hooks/useDebounce";
import { queryClient } from "@/libs/constants";
import { fetchDataSellNFTs } from "@/libs/service/collectionService";
import { erc721TradingSell } from "@/libs/service/tradeService";
import useApproveNFT from "@/libs/utils/handleApproveNFT";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Fragment, useContext, useState } from "react";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import NFTGrid from "./NFTsGrids";
import { BsExclamationOctagon } from "react-icons/bs";

const Sell = () => {
  const { account, chainId, demask, wallet, slippage } =
    useContext(AccountContext);
  const [isOpenSellNFT, setIsOpenSellNFT] = useState<boolean>(false);
  const [isOpenTransaction, setIsOpenTransaction] = useState<boolean>(false);
  const [idNFT, setIdNFT] = useState<number[]>([]);
  const [isOpenSuccessSell, setIsOpenSuccessSell] = useState<boolean>(false);
  const [isOpenErrorSell, setIsOpenErrorSell] = useState<boolean>(false);
  const [hash, setHash] = useState<string>("");
  const router = useRouter();
  const collectionAddress = (router.query.erc as string) || "";
  const [version] = useQueryParam("version", withDefault(StringParam, "v1"));
  const { data, isSuccess, isLoading, isFetching } = useQuery({
    queryKey: [
      "collectionNFTSell",
      chainId,
      collectionAddress,
      account,
      version,
    ],
    queryFn: async () => {
      const res = await fetchDataSellNFTs(
        collectionAddress,
        chainId,
        account,
        version,
        1,
        500
      );
      return res;
    },
  });

  console.log(data)

  const debouncedIdNFT = useDebounce(idNFT, 1000);
  const contracts = queryClient.getQueryData<ContractAddresses>([
    "contracts",
    chainId,
    version,
  ]);


  const { isApprovedNFT, loading, refetch } = useCheckApproveNFT(
    account,
    collectionAddress,
    contracts?.ERC721_ROUTER_ADDRESS || "",
    "erc721"
  );
  const {
    isLoading: isLoading721Trading,
    data: data721Trading,
    isFetching: isFetching721Trading,
  } = useQuery<DataSell>({
    queryKey: [
      "721TradingSell",
      chainId,
      collectionAddress,
      slippage,
      debouncedIdNFT,
      version,
    ],
    queryFn: async () => {
      const res = await erc721TradingSell(
        collectionAddress,
        chainId,
        debouncedIdNFT.length,
        slippage,
        version
      );
      return res.data;
    },
  });
  const dataFake = {
    dmlAddress: data?.data?.[0]?.dmlAddress,
    tokenDecimals: "18",
    metadata: {
      image: data?.data?.[0]?.avatar,
    },
  };

  const { handleApproveNFT } = useApproveNFT();

  return (
    <Fragment>
      {account ? (
        <Fragment>

          {data &&
            <div className="flex items-center justify-between w-full pb-2 pt-4">
              <p className="text-xs text-[#F9BE76] flex gap-1 items-center">
                <BsExclamationOctagon className="inline-block" />
                The maximum transaction limit's 500 NFTs.</p>
              <p className="text-white text-sm font-semibold">{data?.data?.length}/{data?.totalRecords}</p>
            </div>
          }

          {isLoading || isFetching ? (
            <div className="grid grid-cols-3 gap-6 mt-4 lg:grid-cols-4">
              <SkeletonItemTransaction />
            </div>
          ) : isSuccess && data?.data?.length > 0 ? (
            <div className="flex flex-col ">
              <NFTGrid data={data?.data} setIdNFT={setIdNFT} idNFT={idNFT} isSearch />
              <div className="w-full mt-4">
                {idNFT.length > 0 && (
                  <StaticDetailSell
                    data={data721Trading}
                    inputNFTValue={debouncedIdNFT.length}
                    isFetching={isFetching721Trading}
                  />
                )}
                {!isApprovedNFT && contracts ? (
                  <Button
                    className="w-full py-4"
                    primary
                    onClick={() =>
                      handleApproveNFT(
                        account,
                        collectionAddress,
                        setIsOpenTransaction,
                        contracts.ERC721_ROUTER_ADDRESS,
                        "erc721",
                        refetch

                      )
                    }
                  >
                    Approve NFT
                  </Button>
                ) : (
                  <Dialog open={isOpenSellNFT} onOpenChange={setIsOpenSellNFT}>
                    <DialogTrigger asChild>
                      <Button
                        disabled={
                          idNFT.length === 0 ||
                          data721Trading?.minAmount === 0 ||
                          isFetching721Trading
                        }
                        primary={
                          idNFT.length !== 0 &&
                          data721Trading?.minAmount !== 0 &&
                          !isFetching721Trading
                        }
                        className="w-full py-4"
                        active={
                          idNFT.length === 0 ||
                          data721Trading?.minAmount === 0 ||
                          isFetching721Trading
                        }
                      >
                        SELL {idNFT.length} NFTs
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="p-0 border-none ">
                      {data721Trading && contracts && (
                        <ModalSellNFT
                          isOpenSellNFT={isOpenSellNFT}
                          isOpenTransaction={isOpenTransaction}
                          setIsOpenTransaction={setIsOpenTransaction}
                          tokenAddress={contracts.WETH_ADDRESS}
                          nftAddress={collectionAddress}
                          idNFT={debouncedIdNFT}
                          routerAddress={contracts.ERC721_ROUTER_ADDRESS}
                          /* 
          // @ts-ignore */
                          data={dataFake}
                          dataSell={data721Trading}
                          setIsOpenSellNFT={setIsOpenSellNFT}
                          inputNFT={""}
                          setInputNFT={setIdNFT}
                          setHash={setHash}
                          setIsOpenSuccess={setIsOpenSuccessSell}
                          setIsOpenError={setIsOpenErrorSell}
                        />
                      )}
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          ) : (
            <p className="mt-4">No data available.</p>
          )}
        </Fragment>
      ) : (
        <Dialog>
          <DialogTrigger asChild>
            <Button className="absolute bottom-0 w-full py-2" primary>
              Connect Wallet
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[350px] p-0 border-none">
            <ModalWallet />
          </DialogContent>
        </Dialog>
      )}
      <ModalTransation
        isOpenTransation={isOpenTransaction}
        setIsOpenTransaction={setIsOpenTransaction}
      />
      <ModalSuccess
        isOpenSuccess={isOpenSuccessSell}
        transactionHash={hash}
        type="Sell NFT"
        setIsOpenSuccess={setIsOpenSuccessSell}
      />
      <ModalError
        isOpenError={isOpenErrorSell}
        transactionHash={hash}
        type="Sell NFT"
        setIsOpenError={setIsOpenErrorSell}
      />
    </Fragment>
  );
};

export default Sell;
