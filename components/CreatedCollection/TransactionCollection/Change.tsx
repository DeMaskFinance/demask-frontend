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
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
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
    isSuccess: isInputDataSuccess,
    isLoading: isInputDataLoading,
    isFetching: isInputDataFetching,
  } = useQuery({
    queryKey: ["collectionNFTSell", chainId, collectionAddress, account],
    queryFn: async () => {
      const res = await fetchDataSellNFTs(collectionAddress, chainId, account);
      return res;
    },
  });

  //Data output
  const { data, isSuccess, isLoading, isFetching } = useQuery({
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
      <div className="mt-4">
        <h5 className="font-semibold text-primary_300">Change from</h5>
        <p className="text-sm text-shader_200">Pick your items to swap from</p>
      </div>
      <div className="my-2">
        {account ? (
          <Fragment>
            {isInputDataLoading ? (
              <div className="grid grid-cols-3 gap-6 mt-4 lg:grid-cols-4">
                <SkeletonItemTransaction />
              </div>
            ) : isInputDataSuccess && inputData?.data?.length > 0 ? (
              <div className="flex flex-col ">
                <NFTGrid
                  data={inputData}
                  isFetching={isInputDataFetching}
                  handleChoiceNFT={handleChoiceNFTInput}
                  idNFT={idNFTInput}
                  isSearch={false}
                />
                <div className="flex px-4 py-[10px] my-4 text-sm bg-shader_500 text-shader_200 gap-x-2 ">
                  <p>
                    You have selected
                    <span className="text-primary_400">
                      {" "}
                      {idNFTInput.length}{" "}
                    </span>
                    input NFTs and 
                    <span className="text-primary_400">
                      {idNFTOutput.length} out of {data?.totalRecords}
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

      <div className="mt-4">
        <h5 className="font-semibold text-primary_300">Change to</h5>
        <p className="text-sm text-shader_200">Pick your items to receive</p>
      </div>
      <div className="my-2 pb-14">
        {isLoading ? (
          <div className="grid grid-cols-3 gap-6 mt-4 lg:grid-cols-4">
            <SkeletonItemTransaction />
          </div>
        ) : isSuccess && data?.data?.length > 0 ? (
          <div className="flex flex-col ">
            <NFTGrid
              data={data}
              isFetching={isFetching}
              handleChoiceNFT={handleChoiceNFTOutput}
              idNFT={idNFTOutput}
              isSearch={false}
            />
          </div>
        ) : (
          <p>No NFTs Found!</p>
        )}
        <div className="absolute bottom-0 w-full">
          {!account ? (
            <Button className="w-full py-4" primary onClick={handleOpen}>
              Connect Wallet
            </Button>
          ) : !isApprovedNFT ? (
            <Button
              className="w-full py-4"
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
              Approve NFT
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
