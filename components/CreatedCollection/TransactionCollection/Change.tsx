import { Button } from "@/components/Buttons";
import { LightBulbIcon } from "@/components/Icons";
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
import {
  fetchDataBuyNFTs,
  fetchDataSellNFTs,
} from "@/libs/service/collectionService";
import { exponentialToDecimal } from "@/libs/utils/convertExponential";
import ercContract from "@/libs/utils/erc/erc.contract";
import ercContract721 from "@/libs/utils/erc/erc721.contract";
import handleApproveNFT from "@/libs/utils/handleApproveNFT";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Fragment, useContext, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import NFTGrid from "./NFTsGrids";

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
  const collectionAddress = useRouter().query.collection as string;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSufficientToken, setIsSufficientToken] = useState<boolean>(false);
  const {
    ROUTER_721: routerAddress,
    RPC: rpc,
    NATIVE_ADDRESS: nativeAddress,
  } = demask;
  const { ref, inView } = useInView();
  const { ref: refOutput, inView: inViewOutput } = useInView();
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
  const {
    data: inputData,
    fetchNextPage: fetchNextInputPage,
    isFetchingNextPage: isFetchingNextInputPage,
    hasNextPage: hasNextInputPage,
    isSuccess: isInputDataSuccess,
    isLoading: isInputDataLoading,
    isFetching: isInputDataFetching,
  } = useInfiniteQuery(
    ["collectionNFTSell", chainId, account, collectionAddress],
    ({ pageParam = 1 }) =>
      fetchDataSellNFTs(collectionAddress, pageParam, chainId, account),
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
  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    isSuccess,
    isLoading,
    isFetching,
    hasNextPage,
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
    if (inViewOutput) {
      fetchNextPage();
    }
  }, [inViewOutput]);
  const dmlToken = data?.pages[0]?.dmlAddress;
  const { amountTokenBuy, isLoadingBuy } = useAmountInMax(
    "",
    dmlToken,
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
  const handleChoiceNFTInput = (item: any) => {
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
  const handleChoiceNFTOutput = (item: any) => {
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
  const queryClient = useQueryClient();

  const handleSwap = async () => {
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
      queryClient.refetchQueries(["collectionNFTBUY"]);
      queryClient.refetchQueries(["collectionNFTSell"]);
    } catch (error) {
      setIsOpenTransaction(false);
      console.error(error);
    }
  };
  return (
    <div>
      <div className="flex px-6 py-4 my-4 text-sm rounded-lg bg-shader_600 text-shader_500 gap-x-2 ">
        <LightBulbIcon
          width={20}
          height={20}
          className="flex-shrink-0 fill-yellow"
        />
        <p>
          You can change any NFTs that you have in your wallet for some other
          NFTs in the pool and pay a small fee.
        </p>
      </div>
      <h5 className="font-semibold text-shader_700">
        Select some input NFTs from your wallet
      </h5>
      <div className="my-2">
        {account ? (
          <Fragment>
            {isInputDataLoading ? (
              <div className="grid grid-cols-3 gap-6 mt-4 lg:grid-cols-4">
                <SkeletonItemTransaction />
              </div>
            ) : isInputDataSuccess && inputData?.pages[0]?.data?.length > 0 ? (
              <div className="flex flex-col ">
                <NFTGrid
                  data={inputData}
                  isFetching={isFetchingNextInputPage}
                  hasNextPage={hasNextInputPage}
                  ref={ref}
                  handleChoiceNFT={handleChoiceNFTInput}
                  idNFT={idNFTInput}
                />
                <div className="flex px-6 py-4 my-4 text-sm rounded-lg bg-shader_600 text-shader_500 gap-x-2 ">
                  <p>
                    You have selected
                    <span className="text-primary_400">
                      {" "}
                      {idNFTInput.length}{" "}
                    </span>
                    input NFTs and 
                    <span className="text-primary_400">
                      {idNFTOutput.length} out of {data?.pages[0]?.totalRecords}
                    </span>
                      output NFTs
                  </p>
                </div>
              </div>
            ) : (
              <p>No NFTs Found!</p>
            )}
          </Fragment>
        ) : (
          <p className="text-shader_700">Please connect wallet</p>
        )}
      </div>

      <h5 className="font-semibold text-shader_700">Select some output NFTs</h5>
      <div className="my-2">
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
              ref={refOutput}
              handleChoiceNFT={handleChoiceNFTOutput}
              idNFT={idNFTOutput}
            />
          </div>
        ) : (
          <p>No NFTs Found!</p>
        )}
        <div className="absolute bottom-0 w-full">
          {!account ? (
            <Button className="w-full py-2" primary onClick={handleOpen}>
              Connect Wallet
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
                Math.floor(amountTokenBuy) === 0 ||
                isLoadingBuy
              }
              primary={
                idNFTInput.length !== 0 &&
                idNFTOutput.length !== 0 &&
                isSufficientToken &&
                idNFTInput.length === idNFTOutput.length &&
                Math.floor(amountTokenBuy) !== 0 &&
                !isLoadingBuy
              }
              active={
                idNFTInput.length === 0 ||
                idNFTOutput.length === 0 ||
                !isSufficientToken ||
                idNFTInput.length !== idNFTOutput.length ||
                Math.floor(amountTokenBuy) === 0 ||
                isLoadingBuy
              }
              className="w-full py-4"
              isLoadingBtn={isLoadingBuy}
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
