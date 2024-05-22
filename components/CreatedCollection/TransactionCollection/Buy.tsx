import { Button } from "@/components/Buttons";
import FormatNumber from "@/components/Common/FormatNumber";
import { EtherIcon } from "@/components/Icons";
import ModalBuyNFT from "@/components/Modal/ModalBuyNFT";
import {
  ModalError,
  ModalTransation,
} from "@/components/Modal/ModalTransation";
import { ModalSuccess } from "@/components/Modal/ModalTransation/ModalSuccess";
import { ModalWallet } from "@/components/Modal/ModalWallet";
import { SkeletonItemTransaction } from "@/components/Skeleton/SkeletonCategory";
import AccountContext from "@/context/AccountContext";
import useAmountInMax from "@/hooks/useAmountInMax";
import useInformationToken from "@/hooks/useInformationToken";
import { fetchDataBuyNFTs } from "@/libs/service/collectionService";
import ercContract from "@/libs/utils/erc/erc.contract";
import handleApproveNFT from "@/libs/utils/handleApproveNFT";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import NFTGrid from "./NFTsGrids";
const Buy = () => {
  const { account, chainId, demask, wallet, slippage } =
    useContext(AccountContext);
  const [isOpenBuyNFT, setIsOpenBuyNFT] = useState<boolean>(false);
  const [isOpenTransaction, setIsOpenTransaction] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [idNFT, setIdNFT] = useState<number[]>([]);
  const [isOpenSuccessBuy, setIsOpenSuccessBuy] = useState<boolean>(false);
  const [isOpenErrorBuy, setIsOpenErrorBuy] = useState<boolean>(false);
  const [isApprovedNFT, setIsApprovedNFT] = useState<boolean>(false);
  const [hash, setHash] = useState<string>("");
  const [isSufficientTokenBuy, setIsSufficientTokenBuy] =
    useState<boolean>(false);
  const {
    ROUTER_721: routerAddress,
    RPC: rpc,
    NATIVE_ADDRESS: nativeAddress,
  } = demask;
  const collectionAddress = useRouter().query.collection as string;
  const { ref, inView } = useInView();
  const { bigNumberBalance } = useInformationToken(
    account,
    nativeAddress,
    wallet,
    routerAddress,
    rpc,
    nativeAddress,
    isOpenTransaction
  );

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isSuccess,
    isLoading,
    isFetching,
  } = useInfiniteQuery(
    ["collectionNFTBUY", chainId, collectionAddress],
    ({ pageParam = 1 }) =>
      fetchDataBuyNFTs(collectionAddress, pageParam, chainId),
    {
      getNextPageParam: (page) =>
        page?.currentPage === page?.totalPages
          ? undefined
          : page?.currentPage + 1,
    }
  );
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);
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
  const dmlToken = data?.pages[0]?.dmlAddress;
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
  console.log(amountTokenBuy);

  useEffect(() => {
    if (Number(amountTokenBuy) > Number(bigNumberBalance)) {
      setIsSufficientTokenBuy(false);
    } else {
      setIsSufficientTokenBuy(true);
    }
  }, [account, amountTokenBuy, data, isOpenBuyNFT]);

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
  const handleOpen = () => {
    document.body.style.overflowY = "hidden";
    setIsOpen(true);
  };
  const dataFake = {
    dmlAddress: data?.pages[0]?.dmlAddress,
    tokenDecimals: "18",
  };

  return (
    <div>
      {isLoading ? (
        <div className="grid grid-cols-3 gap-6 mt-4 lg:grid-cols-4">
          <SkeletonItemTransaction />
        </div>
      ) : isSuccess && data?.pages[0]?.data?.length > 0 ? (
        <div className="flex flex-col ">
          <NFTGrid
            data={data}
            isFetching={isFetching}
            hasNextPage={hasNextPage}
            ref={ref}
            handleChoiceNFT={handleChoiceNFT}
            idNFT={idNFT}
          />
          <div className="absolute bottom-0 w-full">
            {idNFT.length > 0 && (
              <ul className="flex flex-wrap px-4 py-2 text-sm bg-dark5 text-dark2 gap-x-4 area_input dark:text-dark3">
                <li className="flex items-center">
                  Send:
                  <FormatNumber
                    number={(amountTokenBuy / 1e18).toString()}
                  />{" "}
                  <EtherIcon width={18} height={18} className="fill-dark2" />
                </li>
                <li className="flex items-center">
                  Receive: {idNFT.length} NFTs
                </li>
                <li className="flex items-center">
                  Price:
                  <FormatNumber
                    number={(amountTokenBuy / 1e18).toString()}
                  />{" "}
                  <EtherIcon width={18} height={18} className="fill-dark2" />
                </li>
              </ul>
            )}

            {!account ? (
              <Button className="w-full py-2" primary onClick={handleOpen}>
                CONNECT WALLET
              </Button>
            ) : !isApprovedNFT ? (
              <Button
                className="w-full py-2"
                primary
                onClick={() =>
                  handleApproveNFT(
                    account,
                    wallet,
                    collectionAddress,
                    setIsOpen,
                    setIsOpenTransaction,
                    routerAddress
                  )
                }
              >
                APPROVE NFT
              </Button>
            ) : (
              <Button
                disabled={
                  idNFT.length === 0 ||
                  !isSufficientTokenBuy ||
                  Math.floor(amountTokenBuy) === 0
                }
                primary={
                  idNFT.length !== 0 &&
                  isSufficientTokenBuy &&
                  Math.floor(amountTokenBuy) !== 0
                }
                className="w-full py-4"
                active={
                  idNFT.length === 0 ||
                  !isSufficientTokenBuy ||
                  Math.floor(amountTokenBuy) === 0
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
      <ModalWallet isOpen={isOpen} setIsOpen={setIsOpen} />
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
