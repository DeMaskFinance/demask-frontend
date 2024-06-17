import Button from "@/components/Buttons/Button";
import FormatNumber from "@/components/Common/FormatNumber";
import MediaNFT from "@/components/Common/MediaNFT";
import {
  CreateIcon,
  EtherIcon,
  EyeIcon,
  LeftIcon,
  NFTIcon,
  RefetchIcon,
  SettingIcon,
  SwapIcon,
  TokenIconNotDefine,
} from "@/components/Icons";
import { ModalConfirmAddLiquidity } from "@/components/Modal/ModalConfirmAddLiquidity";
import { ModalDetail } from "@/components/Modal/ModalDedail";
import { ModalSearchNFT } from "@/components/Modal/ModalSearchNFT";
import { ModalSearchToken } from "@/components/Modal/ModalSearchToken";
import ModalSetting from "@/components/Modal/ModalSetting";
import {
  ModalError,
  ModalTransation,
} from "@/components/Modal/ModalTransation";
import { ModalSuccess } from "@/components/Modal/ModalTransation/ModalSuccess";
import { ModalWallet } from "@/components/Modal/ModalWallet";
import { TabGroups } from "@/components/NavChoice";
import { SkeletonAddLiquidity } from "@/components/Skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import AccountContext from "@/context/AccountContext";
import useNFTBalance from "@/hooks/useBalanceNFT";
import useBalanceToken from "@/hooks/useInformationToken";
import { usePreventUserFromErasingContent } from "@/hooks/usePreventUserFromErasingContent";
import { swapAPI } from "@/libs/service";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import ercContract from "@/libs/utils/erc/erc.contract";
import formatNumber from "@/libs/utils/formatNumer";
import handleApproveNFT from "@/libs/utils/handleApproveNFT";
import handleBignumber from "@/libs/utils/handleBignumber";
import { useQuery } from "@tanstack/react-query";
import Tippy from "@tippyjs/react";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { FaAngleDown } from "react-icons/fa";
import { NumericFormat } from "react-number-format";
import { SEO } from "../../next-seo.config";
const styles = {
  title: "block mb-1 mt-5 text-base font-semibold text-shader_100",
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
    setInputNFT(e.target.value.replace(/,/g, ""));
    if (Number(e.target.value.replace(/,/g, "")) > Number(balanceNFT)) {
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
          width={18}
          height={18}
          className="cursor-pointer text-primary_200"
        />
      ),
      content: "Refresh",
      // onClick: () => {
      //   refresh();
      // },
    },
    {
      icon: (
        <SwapIcon
          width={18}
          height={18}
          className="cursor-pointer text-primary_200"
        />
      ),
      content: "Swap",
      link: `/swap/${nftAddress}/${tokenAddress}/${idNFT}?chainId=${chainId}`,
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
    setInputNFT(
      Math.floor((parseFloat(item) / 100) * +data.reserveNFT).toString()
    );
    // setShowRequiredMessage(false);
    setActiveChoiceNFT(item);
  };

  return (
    <div className="max-w-4xl mx-auto min-h-[94vh] pb-24 lg:pb-8 pt-6">
      <NextSeo {...updateMeta} />
      <div className="flex items-center justify-between ">
        <div className="">
          <div className="sticky top-16">
            <div
              className="flex items-center cursor-pointer gap-x-2"
              onClick={() => router.back()}
            >
              <LeftIcon width={20} height={20} />

              <p className="font-semibold text-white">Back</p>
            </div>
            <h2 className="mt-4 text-xl font-bold text-primary_300">
              Add Liquidity
            </h2>
          </div>
        </div>
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
      {isLoading || isFetching ? (
        <SkeletonAddLiquidity />
      ) : isSuccess ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
          <div className="order-2">
            <div>
              <p className="title_label">
                <span className="">Choose NFT</span>
                <span className="text-red">*</span>
              </p>
              <div className="input_item" onClick={handleSearchNFT}>
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
            </div>
            <div>
              <p className="title_label">
                <span className="">Choose Token</span>
                <span className="text-red">*</span>
              </p>
              <div className="input_item" onClick={handleSearchToken}>
                <div className="flex items-center justify-between cursor-pointer text-shader_500">
                  <div className="flex items-center gap-x-2 title">
                    {tokenSymbolIcon ? (
                      <div>
                        {/* @ts-ignore */}
                        <tokenSymbolIcon.logo width={20} height={20} />
                      </div>
                    ) : (
                      <div>
                        <TokenIconNotDefine
                          width={24}
                          height={24}
                          className="fill-primary_400"
                        />
                      </div>
                    )}
                    {data?.tokenSymbol}
                  </div>
                  <FaAngleDown className="text-white transition-all duration-150 group-hover:rotate-180" />
                </div>
              </div>
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
                        <BiLoaderAlt className="text-3xl animate-spin text-primary_400" />
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
                className="w-full py-3"
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
                Approve NFT
              </Button>
            )}
            {isApprovedNFT && account && (
              <Button
                className="w-full py-3"
                primary
                onClick={handleAddLiquidity}
              >
                Add Liquidity
              </Button>
            )}
            {!account && (
              <Button className="w-[144px] py-2" primary onClick={handleOpen}>
                Connect Wallet
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
                      className="absolute flex px-3 py-2 text-sm font-semibold text-white translate-x-1/2 rounded-lg cursor-pointer bottom-2 whitespace-nowrap right-1/2 gap-x-2 bg-shader_500"
                      third
                    >
                      View Detail
                      <EyeIcon width={16} height={16} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-full bg-shader_800 border border-shader_500 p-4">
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
              </div>
            </div>
          </div>
        </div>
      ) : (
        <SkeletonAddLiquidity />
      )}
      {/* {(isLoading || isFetching) && !isSuccess && <SkeletonAddLiquidity />} */}
      <ModalSearchNFT
        setIsOpenSearchNFT={setIsOpenSearchNFT}
        isOpenSearchNFT={isOpenSearchNFT}
      />
      <ModalSetting
        isOpenSetting={isOpenSetting}
        setIsOpenSetting={setIsOpenSetting}
      />
      <ModalWallet isOpen={isOpen} setIsOpen={setIsOpen} />
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
