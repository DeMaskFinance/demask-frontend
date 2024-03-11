import { Button } from "@/components/Buttons";
import MediaNFT from "@/components/Common/MediaNFT";
import { EtherIcon } from "@/components/Icons";
import ModalBuyNFT from "@/components/Modal/ModalBuyNFT";
import { ModalError, ModalSuccess } from "@/components/Modal/ModalTransation";
import { ModalWallet } from "@/components/Modal/ModalWallet";
import SkeletonCategory from "@/components/Skeleton/SkeletonCategory";
import AccountContext from "@/context/AccountContext";
import useAmountInMax from "@/hooks/useAmountInMax";
import useDMLToken from "@/hooks/useDMLToken";
import useInformationToken from "@/hooks/useInformationToken";
import { nftsUserService } from "@/libs/service/profileService";
import ercContract from "@/libs/utils/erc/erc.contract";
import handleApproveNFT from "@/libs/utils/handleApproveNFT";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Fragment, useContext, useEffect, useState } from "react";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
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
  const collectionAddress = "0x286e08EEb3169042585B4838378D21d2c23ded55";
  const [typeERC, setTypeERC] = useQueryParam(
    "typeERC",
    withDefault(StringParam, "")
  );
  const royaltyFee = 0;
  const { balanceToken, bigNumberBalance, allowanceToken } =
    useInformationToken(
      account,
      nativeAddress,
      wallet,
      routerAddress,
      rpc,
      nativeAddress,
      isOpenTransaction
    );
  const fetchDataNFTs = async (
    pageParam = 1,
    chain: string | string[],
    account: string
  ) => {
    const data = await nftsUserService(account, chain, typeERC, pageParam);
    return data.data;
  };

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    isSuccess,
    isLoading,
    isFetching,
  } = useInfiniteQuery(
    ["NFTsUser", chainId, account],
    ({ pageParam = 1 }) => fetchDataNFTs(pageParam, chainId, account),
    {
      getNextPageParam: (page) =>
        page?.currentPage === page?.totalPages
          ? undefined
          : page?.currentPage + 1,
    }
  );
  const dmlToken = useDMLToken(
    account,
    collectionAddress,
    nativeAddress,
    wallet,
    demask.FACTORY_721,
    "",
    isOpenTransaction
  );
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
  console.log(amountBuyDec);

  const hanldeChoiceNFT = (index: number) => {
    const isExist = idNFT.includes(index);
    if (isExist) {
      const arr = idNFT.filter((item) => {
        return item !== index;
      });
      setIdNFT(arr);
    } else {
      setIdNFT([...idNFT, index]);
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
    dmlAddress: dmlToken,
    royaltyFee: royaltyFee,
    tokenDecimals: "18",
  };
  console.log(dmlToken);
  
  return (
    <div>
      {isLoading ? (
        <div className="mt-4">
          <SkeletonCategory />
        </div>
      ) : isSuccess && data?.pages[0]?.data?.length > 0 ? (
        <div className="flex flex-col ">
          <div className="grid grid-cols-3 pb-[34px] gap-6 mt-4 overflow-y-scroll lg:grid-cols-5 md:grid-cols-3 text-dark2 max-h-[400px] lg:max-h-[542px]">
            {data?.pages.map((page: any, pageIndex: number) => (
              <Fragment key={pageIndex}>
                {page?.data?.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="relative overflow-hidden"
                    onClick={() => hanldeChoiceNFT(index)}
                  >
                    <div className="relative items-center p-3 text-sm transition-all border rounded-md cursor-pointer lg:text-base hover:-translate-y-1 hover:shadow-home">
                      <div className="relative h-[78px] lg:h-[100px]">
                        <MediaNFT data={item} isControls={false} hover />
                      </div>
                      <div className="w-full">
                        <div className="flex w-full mt-2">
                          <div className="w-full">
                            {/* <h6
                              title={item.metadata.name}
                              className="flex items-start gap-2 font-medium uppercase"
                            >
                              <span className="flex-wrap max-w-full text-xl line-clamp-1">
                                <ModalDocument data={item.metadata.name} />
                              </span>
                            </h6> */}
                            --
                          </div>
                        </div>
                        <div className="hidden text-sm lg:block ">
                          <p>Floor price</p>
                        </div>
                        <div className="flex justify-between font-semibold text-dark2">
                          {/* <div>
                            <FormatNumber number={item.floorPrice} />
                          </div> */}
                          123
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Fragment>
            ))}
            {data?.pages.map((page: any, pageIndex: number) => (
              <Fragment key={pageIndex}>
                {page?.data?.map((item: any, index: number) => (
                  <div key={index} className="relative overflow-hidden">
                    <div className="relative items-center p-3 text-sm transition-all border rounded-md cursor-pointer lg:text-base hover:-translate-y-1 hover:shadow-home">
                      <div className="relative h-[78px] lg:h-[100px]">
                        <MediaNFT data={item} isControls={false} hover />
                      </div>
                      <div className="w-full">
                        <div className="flex w-full mt-2">
                          <div className="w-full">
                            {/* <h6
                              title={item.metadata.name}
                              className="flex items-start gap-2 font-medium uppercase"
                            >
                              <span className="flex-wrap max-w-full text-xl line-clamp-1">
                                <ModalDocument data={item.metadata.name} />
                              </span>
                            </h6> */}
                            --
                          </div>
                        </div>
                        <div className="hidden text-sm lg:block ">
                          <p>Floor price</p>
                        </div>
                        <div className="flex justify-between font-semibold text-dark2">
                          {/* <div>
                            <FormatNumber number={item.floorPrice} />
                          </div> */}
                          123
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Fragment>
            ))}
          </div>
          <div>
            <ul className="p-2 text-white rounded-lg bg-dark1">
              <li className="flex items-center">
                Send: 1.23{" "}
                <EtherIcon width={18} height={18} className="fill-white" />
              </li>
              <li className="flex items-center">Receive: 1.23 NFTs</li>
              <li className="flex items-center">
                Price: 1.23{" "}
                <EtherIcon width={18} height={18} className="fill-white" />
              </li>
            </ul>
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
                    "0x286e08EEb3169042585B4838378D21d2c23ded55",
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
    </div>
  );
};

export default Buy;
