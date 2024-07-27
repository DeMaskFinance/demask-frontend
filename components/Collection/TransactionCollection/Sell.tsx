import { Button } from "@/components/Buttons";
import FormatNumber from "@/components/Common/FormatNumber";
import { EtherIcon, NFTIcon } from "@/components/Icons";
import ModalSellNFT from "@/components/Modal/ModalSellNFT";
import {
  ModalError,
  ModalTransation,
} from "@/components/Modal/ModalTransation";
import { ModalSuccess } from "@/components/Modal/ModalTransation/ModalSuccess";
import { ModalWallet } from "@/components/Modal/ModalWallet";
import { SkeletonItemTransaction } from "@/components/Skeleton/SkeletonCategory";
import AccountContext from "@/context/AccountContext";
import useAmountOutMin from "@/hooks/useAmountOutMin";
import useDMLToken from "@/hooks/useDMLToken";
import useFee from "@/hooks/useFee";
import { fetchDataSellNFTs } from "@/libs/service/collectionService";
import ercContract from "@/libs/utils/erc/erc.contract";
import handleApproveNFT from "@/libs/utils/handleApproveNFT";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Fragment, useContext, useEffect, useState } from "react";
import NFTGrid from "./NFTsGrids";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import useDebounce from "@/hooks/useDebounce";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import { erc721TradingSell } from "@/libs/service/tradeService";
import { StaticDetailSell } from "@/components/Trade/TradeTransaction/StaticDetail";
import useCheckApproveNFT from "@/hooks/useCheckApproveNFT";
import { queryClient } from "@/libs/constants";
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
  const { data, isSuccess, isLoading, isFetching } = useQuery({
    queryKey: ["collectionNFTSell", chainId, collectionAddress, account],
    queryFn: async () => {
      const res = await fetchDataSellNFTs(collectionAddress, chainId, account);
      return res;
    },
  });
  const debouncedIdNFT = useDebounce(idNFT, 1000);
  const contracts = queryClient.getQueryData<ContractAddresses>([
    "contracts",
    chainId,
  ]);
  const isApprovedNFT = useCheckApproveNFT(
    account,
    wallet,
    collectionAddress,
    contracts?.ERC721_ROUTER_ADDRESS || "",
    isOpenTransaction
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
    ],
    queryFn: async () => {
      const res = await erc721TradingSell(
        collectionAddress,
        chainId,
        debouncedIdNFT.length,
        slippage
      );
      return res.data;
    },
  });
  const dataFake = {
    dmlAddress: data?.dmlAddress,
    tokenDecimals: "18",
    metadata: {
      image: data?.avatar,
    },
  };
  return (
    <Fragment>
      {account ? (
        <Fragment>
          {isLoading || isFetching ? (
            <div className="grid grid-cols-3 gap-6 mt-4 lg:grid-cols-4">
              <SkeletonItemTransaction />
            </div>
          ) : isSuccess && data?.data?.length > 0 ? (
            <div className="flex flex-col ">
              <NFTGrid data={data} setIdNFT={setIdNFT} idNFT={idNFT} isSearch />
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
                        wallet,
                        collectionAddress,
                        setIsOpenTransaction,
                        contracts.ERC721_ROUTER_ADDRESS
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
