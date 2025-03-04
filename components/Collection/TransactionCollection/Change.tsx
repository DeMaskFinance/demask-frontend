import { Button } from "@/components/Buttons";
import {
  ModalError,
  ModalTransation,
} from "@/components/Modal/ModalTransation";
import { ModalSuccess } from "@/components/Modal/ModalTransation/ModalSuccess";
import { ModalWallet } from "@/components/Modal/ModalWallet";
import { SkeletonItemTransaction } from "@/components/Skeleton/SkeletonCategory";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AccountContext from "@/context/AccountContext";
import useCheckApproveNFT from "@/hooks/useCheckApproveNFT";
import { queryClient } from "@/libs/constants";
import {
  fetchDataBuyNFTs,
  fetchDataSellNFTs,
} from "@/libs/service/collectionService";
import { erc721TradingBuy } from "@/libs/service/tradeService";
import { exponentialToDecimal } from "@/libs/utils/convertExponential";
import ercContract721 from "@/libs/utils/erc/erc721.contract";
import handleApproveNFT from "@/libs/utils/handleApproveNFT";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Fragment, useContext, useEffect, useState } from "react";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import NFTGrid from "./NFTsGrids";
import useInformationToken from "@/hooks/useInformationToken";
import useApproveNFT from "@/libs/utils/handleApproveNFT";

const Change = () => {
  const { account, chainId, wallet, txDeadline, slippage } =
    useContext(AccountContext);
  const [idNFTInput, setIdNFTInput] = useState<number[]>([]);
  const [idNFTOutput, setIdNFTOutput] = useState<number[]>([]);
  const [isOpenTransaction, setIsOpenTransaction] = useState<boolean>(false);
  const [hash, setHash] = useState<string>("");
  const [isOpenSuccessSwap, setIsOpenSuccessSwap] = useState<boolean>(false);
  const [isOpenErrorSwap, setIsOpenErrorSwap] = useState<boolean>(false);
  const router = useRouter();
  const collectionAddress = (router.query.erc as string) || "";
  const [isSufficientToken, setIsSufficientToken] = useState<boolean>(false);
  const [version] = useQueryParam("version", withDefault(StringParam, "v1"));
  const contracts = queryClient.getQueryData<ContractAddresses>([
    "contracts",
    chainId,
    version,
  ]);
  const { bigNumberBalance } = useInformationToken(account, wallet, chainId);
  const nativeAddress = contracts?.WETH_ADDRESS || "";
  const routerAddress = contracts?.ERC721_ROUTER_ADDRESS || "";
  //data Input
  const {
    data: inputData,
    isSuccess: isInputDataSuccess,
    isLoading: isInputDataLoading,
    isFetching: isInputDataFetching,
  } = useQuery({
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
        version
      );
      return res;
    },
  });

  //Data output
  const { data, isSuccess, isLoading, isFetching } = useQuery({
    queryKey: ["collectionNFTBUY", chainId, collectionAddress, version],
    queryFn: async () => {
      const res = await fetchDataBuyNFTs(collectionAddress, chainId, version);
      return res;
    },
  });
  const {
    isLoading: isLoading721Trading,
    data: data721Trading,
    isFetching: isFetching721Trading,
  } = useQuery<DataBuy>({
    queryKey: [
      "721TradingBuy",
      chainId,
      collectionAddress,
      slippage,
      idNFTInput,
      version,
    ],
    queryFn: async () => {
      const res = await erc721TradingBuy(
        collectionAddress,
        chainId,
        idNFTInput.length,
        slippage,
        version
      );
      return res.data;
    },
  });

  useEffect(() => {
    if (Number(data721Trading?.maxAmountDecimals) > Number(bigNumberBalance)) {
      setIsSufficientToken(false);
    } else {
      setIsSufficientToken(true);
    }
  }, [account, data721Trading, bigNumberBalance]);

  const { isApprovedNFT, refetch } = useCheckApproveNFT(
    account,
    collectionAddress,
    routerAddress,
    "erc721"
  );

  const { swapERC20ERC721 } = ercContract721()

  const handleSwap = async () => {
    try {
      setIsOpenTransaction(true);
      const result = await swapERC20ERC721(
        wallet,
        collectionAddress,
        nativeAddress,
        idNFTInput,
        idNFTOutput,
        routerAddress,
        account,
        txDeadline,
        exponentialToDecimal(Math.floor(data721Trading?.maxAmountDecimals || 0))
      );
      setHash(result.transactionHash);
      setIsOpenTransaction(false);
      setIdNFTInput([]);
      setIdNFTOutput([]);
      if (result.status === "success") {
        setIsOpenSuccessSwap(true);
      } else {
        setIsOpenErrorSwap(true);
      }
      queryClient.refetchQueries({ queryKey: ["collectionNFTBUY"] });
      queryClient.refetchQueries({ queryKey: ["collectionNFTSell"] });
      queryClient.refetchQueries({ queryKey: ["useBalanceToken"] });
    } catch (error) {
      setIsOpenTransaction(false);
      console.error(error);
    }
  };
  const { handleApproveNFT } = useApproveNFT()
  return (
    <div>
      <div className="mt-4">
        <h5 className="font-semibold text-primary_300">Change from</h5>
        <p className="text-sm text-shader_200">Pick your items to swap from</p>
      </div>
      <div className="my-2">
        {account ? (
          <Fragment>
            {isInputDataLoading || isInputDataFetching ? (
              <div className="grid grid-cols-3 gap-6 mt-4 lg:grid-cols-4">
                <SkeletonItemTransaction />
              </div>
            ) : isInputDataSuccess && inputData?.data?.length > 0 ? (
              <div className="flex flex-col ">
                <NFTGrid
                  data={inputData}
                  setIdNFT={setIdNFTInput}
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
        {isLoading || isFetching ? (
          <div className="grid grid-cols-3 gap-6 mt-4 lg:grid-cols-4">
            <SkeletonItemTransaction />
          </div>
        ) : isSuccess && data?.data?.length > 0 ? (
          <div className="flex flex-col ">
            <NFTGrid
              data={data}
              // handleChoiceNFT={handleChoiceNFTOutput}
              setIdNFT={setIdNFTOutput}
              idNFT={idNFTOutput}
              isSearch={false}
            />
          </div>
        ) : (
          <p>No NFTs Found!</p>
        )}
        <div className="absolute bottom-0 w-full">
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
                  collectionAddress,
                  setIsOpenTransaction,
                  routerAddress,
                  "erc721",
                  refetch
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
                Math.floor(data721Trading?.maxAmountDecimals ?? 0) === 0 ||
                isFetching
              }
              primary={
                idNFTInput.length !== 0 &&
                idNFTOutput.length !== 0 &&
                isSufficientToken &&
                idNFTInput.length === idNFTOutput.length &&
                Math.floor(data721Trading?.maxAmountDecimals ?? 0) !== 0 &&
                !isFetching
              }
              active={
                idNFTInput.length === 0 ||
                idNFTOutput.length === 0 ||
                !isSufficientToken ||
                idNFTInput.length !== idNFTOutput.length ||
                Math.floor(data721Trading?.maxAmountDecimals ?? 0) === 0 ||
                isFetching
              }
              className="w-full py-4"
              isLoadingBtn={isFetching721Trading}
              onClick={handleSwap}
            >
              Swap
            </Button>
          )}
          {account && !isSufficientToken && idNFTInput.length !== 0 && (
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
      <ModalTransation
        isOpenTransation={isOpenTransaction}
        setIsOpenTransaction={setIsOpenTransaction}
      />
    </div>
  );
};

export default Change;
