import Button from "@/components/Buttons/Button";
import FormatNumber from "@/components/Common/FormatNumber";
import MediaNFT from "@/components/Common/Media/MediaNFT";
import {
  CreateIcon,
  EtherIcon,
  EyeIcon,
  NFTIcon,
  SwapIcon,
} from "@/components/Icons";
import { ModalConfirmAddLiquidity } from "@/components/Modal/ModalConfirmAddLiquidity";
import { ModalDetail } from "@/components/Modal/ModalDedail";
import { ModalSearchCollectionSwap } from "@/components/Modal/ModalSearchCollection";
import { ModalSearchToken } from "@/components/Modal/ModalSearchToken";
import {
  ModalError,
  ModalTransation,
} from "@/components/Modal/ModalTransation";
import { ModalSuccess } from "@/components/Modal/ModalTransation/ModalSuccess";
import { ModalWallet } from "@/components/Modal/ModalWallet";
import { TabGroups } from "@/components/NavChoice";
import { SkeletonAddLiquidity } from "@/components/Skeleton";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AccountContext from "@/context/AccountContext";
import useNFTBalance from "@/hooks/useBalanceNFT";
import useCheckApproveNFT from "@/hooks/useCheckApproveNFT";
import useDebounce from "@/hooks/useDebounce";
import { usePreventUserFromErasingContent } from "@/hooks/usePreventUserFromErasingContent";
import { getMetadata } from "@/libs/service/nftService";
import { erc1155TradingAdd } from "@/libs/service/tradeService";
import { replaceDot } from "@/libs/utils/formatComon";
import formatNumber from "@/libs/utils/formatNumer";
import handleApproveNFT from "@/libs/utils/handleApproveNFT";
import handleBignumber from "@/libs/utils/handleBignumber";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { FaAngleDown } from "react-icons/fa";
import { NumberFormatValues, NumericFormat } from "react-number-format";
import Back from "../Common/Back";
import Actions from "../Trade/Action";

