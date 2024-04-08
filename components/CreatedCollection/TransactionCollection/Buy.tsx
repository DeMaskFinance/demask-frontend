import { Button } from "@/components/Buttons";
import FormatNumber from "@/components/Common/FormatNumber";
import MediaNFT from "@/components/Common/MediaNFT";
import { EtherIcon } from "@/components/Icons";
import ModalBuyNFT from "@/components/Modal/ModalBuyNFT";
import ModalDocument from "@/components/Modal/ModalLength/ModalDocument";
import {
  ModalError,
  ModalSuccess,
  ModalTransation,
} from "@/components/Modal/ModalTransation";
import { ModalWallet } from "@/components/Modal/ModalWallet";
import {
  SkeletonCategory,
  SkeletonItemTransaction,
  SkeletonSubCategory,
} from "@/components/Skeleton/SkeletonCategory";
import AccountContext from "@/context/AccountContext";
import useAmountInMax from "@/hooks/useAmountInMax";
import useInformationToken from "@/hooks/useInformationToken";
import { collectionListBuy } from "@/libs/service/collectionService";
import ercContract from "@/libs/utils/erc/erc.contract";
import handleApproveNFT from "@/libs/utils/handleApproveNFT";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Fragment, useContext, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
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
  const [amountBuyDec, setAmountBuyDec] = useState<number>(0);
  const [hash, setHash] = useState<string>("");
  const [totalProcessBuy, setTotalProcessBuy] = useState<number>(0);
  const [isSufficientTokenBuy, setIsSufficientTokenBuy] =
    useState<boolean>(false);
  const {
    ROUTER_721: routerAddress,
    RPC: rpc,
    NATIVE_ADDRESS: nativeAddress,
  } = demask;
  const collectionAddress = useRouter().query.collection as string;
  const { ref, inView } = useInView();
  const royaltyFee = 0;
  const { bigNumberBalance } = useInformationToken(
    account,
    nativeAddress,
    wallet,
    routerAddress,
    rpc,
    nativeAddress,
    isOpenTransaction
  );
  const fetchDataNFTs = async (
    collectionAddress: string,
    pageParam = 1,
    chain: string | string[]
  ) => {
    const data = await collectionListBuy(
      collectionAddress,
      chain,
      pageParam,
      10
    );
    return data.data;
  };

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
    ({ pageParam = 1 }) => fetchDataNFTs(collectionAddress, pageParam, chainId),
    {
      getNextPageParam: (page) =>
        page?.currentPage === page?.totalPages
          ? undefined
          : page?.currentPage + 1,
    }
  );
  console.log(data);
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
  const { amountTokenBuy, isLoadingBuy, feeTradingBuy } = useAmountInMax(
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
    if (Number(amountBuyDec.toFixed()) > Number(bigNumberBalance)) {
      setIsSufficientTokenBuy(false);
    } else {
      setIsSufficientTokenBuy(true);
    }
  }, [account, amountBuyDec, data, isOpenBuyNFT]);
  useEffect(() => {
    if (data && amountTokenBuy) {
      setAmountBuyDec(
        amountTokenBuy * (1 + slippage / 100) +
          (amountTokenBuy * Number(royaltyFee)) / 100
      );
      setTotalProcessBuy(
        Number(amountTokenBuy) + (amountTokenBuy * Number(royaltyFee)) / 100
      );
    } else {
      setAmountBuyDec(0);
      setTotalProcessBuy(0);
    }
  }, [data, slippage, amountTokenBuy]);

  const hanldeChoiceNFT = (item: any) => {
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
    royaltyFee: royaltyFee,
    tokenDecimals: "18",
  };

  return (
    <div>
      {isLoading ? (
        <div className="grid grid-cols-3 gap-6 mt-4 lg:grid-cols-5">
          <SkeletonItemTransaction />
        </div>
      ) : isSuccess && data?.pages[0]?.data?.length > 0 ? (
        <div className="flex flex-col ">
          <div className="grid grid-cols-3 pb-[34px] gap-6 mt-4 overflow-y-scroll lg:grid-cols-5 md:grid-cols-3 text-dark2 max-h-[400px] lg:max-h-[542px]">
            {data?.pages.map((page: any, pageIndex: number) => (
              <Fragment key={pageIndex}>
                {page?.data?.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="relative"
                    onClick={() => hanldeChoiceNFT(item)}
                  >
                    <div
                      className={`relative items-center p-3 text-sm transition-all border rounded-md cursor-pointer lg:text-base hover:-translate-y-1 hover:shadow-home ${
                        idNFT.includes(Number(item.nftID))
                          ? "border-secondary5"
                          : ""
                      }`}
                    >
                      <div className="relative h-[78px] lg:h-[100px]">
                        <MediaNFT data={item} isControls={false} hover />
                      </div>
                      <div className="w-full">
                        <div className="flex w-full mt-2">
                          <div className="w-full">
                            <h6
                              title={item.metadata.name}
                              className="flex items-start gap-2 font-semibold uppercase"
                            >
                              <span className="flex-wrap max-w-full text-sm line-clamp-1">
                                <ModalDocument data={item.metadata.name} />
                              </span>
                            </h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Fragment>
            ))}
            {isFetching && hasNextPage && <SkeletonItemTransaction />}
            <div ref={ref} style={{ height: "1px" }}></div>
          </div>
          <div className="absolute bottom-0 w-full">
            {idNFT.length > 0 && (
              <ul className="flex flex-wrap px-4 py-2 text-sm bg-dark5 text-dark2 gap-x-4">
                <li className="flex items-center">
                  Send:
                  <FormatNumber
                    number={(amountBuyDec / 1e18).toString()}
                  />{" "}
                  <EtherIcon width={18} height={18} className="fill-white" />
                </li>
                <li className="flex items-center">
                  Receive: {idNFT.length} NFTs
                </li>
                <li className="flex items-center">
                  Price:
                  <FormatNumber
                    number={(amountTokenBuy / 1e18).toString()}
                  />{" "}
                  <EtherIcon width={18} height={18} className="fill-white" />
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
                  Math.floor(amountBuyDec) === 0
                }
                primary={
                  idNFT.length !== 0 ||
                  isSufficientTokenBuy ||
                  Math.floor(amountBuyDec) !== 0
                }
                className="w-full py-4"
                active
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
