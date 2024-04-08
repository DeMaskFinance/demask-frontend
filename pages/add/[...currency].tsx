import Button from "@/components/Buttons/Button";
import MediaNFT from "@/components/Common/MediaNFT";
import {
  BackIcon,
  DownIcon,
  NFTIcon,
  RefetchIcon,
  SettingIcon,
  TokenIconNotDefine,
} from "@/components/Icons";
import { ModalDetail } from "@/components/Modal/ModalDedail";
import { ModalSearchNFT } from "@/components/Modal/ModalSearchNFT";
import { ModalSearchToken } from "@/components/Modal/ModalSearchToken";
import ModalSetting from "@/components/Modal/ModalSetting";
import {
  ModalError,
  ModalSuccess,
  ModalTransation,
} from "@/components/Modal/ModalTransation";
import { ModalWallet } from "@/components/Modal/ModalWallet";
import { SkeletonAddLiquidity } from "@/components/Skeleton";
import AccountContext from "@/context/AccountContext";
import useNFTBalance from "@/hooks/useBalanceNFT";
import useBalanceToken from "@/hooks/useInformationToken";
import { usePreventUserFromErasingContent } from "@/hooks/usePreventUserFromErasingContent";
import { swapAPI } from "@/libs/service";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import handleApproveNFT from "@/libs/utils/handleApproveNFT";
import handleBignumber from "@/libs/utils/handleBignumber";
import { useQuery } from "@tanstack/react-query";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { SEO } from "../../next-seo.config";
import Tippy from "@tippyjs/react";
import FormatNumber from "@/components/Common/FormatNumber";
import formatNumber from "@/libs/utils/formatNumer";
import ercContract from "@/libs/utils/erc/erc.contract";
import { activeNFTPercent } from "@/libs/constants";
import { ModalConfirmAddLiquidity } from "@/components/Modal/ModalConfirmAddLiquidity";
import Link from "next/link";
const styles = {
  title: "block mb-4 text-base font-medium text-black24",
};
const updateMeta = {
  ...SEO,
  title: "Add Liquidity",
};
export default function AddLiquidity() {
  const router = useRouter();
  const [nftAddress, setNftAddress] = useState<string>("");
  const [tokenAddress, setTokenAddress] = useState<string>("");
  const [inputNFT, setInputNFT] = useState<string>("");
  const [inputToken, setInputToken] = useState<string>("");
  const [idNFT, setIdNFT] = useState("");
  const [isOpenSetting, setIsOpenSetting] = useState<boolean>(false);
  const [isSufficientNFT, setIsSufficientNFT] = useState<boolean>(false);
  const [isSufficientToken, setIsSufficientToken] = useState<boolean>(false);
  const [isApprovedNFT, setIsApprovedNFT] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false);
  const [isOpenSearchNFT, setIsOpenSearchNFT] = useState<boolean>(false);
  const [isOpenSearchToken, setIsOpenSearchToken] = useState<boolean>(false);
  const [isOpenConfirmAddLiquidity, setIsOpenConfirmAddLiquidity] =
    useState<boolean>(false);
  const [amountErcDesired, setAmountErcDesired] = useState<any>();
  const { currency } = router.query;
  const { account, wallet, chainId, demask, tokenDefault, slippage } =
    useContext(AccountContext);
  const [isInputNFT, setIsInputNFT] = useState<boolean>(false);
  const [amountErcDesiredToDec, setAmountErcDesiredToDec] = useState<any>("0");
  const [isOpenTransaction, setIsOpenTransaction] = useState<boolean>(false);
  const [tokenSymbolIcon, setTokenSymbolIcon] = useState();
  const [checkExit, setCheckExit] = useState<boolean>(false);
  const [hash, setHash] = useState<string>("");
  const [isOpenSuccess, setIsOpenSuccess] = useState<boolean>(false);
  const [isOpenError, setIsOpenError] = useState<boolean>(false);
  const [activeChoiceNFT, setActiveChoiceNFT] = useState<string>("");
  const {
    ROUTER: routerAddress,
    RPC: rpc,
    NATIVE_ADDRESS: nativeAddress,
  } = demask;
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
    queryKey: ["liquidity", idNFT, nftAddress, chainId, tokenAddress],
    queryFn: async () => {
      try {
        const res = await swapAPI(
          tokenAddress.toLocaleLowerCase(),
          chainId,
          nftAddress.toLowerCase(),
          idNFT
        );
        if (res) {
          return res;
        } else {
          throw new Error("Invalid data from API");
        }
      } catch (error) {
        console.error("Error in queryFn:", error);
        throw error;
      }
    },
    keepPreviousData: true,
  });

  const balanceNFT = useNFTBalance(
    account,
    nftAddress,
    idNFT,
    wallet,
    isOpenTransaction
  );

  const { balanceToken, bigNumberBalance, allowanceToken } = useBalanceToken(
    account,
    tokenAddress,
    wallet,
    routerAddress,
    rpc,
    nativeAddress,
    isOpenTransaction
  );
  const handleGetNFT = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputNFT(e.target.value);
    if (Number(e.target.value) > Number(balanceNFT)) {
      setIsSufficientNFT(true);
    } else {
      setIsSufficientNFT(false);
    }
  };
  useEffect(() => {
    let amountErcDesired;
    if (data?.dmlAddress !== null && data && inputNFT) {
      amountErcDesired =
        ((Number(inputNFT) * +data.reserveTokenDecimals) / +data.reserveNFT) *
        (1 + slippage / 100);
    } else {
      amountErcDesired = handleBignumber(
        Number(inputToken),
        Number(data?.tokenDecimals)
      );
    }
    if (!inputNFT) {
      setAmountErcDesiredToDec("");
    }
    setAmountErcDesired(amountErcDesired);
    if (amountErcDesired) {
      const amountErcDesiredToDec = divideByDecimal(
        amountErcDesired?.toString(),
        data?.tokenDecimals
      );
      setAmountErcDesiredToDec(amountErcDesiredToDec.toString());
      if (Number(amountErcDesired) > Number(bigNumberBalance)) {
        setIsSufficientToken(true);
      } else {
        setIsSufficientToken(false);
      }
    }
  }, [inputNFT, inputToken, data]);
  const handleOpen = () => {
    document.body.style.overflowY = "hidden";
    setIsOpen(true);
  };

  useEffect(() => {
    if (tokenAddress) {
      const icon = (tokenDefault || []).find(
        (item: any) => item.address.toLowerCase() === tokenAddress
      );
      setTokenSymbolIcon(icon);
    }
  }, [currency, chainId, tokenAddress]);

  const handleGetToken = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const isValidInput = /^[0-9]*[.,]?[0-9]*$/.test(inputValue);
    if (!isValidInput) {
      return;
    }
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
  const handleShowDetail = () => {
    setIsOpenDetail(true);
    document.body.style.overflowY = "hidden";
  };
  const handleSearchNFT = () => {
    setIsOpenSearchNFT(true);
    document.body.style.overflowY = "hidden";
  };
  const handleSearchToken = () => {
    setIsOpenSearchToken(true);
    document.body.style.overflowY = "hidden";
  };
  const actions = [
    {
      icon: (
        <RefetchIcon
          width={24}
          height={24}
          className="cursor-pointer hover:fill-dark2"
        />
      ),
      content: "Refresh",
      onClick: () => refetch(),
    },
    {
      icon: (
        <SettingIcon
          width={24}
          height={24}
          className="cursor-pointer hover:rotate-90 hover:fill-dark2"
        />
      ),
      content: "Setting",
      onClick: () => setIsOpenSetting(true),
    },
  ];
  return (
    <div className="px-4 py-8 lg:px-secondary md:px-14 min-h-[75vh] pb-24 lg:pb-8">
      <NextSeo {...updateMeta} />
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href={`/pools?chain=${chainId}`}>
            <BackIcon
              width={20}
              height={20}
              className="cursor-pointer hover:fill-secondary5"
            />
          </Link>
          <h2 className="text-2xl text-black24 ml-[18px]">Add Liquidity</h2>
        </div>
        <div className="flex items-center gap-x-2">
          {actions.map((action, index) => (
            <Tippy
              key={index}
              content={<div>{action.content}</div>}
              theme="dark"
              placement="bottom"
            >
              <div onClick={action.onClick}>{action.icon}</div>
            </Tippy>
          ))}
        </div>
      </div>
      {isSuccess ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
          <div className="order-2">
            <div>
              <p className={styles.title}>
                <span className="">Choose NFT</span>
                <span className="text-red">*</span>
              </p>
              <div
                className="w-full p-2 mb-4 border rounded-lg border-secondary5"
                onClick={handleSearchNFT}
              >
                <div className="flex justify-between cursor-pointer text-dark3">
                  <div className="flex gap-x-2 text-secondary5">
                    <NFTIcon
                      width={24}
                      height={24}
                      className="fill-secondary5"
                    />
                    <p>{data?.metadata?.name}</p>
                  </div>
                  <DownIcon width={24} height={24} />
                </div>
              </div>
            </div>
            <div>
              <p className={styles.title}>
                <span className="">Choose Token</span>
                <span className="text-red">*</span>
              </p>
              <div
                className="w-full p-2 mb-4 border rounded-lg border-secondary5"
                onClick={handleSearchToken}
              >
                <div className="flex justify-between cursor-pointer text-dark3">
                  <div className="flex gap-x-2 text-secondary5">
                    {tokenSymbolIcon ? (
                      <div>
                        {/* @ts-ignore */}
                        <tokenSymbolIcon.logo
                          width={24}
                          height={24}
                          className="fill-secondary5"
                        />
                      </div>
                    ) : (
                      <div>
                        <TokenIconNotDefine
                          width={24}
                          height={24}
                          className="fill-secondary5"
                        />
                      </div>
                    )}
                    {data?.tokenSymbol}
                  </div>
                  <DownIcon width={24} height={24} />
                </div>
              </div>
            </div>
            <div>
              <p className={styles.title}>
                <span className="">Deposit</span>
                <span className="text-red">*</span>
              </p>
              <div>
                <div className="flex justify-between mb-1 text-dark1">
                  <p>NFT</p>
                  <p>Balance: {account ? formatNumber(balanceNFT) : 0}</p>
                </div>
                <div
                  className={`relative p-2 border rounded-lg border-dark3 ${
                    !inputNFT && isInputNFT && "border-red"
                  }`}
                >
                  <input
                    className="font-semibold border-none outline-none text-dark3 placeholder:font-semibold"
                    type="number"
                    placeholder="Input amount NFT"
                    value={inputNFT}
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
                    onChange={handleGetNFT}
                  />
                  <div className="flex justify-end mt-8">
                    {activeNFTPercent.map((item, index) => (
                      <button
                        type="button"
                        className={`ml-3 text-[10px] text-dark3 p-1 border-dark3 border rounded-lg ${
                          item.text === activeChoiceNFT &&
                          "bg-secondary5 text-white"
                        }`}
                        key={index}
                        onClick={() => {
                          setInputNFT(
                            Math.floor(
                              item.percent * Number(balanceNFT)
                            ).toString()
                          );
                          setActiveChoiceNFT(item.text);
                        }}
                      >
                        {item.text}
                      </button>
                    ))}
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
              <div>
                <div className="flex justify-between mt-4 mb-1 text-dark1">
                  <p>Token</p>
                  <p>Balance: {account ? formatNumber(balanceToken) : 0}</p>
                </div>
                {data.dmlAddress === null ? (
                  <input
                    className="input_item"
                    pattern="^[0-9]*[.,]?[0-9]*$"
                    spellCheck="false"
                    minLength={1}
                    maxLength={79}
                    type="text"
                    inputMode="decimal"
                    placeholder="Input amount Token"
                    value={inputToken}
                    onChange={handleGetToken}
                  />
                ) : (
                  <div>
                    {data ? (
                      <div className="input_item">
                        <FormatNumber number={amountErcDesiredToDec} />
                      </div>
                    ) : (
                      <div className="input_item">
                        <BiLoaderAlt className="text-3xl animate-spin text-secondary5" />
                      </div>
                    )}
                  </div>
                )}
                {isSufficientToken && (
                  <p
                    className="mb-2 ml-3 -mt-2 text-xs text-red"
                    key="inputNFT"
                  >
                    Insufficient Token balance
                  </p>
                )}
              </div>
            </div>
            {!isApprovedNFT && account && (
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
            {isApprovedNFT && account && (
              <Button
                className="w-[126px] py-2"
                primary
                onClick={handleAddLiquidity}
              >
                ADD LIQUIDITY
              </Button>
            )}
            {!account && (
              <Button className="w-[144px] py-2" primary onClick={handleOpen}>
                CONNECT WALLET
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
            <div className="flex flex-col items-center w-full h-full ">
              <MediaNFT data={data} isControls={true} />
              <p
                className="mt-2 text-xs text-secondary5 hover:cursor-pointer hover:text-secondary3"
                onClick={handleShowDetail}
              >
                Show detail
              </p>
            </div>
          </div>
        </div>
      ) : (
        <SkeletonAddLiquidity />
      )}
      {isLoading && !isSuccess && <SkeletonAddLiquidity />}
      <ModalSearchNFT
        setIsOpenSearchNFT={setIsOpenSearchNFT}
        isOpenSearchNFT={isOpenSearchNFT}
      />
      <ModalSetting
        isOpenSetting={isOpenSetting}
        setIsOpenSetting={setIsOpenSetting}
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
      <ModalTransation
        isOpenTransation={isOpenTransaction}
        setIsOpenTransaction={setIsOpenTransaction}
        isTransaction={true}
      />
      {data && account && (
        <ModalConfirmAddLiquidity
          isOpenConfirmAddLiquidity={isOpenConfirmAddLiquidity}
          isOpenTransaction={isOpenTransaction}
          setIsOpenTransaction={setIsOpenTransaction}
          tokenAddress={tokenAddress}
          nftAddress={nftAddress}
          idNFT={idNFT}
          data={data}
          inputToken={inputToken}
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
