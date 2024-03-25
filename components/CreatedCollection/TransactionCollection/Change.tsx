import { Button } from "@/components/Buttons";
import MediaNFT from "@/components/Common/MediaNFT";
import { LightBulbIcon } from "@/components/Icons";
import ModalDocument from "@/components/Modal/ModalLength/ModalDocument";
import { ModalError, ModalSuccess, ModalTransation } from "@/components/Modal/ModalTransation";
import { ModalWallet } from "@/components/Modal/ModalWallet";
import { SkeletonCategory, SkeletonItemTransaction } from "@/components/Skeleton/SkeletonCategory";
import AccountContext from "@/context/AccountContext";
import useAmountInMax from "@/hooks/useAmountInMax";
import useInformationToken from "@/hooks/useInformationToken";
import { getProvider } from "@/libs/connection/getProvider";
import {
  collectionListBuy,
  collectionListSell,
} from "@/libs/service/collectionService";
import { exponentialToDecimal } from "@/libs/utils/convertExponential";
import ercContract from "@/libs/utils/erc/erc.contract";
import ercContract721 from "@/libs/utils/erc/erc721.contract";
import handleApproveNFT from "@/libs/utils/handleApproveNFT";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

const Change = () => {
  const { account, chainId, demask, wallet, slippage, txDeadline } =
    useContext(AccountContext);
  const [idNFTInput, setIdNFTInput] = useState<number[]>([]);
  const [idNFTOutput, setIdNFTOutput] = useState<number[]>([]);
  const [isApprovedNFT, setIsApprovedNFT] = useState<boolean>(false);
  const [isOpenTransaction, setIsOpenTransaction] = useState<boolean>(false);
  const [hash, setHash] = useState<string>("");
  const [isOpenSuccessSwap, setIsOpenSuccessSwap] = useState<boolean>(false);
  const [isOpenErrorSwap, setIsOpenErrorSwap] = useState<boolean>(false);
  const collectionAddress = useRouter().query.created as string;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenSwapNFT, setIsOpenSwapNFT] = useState<boolean>(false);
  const [isSufficientToken, setIsSufficientToken] = useState<boolean>(false);
  const {
    ROUTER_721: routerAddress,
    RPC: rpc,
    NATIVE_ADDRESS: nativeAddress,
  } = demask;
  const { ref, inView } = useInView();
  const { ref:refOutput, inView :inViewOutput} = useInView();
  const { balanceToken, bigNumberBalance } = useInformationToken(
    account,
    nativeAddress,
    wallet,
    routerAddress,
    rpc,
    nativeAddress,
    isOpenTransaction
  );
  //data Input
  const fetchDataNFTsInput = async (
    collectionAddress: string,
    pageParam = 1,
    chain: string | string[],
    account: string
  ) => {
    const data = await collectionListSell(
      account,
      collectionAddress,
      chain,
      pageParam,
      10
    );
    return data.data;
  };
  const {
    data: inputData,
    fetchNextPage: fetchNextInputPage,
    isFetchingNextPage: isFetchingNextInputPage,
    isSuccess: isInputDataSuccess,
    isLoading: isInputDataLoading,
    isFetching: isInputDataFetching,
  } = useInfiniteQuery(
    ["collectionNFTSell", chainId, account, collectionAddress],
    ({ pageParam = 1 }) =>
      fetchDataNFTsInput(collectionAddress, pageParam, chainId, account),
    {
      getNextPageParam: (page) =>
        page?.currentPage === page?.totalPages
          ? undefined
          : page?.currentPage + 1,
    }
  );
  useEffect(() => {
    if (inView) {
      fetchNextInputPage();
    }
  }, [inView]);
  //Data output
  const fetchDataNFTsOutput = async (
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
    isSuccess,
    isLoading,
    isFetching,
    hasNextPage
  } = useInfiniteQuery(
    ["collectionNFTBUY", chainId, collectionAddress],
    ({ pageParam = 1 }) =>
      fetchDataNFTsOutput(collectionAddress, pageParam, chainId),
    {
      getNextPageParam: (page) =>
        page?.currentPage === page?.totalPages
          ? undefined
          : page?.currentPage + 1,
    }
  );
  useEffect(() => {
    if (inViewOutput) {
      fetchNextPage();
    }
  }, [inViewOutput]);
  const { amountTokenBuy } = useAmountInMax(
    "",
    "0x2d4c46bac8817558f80b4219a6e5020d5f78672b",
    nativeAddress,
    collectionAddress,
    idNFTInput,
    wallet,
    account,
    rpc,
    routerAddress,
    true
  );
  useEffect(() => {
    if (Number(amountTokenBuy) > Number(bigNumberBalance)) {
      setIsSufficientToken(false);
    } else {
      setIsSufficientToken(true);
    }
  }, [account, amountTokenBuy, data, bigNumberBalance]);

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
  const hanldeChoiceNFTInput = (item: any) => {
    const isExist = idNFTInput.includes(Number(item.nftID));
    if (isExist) {
      const arr = idNFTInput.filter((itemArr) => {
        return itemArr !== Number(item.nftID);
      });
      setIdNFTInput(arr);
    } else {
      setIdNFTInput([...idNFTInput, Number(item.nftID)]);
    }
  };
  const hanldeChoiceNFTOutput = (item: any) => {
    const isExist = idNFTOutput.includes(Number(item.nftID));
    if (isExist) {
      const arr = idNFTOutput.filter((itemArr) => {
        return itemArr !== Number(item.nftID);
      });
      setIdNFTOutput(arr);
    } else {
      setIdNFTOutput([...idNFTOutput, Number(item.nftID)]);
    }
  };
  const handleOpen = () => {
    document.body.style.overflowY = "hidden";
    setIsOpen(true);
  };
  const handleSwap = async () => {
    // setIsOpenSwapNFT(true);
    // document.body.style.overflowY = "hidden";
    try {
      setIsOpenTransaction(true);
      const result = await ercContract721.swapERC20ERC721(
        wallet,
        collectionAddress,
        nativeAddress,
        idNFTInput,
        idNFTOutput,
        routerAddress,
        account,
        txDeadline,
        exponentialToDecimal(Math.floor(amountTokenBuy))
      );
      const check = await result.wait();
      setHash(result.hash);
      setIsOpenTransaction(false);
      setIdNFTInput([]);
      setIdNFTOutput([]);
      if (check.status === 1) {
        setIsOpenSuccessSwap(true);
      } else {
        setIsOpenErrorSwap(true);
      }
    } catch (error) {
      setIsOpenTransaction(false);
      console.error(error);
    }
  };
  return (
    <div>
      <div className="flex px-6 py-4 my-4 text-sm rounded-lg bg-dark5 text-dark3 gap-x-2">
        <LightBulbIcon width={24} height={24} className=" fill-yellow" />
        <p>
          You can change any NFTs that you have in your wallet for some other
          NFTs in the pool and pay a small fee.
        </p>
      </div>
      <h5 className="font-semibold text-dark1">
        Select some input NFTs from your wallet
      </h5>
      <div className="my-2">
        {isInputDataLoading ? (
          <div className="grid grid-cols-3 gap-6 mt-4 lg:grid-cols-5">
          <SkeletonItemTransaction />
        </div>
        ) : isInputDataSuccess && inputData?.pages[0]?.data?.length > 0 ? (
          <div className="flex flex-col ">
            <div className="grid grid-cols-3 pb-[34px] gap-6 mt-4 overflow-y-scroll lg:grid-cols-5 md:grid-cols-3 text-dark2 max-h-[400px] lg:max-h-[342px]">
              {inputData?.pages.map((page: any, pageIndex: number) => (
                <Fragment key={pageIndex}>
                  {page?.data?.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="relative overflow-hidden"
                      onClick={() => hanldeChoiceNFTInput(item)}
                    >
                      <div
                        className={`relative items-center p-3 text-sm transition-all border rounded-md cursor-pointer lg:text-base hover:-translate-y-1 hover:shadow-home ${
                          idNFTInput.includes(Number(item.nftID))
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
              {isFetching && <SkeletonItemTransaction />}
              <div ref={ref} style={{ height: "1px" }} ></div>
            </div>
          </div>
        ) : (
          <p>No NFTs Found!</p>
        )}
      </div>
      <div className="flex px-6 py-4 my-4 text-sm rounded-lg bg-dark5 text-dark3 gap-x-2">
        <p>
          You have selected
          <span className="text-secondary5"> {idNFTInput.length} </span>
          input NFTs and 
          <span className="text-secondary5">
            {idNFTOutput.length} out of {data?.pages[0]?.totalRecords}
          </span>
            output NFTs
        </p>
      </div>
      <h5 className="font-semibold text-dark1">Select some output NFTs</h5>
      <div className="my-2">
        {isLoading ? (
          <div className="grid grid-cols-3 gap-6 mt-4 lg:grid-cols-5">
          <SkeletonItemTransaction />
        </div>
        ) : isSuccess && data?.pages[0]?.data?.length > 0 ? (
          <div className="flex flex-col ">
            <div className="grid grid-cols-3 pb-[34px] gap-6 mt-4 overflow-y-scroll lg:grid-cols-5 md:grid-cols-3 text-dark2 max-h-[400px] lg:max-h-[342px]">
              {data?.pages.map((page: any, pageIndex: number) => (
                <Fragment key={pageIndex}>
                  {page?.data?.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="relative overflow-hidden"
                      onClick={() => hanldeChoiceNFTOutput(item)}
                    >
                      <div
                        className={`relative items-center p-3 text-sm transition-all border rounded-md cursor-pointer lg:text-base hover:-translate-y-1 hover:shadow-home ${
                          idNFTOutput.includes(Number(item.nftID))
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
              {isFetching && <SkeletonItemTransaction />}
              <div ref={refOutput} style={{ height: "1px" }} ></div>
            </div>
          </div>
        ) : (
          <p>No NFTs Found!</p>
        )}
        <div className="absolute bottom-0 w-full">
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
                idNFTInput.length === 0 ||
                idNFTOutput.length === 0 ||
                !isSufficientToken ||
                idNFTInput.length !== idNFTOutput.length ||
                Math.floor(amountTokenBuy) === 0
              }
              primary={
                idNFTInput.length !== 0 &&
                idNFTOutput.length !== 0 &&
                isSufficientToken &&
                idNFTInput.length === idNFTOutput.length &&
                Math.floor(amountTokenBuy) !== 0
              }
              active={
                idNFTInput.length === 0 ||
                idNFTOutput.length === 0 ||
                !isSufficientToken ||
                idNFTInput.length !== idNFTOutput.length ||
                Math.floor(amountTokenBuy) === 0
              }
              className="w-full py-4"
              onClick={handleSwap}
            >
              Swap
            </Button>
          )}
          {account && !isSufficientToken && (
            <p className="text-xs text-red" key="Tokenbalance">
              Insufficient Token balance
            </p>
          )}
        </div>
      </div>
      <ModalSuccess
        isOpenSuccess={isOpenSuccessSwap}
        transactionHash={hash}
        type="Swap NFTs Successed"
        setIsOpenSuccess={setIsOpenSuccessSwap}
      />
      <ModalError
        isOpenError={isOpenErrorSwap}
        transactionHash={hash}
        type="Swap NFTs Failed"
        setIsOpenError={setIsOpenErrorSwap}
      />
      <ModalWallet isOpen={isOpen} setIsOpen={setIsOpen} />
      <ModalTransation
        isOpenTransation={isOpenTransaction}
        setIsOpenTransaction={setIsOpenTransaction}
        isTransaction={true}
      />
    </div>
  );
};

export default Change;
