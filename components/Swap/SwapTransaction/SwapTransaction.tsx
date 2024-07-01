import { Button } from "@/components/Buttons";
import Copy from "@/components/Common/Copy";
import FormatNumber from "@/components/Common/FormatNumber";
import MediaNFT from "@/components/Common/Media/MediaNFT";
import {
  EtherIcon,
  EyeIcon,
  ImgIcon,
  NFTIcon,
  PoolIcon,
  RefetchIcon,
  SettingIcon,
} from "@/components/Icons";
import ModalBuyNFT from "@/components/Modal/ModalBuyNFT";
import { ModalDetail } from "@/components/Modal/ModalDedail";
import { ModalSearchCollectionSwap } from "@/components/Modal/ModalSearchCollection";
import ModalSellNFT from "@/components/Modal/ModalSellNFT";
import ModalSetting from "@/components/Modal/ModalSetting";
import {
  ModalError,
  ModalTransation,
} from "@/components/Modal/ModalTransation";
import { ModalSuccess } from "@/components/Modal/ModalTransation/ModalSuccess";
import { ModalWallet } from "@/components/Modal/ModalWallet";
import ModalWarningRemove from "@/components/Modal/ModalWarningRemove";
import { TabGroups } from "@/components/NavChoice";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import AccountContext from "@/context/AccountContext";
import useAmountInMax from "@/hooks/useAmountInMax";
import useAmountOutMin from "@/hooks/useAmountOutMin";
import useNFTBalance from "@/hooks/useBalanceNFT";
import useDebounce from "@/hooks/useDebounce";
import useFee from "@/hooks/useFee";
import useInformationToken from "@/hooks/useInformationToken";
import { usePreventUserFromErasingContent } from "@/hooks/usePreventUserFromErasingContent";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import ercContract from "@/libs/utils/erc/erc.contract";
import formatNumber from "@/libs/utils/formatNumer";
import handleApproveNFT from "@/libs/utils/handleApproveNFT";
import Tippy from "@tippyjs/react";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { NumericFormat } from "react-number-format";
import "react-toastify/dist/ReactToastify.css";
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
  const [isOpen, setIsOpen] = useState<boolean>(false);
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
  const [amountSellDec, setAmountSellDec] = useState<number>(0);
  const [amountInMax, setAmountInMax] = useState<number>(0);
  const [activeChoiceNFT, setActiveChoiceNFT] = useState<string>("");
  const [activeChoice, setActiveChoice] = useState<string>("Buy");
  const [isApprovedNFT, setIsApprovedNFT] = useState<boolean>(false);
  const [isOpenTransaction, setIsOpenTransaction] = useState<boolean>(false);

  const { account, wallet, chainId, demask, slippage } =
    useContext(AccountContext);
  const [checkExit, setCheckExit] = useState<boolean>(false);
  const {
    ROUTER: routerAddress,
    RPC: rpc,
    NATIVE_ADDRESS: nativeAddress,
  } = demask;

  let inputNFTValue = useDebounce(inputNFT, 1000);
  const balanceNFT = useNFTBalance(
    account,
    nftAddress,
    idNFT,
    wallet,
    isOpenTransaction
  );
  const { balanceToken, bigNumberBalance } = useInformationToken(
    account,
    tokenAddress,
    wallet,
    routerAddress,
    rpc,
    nativeAddress,
    chainId,
    isOpenTransaction
  );
  usePreventUserFromErasingContent(checkExit);
  useEffect(() => {
    const checkApproveNFT = async () => {
      const result = await ercContract.approveNFT(
        account,
        wallet,
        nftAddress,
        routerAddress
      );
      setIsApprovedNFT(result);
    };
    checkApproveNFT();
  }, [account, nftAddress, wallet, isOpenTransaction]);
  useEffect(() => {
    if (inputNFTValue) {
      setCheckExit(true);
    } else {
      setCheckExit(false);
    }
  }, [inputNFTValue]);
  const { amountTokenBuy, isLoadingBuy } = useAmountInMax(
    inputNFTValue,
    data?.dmlAddress,
    tokenAddress,
    nftAddress,
    idNFT,
    wallet,
    account,
    rpc,
    routerAddress,
    true
  );
  const { amountTokenSell, isLoadingSell } = useAmountOutMin(
    inputNFTValue,
    data?.dmlAddress,
    tokenAddress,
    nftAddress,
    idNFT,
    wallet,
    account,
    rpc,
    routerAddress,
    true
  );
  const { totalFee } = useFee(
    amountTokenSell,
    data.dmlAddress,
    wallet,
    account,
    rpc,
    demask.FEE_MANAGER,
    true
  );

  useEffect(() => {
    if (inputNFTValue && data && amountTokenSell && amountTokenBuy) {
      setAmountSellDec((amountTokenSell - totalFee) * (1 - slippage / 100));
      setAmountInMax(amountTokenBuy * (1 + slippage / 100));
    } else {
      setAmountSellDec(0);
      setAmountInMax(0);
    }
  }, [slippage, amountTokenSell, totalFee, amountTokenBuy]);

  useEffect(() => {
    const checkReservesNFT = () => {
      if (activeChoice === "Buy") {
        if (data && Number(inputNFTValue) < Number(data.reserveNFT)) {
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
    if (Number(amountInMax) > Number(bigNumberBalance)) {
      setIsSufficientTokenBuy(false);
    } else {
      setIsSufficientTokenBuy(true);
    }
  }, [
    inputNFTValue,
    activeChoice,
    account,
    data,
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
  const handleBuy = () => {
    if (inputNFTValue === "") {
      setShowRequiredMessage(true);
    } else if (
      isSufficientNFT &&
      isSufficientTokenBuy &&
      data.dmlAddress !== null &&
      Math.floor(amountInMax) !== 0
    ) {
      setIsOpenBuyNFT(true);
      document.body.style.overflowY = "hidden";
    }
  };
  const handleSell = () => {
    if (inputNFTValue === "") {
      setShowRequiredMessage(true);
    } else if (
      isSufficientNFT &&
      data.dmlAddress !== null &&
      Math.floor(amountSellDec) !== 0
    ) {
      setIsOpenSellNFT(true);
      document.body.style.overflowY = "hidden";
    }
  };

  const handleOpen = () => {
    document.body.style.overflowY = "hidden";
    setIsOpen(true);
  };
  const actions = [
    {
      icon: (
        <RefetchIcon
          width={18}
          height={18}
          className="cursor-pointer text-primary_200"
        />
      ),
      content: "Refresh",
      onClick: () => refetch(),
    },
    {
      icon: (
        <PoolIcon
          width={18}
          height={18}
          className="cursor-pointer text-primary_200"
        />
      ),
      content: "Pool",
      link: `/add/${nftAddress}/${tokenAddress}/${idNFT}`,
    },
    {
      icon: (
        <SettingIcon
          width={18}
          height={18}
          className="cursor-pointer text-primary_200"
        />
      ),
      content: "Setting",
      dialog: (
        <Dialog>
          <DialogTrigger asChild>
            <div className="cursor-pointer text-primary_200">
              <SettingIcon width={18} height={18} />
            </div>
          </DialogTrigger>
          <DialogContent className="w-fit bg-shader_800 border border-shader_500 p-4">
            <DialogHeader>
              <DialogDescription>
                <ModalSetting />
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      ),
    },
  ];
  const handleChoicePercent = (item: string) => {
    if (activeChoice === "Buy") {
      setInputNFT(
        Math.floor((parseFloat(item) / 100) * +data.reserveNFT).toString()
      );
    } else {
      setInputNFT(
        Math.floor((parseFloat(item) / 100) * Number(balanceNFT)).toString()
      );
    }
    setShowRequiredMessage(false);
    setActiveChoiceNFT(item);
  };
  console.log(isApprovedNFT, account);

  return (
    <div className="flex w-full md:w-[30rem] h-fit gap-y-1 lg:gap-y-12 flex-shrink-0 md:sticky top-14">
      <div className="w-full p-4">
        <div className="flex justify-between gap-4 mb-2">
          <p className="text-xl font-bold text-white">Demask Swaps</p>
          <div className="flex items-center gap-x-2">
            {actions.map((action, index) => (
              <Tippy
                key={index}
                content={<div className="text-xs">{action.content}</div>}
                theme="dark"
                placement="bottom"
              >
                <div className="border rounded-full border-shader_400 p-[7px]">
                  {action.link ? (
                    <Link href={action.link} className="group">
                      {action.icon}
                    </Link>
                  ) : action.dialog ? (
                    action.dialog
                  ) : (
                    <div onClick={action.onClick} className="">
                      {action.icon}
                    </div>
                  )}
                </div>
              </Tippy>
            ))}
          </div>
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
                href={`/collection/${nftAddress}?typeERC=erc1155`}
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
                  <p>{data.reserveNFT}</p>
                </div>
                <div className="p-3 font-semibold text-white rounded-lg bg-primary_500 bg-opacity-10 basis-1/2 text-sm">
                  <p className="font-normal text-primary_200 ">Reserve Token</p>
                  <div className="flex items-center gap-x-1">
                    <FormatNumber number={data.reserveToken} />
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
                <DialogHeader>
                  <DialogDescription>
                    <ModalDetail
                      type="erc1155"
                      idNFT={idNFT}
                      nftAddress={nftAddress}
                    />
                  </DialogDescription>
                </DialogHeader>
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
                <DialogHeader>
                  <DialogDescription>
                    <ModalSearchCollectionSwap />
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <form className="mt-5">
          <div>
            <div className="flex flex-wrap items-center justify-between mb-2">
              {account && (
                <div className="w-full font-semibold text-primary_300">
                  {activeChoice === "Buy" ? (
                    <div className="flex items-center justify-between">
                      <p>Your balance (ETH)</p>
                      <div className="flex items-center font-bold text-white gap-x-1">
                        {formatNumber(balanceToken)}
                        <EtherIcon width={16} height={16} />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between ">
                      <p>Your NFT balance:</p>
                      <div className="flex items-center font-bold text-white gap-x-1">
                        <p>{formatNumber(balanceNFT)}</p>
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
              inputNFT &&
              // balanceNFT &&
              data.reserveNFT &&
              account && (
                <p className="mt-1 mb-2 ml-3 text-xs text-red" key="NFTbalance">
                  Insufficient NFT balance
                </p>
              )}
            {data.dmlAddress !== null &&
              !isSufficientTokenBuy &&
              activeChoice === "Buy" &&
              account &&
              data.reserveToken && (
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

          <div className="mt-2 text-slate-200">
            <div className="items-center justify-between  mb-4 flex">
              <p className="mr-1 text-xs font-normal">Slippage </p>
              <div className="flex text-sm text-primary_300">{slippage}%</div>
            </div>
            {inputNFTValue ? (
              <div className="relative h-10">
                <div className="relative flex items-center justify-between w-full h-10 py-2 pl-2 mb-4 text-base font-semibold rounded-lg bg-primary_500 bg-opacity-10">
                  {isLoadingBuy ? (
                    <BiLoaderAlt className="animate-spin text-primary_400" />
                  ) : isLoadingSell ? (
                    <BiLoaderAlt className="animate-spin text-primary_400" />
                  ) : (
                    <FormatNumber
                      number={divideByDecimal(
                        activeChoice === "Buy"
                          ? amountTokenBuy
                          : amountTokenSell,
                        data.tokenDecimals
                      )}
                    />
                  )}
                </div>
                <div className="absolute px-2 py-1 right-1 top-2">
                  <EtherIcon width={16} height={16} />
                </div>
              </div>
            ) : (
              <div className="relative flex items-center justify-between w-full h-10 py-2 pl-2 mb-4 text-base font-semibold rounded-lg bg-primary_500 bg-opacity-10">
                0
              </div>
            )}
          </div>
        </form>
        {inputNFTValue && (
          <div className="h-4">
            {activeChoice === "Buy" &&
              Math.floor(amountInMax) === 0 &&
              !isLoadingBuy && (
                <p className="mt-0 mb-2 ml-3 text-xs text-red">Can't buy</p>
              )}
            {activeChoice === "Sell" &&
              Math.floor(amountSellDec) === 0 &&
              !isLoadingSell && (
                <p className="mt-0 mb-2 ml-3 text-xs text-red">Can't sell</p>
              )}
          </div>
        )}
        <div className="flex justify-center w-full">
          {!account ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full py-2" gradient onClick={handleOpen}>
                  Connect Wallet
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[350px] p-0 border-none">
                <ModalWallet />
              </DialogContent>
            </Dialog>
          ) : activeChoice === "Buy" ? (
            <Button
              type="button"
              className="py-2 w-full"
              green
              onClick={handleBuy}
            >
              Buy Now
            </Button>
          ) : isApprovedNFT ? (
            <Button
              type="button"
              className="py-2 w-full"
              red
              onClick={handleSell}
            >
              Sell Now
            </Button>
          ) : (
            <Button
              className="w-full py-2"
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
          )}
        </div>
      </div>
      {data && <ModalWarningRemove isOpenWarning={data?.isDeleted} />}
      {data && account && (
        <ModalBuyNFT
          isOpenBuyNFT={isOpenBuyNFT}
          isOpenTransaction={isOpenTransaction}
          setIsOpenTransaction={setIsOpenTransaction}
          tokenAddress={tokenAddress}
          nftAddress={nftAddress}
          idNFT={idNFT}
          routerAddress={routerAddress}
          data={data}
          setIsOpenBuyNFT={setIsOpenBuyNFT}
          inputNFT={inputNFTValue}
          setInputNFT={setInputNFT}
          setHash={setHash}
          setIsOpenSuccess={setIsOpenSuccessBuy}
          setIsOpenError={setIsOpenErrorBuy}
        />
      )}
      {data && account && (
        <ModalSellNFT
          isOpenSellNFT={isOpenSellNFT}
          isOpenTransaction={isOpenTransaction}
          setIsOpenTransaction={setIsOpenTransaction}
          tokenAddress={tokenAddress}
          nftAddress={nftAddress}
          idNFT={idNFT}
          data={data}
          routerAddress={routerAddress}
          setIsOpenSellNFT={setIsOpenSellNFT}
          inputNFT={inputNFTValue}
          setInputNFT={setInputNFT}
          setHash={setHash}
          setIsOpenSuccess={setIsOpenSuccessSell}
          setIsOpenError={setIsOpenErrorSell}
        />
      )}
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
