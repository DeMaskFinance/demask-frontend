import { Button } from "@/components/Buttons";
import FormatNumber from "@/components/Common/FormatNumber";
import { EtherIcon, NFTIcon } from "@/components/Icons";
import ModalBuyNFT from "@/components/Modal/ModalBuyNFT";
import {
  ModalError,
  ModalTransation,
} from "@/components/Modal/ModalTransation";
import { ModalSuccess } from "@/components/Modal/ModalTransation/ModalSuccess";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ModalWallet } from "@/components/Modal/ModalWallet";
import { SkeletonItemTransaction } from "@/components/Skeleton/SkeletonCategory";
import AccountContext from "@/context/AccountContext";
import useAmountInMax from "@/hooks/useAmountInMax";
import useInformationToken from "@/hooks/useInformationToken";
import { fetchDataBuyNFTs } from "@/libs/service/collectionService";
import ercContract from "@/libs/utils/erc/erc.contract";
import handleApproveNFT from "@/libs/utils/handleApproveNFT";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import NFTGrid from "./NFTsGrids";
const Buy = () => {
  const { account, chainId, demask, wallet, slippage } =
    useContext(AccountContext);
  const [isOpenBuyNFT, setIsOpenBuyNFT] = useState<boolean>(false);
  const [isOpenTransaction, setIsOpenTransaction] = useState<boolean>(false);
  const [idNFT, setIdNFT] = useState<number[]>([]);
  const [isOpenSuccessBuy, setIsOpenSuccessBuy] = useState<boolean>(false);
  const [isOpenErrorBuy, setIsOpenErrorBuy] = useState<boolean>(false);
  const [isApprovedNFT, setIsApprovedNFT] = useState<boolean>(false);
  const [amountInMax, setAmountInMax] = useState<number>(0);
  const [hash, setHash] = useState<string>("");
  const [isSufficientTokenBuy, setIsSufficientTokenBuy] =
    useState<boolean>(false);
  const {
    ROUTER_721: routerAddress,
    RPC: rpc,
    NATIVE_ADDRESS: nativeAddress,
  } = demask;
  const router = useRouter();
  const queryErc = (router.query.erc as string) || "";
  const collectionAddress = queryErc.split("&")[0] || "";
  const { bigNumberBalance } = useInformationToken(
    account,
    nativeAddress,
    wallet,
    routerAddress,
    rpc,
    nativeAddress,
    chainId,
    isOpenTransaction
  );
  const { isLoading, data, isSuccess, refetch, isFetching } = useQuery({
    queryKey: ["collectionNFTBUY", chainId, collectionAddress],
    queryFn: async () => {
      const res = await fetchDataBuyNFTs(collectionAddress, chainId);
      return res;
    },
  });
  useEffect(() => {
    const checkApproveNFT = async () => {
      const result = await ercContract.approveNFT(
        account,
        wallet,
        collectionAddress,
        routerAddress
      );
      setIsApprovedNFT(result);
    };
    checkApproveNFT();
  }, [account, collectionAddress, wallet, isOpenTransaction]);

  const dmlToken = data?.dmlAddress;
  const { amountTokenBuy, isLoadingBuy } = useAmountInMax(
    "",
    dmlToken,
    nativeAddress,
    collectionAddress,
    idNFT,
    wallet,
    account,
    rpc,
    routerAddress,
    true
  );

  useEffect(() => {
    if (Number(amountInMax) > Number(bigNumberBalance)) {
      setIsSufficientTokenBuy(false);
    } else {
      setIsSufficientTokenBuy(true);
    }
  }, [account, amountInMax, data, isOpenBuyNFT]);
  useEffect(() => {
    if (data && amountTokenBuy) {
      setAmountInMax(amountTokenBuy * (1 + slippage / 100));
    } else {
      setAmountInMax(0);
    }
  }, [data, slippage, amountTokenBuy]);
  const handleChoiceNFT = (item: any) => {
    const isExist = idNFT.includes(Number(item.nftID));
    if (isExist) {
      const arr = idNFT.filter((itemArr) => {
        return itemArr !== Number(item.nftID);
      });
      setIdNFT(arr);
    } else {
      setIdNFT([...idNFT, Number(item.nftID)]);
    }
  };

  const handleBuy = () => {
    setIsOpenBuyNFT(true);
    document.body.style.overflowY = "hidden";
  };
  const dataFake = {
    dmlAddress: data?.dmlAddress,
    tokenDecimals: "18",
  };
  console.log(data, idNFT, amountTokenBuy);

  return (
    <div>
      {isLoading ? (
        <div className="grid grid-cols-3 gap-6 mt-4 lg:grid-cols-4">
          <SkeletonItemTransaction />
        </div>
      ) : isSuccess && data?.data?.length > 0 ? (
        <div className="flex flex-col ">
          <NFTGrid
            data={data}
            isFetching={isFetching}
            handleChoiceNFT={handleChoiceNFT}
            idNFT={idNFT}
            isSearch
          />
          <div className="w-full mt-4">
            {idNFT.length > 0 && (
              <ul className="text-sm text-shader_200">
                <li className="flex items-center justify-between mb-1">
                  Send:
                  <div className="flex items-center font-bold text-white gap-x-1">
                    <FormatNumber number={(amountInMax / 1e18).toString()} />{" "}
                    <EtherIcon width={16} height={16} />
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
                    <FormatNumber number={(amountTokenBuy / 1e18).toString()} />{" "}
                    <EtherIcon width={16} height={16} />
                  </div>
                </li>
                <li>
                  <div className="relative flex items-center justify-between w-full h-11 pl-2 mb-4 text-base font-semibold rounded-lg bg-primary_500 bg-opacity-10">
                    <div className="">Total Pay</div>
                    <div className="flex items-center px-2 py-1 text-white gap-x-1">
                      <FormatNumber
                        number={(amountTokenBuy / 1e18).toString()}
                      />{" "}
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
            ) : !isApprovedNFT ? (
              <Button
                className="w-full py-4"
                primary
                onClick={() =>
                  handleApproveNFT(
                    account,
                    wallet,
                    collectionAddress,
                    setIsOpenTransaction,
                    routerAddress
                  )
                }
              >
                Approve NFT
              </Button>
            ) : (
              <Button
                disabled={
                  idNFT.length === 0 ||
                  !isSufficientTokenBuy ||
                  Math.floor(amountInMax) === 0
                }
                primary={
                  idNFT.length !== 0 &&
                  isSufficientTokenBuy &&
                  Math.floor(amountInMax) !== 0
                }
                className="w-full py-4"
                active={
                  idNFT.length === 0 ||
                  !isSufficientTokenBuy ||
                  Math.floor(amountInMax) === 0
                }
                onClick={handleBuy}
              >
                BUY {idNFT.length} NFTs
              </Button>
            )}
            {!isSufficientTokenBuy && account && (
              <p className="text-xs text-red" key="Tokenbalance">
                Insufficient Token balance
              </p>
            )}
          </div>
        </div>
      ) : (
        <p className="mt-4">No data available.</p>
      )}
      {data && account && (
        <ModalBuyNFT
          isOpenBuyNFT={isOpenBuyNFT}
          isOpenTransaction={isOpenTransaction}
          setIsOpenTransaction={setIsOpenTransaction}
          tokenAddress={nativeAddress}
          nftAddress={collectionAddress}
          idNFT={idNFT}
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
        isTransaction={true}
      />
    </div>
  );
};

export default Buy;
