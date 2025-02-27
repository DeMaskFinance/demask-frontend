import { Button } from "@/components/Buttons";
import FormatNumber from "@/components/Common/FormatNumber";
import MediaNFT from "@/components/Common/Media/MediaNFT";
import VersionTrade from "@/components/Common/VersionTrade";
import {
  EtherIcon,
  EyeIcon,
  ImgIcon,
  NFTIcon,
  PoolIcon,
} from "@/components/Icons";
import ModalBuyNFT from "@/components/Modal/ModalBuyNFT";
import { ModalDetail } from "@/components/Modal/ModalDedail";
import { ModalSearchCollectionSwap } from "@/components/Modal/ModalSearchCollection";
import ModalSellNFT from "@/components/Modal/ModalSellNFT";
import {
  ModalError,
  ModalTransation,
} from "@/components/Modal/ModalTransation";
import { ModalSuccess } from "@/components/Modal/ModalTransation/ModalSuccess";
import { ModalWallet } from "@/components/Modal/ModalWallet";
import ModalWarningRemove from "@/components/Modal/ModalWarningRemove";
import { TabGroups } from "@/components/NavChoice";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AccountContext from "@/context/AccountContext";
import useNFTBalance from "@/hooks/useBalanceNFT";
import useCheckApproveNFT from "@/hooks/useCheckApproveNFT";
import useDebounce from "@/hooks/useDebounce";
import { queryClient } from "@/libs/constants";
import {
  erc1155TradingBuy,
  erc1155TradingSell,
} from "@/libs/service/tradeService";
import formatNumber from "@/libs/utils/formatNumer";
import handleApproveNFT from "@/libs/utils/handleApproveNFT";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import Actions from "../Action";
import { StaticDetailBuy, StaticDetailSell } from "./StaticDetail";
import useInformationToken from "@/hooks/useInformationToken";
import useApproveNFT from "@/libs/utils/handleApproveNFT";
interface SwapTransactionProps {
  data: DataBase;
  tokenAddress: string;
  idNFT: string;
  nftAddress: string;
  refetch: any;
}
const SwapTransaction: React.FunctionComponent<SwapTransactionProps> = ({
  data,
  tokenAddress,
  idNFT,
  nftAddress,
  refetch,
}) => {
  const [isOpenBuyNFT, setIsOpenBuyNFT] = useState<boolean>(false);
  const [isOpenSellNFT, setIsOpenSellNFT] = useState<boolean>(false);
  const [isOpenSuccessBuy, setIsOpenSuccessBuy] = useState<boolean>(false);
  const [isOpenErrorBuy, setIsOpenErrorBuy] = useState<boolean>(false);
  const [isOpenSuccessSell, setIsOpenSuccessSell] = useState<boolean>(false);
  const [isOpenErrorSell, setIsOpenErrorSell] = useState<boolean>(false);
  const [hash, setHash] = useState<string>("");
  const [isSufficientNFT, setIsSufficientNFT] = useState<boolean>(false);
  const [isSufficientTokenBuy, setIsSufficientTokenBuy] =
    useState<boolean>(false);
  const [showRequiredMessage, setShowRequiredMessage] = useState(false);
  const [inputNFT, setInputNFT] = useState<string>("");
  const [activeChoiceNFT, setActiveChoiceNFT] = useState<string>("");
  const [activeChoice, setActiveChoice] = useState<string>("Buy");
  const [isOpenTransaction, setIsOpenTransaction] = useState<boolean>(false);

  const { account, wallet, slippage, chainId } = useContext(AccountContext);
  const { balanceToken, bigNumberBalance } = useInformationToken(
    account,
    wallet,
    chainId
  );
  const [version] = useQueryParam("version", withDefault(StringParam, "v1"));

  const contracts = queryClient.getQueryData<ContractAddresses>([
    "contracts",
    chainId,
    version,
  ]);
  const routerAddress = contracts?.ERC1155_ROUTER_ADDRESS || "";
  let inputNFTValue = useDebounce(inputNFT, 1000);
  const { balanceNFT } = useNFTBalance(
    account,
    nftAddress,
    idNFT,
  );
  const {
    data: dataBuy,
    isLoading,
    isFetching,
    isSuccess,
  } = useQuery<DataBuy>({
    queryKey: [
      "1155TradingBuy",
      tokenAddress,
      chainId,
      nftAddress,
      idNFT,
      inputNFTValue,
      slippage,
      version,
    ],
    queryFn: async () => {
      const res = await erc1155TradingBuy(
        tokenAddress,
        chainId,
        nftAddress,
        idNFT,
        inputNFTValue,
        slippage,
        version
      );
      return res.data;
    },
    enabled: data.dmlAddress !== null && activeChoice === "Buy",
  });


  const { data: dataSell, isFetching: isFetchingSell } = useQuery<DataSell>({
    queryKey: [
      "1155TradingSell",
      tokenAddress,
      chainId,
      nftAddress,
      idNFT,
      inputNFTValue,
      slippage,
      version,
    ],
    queryFn: async () => {
      const res = await erc1155TradingSell(
        tokenAddress,
        chainId,
        nftAddress,
        idNFT,
        inputNFTValue,
        slippage,
        version
      );
      return res.data;
    },
    enabled: data.dmlAddress !== null && activeChoice === "Sell",
  });
  const isApprovedNFT = useCheckApproveNFT(
    account,
    nftAddress,
    routerAddress,
    "erc1155"
  );
  useEffect(() => {
    const checkReservesNFT = () => {
      if (activeChoice === "Buy") {
        if (data && Number(inputNFTValue) < Number(dataBuy?.reserveNFT)) {
          setIsSufficientNFT(true);
        } else {
          setIsSufficientNFT(false);
        }
      } else {
        if (Number(inputNFTValue) <= Number(balanceNFT)) {
          setIsSufficientNFT(true);
        } else {
          setIsSufficientNFT(false);
        }
      }
    };
    checkReservesNFT();
    if (Number(dataBuy?.maxAmountDecimals) > Number(bigNumberBalance)) {
      setIsSufficientTokenBuy(false);
    } else {
      setIsSufficientTokenBuy(true);
    }
  }, [
    inputNFTValue,
    activeChoice,
    account,
    data,
    dataBuy,
    bigNumberBalance,
    balanceNFT,
  ]);

  useEffect(() => {
    setInputNFT("");
    setActiveChoiceNFT("");
  }, [activeChoice]);

  const handleChoiceChange = (choice: string) => {
    setActiveChoice(choice);
  };

  const handleChoicePercent = (item: string) => {
    if (activeChoice === "Buy" && dataBuy) {
      item === "100%"
        ? setInputNFT(
          Math.floor(
            (parseFloat(item) / 100) * (+dataBuy.reserveNFT - 1)
          ).toString()
        )
        : setInputNFT(
          Math.floor(
            (parseFloat(item) / 100) * +dataBuy.reserveNFT
          ).toString()
        );
    } else {
      setInputNFT(
        Math.floor((parseFloat(item) / 100) * Number(balanceNFT)).toString()
      );
    }
    setShowRequiredMessage(false);
    setActiveChoiceNFT(item);
  };

  const { handleApproveNFT } = useApproveNFT()

  return (
    <div className="flex w-full md:w-[30rem] h-fit gap-y-1 lg:gap-y-12 flex-shrink-0 md:sticky top-14">
      <div className="w-full p-4">
        <div className="flex justify-between gap-4 mb-2">
          <VersionTrade />
          <Actions
            IconSwap={
              <PoolIcon
                width={18}
                height={18}
                className="cursor-pointer text-primary_200"
              />
            }
            contentTrade="Trade"
            link={`/add/${nftAddress}/${tokenAddress}/${idNFT}`}
            refetch={refetch}
          />
        </div>
        <div className="flex flex-col items-center my-4">
          <TabGroups
            choices={["Buy", "Sell"]}
            activeChoice={activeChoice}
            onChoiceChange={handleChoiceChange}
          />
        </div>
        <div className="p-4 border rounded-lg border-shader_500 bg-shader_700">
          <div className="md:flex pb-5 border-b gap-x-5 border-shader_500">
            <div className="w-[157px] h-[157px] aspect-square rounded-xl overflow-hidden mx-auto">
              <MediaNFT data={data} isControls={true} />
            </div>
            <div className="flex-grow font-semibold text-white text-center md:text-left">
              <Link
                href={`/collection/${nftAddress}`}
                className="text-primary_400 text-sm"
              >
                {data?.collectionName}
              </Link>
              <div className="flex gap-x-1 justify-center md:justify-start">
                <h4>{data?.metadata?.name}</h4>
                <p>#{idNFT}</p>
              </div>
              <p className="mb-2 mt-3 text-shader_200 text-sm">
                Liquidity Pool:
              </p>
              <div className="flex gap-x-2 whitespace-nowrap">
                <div className="p-3 font-semibold text-white rounded-lg bg-primary_500 bg-opacity-10 basis-1/2 text-sm">
                  <p className="font-normal text-primary_200 ">Reserve NFT</p>
                  <FormatNumber number={dataBuy?.reserveNFT || 0} />
                </div>
                <div className="p-3 font-semibold text-white rounded-lg bg-primary_500 bg-opacity-10 basis-1/2 text-sm">
                  <p className="font-normal text-primary_200 ">Reserve Token</p>
                  <div className="flex items-center gap-x-1">
                    <FormatNumber number={dataBuy?.reserveToken || 0} />
                    <EtherIcon width={16} height={16} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center mx-auto mt-5 gap-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button active className="border-2 gap-x-2">
                  <EyeIcon width={20} height={20} className="text-shader_200" />
                  View detail
                </Button>
              </DialogTrigger>
              <DialogContent className=" bg-shader_800 border border-shader_500 p-0">
                <ModalDetail
                  type="erc1155"
                  idNFT={idNFT}
                  nftAddress={nftAddress}
                />
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex whitespace-nowrap gap-x-2" green_2>
                  <ImgIcon width={20} height={20} />
                  Select
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl bg-shader_800 border border-shader_500 p-0">
                <ModalSearchCollectionSwap />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <form className="mt-5 mb-4">
          <div>
            <div className="flex flex-wrap items-center justify-between mb-2">
              {account && (
                <div className="w-full font-semibold text-primary_300">
                  {activeChoice === "Buy" ? (
                    <div className="flex items-center justify-between">
                      <p>Your balance (MON)</p>
                      <div className="flex items-center font-bold text-white gap-x-1">
                        {formatNumber(balanceToken)}
                        <EtherIcon width={16} height={16} />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between ">
                      <p>Your NFT balance:</p>
                      <div className="flex items-center font-bold text-white gap-x-1">
                        <p>{formatNumber(Number(balanceNFT))}</p>
                        <NFTIcon width={12} height={14} />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="relative flex gap-x-2">
              <div className="relative w-[60%]">
                <NumericFormat
                  name="amountNFT"
                  id="amountNFT"
                  autoComplete="off"
                  placeholder="NFT quantity"
                  pattern="^[1-9][0-9]*$"
                  min="1"
                  decimalScale={0}
                  thousandSeparator=","
                  className="w-full h-full px-3 py-2 font-semibold text-white rounded-lg outline-none bg-shader_600 placeholder:text-shader_300 placeholder:font-medium border_500"
                  value={inputNFT}
                  onChange={(e) => {
                    let newValue = e.target.value.replace(/,/g, "");
                    setInputNFT(newValue);
                    setActiveChoiceNFT("");
                  }}
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
            {data.dmlAddress !== null &&
              isSufficientNFT === false &&
              !isFetching &&
              inputNFT &&
              account && (
                <p className="mt-1 mb-2 ml-3 text-xs text-red" key="NFTbalance">
                  Insufficient NFT balance
                </p>
              )}
            {data.dmlAddress !== null &&
              !isSufficientTokenBuy &&
              !isFetching &&
              activeChoice === "Buy" &&
              account && (
                <p
                  className="mt-1 mb-2 ml-3 text-xs text-red"
                  key="Tokenbalance"
                >
                  Insufficient Token balance
                </p>
              )}
            {data.dmlAddress === null && (
              <p className="mt-1 mb-2 ml-3 text-xs text-red">
                DML Token doesn't exist yet
              </p>
            )}
            {showRequiredMessage && (
              <p className="mt-1 mb-2 ml-3 text-xs text-red" key="emptyNFT">
                Required
              </p>
            )}
          </div>
        </form>
        {activeChoice === "Buy" && (
          <StaticDetailBuy
            data={dataBuy}
            inputNFTValue={+inputNFT}
            isFetching={isFetching}
          />
        )}
        {activeChoice === "Sell" && (
          <StaticDetailSell
            data={dataSell}
            inputNFTValue={+inputNFT}
            isFetching={isFetching}
          />
        )}
        {inputNFTValue && (
          <div className="">
            {activeChoice === "Buy" &&
              dataBuy?.maxAmount === 0 &&
              !isFetching && (
                <p className="mt-0 mb-2 ml-3 text-xs text-red">Can't buy</p>
              )}
            {activeChoice === "Sell" &&
              dataSell?.minAmountDecimals === 0 &&
              !isFetchingSell && (
                <p className="mt-0 mb-2 ml-3 text-xs text-red">Can't sell</p>
              )}
          </div>
        )}
        <div className="flex justify-center w-full">
          {!account ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full py-2" gradient>
                  Connect Wallet
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[350px] p-0 border-none">
                <ModalWallet />
              </DialogContent>
            </Dialog>
          ) : activeChoice === "Buy" ? (
            <Dialog open={isOpenBuyNFT} onOpenChange={setIsOpenBuyNFT}>
              <DialogTrigger asChild>
                <Button
                  disabled={
                    inputNFTValue === "" ||
                    data.dmlAddress === null ||
                    !isSufficientTokenBuy ||
                    isFetching ||
                    dataBuy?.maxAmountDecimals === 0
                  }
                  active={
                    inputNFTValue === "" ||
                    data.dmlAddress === null ||
                    !isSufficientTokenBuy ||
                    isFetching ||
                    dataBuy?.maxAmountDecimals === 0
                  }
                  primary={
                    +inputNFTValue > 0 &&
                    data.dmlAddress !== null &&
                    isSufficientTokenBuy &&
                    dataBuy?.maxAmountDecimals !== 0
                  }
                  className="w-full py-4"
                >
                  Buy now
                </Button>
              </DialogTrigger>
              <DialogContent className="p-0 border-none">
                {dataBuy && (
                  <ModalBuyNFT
                    isOpenTransaction={isOpenTransaction}
                    tokenAddress={tokenAddress}
                    nftAddress={nftAddress}
                    idNFT={idNFT}
                    setIsOpenTransaction={setIsOpenTransaction}
                    routerAddress={routerAddress}
                    data={data}
                    dataBuy={dataBuy}
                    isFetching={isFetching}
                    setIsOpenBuyNFT={setIsOpenBuyNFT}
                    inputNFT={inputNFTValue}
                    setInputNFT={setInputNFT}
                    setHash={setHash}
                    setIsOpenSuccess={setIsOpenSuccessBuy}
                    setIsOpenError={setIsOpenErrorBuy}
                  />
                )}
              </DialogContent>
            </Dialog>
          ) : isApprovedNFT ? (
            <Dialog open={isOpenSellNFT} onOpenChange={setIsOpenSellNFT}>
              <DialogTrigger asChild>
                <Button
                  disabled={
                    inputNFTValue === "" ||
                    data.dmlAddress === null ||
                    !isSufficientNFT ||
                    isFetching ||
                    dataSell?.minAmountDecimals === 0
                  }
                  primary={
                    +inputNFTValue > 0 &&
                    data.dmlAddress !== null &&
                    isSufficientTokenBuy &&
                    dataSell?.minAmountDecimals !== 0
                  }
                  className="w-full py-4"
                  active={
                    inputNFTValue === "" ||
                    data.dmlAddress === null ||
                    !isSufficientNFT ||
                    isFetching ||
                    dataSell?.minAmountDecimals === 0
                  }
                >
                  Sell now
                </Button>
              </DialogTrigger>
              <DialogContent className="p-0 border-none">
                {dataSell && (
                  <ModalSellNFT
                    isOpenTransaction={isOpenTransaction}
                    setIsOpenTransaction={setIsOpenTransaction}
                    tokenAddress={tokenAddress}
                    nftAddress={nftAddress}
                    idNFT={idNFT}
                    data={data}
                    isFetching={isFetchingSell}
                    dataSell={dataSell}
                    routerAddress={routerAddress}
                    setIsOpenSellNFT={setIsOpenSellNFT}
                    inputNFT={inputNFT}
                    setInputNFT={setInputNFT}
                    setHash={setHash}
                    setIsOpenSuccess={setIsOpenSuccessSell}
                    setIsOpenError={setIsOpenErrorSell}
                  />
                )}
              </DialogContent>
            </Dialog>
          ) : (
            <Button
              className="w-full py-2"
              primary
              onClick={() =>
                handleApproveNFT(
                  account,
                  nftAddress,
                  setIsOpenTransaction,
                  routerAddress
                )
              }
            >
              Approve NFT
            </Button>
          )}
        </div>
      </div>
      {data && <ModalWarningRemove isOpenWarning={data?.isDeleted} />}
      <ModalTransation
        isOpenTransation={isOpenTransaction}
        setIsOpenTransaction={setIsOpenTransaction}
      />
      <ModalSuccess
        isOpenSuccess={isOpenSuccessBuy}
        transactionHash={hash}
        type="Buy NFT"
        setIsOpenSuccess={setIsOpenSuccessBuy}
      />
      <ModalError
        isOpenError={isOpenErrorBuy}
        transactionHash={hash}
        type="Buy NFT"
        setIsOpenError={setIsOpenErrorBuy}
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
    </div>
  );
};
export default SwapTransaction;
