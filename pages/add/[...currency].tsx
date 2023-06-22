import Button from "@/components/Buttons/Button";
import { BackIcon, DownIcon, NFTIcon, TokenIcon } from "@/components/Icons";
import { ModalSearchNFT } from "@/components/Modal/ModalSearchNFT";
import { BigNumber, ethers } from "ethers";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect, useContext } from "react";
import { getProvider } from "@/libs/connection/getProvider";
import AccountContext from "@/context/AccountContext";
import useMetadata from "@/hooks/useMetadata";
import abiErc20 from "@/abi/abiErc20.json";
import abiRouter from "@/abi/abiRouter.json";
import getDMLToken from "@/libs/utils/getDMLToken";
import getBalanceNFT from "@/libs/utils/getBalanceNFT";
import approveNFT from "@/libs/utils/approveNFT";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import approveToken from "@/libs/utils/approveToken";
import { ModalWallet } from "@/components/Modal/ModalWallet";
import { ModalDetail } from "@/components/Modal/ModalDedail";
import { ModalSearchToken } from "@/components/Modal/ModalSearchToken";
import handleBignumber from "@/libs/utils/handleBignumber";
import getReserves from "@/libs/utils/getReserves";
import BigNumberJS from "bignumber.js";
import abiErc1155 from "@/abi/abiErc1155.json";
import TransitionURL from "@/components/Toast/TransionURL";
import Web3 from "web3";
import handleBignumbertoDec from "@/libs/utils/handleBigNumbertoDec";
const styles = {
  title: "block mb-4 text-base font-medium text-black24",
  inputItem: "w-full p-2 mb-4 border rounded-lg border-dark3",
  btnActive: "rounded-full bg-base2",
};
export default function AddLiquidity() {
  const router = useRouter();
  const [nftAddress, setNftAddress] = useState<string>("");
  const [tokenAddress, setTokenAddress] = useState<string>("");
  const [balanceNFT, setBalanceNFT] = useState("0");
  const [balanceToken, setBalanceToken] = useState("0");
  const [decimals, setDecimals] = useState("");
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
  const [reserves, setReserves] = useState();
  const [amountErcDesired, setAmountErcDesired] = useState<any>();
  const [symbolToken, setSymbolToken] = useState<string>("USDT");
  const { currency } = router.query;
  const { account, wallet } = useContext(AccountContext);
  const [dmlToken, setDmlToken] = useState<string>();
  const [isInputNFT, setIsInputNFT] = useState<boolean>(false);
  const [amountErcDesiredToDec, setAmountErcDesiredToDec] = useState<any>();
  useEffect(() => {
    if (currency) {
      setNftAddress(currency[0]);
      setTokenAddress(currency[1]);
      setIdNFT(currency[2]);
    }
  }, [currency]);
  const {
    nameNFT,
    imageNFT,
    symbolNFT,
    category,
    attributes,
    animationUrl,
    description,
  } = useMetadata(nftAddress, idNFT);
  useEffect(() => {
    const fetchBalanceNFT = async () => {
      if (account && nftAddress && idNFT) {
        try {
          // console.log(nftAddress);
          // console.log(idNFT);
          // console.log(account);

          const balance = await getBalanceNFT(
            account,
            wallet,
            nftAddress,
            idNFT
          );
          setBalanceNFT(balance);
        } catch (error) {
          return error;
        }
      } else {
        setBalanceNFT("0"); //No Account
      }
    };
    fetchBalanceNFT();
  }, [account, idNFT, nftAddress, wallet]);

  useEffect(() => {
    const getBalanceToken = async () => {
      if (account && tokenAddress) {
        if (tokenAddress === "MATIC") {
          const provider = new ethers.providers.JsonRpcProvider(
            "https://rpc.ankr.com/polygon_mumbai"
          );
          console.log(provider);

          try {
            console.log(account);
            console.log(wallet);
            const balance = await provider.getBalance(account);
            const balanceInMatic = parseFloat(
              ethers.utils.formatEther(balance)
            ).toFixed(4);
            setBalanceToken(balanceInMatic);
          } catch (error) {
            console.error(error);
          }
        } else {
          const providerChoice = getProvider(wallet);
          const provider = new ethers.providers.Web3Provider(providerChoice);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(tokenAddress, abiErc20, signer);
          try {
            const bigNumberBalance = await contract.balanceOf(account);
            const decimals = await contract.decimals();
            const decimalsInt = Number(decimals);
            const divisor = ethers.BigNumber.from(10).pow(decimalsInt);
            const balance = bigNumberBalance.div(divisor);
            setBalanceToken(balance.toString());
            setDecimals(decimals);
          } catch (error) {
            console.error(error);
          }
        }
      } else {
        setBalanceToken("0"); //No Account
      }
    };
    getBalanceToken();
  }, [account, tokenAddress, wallet]);
  useEffect(() => {
    const fetchDataDML = async () => {
      try {
        const dmlToken = await getDMLToken(
          nftAddress,
          idNFT,
          tokenAddress,
          wallet
        );
        console.log(dmlToken);

        setDmlToken(dmlToken);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDataDML();
  }, [nftAddress, idNFT, tokenAddress]);
  useEffect(() => {
    const fetchReservesDML = async () => {
      try {
        if (dmlToken) {
          const reserves = await getReserves(dmlToken, wallet);
          setReserves(reserves);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchReservesDML();
  }, [dmlToken, wallet, inputNFT]);
  console.log(dmlToken);
  console.log(reserves);
  console.log(balanceNFT);
  console.log(balanceToken);
  console.log(amountErcDesired);
  // console.log(nftAddress);
  console.log(tokenAddress);
  // console.log(idNFT);

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
    if (tokenAddress !== "MATIC") {
      let amountErcDesired;
      if (
        dmlToken !== "0x0000000000000000000000000000000000000000" &&
        reserves &&
        inputNFT
      ) {
        amountErcDesired = ethers.BigNumber.from(inputNFT)
          .mul(reserves[0])
          .div(reserves[1])
          .mul(105)
          .div(100);
      } else {
        amountErcDesired = handleBignumber(
          Number(inputToken),
          Number(decimals)
        );
      }
      setAmountErcDesired(amountErcDesired);
      const amountErcDesiredToDec = handleBignumbertoDec(amountErcDesired, 18);
      setAmountErcDesiredToDec(amountErcDesiredToDec.toString());
    }
  }, [inputNFT, inputToken]);

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

    if (inputNFT && !isSufficientNFT && !isSufficientToken) {
      const providerChoice = getProvider(wallet);
      const provider = new ethers.providers.Web3Provider(providerChoice);
      const signer = provider.getSigner();
      const routerAddress = process.env.NEXT_PUBLIC_ROUTER || "";
      const contract = new ethers.Contract(routerAddress, abiRouter, signer);
      const value = handleBignumber(Number(inputToken),18);

      try {
        let result;
        let transactionHash;

        if (tokenAddress === "MATIC") {
          result = await contract.addLiquidityETH(
            nftAddress,
            idNFT,
            inputNFT,
            0,
            account,
            Math.floor((new Date().getTime() + 20 * 60000) / 1000),
            { gasLimit: 8000000, value }
          );
          transactionHash = result.hash;
        } else {
          result = await contract.addLiquidity(
            tokenAddress,
            nftAddress,
            idNFT,
            amountErcDesired,
            inputNFT,
            0,
            account,
            Math.floor((new Date().getTime() + 20 * 60000) / 1000),
            { gasLimit: 8000000 }
          );
          transactionHash = result.hash;
        }

        console.log(transactionHash);
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
        console.error(error);
      }
    } else {
      setIsInputNFT(true);
    }
  };

  const hanldeApproveToken = async () => {
    if (account) {
      const providerChoice = getProvider(wallet);
      const provider = new ethers.providers.Web3Provider(providerChoice);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(tokenAddress, abiErc20, signer);
      const routerAddress = process.env.NEXT_PUBLIC_ROUTER || "";
      try {
        await contract.approve(routerAddress, inputToken);
        setIsApprovedToken(true);
      } catch (error) {
        console.error(error);
      }
    } else {
      setIsOpen(true);
    }
  };
  useEffect(() => {
    const checkApproveToken = async () => {
      const currentAllowance = await approveToken(
        account,
        wallet,
        tokenAddress
      );
      console.log(currentAllowance);

      if (Number(currentAllowance) < Number(amountErcDesired)) {
        setIsApprovedToken(false);
      } else {
        setIsApprovedToken(true);
      }
    };
    checkApproveToken();
  }, [account, wallet, tokenAddress,inputToken]);

  useEffect(() => {
    const checkApproveNFT = async () => {
      const result = await approveNFT(account, wallet, nftAddress);
      setIsApprovedNFT(result);
    };
    checkApproveNFT();
  }, [account, nftAddress, wallet]);
  const hanldeApproveNFT = async () => {
    if (account) {
      const providerChoice = getProvider(wallet);
      const provider = new ethers.providers.Web3Provider(providerChoice);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(nftAddress, abiErc1155, signer);
      const routerAddress = process.env.NEXT_PUBLIC_ROUTER || "";
      try {
        await contract.setApprovalForAll(routerAddress, true);
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
    <div className="grid grid-cols-2 py-8 px-secondary gap-7">
      <Head>
        <title>Add Liquidity | DeMask</title>
      </Head>
      <div className="">
        <div className="flex items-center mb-6">
          <Link href="/liquidity">
            <BackIcon width={24} height={24} />
          </Link>
          <h2 className="text-2xl text-black24 ml-[18px]">Add Liquidity</h2>
        </div>
        <div>
          <p className={styles.title}>
            <span className="">Choose NFT</span>
            <span className="text-red">*</span>
          </p>
          <div className={styles.inputItem} onClick={handleSearchNFT}>
            <div className="flex justify-between cursor-pointer text-dark3">
              <div className="flex gap-x-2">
                <NFTIcon width={24} height={24} />
                {nameNFT}
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
          <div className={styles.inputItem} onClick={handleSearchToken}>
            <div className="flex justify-between cursor-pointer text-dark3">
              <div className="flex gap-x-2">
                <TokenIcon width={24} height={24} />
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
            {tokenAddress === "MATIC" ||
            dmlToken === "0x0000000000000000000000000000000000000000" ? (
              <input
                className={styles.inputItem}
                type="number"
                placeholder="Input amount Token"
                value={inputToken}
                onChange={handleGetToken}
              />
            ) : (
              <div className={styles.inputItem}>{amountErcDesiredToDec}</div>
            )}
            {isSufficientToken && (
              <p className="mb-2 ml-3 -mt-1 text-xs text-red" key="inputNFT">
                Insufficient Token balance
              </p>
            )}
          </div>
        </div>
        {!isApprovedNFT && (
          <Button className="w-[126px] py-2" primary onClick={hanldeApproveNFT}>
            APPROVE NFT
          </Button>
        )}
        {isApprovedNFT && !isApprovedToken && (
          <Button
            className="w-[126px] py-2"
            primary
            onClick={hanldeApproveToken}
          >
            APPROVE TOKEN
          </Button>
        )}
        {isApprovedNFT && isApprovedToken && (
          <Button className="w-[126px] py-2" primary onClick={addLiquidity}>
            ADD LIQUIDITY
          </Button>
        )}
        {/* <Button primary className="p-2" onClick={getBalanceNative}>
   
          Check
        </Button> */}
      </div>
      <div>
        <div className="flex flex-col items-center w-[504px] h-full ">
          <div className="flex flex-col items-center justify-center w-full h-full text-center ">
            <Image
              src={imageNFT}
              width={504}
              height={100}
              alt="pictureLiquidity"
              className="w-[504px] h-full rounded-2xl"
              unoptimized
            />
          </div>
          <p
            className="mt-2 text-sm text-secondary5 hover:cursor-pointer hover:text-secondary3"
            onClick={handleShowDetail}
          >
            Show detail
          </p>
        </div>
      </div>
      <ModalSearchNFT
        setIsOpenSearchNFT={setIsOpenSearchNFT}
        isOpenSearchNFT={isOpenSearchNFT}
      />
      <ModalWallet isOpen={isOpen} setIsOpen={setIsOpen} />
      <ModalDetail
        nameNFT={nameNFT}
        symbolNFT={symbolNFT}
        category={category}
        attributes={attributes}
        description={description}
        setIsOpenDetail={setIsOpenDetail}
        isOpenDetail={isOpenDetail}
      />
      <ModalSearchToken
        setIsOpenSearchToken={setIsOpenSearchToken}
        isOpenSearchToken={isOpenSearchToken}
        setSymbolToken={setSymbolToken}
      />
      <ToastContainer />
    </div>
  );
}
