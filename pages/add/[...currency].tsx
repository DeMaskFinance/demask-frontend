import abiErc1155 from "@/abi/abiErc1155.json";
import abiErc20 from "@/abi/abiErc20.json";
import abiRouter from "@/abi/abiRouter.json";
import Button from "@/components/Buttons/Button";
import { BackIcon, DownIcon, NFTIcon, TokenIconNotDefine } from "@/components/Icons";
import { ModalDetail } from "@/components/Modal/ModalDedail";
import { ModalSearchNFT } from "@/components/Modal/ModalSearchNFT";
import { ModalSearchToken } from "@/components/Modal/ModalSearchToken";
import { ModalTransation } from "@/components/Modal/ModalTransation";
import { ModalWallet } from "@/components/Modal/ModalWallet";
import TransitionURL from "@/components/Toast/TransionURL";
import AccountContext from "@/context/AccountContext";
import useNFTBalance from "@/hooks/useBalanceNFT";
import useDMLToken from "@/hooks/useDMLToken";
import useFetchReservesDML from "@/hooks/useFetchReservesDML";
import useBalanceToken from "@/hooks/useInformationToken";
import { getProvider } from "@/libs/connection/getProvider";
import approveNFT from "@/libs/utils/approveNFT";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import handleBignumber from "@/libs/utils/handleBignumber";
import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NextSeo } from "next-seo";
import { SEO } from '../../next-seo.config';
import { swapAPI } from "@/libs/service";
import { SkeletonAddLiquidity } from "@/components/Skeleton";
const styles = {
  title: "block mb-4 text-base font-medium text-black24",
  inputItem: "w-full p-2 mb-4 border rounded-lg border-dark3",
  btnActive: "rounded-full bg-base2",
};
const updateMeta = {
  ...SEO,
  title: 'Add Liquidity',
};
export default function AddLiquidity() {
  const router = useRouter();
  const [nftAddress, setNftAddress] = useState<string>("");
  const [tokenAddress, setTokenAddress] = useState<string>("");
  const [inputNFT, setInputNFT] = useState<string>("");
  const [inputToken, setInputToken] = useState<string>("");
  const [idNFT, setIdNFT] = useState("");
  const [isSufficientNFT, setIsSufficientNFT] = useState<boolean>(false);
  const [isSufficientToken, setIsSufficientToken] = useState<boolean>(false);
  const [isApprovedNFT, setIsApprovedNFT] = useState<boolean>(false);
  const [isApprovedToken, setIsApprovedToken] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false);
  const [isOpenSearchNFT, setIsOpenSearchNFT] = useState<boolean>(false);
  const [isOpenSearchToken, setIsOpenSearchToken] = useState<boolean>(false);
  const [amountErcDesired, setAmountErcDesired] = useState<any>();
  const { currency } = router.query;
  const { account, wallet, chainId, demask, tokenDefault } = useContext(AccountContext);
  const [isInputNFT, setIsInputNFT] = useState<boolean>(false);
  const [amountErcDesiredToDec, setAmountErcDesiredToDec] = useState<any>('0');
  const [checkApproveNFT, setCheckApproveNFT] = useState<boolean>(false);
  const [checkApproveToken, setCheckApproveToken] = useState<boolean>(false);
  const [isOpenTransaction, setIsOpenTransaction] = useState<boolean>(false);
  const [tokenSymbolIcon, setTokenSymbolIcon] = useState();
  const [symbolToken, setSymbolToken] = useState<string>('');
  const { ROUTER: routerAddress, RPC: rpc, NATIVE_ADDRESS: nativeAddress } = demask;
  useEffect(() => {
    if (currency) {
      setNftAddress(currency[0]);
      setTokenAddress(currency[1]);
      setIdNFT(currency[2]);
      setInputNFT('');
      setIsSufficientNFT(false);
      setIsSufficientToken(false);
    }
  }, [currency]);
  const { isLoading, data, isFetching, isSuccess, refetch } = useQuery({
    queryKey: ["liquidity", idNFT, nftAddress, chainId, tokenAddress],
    queryFn: async () => {
      try {
        const res = await swapAPI(tokenAddress.toLocaleLowerCase(), chainId, nftAddress.toLowerCase(), idNFT);
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

  const balanceNFT = useNFTBalance(account, nftAddress, idNFT, wallet, isOpenTransaction);

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
      console.log("Insufficient NFT balance");
      setIsSufficientNFT(true);
    } else {
      setIsSufficientNFT(false);
    }
  };
  useEffect(() => {
    let amountErcDesired;
    if (
      data?.dmlAddress !== null &&
      data &&
      inputNFT
    ) {
      console.log(data.reserveTokenDecimals);
      console.log(data.reserveNFT);

      // amountErcDesired = ethers.BigNumber.from(inputNFT)
      //   .mul(data.reserveTokenDecimals)
      //   .div(data.reserveNFT)
      //   .mul(105)
      //   .div(100);
      //   console.log(amountErcDesired.toString());
      amountErcDesired = Number(inputNFT) * +(data.reserveTokenDecimals) / +(data.reserveNFT) * 1.05;
      console.log(amountErcDesired);

    } else {
      console.log(data?.tokenDecimals);

      amountErcDesired = handleBignumber(
        Number(inputToken),
        Number(data?.tokenDecimals)
      );
    }
    setAmountErcDesired(amountErcDesired);
    if (amountErcDesired) {
      const amountErcDesiredToDec = divideByDecimal(
        amountErcDesired?.toString(),
        data?.tokenDecimals
      );
      setAmountErcDesiredToDec(amountErcDesiredToDec.toString());
      if (Number(amountErcDesired) > Number(bigNumberBalance)) {
        setIsSufficientToken(true)
      } else {
        setIsSufficientToken(false);
      }
    }
  }, [inputNFT, inputToken, data]);
  console.log(amountErcDesired);

  useEffect(() => {
    if (tokenDefault && data) {
      if (data.tokenSymbol !== tokenDefault[0].symbolNative) {
        setSymbolToken(data.tokenSymbol)
      } else {
        setSymbolToken(tokenDefault[0].symbol)
      }
    }
  }, [data, tokenDefault, chainId])
  
  useEffect(() => {
    console.log(tokenAddress);
    if (tokenAddress) {
      const icon = (tokenDefault || []).find((item: any) => item.address.toLowerCase() === tokenAddress);
      setTokenSymbolIcon(icon);
    }
  }, [currency, chainId, tokenAddress])

  const handleGetToken = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputToken(e.target.value);
    if (Number(e.target.value) > Number(balanceToken)) {
      console.log("Insufficient Token balance");
      setIsSufficientToken(true);
    } else {
      setIsSufficientToken(false);
    }
  };

  const addLiquidity = async () => {
    if (!account) {
      setIsOpen(true);
      return;
    }

    if (inputNFT && !isSufficientNFT && !isSufficientToken && Math.floor(amountErcDesired) !== 0) {
      const providerChoice = getProvider(wallet);
      const provider = new ethers.providers.Web3Provider(providerChoice);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(routerAddress, abiRouter, signer);

      try {
        let result;
        let transactionHash;
        setIsOpenTransaction(true);
        if (tokenAddress === nativeAddress) {
          result = await contract.addLiquidityETH(
            nftAddress,
            idNFT,
            inputNFT,
            0,
            account,
            Math.floor((new Date().getTime() + 20 * 60000) / 1000),
            { gasLimit: 8000000, value: Math.floor(amountErcDesired).toString() }
          );
          transactionHash = result.hash;
        } else {
          result = await contract.addLiquidity(
            tokenAddress,
            nftAddress,
            idNFT,
            Math.floor(amountErcDesired).toString(),
            inputNFT,
            0,
            account,
            Math.floor((new Date().getTime() + 20 * 60000) / 1000),
            { gasLimit: 8000000 }
          );
          transactionHash = result.hash;
        }
        await provider.waitForTransaction(transactionHash);
        setIsOpenTransaction(false);
        setInputNFT('');
        setInputToken('');
        setAmountErcDesiredToDec('');
        toast.success(
          <TransitionURL
            type={"Add Liquidity"}
            transactionHash={transactionHash}
          />,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          }
        );
      } catch (error) {
        setIsOpenTransaction(false);
        console.error(error);
      }
    } else {
      setIsInputNFT(true);
    }
  };

  const handleApproveToken = async () => {
    if (account) {
      const providerChoice = getProvider(wallet);
      const provider = new ethers.providers.Web3Provider(providerChoice);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(tokenAddress, abiErc20, signer);
      try {
        const result = await contract.approve(routerAddress, inputToken);
        await provider.waitForTransaction(result.hash);
        setCheckApproveToken(true);
      } catch (error) {
        console.error(error);
      }
    } else {
      setIsOpen(true);
    }
  };
  useEffect(() => {
    const handleCheckApproveToken = async () => {
      if (tokenAddress === nativeAddress) {
        setIsApprovedToken(true);
      } else {
        if (amountErcDesired && allowanceToken) {
          if (Number(allowanceToken) < Number(amountErcDesired.toString())) {
            setIsApprovedToken(false);
          } else {
            setIsApprovedToken(true);
          }
        }
      }
    };
    handleCheckApproveToken();
  }, [account, wallet, tokenAddress, inputToken, checkApproveToken, amountErcDesired, allowanceToken]);
  // console.log(amountErcDesired.toString());
  // console.log(amountErcDesiredToDec);

  useEffect(() => {
    const checkApproveNFT = async () => {
      const result = await approveNFT(account, wallet, nftAddress, routerAddress);
      setIsApprovedNFT(result);
    };
    checkApproveNFT();
  }, [account, nftAddress, wallet, checkApproveNFT]);
  const handleApproveNFT = async () => {
    if (account) {
      const providerChoice = getProvider(wallet);
      const provider = new ethers.providers.Web3Provider(providerChoice);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(nftAddress, abiErc1155, signer);
      try {
        const result = await contract.setApprovalForAll(routerAddress, true);
        await provider.waitForTransaction(result.hash);
        setCheckApproveNFT(true);
      } catch (error) {
        console.error(error);
      }
    } else {
      setIsOpen(true);
    }
  };
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

  return (
    <div className="px-4 py-8 lg:px-secondary md:px-14">
      <NextSeo {...updateMeta} />
      <div className="flex items-center mb-6">
        <Link href="/liquidity">
          <BackIcon width={24} height={24} />
        </Link>
        <h2 className="text-2xl text-black24 ml-[18px]">Add Liquidity</h2>
      </div>
      {isSuccess ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
          <div className="order-2">
            <div>
              <p className={styles.title}>
                <span className="">Choose NFT</span>
                <span className="text-red">*</span>
              </p>
              <div className='w-full p-2 mb-4 border rounded-lg border-secondary5' onClick={handleSearchNFT}>
                <div className="flex justify-between cursor-pointer text-dark3">
                  <div className="flex gap-x-2 text-secondary5">
                    <NFTIcon width={24} height={24} className="fill-secondary5" />
                    <p>{data.metadata.name}</p>
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
              <div className='w-full p-2 mb-4 border rounded-lg border-secondary5' onClick={handleSearchToken}>
                <div className="flex justify-between cursor-pointer text-dark3">
                  <div className="flex gap-x-2 text-secondary5">
                    {tokenSymbolIcon ? (
                      <div>
                        {/* @ts-ignore */}
                        <tokenSymbolIcon.logo width={24} height={24} className="fill-secondary5" />
                      </div>
                    ) : (
                      <div>
                        <TokenIconNotDefine width={24} height={24} className="fill-secondary5" />
                      </div>
                    )}
                    {symbolToken}
                  </div>
                  <DownIcon width={24} height={24} />
                </div>
              </div>
            </div>
            <div>
              <p className={styles.title}>Fee</p>
              <Button className="p-2 mb-4 text-white bg-secondary5">0.5%</Button>
            </div>
            <div>
              <p className={styles.title}>
                <span className="">Deposit</span>
                <span className="text-red">*</span>
              </p>
              <div>
                <div className="flex justify-between mb-4 text-dark1">
                  <p>NFT</p>
                  <p>Balance: {balanceNFT}</p>
                </div>
                <input
                  className={styles.inputItem}
                  type="number"
                  placeholder="Input amount NFT"
                  value={inputNFT}
                  onChange={handleGetNFT}
                />
                {isSufficientNFT && (
                  <p className="mb-2 ml-3 -mt-1 text-xs text-red" key="totalSale">
                    Insufficient NFT balance
                  </p>
                )}
                {isInputNFT && (
                  <p className="mb-2 ml-3 -mt-1 text-xs text-red" key="inputNFT">
                    Required
                  </p>
                )}
              </div>
              <div>
                <div className="flex justify-between mb-4 text-dark1">
                  <p>Token</p>
                  <p>Balance: {balanceToken}</p>
                </div>
                {(data.dmlAddress === null) ? (
                  <input
                    className={styles.inputItem}
                    type="number"
                    placeholder="Input amount Token"
                    value={inputToken}
                    onChange={handleGetToken}
                  />
                ) : (
                  <div>
                    {data ? (
                      <div className={styles.inputItem}>
                        {amountErcDesiredToDec}
                      </div>
                    ) : (
                      <div className={styles.inputItem}>
                        <BiLoaderAlt className="text-3xl animate-spin text-secondary5" />
                      </div>
                    )}
                  </div>
                )}
                {isSufficientToken && (
                  <p className="mb-2 ml-3 -mt-1 text-xs text-red" key="inputNFT">
                    Insufficient Token balance
                  </p>
                )}
              </div>
            </div>
            {!isApprovedNFT && (
              <Button className="w-[126px] py-2" primary onClick={handleApproveNFT}>
                APPROVE NFT
              </Button>
            )}
            {isApprovedNFT && !isApprovedToken && tokenAddress !== nativeAddress && (
              <Button
                className="w-[126px] py-2"
                primary
                onClick={handleApproveToken}
              >
                APPROVE TOKEN
              </Button>
            )}
            {isApprovedNFT && isApprovedToken && (
              <Button className="w-[126px] py-2" primary onClick={addLiquidity}>
                ADD LIQUIDITY
              </Button>
            )}
            {Math.floor(amountErcDesired) === 0 && inputNFT && (
              <p className="mt-3 ml-3 text-xs text-red" key="inputNFT">
                Can't add liquidity
              </p>
            )}
          </div>
          <div className="order-1 w-full lg:order-2">
            <div className="flex flex-col items-center w-full h-full ">
              <>
                {data?.metadata && (
                  <div className="flex flex-col items-center">
                    <div className="flex flex-col items-center justify-center w-full h-full text-center ">
                      {data.metadata?.image && (
                        <Image
                          src={data.metadata.image}
                          alt="test"
                          width={680}
                          height={576}
                          sizes="(max-width: 770px) 100vw"
                          className="w-full rounded-lg lg:max-h-[80vh]"
                          style={{
                            objectFit: "contain",
                          }}
                        />
                      )}
                      {!data.metadata?.image && data.metadata?.animation_url && (
                        <video
                          src={data.metadata.animation_url}
                          autoPlay
                          loop
                          muted
                          controls
                          className="w-full rounded-lg"
                        />
                      )}
                      {data.metadata?.image && data.metadata?.animation_url && (
                        <audio
                          autoPlay
                          loop
                          muted
                          controls
                          src={data.metadata.animation_url}
                          className="mt-4 mb-2"
                        >
                          Your browser does not support the
                          <code>audio</code> element.
                        </audio>
                      )}
                    </div>
                    <p
                      className="mt-2 text-sm text-secondary5 hover:cursor-pointer hover:text-secondary3"
                      onClick={handleShowDetail}
                    >
                      Show detail
                    </p>
                  </div>
                )}
              </>

            </div>
          </div>
        </div>
      ):(
        <SkeletonAddLiquidity/>
      )}
      {isLoading && !isSuccess && (
        <SkeletonAddLiquidity/>
      )}
      <ModalSearchNFT
        setIsOpenSearchNFT={setIsOpenSearchNFT}
        isOpenSearchNFT={isOpenSearchNFT}
      />
      <ModalWallet isOpen={isOpen} setIsOpen={setIsOpen} />
      {data?.metadata && (
        <ModalDetail
          nameNFT={data.metadata.name}
          symbolNFT={data.metadata.symbol}
          category={data.metadata.category}
          attributes={data.metadata.attributes}
          description={data.metadata.description}
          uri={data.uri}
          setIsOpenDetail={setIsOpenDetail}
          isOpenDetail={isOpenDetail}
        />
      )}
      <ModalSearchToken
        setIsOpenSearchToken={setIsOpenSearchToken}
        isOpenSearchToken={isOpenSearchToken}
      />
      <ModalTransation isOpenTransation={isOpenTransaction} setIsOpenTransaction={setIsOpenTransaction} isTransaction={true} />
      <ToastContainer />
    </div>
  );
}
