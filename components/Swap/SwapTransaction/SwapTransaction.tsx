import { Button } from "@/components/Buttons";
import FormatNumber from "@/components/Common/FormatNumber";
import MediaNFT from "@/components/Common/MediaNFT";
import {
  EtherIcon,
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
  ModalSuccess,
  ModalTransation,
} from "@/components/Modal/ModalTransation";
import { ModalWallet } from "@/components/Modal/ModalWallet";
import ModalWarningRemove from "@/components/Modal/ModalWarningRemove";
import { TabGroups } from "@/components/NavChoice";
import AccountContext from "@/context/AccountContext";
import useAmountInMax from "@/hooks/useAmountInMax";
import useAmountOutMin from "@/hooks/useAmountOutMin";
import useNFTBalance from "@/hooks/useBalanceNFT";
import useDebounce from "@/hooks/useDebounce";
import useInformationToken from "@/hooks/useInformationToken";
import { usePreventUserFromErasingContent } from "@/hooks/usePreventUserFromErasingContent";
import { activeNFTPercent } from "@/libs/constants";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import ercContract from "@/libs/utils/erc/erc.contract";
import formatNumber from "@/libs/utils/formatNumer";
import handleApproveNFT from "@/libs/utils/handleApproveNFT";
import Tippy from "@tippyjs/react";
import Link from "next/link";
import { useContext, useEffect, useRef, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
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
  const [isSufficientTokenSell, setIsSufficientTokenSell] =
    useState<boolean>(false);
  const [showRequiredMessage, setShowRequiredMessage] = useState(false);
  const [inputNFT, setInputNFT] = useState<string>("");
  const [amountBuyDec, setAmountBuyDec] = useState<number>(0);
  const [amountSellDec, setAmountSellDec] = useState<number>(0);
  const [totalProcessBuy, setTotalProcessBuy] = useState<number>(0);
  const [totalProcessSell, setTotalProcessSell] = useState<number>(0);
  const [royaltiesFeeBuy, setRoyaltiesFeeBuy] = useState<number>(0);
  const [royaltiesFeeSell, setRoyaltiesFeeSell] = useState<number>(0);
  const [activeChoiceNFT, setActiveChoiceNFT] = useState<string>("");
  const [activeChoice, setActiveChoice] = useState<string>("BUY");
  const [isApprovedNFT, setIsApprovedNFT] = useState<boolean>(false);
  const [isOpenTransaction, setIsOpenTransaction] = useState<boolean>(false);
  const [widthBtn, setWidthBtn] = useState(0);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>(
    Array(activeNFTPercent.length).fill(null)
  );
  const {
    account,
    wallet,
    chainId,
    demask,
    tokenDefault,
    slippage,
    txDeadline,
  } = useContext(AccountContext);
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
  const { balanceToken, bigNumberBalance, allowanceToken } =
    useInformationToken(
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

  useEffect(() => {
    if (inputNFTValue && data && amountTokenBuy && amountTokenSell) {
      setAmountBuyDec(
        amountTokenBuy * (1 + slippage / 100) +
          (amountTokenBuy * Number(data.royaltyFee)) / 100
      );
      setAmountSellDec(
        amountTokenSell * (1 - slippage / 100) -
          (amountTokenSell * Number(data.royaltyFee)) / 100
      );
      setTotalProcessBuy(
        Number(amountTokenBuy) +
          (amountTokenBuy * Number(data.royaltyFee)) / 100
      );
      setTotalProcessSell(
        amountTokenSell - (amountTokenSell * Number(data.royaltyFee)) / 100
      );
      setRoyaltiesFeeBuy((amountTokenBuy * Number(data.royaltyFee)) / 100);
      setRoyaltiesFeeSell((amountTokenSell * Number(data.royaltyFee)) / 100);
    } else {
      setAmountBuyDec(0);
      setAmountSellDec(0);
      setRoyaltiesFeeBuy(0);
      setRoyaltiesFeeSell(0);
      setTotalProcessBuy(0);
      setTotalProcessSell(0);
    }
  }, [inputNFTValue, slippage, amountTokenBuy, amountTokenSell, activeChoice]);

  useEffect(() => {
    const checkReservesNFT = () => {
      if (activeChoice === "BUY") {
        if (data && Number(inputNFTValue) <= Number(data.reserveNFT)) {
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
    if (Number(amountBuyDec.toFixed()) > Number(bigNumberBalance)) {
      setIsSufficientTokenBuy(false);
    } else {
      setIsSufficientTokenBuy(true);
    }
    if (Number(amountSellDec.toFixed()) > Number(bigNumberBalance)) {
      setIsSufficientTokenSell(false);
    } else {
      setIsSufficientTokenSell(true);
    }
  }, [inputNFTValue, activeChoice, account, amountBuyDec, amountSellDec, data]);
  useEffect(() => {
    setInputNFT("");
    setActiveChoiceNFT("");
  }, [activeChoice]);
  useEffect(() => {
    if (inputNFTValue === "") {
      setIsSufficientNFT(true);
    }
  }, []);
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
      Math.floor(amountBuyDec) !== 0
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
      isSufficientTokenSell &&
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
          width={24}
          height={24}
          className="cursor-pointer hover:fill-secondary5"
        />
      ),
      content: "Refetch",
      onClick: () => refetch(),
    },
    {
      icon: (
        <PoolIcon
          width={24}
          height={24}
          className="group-hover:fill-secondary3"
        />
      ),
      content: "Pool",
      link: `/add/${nftAddress}/${tokenAddress}/${idNFT}`,
    },
    {
      icon: (
        <SettingIcon
          width={24}
          height={24}
          className="cursor-pointer hover:rotate-90 hover:fill-secondary5"
        />
      ),
      content: "Setting",
      onClick: () => setIsOpenSetting(true),
    },
  ];
  return (
    <div className="lg:w-[40%] md:w-2/4 w-full h-fit flex gap-y-1 lg:gap-y-12">
      <div className="w-full p-6 border rounded-lg shadow-home">
        <div className="flex justify-between gap-4 mb-2 text-dark1">
          <div className="flex flex-col items-center ">
            <TabGroups
              choices={["BUY", "SELL"]}
              activeChoice={activeChoice}
              onChoiceChange={handleChoiceChange}
            />
          </div>
          <div className="flex items-center gap-x-2">
            {actions.map((action, index) => (
              <Tippy
                key={index}
                content={<div className="text-xs">{action.content}</div>}
                theme="dark"
                placement="bottom"
              >
                {action.link ? (
                  <Link href={action.link} className="group">
                    {action.icon}
                  </Link>
                ) : (
                  <div onClick={action.onClick}>{action.icon}</div>
                )}
              </Tippy>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-center my-6">
          <div className="w-40 mx-auto ">
            <MediaNFT data={data} isControls={true} />
          </div>
          <p
            className="mx-auto mt-1 text-xs cursor-pointer text-dark3 hover:text-secondary3"
            onClick={handleShowDetail}
          >
            Show detail
          </p>
        </div>
        <form className="mt-5">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                {account && activeChoice === "BUY" && (
                  <div className="flex items-center text-sm text-dark1">
                    <p className="mr-1">Your balance:</p>
                    {formatNumber(balanceToken)}
                    <EtherIcon width={16} height={16} className="fill-dark2" />
                  </div>
                )}
                {account && activeChoice === "SELL" && (
                  <div className="flex items-center text-sm text-dark1">
                    <p className="mr-1">Your balance:</p>
                    <p>{formatNumber(balanceNFT)}</p>
                    <NFTIcon
                      width={24}
                      height={24}
                      className="fill-dark1 ml-[2px]"
                    />
                  </div>
                )}
              </div>
              <div className="flex items-center text-sm text-dark1">
                <div className="flex items-center mr-2">
                  <span className="mr-1">LP:</span>
                  <FormatNumber number={data.reserveNFT} />
                  <NFTIcon
                    width={24}
                    height={24}
                    className="fill-dark1 ml-[2px]"
                  />
                </div>
                <FormatNumber number={data.reserveToken} />
                <span>
                  <EtherIcon
                    width={20}
                    height={20}
                    className="fill-dark1 ml-[-1px]"
                  />
                </span>
              </div>
            </div>
            <div
              className={`relative p-2  rounded-lg bg-dark5 border border-dark5 hover:border-dark3 ${
                showRequiredMessage && "border-red"
              }`}
            >
              <div className="relative">
                <input
                  type="number"
                  name="amountNFT"
                  id="amountNFT"
                  autoComplete="off"
                  placeholder="Input amount NFT"
                  pattern="^[1-9][0-9]*$"
                  inputMode="numeric"
                  onKeyDown={(event) => {
                    if (
                      !(event.key >= "0" && event.key <= "9") &&
                      event.key !== "Backspace" &&
                      event.key !== "ArrowLeft" &&
                      event.key !== "ArrowRight"
                    ) {
                      event.preventDefault();
                    }
                  }}
                  min="1"
                  className="text-sm font-semibold border-none outline-none text-dark2 bg-dark5 placeholder:text-dark2 placeholder:font-medium"
                  value={inputNFT}
                  onChange={(e) => {
                    setInputNFT(e.target.value);
                    setShowRequiredMessage(false);
                    setActiveChoiceNFT("");
                    setWidthBtn(0);
                    setCheckExit(true);
                  }}
                />
                <div
                  className="absolute min-h-[80%] px-2 py-1 transition duration-150 ease-out bg-white border rounded-lg cursor-pointer hover:text-white hover:bg-secondary5 active:bg-secondary3 text-secondary5 right-1 top-1 border-secondary5 "
                  onClick={handleSearchNFT}
                >
                  <div className="w-16 text-center">
                    <h2 className="truncate">
                      {data.metadata?.symbol
                        ? data.metadata?.symbol
                        : data.metadata?.name}
                    </h2>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-8">
                <div className="relative flex items-center h-8 rounded-lg bg-dark4 w-fit">
                  <div
                    className="absolute h-8 transition-transform duration-100 ease-linear rounded-l-lg bg-secondary5"
                    style={{ width: `${widthBtn}px` }}
                  ></div>
                  {activeNFTPercent.map((item, index) => (
                    <button
                      type="button"
                      ref={(el) => (buttonRefs.current[index] = el)}
                      key={index}
                      onClick={() => {
                        if (activeChoice === "BUY") {
                          setInputNFT(
                            Math.floor(
                              item.percent * +data.reserveNFT
                            ).toString()
                          );
                        } else {
                          setInputNFT(
                            Math.floor(
                              item.percent * Number(balanceNFT)
                            ).toString()
                          );
                        }
                        setShowRequiredMessage(false);
                        setActiveChoiceNFT(item.text);
                        const totalWidth = buttonRefs.current
                          .slice(0, index + 1)
                          .reduce(
                            (acc, ref) => (ref ? acc + ref.offsetWidth : acc),
                            0
                          );
                        setWidthBtn(totalWidth);
                      }}
                      className={`text-[12px] w-10 h-4 z-10 flex cursor-pointer justify-center last:border-none border-r border-dark3 font-semibold text-dark3 ${
                        item.text === activeChoiceNFT && " text-white"
                      }`}
                    >
                      {item.text}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {data.dmlAddress !== null &&
              !isSufficientNFT &&
              balanceNFT &&
              data.reserveNFT &&
              account && (
                <p className="mt-1 mb-2 ml-3 text-xs text-red" key="NFTbalance">
                  Insufficient NFT balance
                </p>
              )}
            {data.dmlAddress !== null &&
              ((!isSufficientTokenBuy &&
                activeChoice === "BUY" &&
                account &&
                data.reserveToken) ||
                (!isSufficientTokenSell &&
                  activeChoice === "SELL" &&
                  account &&
                  data.reserveToken)) && (
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

          <div className="mt-4">
            <div className="flex justify-between mb-4">
              <div className="text-sm text-dark1">Total Proceeds:</div>
              <div className="">
                <label htmlFor="data.royaltyFee" className=" text-dark1">
                  <div className="flex text-sm">
                    <p className="mr-1">Royalties Fee: </p>
                    {activeChoice === "BUY" ? (
                      <FormatNumber
                        number={(royaltiesFeeBuy / 1e18).toString()}
                      />
                    ) : (
                      <FormatNumber
                        number={(royaltiesFeeSell / 1e18).toString()}
                      />
                    )}
                    <p>({data?.royaltyFee}%)</p>
                  </div>
                </label>
              </div>
            </div>
            <div className="relative">
              {activeChoice === "BUY" ? (
                <div className="block w-full py-2 pl-2 mb-2 rounded-lg text-dark1 bg-dark5">
                  <FormatNumber
                    number={divideByDecimal(
                      totalProcessBuy.toString(),
                      data.tokenDecimals
                    )}
                  />
                </div>
              ) : (
                <div className="block w-full py-2 pl-2 mb-2 border rounded-lg border-dark4 text-dark1 bg-dark4">
                  <FormatNumber
                    number={divideByDecimal(
                      totalProcessSell.toString(),
                      data.tokenDecimals
                    )}
                  />
                </div>
              )}
              <div className="absolute px-2 py-1 right-1 top-2">
                <EtherIcon width={16} height={16} className="fill-dark2" />
              </div>
            </div>
          </div>
        </form>
        {inputNFTValue && activeChoice === "BUY" ? (
          !isLoadingBuy ? (
            Math.floor(amountBuyDec) === 0 ? (
              <p className="mt-0 mb-2 ml-3 text-xs text-red">Can't buy</p>
            ) : null
          ) : (
            <BiLoaderAlt className="animate-spin text-secondary5" />
          )
        ) : null}
        {inputNFTValue && activeChoice === "SELL" ? (
          !isLoadingSell ? (
            Math.floor(amountSellDec) === 0 ? (
              <p className="mt-0 mb-2 ml-3 text-xs text-red">Can't sell</p>
            ) : null
          ) : (
            <BiLoaderAlt className="animate-spin text-secondary5" />
          )
        ) : null}
        <div className="flex justify-center w-full">
          {activeChoice === "BUY" && account && (
            <button
              type="button"
              className="py-2 w-[144px] bg-green hover:text-green hover:bg-white hover:border-green border rounded-lg text-sm text-white"
              onClick={handleBuy}
            >
              BUY NFT
            </button>
          )}
          {isApprovedNFT && activeChoice === "SELL" && account && (
            <button
              type="button"
              className="py-2 w-[144px] bg-red rounded-lg text-sm text-white"
              onClick={handleSell}
            >
              SELL NFT
            </button>
          )}
          {!isApprovedNFT && account && activeChoice === "SELL" && (
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
            <Button className="w-[144px] py-2" primary onClick={handleOpen}>
              CONNECT WALLET
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
          data={data}
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
        type="Buy NFT Success"
        setIsOpenSuccess={setIsOpenSuccessBuy}
      />
      <ModalError
        isOpenError={isOpenErrorBuy}
        transactionHash={hash}
        type="Buy NFT Failed"
        setIsOpenError={setIsOpenErrorBuy}
      />
      <ModalSuccess
        isOpenSuccess={isOpenSuccessSell}
        transactionHash={hash}
        type="Sell NFT Success"
        setIsOpenSuccess={setIsOpenSuccessSell}
      />
      <ModalError
        isOpenError={isOpenErrorSell}
        transactionHash={hash}
        type="Sell NFT Failed"
        setIsOpenError={setIsOpenErrorSell}
      />
    </div>
  );
};
export default SwapTransaction;