export default function AddLiquidity() {
  const router = useRouter();
  const [nftAddress, setNftAddress] = useState<string>("");
  const [tokenAddress, setTokenAddress] = useState<string>("");
  const [inputNFT, setInputNFT] = useState<string>("");
  const [inputToken, setInputToken] = useState<string>("");
  const [idNFT, setIdNFT] = useState("");
  const [isSufficientNFT, setIsSufficientNFT] = useState<boolean>(false);
  const [isSufficientToken, setIsSufficientToken] = useState<boolean>(false);
  const [isOpenConfirmAddLiquidity, setIsOpenConfirmAddLiquidity] =
    useState<boolean>(false);
  const [amountErcDesired, setAmountErcDesired] = useState<any>();
  const { currency } = router.query;
  const {
    account,
    wallet,
    chainId,
    demask,
    slippage,
    bigNumberBalance,
    balanceToken,
  } = useContext(AccountContext);
  const [isInputNFT, setIsInputNFT] = useState<boolean>(false);
  const [isOpenTransaction, setIsOpenTransaction] = useState<boolean>(false);
  const [checkExit, setCheckExit] = useState<boolean>(false);
  const [hash, setHash] = useState<string>("");
  const [isOpenSuccess, setIsOpenSuccess] = useState<boolean>(false);
  const [isOpenError, setIsOpenError] = useState<boolean>(false);
  const [activeChoiceNFT, setActiveChoiceNFT] = useState<string>("");
  const { ROUTER: routerAddress } = demask;
  let inputNFTValue = useDebounce(inputNFT, 1000);
  useEffect(() => {
    if (currency) {
      setNftAddress(currency[0]);
      setTokenAddress(currency[1]);
      setIdNFT(currency[2]);
      setInputNFT("");
      setIsSufficientNFT(false);
      setIsSufficientToken(false);
    }
  }, [currency]);
  usePreventUserFromErasingContent(checkExit);
  const { isLoading, data, isFetching, isSuccess, refetch } = useQuery({
    queryKey: ["metadata", idNFT, nftAddress, chainId, tokenAddress],
    queryFn: async () => {
      const res = await getMetadata(
        chainId,
        nftAddress.toLowerCase(),
        idNFT,
        tokenAddress
      );
      return res;
    },
    keepPreviousData: true,
  });
  const { data: dataTradingAdd, isFetching: isFetchingAdd } = useQuery<DataAdd>(
    {
      queryKey: [
        "1155TradingAdd",
        tokenAddress,
        chainId,
        nftAddress,
        idNFT,
        inputNFTValue,
        slippage,
      ],
      queryFn: async () => {
        const res = await erc1155TradingAdd(
          tokenAddress,
          chainId,
          nftAddress,
          idNFT,
          +inputNFTValue,
          slippage
        );
        return res.data;
      },
      refetchInterval: 20000,
    }
  );
  const isApprovedNFT = useCheckApproveNFT(
    account,
    wallet,
    nftAddress,
    routerAddress,
    isOpenTransaction
  );
  const balanceNFT = useNFTBalance(
    account,
    nftAddress,
    idNFT,
    wallet,
    isOpenTransaction
  );

  useEffect(() => {
    let amountErcDesired;
    if (data?.dmlAddress !== null && dataTradingAdd && inputNFT) {
      amountErcDesired = dataTradingAdd?.amountETHDecimals;
    } else {
      amountErcDesired = handleBignumber(Number(inputToken), 18);
    }
    if (!inputNFT) {
      setAmountErcDesired("");
    }
    setAmountErcDesired(amountErcDesired);
    if (amountErcDesired) {
      if (Number(amountErcDesired) > Number(bigNumberBalance)) {
        setIsSufficientToken(true);
      } else {
        setIsSufficientToken(false);
      }
    }
  }, [inputNFT, inputToken, dataTradingAdd, bigNumberBalance]);

  const handleGetNFT = (values: NumberFormatValues) => {
    const { value } = values;
    setInputNFT(value);
    const numericValue = Number(value.replace(/,/g, ""));
    if (numericValue > Number(balanceNFT)) {
      setIsSufficientNFT(true);
    } else {
      setIsSufficientNFT(false);
    }
    // setActiveChoiceNFT("");
  };
  const handleGetToken = (values: NumberFormatValues) => {
    const { value } = values;
    const inputValue = replaceDot(value);
    setInputToken(inputValue);
    if (Number(inputValue) > Number(balanceToken)) {
      setIsSufficientToken(true);
    } else {
      setIsSufficientToken(false);
    }
  };
  const handleAddLiquidity = () => {
    if (inputNFT && !isSufficientNFT && !isSufficientToken) {
      setIsOpenConfirmAddLiquidity(true);
    } else {
      setIsInputNFT(true);
    }
  };
  useEffect(() => {
    if (inputNFT) {
      setCheckExit(true);
    } else {
      setCheckExit(false);
    }
  }, [inputNFT]);

  const handleChoicePercent = (item: string) => {
    {
      dataTradingAdd &&
        setInputNFT(
          Math.floor((parseFloat(item) / 100) * +balanceNFT).toString()
        );
    }
    // setShowRequiredMessage(false);
    setActiveChoiceNFT(item);
  };

  return (
    <div className="max-w-4xl mx-auto min-h-[94vh] pb-24 lg:pb-8 px-4">
      <div className="flex items-center justify-between ">
        <div className="">
          <div className="sticky top-16">
            <Back />
            <h2 className="mt-4 text-xl font-bold text-primary_300">
              Add Liquidity
            </h2>
          </div>
        </div>
        <Actions
          IconSwap={
            <SwapIcon
              width={18}
              height={18}
              className="cursor-pointer text-primary_200"
            />
          }
          contentTrade="Swap"
          link={`/trade/erc1155/${nftAddress}/${tokenAddress}/${idNFT}`}
          refetch={refetch}
        />
      </div>
      {isLoading || isFetching ? (
        <SkeletonAddLiquidity />
      ) : isSuccess ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
          <div className="order-2">
            <div>
              <p className="title_label">
                <span className="">Choose Collection</span>
                <span className="text-red">*</span>
              </p>

              <Dialog>
                <DialogTrigger asChild>
                  <div className="input_item">
                    <div className="flex items-center justify-between cursor-pointer text-shader_500 group">
                      <div className="flex items-center gap-x-2 title">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue bg-opacity-20 ">
                          <CreateIcon width={16} height={16} />
                        </div>
                        <p>{data?.metadata?.name}</p>
                      </div>
                      <FaAngleDown className="text-white " />
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="w-full p-0 border bg-shader_800 border-shader_500">
                  <ModalSearchCollectionSwap />
                </DialogContent>
              </Dialog>
            </div>
            <div>
              <p className="title_label">
                <span className="">Choose Token</span>
                <span className="text-red">*</span>
              </p>

              <Dialog>
                <DialogTrigger asChild>
                  <div className="input_item">
                    <div className="flex items-center justify-between cursor-pointer text-shader_500">
                      <div className="flex items-center gap-x-2 title">
                        <EtherIcon width={18} height={18} />
                        ETH
                      </div>
                      <FaAngleDown className="text-white transition-all duration-150 group-hover:rotate-180" />
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className=" p-0 border bg-shader_800 border-shader_500">
                  <ModalSearchToken />
                </DialogContent>
              </Dialog>
            </div>
            <div className="mt-5 border-t border-shader_600">
              <p className="title_label">
                <span className="">Deposit</span>
                <span className="text-red">*</span>
              </p>
              <div>
                <div className="flex justify-between mb-1 font-semibold text-primary_300">
                  <p>NFT balance</p>
                  <p className="flex items-center font-bold text-white gap-x-1">
                    {account ? formatNumber(balanceNFT) : 0}
                    <NFTIcon width={12} height={12} />
                  </p>
                </div>
                <div className="relative flex gap-x-2">
                  <div className="relative w-[60%]">
                    <NumericFormat
                      name="amountNFT"
                      id="amountNFT"
                      autoComplete="off"
                      placeholder="NFT quantity"
                      pattern="^[1-9][0-9]*$"
                      decimalScale={0}
                      decimalSeparator=","
                      thousandSeparator="."
                      className="input_item"
                      value={inputNFT}
                      onValueChange={handleGetNFT}
                    />
                  </div>
                  <div className="w-[40%]">
                    <TabGroups
                      choices={["25%", "50%", "75%", "100%"]}
                      activeChoice={activeChoiceNFT}
                      onChoiceChange={handleChoicePercent}
                    />
                  </div>
                </div>

                {isSufficientNFT && (
                  <p
                    className="mt-1 mb-2 ml-3 text-xs text-red"
                    key="totalSale"
                  >
                    Insufficient NFT balance
                  </p>
                )}
                {!inputNFT && isInputNFT && (
                  <p className="mt-1 mb-2 ml-3 text-xs text-red" key="inputNFT">
                    Required
                  </p>
                )}
              </div>
              <div className="mb-4">
                <div className="flex justify-between mt-4 mb-1 font-semibold text-primary_300">
                  <p>Token</p>
                  <div className="flex items-center font-bold text-white gap-x-1">
                    {account ? formatNumber(balanceToken) : 0}
                    <EtherIcon width={12} height={12} />
                  </div>
                </div>
                {data?.dmlAddress === null ? (
                  <NumericFormat
                    name="amountToken"
                    id="amountToken"
                    autoComplete="off"
                    placeholder="Input amount Token"
                    className="input_item"
                    value={inputToken}
                    inputMode="decimal"
                    onValueChange={handleGetToken}
                    decimalSeparator=","
                    thousandSeparator="."
                    minLength={1}
                    maxLength={30}
                  />
                ) : (
                  <div className="input_item">
                    {dataTradingAdd ? (
                      <FormatNumber number={dataTradingAdd.amountETH} />
                    ) : (
                      <BiLoaderAlt className="text-xl animate-spin text-primary_400" />
                    )}
                  </div>
                )}
                {isSufficientToken && (
                  <p className="mb-2 ml-3 mt-1 text-xs text-red" key="inputNFT">
                    Insufficient Token balance
                  </p>
                )}
              </div>
            </div>
            {!account ? (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full py-2" primary>
                    Connect Wallet
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[350px] p-0 border-none">
                  <ModalWallet />
                </DialogContent>
              </Dialog>
            ) : !isApprovedNFT ? (
              <Button
                className="w-full py-3"
                primary
                onClick={() =>
                  handleApproveNFT(
                    account,
                    wallet,
                    nftAddress,
                    setIsOpenTransaction,
                    routerAddress
                  )
                }
              >
                Approve NFT
              </Button>
            ) : (
              <Button
                className="w-full py-3"
                primary
                onClick={handleAddLiquidity}
              >
                Add Liquidity
              </Button>
            )}
            {Math.floor(amountErcDesired) === 0 &&
              inputNFT &&
              inputToken === "0" && (
                <p className="mt-3 ml-3 text-xs text-red" key="inputNFT">
                  Can't add liquidity
                </p>
              )}
          </div>
          <div className="order-1 w-full lg:order-2">
            <div className="relative flex flex-col items-center w-full h-full">
              <div className="relative w-full h-fit ">
                <div className="overflow-hidden rounded-xl">
                  <MediaNFT data={data} isControls={true} />
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="absolute flex px-3 h-10 text-sm font-semibold text-white translate-x-1/2 rounded-lg cursor-pointer bottom-2 whitespace-nowrap right-1/2 gap-x-2 "
                      active
                    >
                      View Detail
                      <EyeIcon width={16} height={16} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-full p-0 border bg-shader_800 border-shader_500">
                    {data && (
                      <ModalDetail
                        type="erc1155"
                        idNFT={idNFT}
                        nftAddress={nftAddress}
                      />
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <SkeletonAddLiquidity />
      )}

      <ModalTransation
        isOpenTransation={isOpenTransaction}
        setIsOpenTransaction={setIsOpenTransaction}
      />
      {data && account && (
        <ModalConfirmAddLiquidity
          isOpenConfirmAddLiquidity={isOpenConfirmAddLiquidity}
          isOpenTransaction={isOpenTransaction}
          isFetching={isFetchingAdd}
          amountErcDesired={amountErcDesired}
          setIsOpenTransaction={setIsOpenTransaction}
          tokenAddress={tokenAddress}
          nftAddress={nftAddress}
          idNFT={idNFT}
          data={data}
          setInputToken={setInputToken}
          setIsOpenConfirmAddLiquidity={setIsOpenConfirmAddLiquidity}
          inputNFT={inputNFT}
          setInputNFT={setInputNFT}
          setHash={setHash}
          setIsOpenSuccess={setIsOpenSuccess}
          setIsOpenError={setIsOpenError}
        />
      )}
      <ModalSuccess
        isOpenSuccess={isOpenSuccess}
        transactionHash={hash}
        type="Add Liquidity Success"
        setIsOpenSuccess={setIsOpenSuccess}
      />
      <ModalError
        isOpenError={isOpenError}
        transactionHash={hash}
        type="Add Liquidity Failed"
        setIsOpenError={setIsOpenError}
      />
    </div>
  );
}
