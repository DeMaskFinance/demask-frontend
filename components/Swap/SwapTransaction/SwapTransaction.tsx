import { Button } from "@/components/Buttons";
import Copy from "@/components/Common/Copy";
import FormatNumber from "@/components/Common/FormatNumber";
import MediaNFT from "@/components/Common/MediaNFT";
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
import { ModalSearchNFTSwap } from "@/components/Modal/ModalSearchNFT";
import { ModalSearchToken } from "@/components/Modal/ModalSearchToken";
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
import AccountContext from "@/context/AccountContext";
import useAmountInMax from "@/hooks/useAmountInMax";
import useAmountOutMin from "@/hooks/useAmountOutMin";
import useNFTBalance from "@/hooks/useBalanceNFT";
import useDebounce from "@/hooks/useDebounce";
import useFee from "@/hooks/useFee";
import useInformationToken from "@/hooks/useInformationToken";
import { usePreventUserFromErasingContent } from "@/hooks/usePreventUserFromErasingContent";
import { activeNFTPercent } from "@/libs/constants";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import ercContract from "@/libs/utils/erc/erc.contract";
import formatNumber from "@/libs/utils/formatNumer";
import handleApproveNFT from "@/libs/utils/handleApproveNFT";
import Tippy from "@tippyjs/react";
import Link from "next/link";
import { Fragment, useContext, useEffect, useRef, useState } from "react";
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
  const [isOpenSearchToken, setIsOpenSearchToken] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenBuyNFT, setIsOpenBuyNFT] = useState<boolean>(false);
  const [isOpenSellNFT, setIsOpenSellNFT] = useState<boolean>(false);
  const [isOpenSetting, setIsOpenSetting] = useState<boolean>(false);
  const [isOpenSearchNFT, setIsOpenSearchNFT] = useState<boolean>(false);
  const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false);
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
  const handleSearchNFT = () => {
    setIsOpenSearchNFT(true);
    document.body.style.overflowY = "hidden";
  };
  const handleShowDetail = () => {
    setIsOpenDetail(true);
    document.body.style.overflowY = "hidden";
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
      link: `/add/${demask.CREATOR}/${demask.NATIVE_ADDRESS}/${demask.IDNFT}`,
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
      onClick: () => setIsOpenSetting(true),
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

  return (
    <div className="flex w-full md:w-[34%] border-l h-fit gap-y-1 lg:gap-y-12 border-shader_600">
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
          <div>
            <div className="flex pb-5 border-b gap-x-5 border-shader_500">
              <div className="w-[157px] h-[157px]">
                <MediaNFT data={data} isControls={true} />
              </div>
              <div className="flex-grow font-semibold text-white ">
                <div className="flex gap-x-1">
                  <h4>{data.metadata.name}</h4>
                  <p>#{idNFT}</p>
                </div>
                <div className="flex items-center gap-x-1">
                  <h4 className="font-normal text-shader_200">{`${nftAddress.slice(
                    0,
                    6
                  )}...${nftAddress.slice(-5)}`}</h4>
                  <Copy content={nftAddress} />
                </div>
                <p className="mt-2 mb-2 text-primary_400">Liquidity Pool:</p>
                <div className="flex gap-x-2">
                  <div className="p-3 font-semibold text-white rounded-lg bg-primary_500 bg-opacity-10 basis-1/2">
                    <p className="font-normal text-primary_200">Reserve NFT</p>
                    <p>{data.reserveNFT}</p>
                  </div>
                  <div className="p-3 font-semibold text-white rounded-lg bg-primary_500 bg-opacity-10 basis-1/2">
                    <p className="font-normal text-primary_200">
                      Reserve Token
                    </p>
                    <div className="flex items-center gap-x-1">
                      <FormatNumber number={data.reserveToken} />
                      <EtherIcon width={16} height={16} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center mx-auto mt-5 gap-x-2">
              <Button
                active
                className="border-2 gap-x-2"
                onClick={handleShowDetail}
              >
                <EyeIcon width={20} height={20} className="text-shader_200" />
                View detail
              </Button>
              <Button
                className="flex whitespace-nowrap gap-x-2"
                green_2
                onClick={handleSearchNFT}
              >
                <ImgIcon width={20} height={20} />
                Select NFT
              </Button>
            </div>
          </div>
        </div>
        <form className="mt-5">
          <div>
            <div className="flex flex-wrap items-center justify-between mb-4">
              <div>
                {account && activeChoice === "Buy" && (
                  <div className="flex items-center text-sm text-shader_700">
                    <p className="mr-1">Your balance:</p>
                    {formatNumber(balanceToken)}
                    <EtherIcon
                      width={16}
                      height={16}
                      className="fill-shader_600"
                    />
                  </div>
                )}
                {account && activeChoice === "Sell" && (
                  <div className="flex items-center text-sm text-shader_700">
                    <p className="mr-1">Your balance:</p>
                    <p>{formatNumber(balanceNFT)}</p>
                    <NFTIcon
                      width={24}
                      height={24}
                      className="fill-shader_700 ml-[2px]"
                    />
                  </div>
                )}
              </div>
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

          <div className="mt-4 text-slate-200">
            <div className="items-center justify-between block mb-4 lg:flex">
              <p className="mr-1 text-xs font-normal">Royalties Fee: </p>
              <div className="">
                <label htmlFor="data.royaltyFee" className="">
                  <div className="flex text-sm">
                    0.00
                    <p>(0.05%)</p>
                  </div>
                </label>
              </div>
            </div>
            {inputNFTValue ? (
              <div className="relative h-10">
                <div className="relative flex items-center justify-between w-full h-10 py-2 pl-2 mb-2 text-base font-semibold rounded-lg bg-primary_500 bg-opacity-10">
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
                  <EtherIcon
                    width={16}
                    height={16}
                    className="fill-shader_600"
                  />
                </div>
              </div>
            ) : (
              <div className="relative flex items-center justify-between w-full h-10 py-2 pl-2 mb-2 text-base font-semibold rounded-lg bg-primary_500 bg-opacity-10">
                0
              </div>
            )}
          </div>
        </form>
        {inputNFTValue && (
          <div className="h-4">
            {activeChoice === "Buy" && Math.floor(amountInMax) === 0 && (
              <p className="mt-0 mb-2 ml-3 text-xs text-red">Can't buy</p>
            )}
            {activeChoice === "Sell" && Math.floor(amountSellDec) === 0 && (
              <p className="mt-0 mb-2 ml-3 text-xs text-red">Can't sell</p>
            )}
          </div>
        )}
        <div className="flex justify-center w-full">
          {activeChoice === "Buy" && account && (
            <Button
              type="button"
              className="py-2 w-[144px]"
              green
              onClick={handleBuy}
            >
              Buy NFT
            </Button>
          )}
          {isApprovedNFT && activeChoice === "Sell" && account && (
            <button
              type="button"
              className="py-2 w-[144px] bg-red rounded-lg text-sm text-white"
              onClick={handleSell}
            >
              Sell NFT
            </button>
          )}
          {!isApprovedNFT && account && activeChoice === "Sell" && (
            <Button
              className="w-[126px] py-2"
              primary
              onClick={() =>
                handleApproveNFT(
                  account,
                  wallet,
                  nftAddress,
                  setIsOpen,
                  setIsOpenTransaction,
                  routerAddress
                )
              }
            >
              APPROVE NFT
            </Button>
          )}
          {!account && (
            <Button className="w-[144px] py-2" gradient onClick={handleOpen}>
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
      <ModalSearchNFTSwap
        setIsOpenSearchNFT={setIsOpenSearchNFT}
        isOpenSearchNFT={isOpenSearchNFT}
        setActiveChoiceNFT={setActiveChoiceNFT}
      />

      <ModalWallet isOpen={isOpen} setIsOpen={setIsOpen} />
      {data?.metadata && (
        <ModalDetail
          type="erc1155"
          idNFT={idNFT}
          nftAddress={nftAddress}
          setIsOpenDetail={setIsOpenDetail}
          isOpenDetail={isOpenDetail}
        />
      )}
      <ModalSearchToken
        setIsOpenSearchToken={setIsOpenSearchToken}
        isOpenSearchToken={isOpenSearchToken}
      />
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
      <ModalSetting
        isOpenSetting={isOpenSetting}
        setIsOpenSetting={setIsOpenSetting}
      />
      <ModalTransation
        isOpenTransation={isOpenTransaction}
        setIsOpenTransaction={setIsOpenTransaction}
        isTransaction={true}
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
