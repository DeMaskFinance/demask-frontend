import { useState, useContext, useEffect } from "react";
import abiRouter from "@/abi/abiRouter.json";
import { Button } from "@/components/Buttons";
import { PoolIcon } from "@/components/Icons";
import { TwoTab } from "@/components/NavChoice";
import abiErc20 from "@/abi/abiErc20.json";
import abiErc1155 from "@/abi/abiErc1155.json";
import Head from "next/head";
import Image from "next/image";
import AccountContext from "@/context/AccountContext";
import { ModalSearchNFT } from "@/components/Modal/ModalSearchNFT";
import useMetadata from "@/hooks/useMetadata";
import { ModalDetail } from "@/components/Modal/ModalDedail";
import { useRouter } from "next/router";
import { ModalSearchToken } from "@/components/Modal/ModalSearchToken";
import { ethers } from "ethers";
import { getProvider } from "@/libs/connection/getProvider";
import approveToken from "@/libs/utils/approveToken";
import useFetchReservesDML from "@/hooks/useFetchReservesDML";
import { ModalWallet } from "@/components/Modal/ModalWallet";
import TransitionURL from "@/components/Toast/TransionURL";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import approveNFT from "@/libs/utils/approveNFT";
import useNFTBalance from "@/hooks/useBalanceNFT";
import useBalanceToken from "@/hooks/useBalanceToken";
import useDMLToken from "@/hooks/useDMLToken";
import useAmountOutMin from "@/hooks/useAmountOutMin";
import useAmountInMax from "@/hooks/useAmountInMax";
import handleBignumbertoDec from "@/libs/utils/handleBigNumbertoDec";
import BigNumber from "bignumber.js";
const styles = {
  inputItem: "w-full py-2 pl-2 mb-6 border rounded-lg border-dark3 block",
  btnActive: "rounded-full bg-base2",
};
const Swap: React.FC = () => {
  const router = useRouter();
  const [nftAddress, setNftAddress] = useState<string>("");
  const [tokenAddress, setTokenAddress] = useState<string>("");
  const [idNFT, setIdNFT] = useState<string>("");
  const [inputNFT, setInputNFT] = useState<string>("");
  const [isOpenSearchToken, setIsOpenSearchToken] = useState<boolean>(false);
  const [symbolToken, setSymbolToken] = useState<string>("USDT");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isApprovedToken, setIsApprovedToken] = useState<boolean>(false);
  const [isOpenSearchNFT, setIsOpenSearchNFT] = useState<boolean>(false);
  const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false);
  const [isSufficientNFT, setIsSufficientNFT] = useState<boolean>(false);
  const [isSufficientToken, setIsSufficientToken] = useState<boolean>(false);
  const [showRequiredMessage, setShowRequiredMessage] = useState(false);
  const [activeChoice, setActiveChoice] = useState<string>("BUY");
  const [isApprovedNFT, setIsApprovedNFT] = useState<boolean>(false);
  const { account, wallet } = useContext(AccountContext);
  const {
    nameNFT,
    imageNFT,
    symbolNFT,
    category,
    attributes,
    animationUrl,
    description,
  } = useMetadata(nftAddress, idNFT);
  const handleChoiceChange = (choice: string) => {
    setActiveChoice(choice);
  };

  const { slug } = router.query;
  useEffect(() => {
    if (slug) {
      setNftAddress(slug[0]);
      setTokenAddress(slug[1]);
      setIdNFT(slug[2]);
      setInputNFT("");
    }
  }, [slug]);
  console.log(tokenAddress);
  
  const { balanceToken, decimals, bigNumberBalance } = useBalanceToken(
    account,
    tokenAddress,
    wallet
  );
  const balanceNFT = useNFTBalance(account, nftAddress, idNFT, wallet);
  useEffect(() => {
    // console.log(nftAddress);

    const checkApproveNFT = async () => {
      const result = await approveNFT(account, wallet, nftAddress);
      setIsApprovedNFT(result);
    };
    checkApproveNFT();
  }, [account, nftAddress, wallet]);
  console.log(isApprovedNFT);

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

  const dmlToken = useDMLToken(nftAddress, idNFT, tokenAddress, wallet);
  const reserves = useFetchReservesDML(dmlToken, wallet, inputNFT);
  const amountTokenSell = useAmountOutMin(
    inputNFT,
    dmlToken,
    tokenAddress,
    nftAddress,
    idNFT,
    wallet,
    activeChoice
  );
  const amountTokenBuy = useAmountInMax(
    inputNFT,
    dmlToken,
    tokenAddress,
    nftAddress,
    idNFT,
    wallet,
    activeChoice
  );
  console.log(amountTokenBuy);
  console.log(amountTokenSell);
  
  const amountBuy= new BigNumber(amountTokenBuy);
  const amountSell = new BigNumber(amountTokenSell);
  console.log(bigNumberBalance);
  console.log(amountSell.toFixed());
  
  // console.log(amountTokenBuy);
  // console.log(isSufficientToken);
  // console.log(dmlToken);
  // console.log(reserves);
  
  useEffect(() => {
    const checkReservesNFT = () => {
      if (activeChoice === "BUY") {
        if (reserves && Number(inputNFT) < Number(reserves[1])) {
          setIsSufficientNFT(true);
        } else {
          setIsSufficientNFT(false);
        }
      } else {
        if (Number(inputNFT) <= Number(balanceNFT)) {
          setIsSufficientNFT(true);
        } else {
          setIsSufficientNFT(false);
        }
      }
    };
    checkReservesNFT();
    if (Number(amountBuy.toFixed()) > Number(bigNumberBalance)) {
      setIsSufficientToken(false);
    } else {
      setIsSufficientToken(true);
    }
  }, [inputNFT]);
  useEffect(() => {
    if (inputNFT === "") {
      setIsSufficientNFT(true);
    }
  }, []);
  console.log(Number(amountTokenBuy));
  
  useEffect(() => {
    const checkApproveToken = async () => {
      const currentAllowance = await approveToken(
        account,
        wallet,
        tokenAddress
      );
      console.log(currentAllowance);

      if (Number(currentAllowance) < Number(amountTokenBuy)) {
        setIsApprovedToken(false);
      } else {
        setIsApprovedToken(true);
      }
    };
    checkApproveToken();
  }, [account, wallet, tokenAddress, inputNFT]);
  console.log(balanceToken);
  const handleApproveToken = async () => {
    if (account) {
      const providerChoice = getProvider(wallet);
      const provider = new ethers.providers.Web3Provider(providerChoice);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(tokenAddress, abiErc20, signer);
      const routerAddress = process.env.NEXT_PUBLIC_ROUTER || "";
      try {
        await contract.approve(routerAddress, amountBuy.toFixed());
        setIsApprovedToken(true);
      } catch (error) {
        console.error(error);
      }
    } else {
      setIsOpen(true);
    }
  };
  const handleBuyNFT = async (e: any) => {
    e.preventDefault();
    if (!account) {
      setIsOpen(true);
      return;
    }
    if (inputNFT === "") {
      setShowRequiredMessage(true);
    } else {
      setShowRequiredMessage(false);
      if (isSufficientNFT && isSufficientToken) {
        const providerChoice = getProvider(wallet);
        const provider = new ethers.providers.Web3Provider(providerChoice);
        const signer = provider.getSigner();
        const routerAddress = process.env.NEXT_PUBLIC_ROUTER || "";
        const contract = new ethers.Contract(routerAddress, abiRouter, signer);
        console.log(amountBuy.toFixed());
        
        try {
          let result;
          if (tokenAddress === "MATIC") {
            result = await contract.buyETH(
              nftAddress,
              idNFT,
              inputNFT,
              account,
              Math.floor((new Date().getTime() + 20 * 60000) / 1000),
              {gasLimit: 8000000, value: amountBuy.toFixed() }
            );
          } else {
            result = await contract.buy(
              tokenAddress,
              nftAddress,
              idNFT,
              inputNFT,
              amountBuy.toFixed(),
              account,
              Math.floor((new Date().getTime() + 20 * 60000) / 1000),
              { gasLimit: 8000000 }
            );
          }
          toast.success(
            <TransitionURL type={"Buy NFT"} transactionHash={result.hash} />,
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
          setInputNFT("");
        } catch (error) {
          console.error(error);
        }
      }
    }
  };
  const handleSellNFT = async (e: any) => {
    e.preventDefault();
    if (!account) {
      setIsOpen(true);
      return;
    }
    if (inputNFT === "") {
      setShowRequiredMessage(true);
    } else {
      setShowRequiredMessage(false);
      if (isSufficientNFT && isSufficientToken) {
        const providerChoice = getProvider(wallet);
        const provider = new ethers.providers.Web3Provider(providerChoice);
        const signer = provider.getSigner();
        const routerAddress = process.env.NEXT_PUBLIC_ROUTER || "";
        const contract = new ethers.Contract(routerAddress, abiRouter, signer);

        try {
          let result;
          if (tokenAddress === "MATIC") {
            result = await contract.sellETH(
              nftAddress,
              idNFT,
              inputNFT,
              amountSell.toFixed(),
              account,
              Math.floor((new Date().getTime() + 20 * 60000) / 1000),
              { gasLimit: 8000000 }
            );
          } else {
            result = await contract.sell(
              tokenAddress,
              nftAddress,
              idNFT,
              inputNFT,
              amountSell.toFixed(),
              account,
              Math.floor((new Date().getTime() + 20 * 60000) / 1000),
              { gasLimit: 8000000 }
            );
          }
          toast.success(
            <TransitionURL type={"Sell NFT"} transactionHash={result.hash} />,
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
          setInputNFT("");
        } catch (error) {
          console.error(error);
        }
      }
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
  const handleSearchToken = () => {
    setIsOpenSearchToken(true);
    document.body.style.overflowY = "hidden";
  };
  return (
    <div className="py-8 swap">
      <Head>
        <title>Swap | DeMask</title>
      </Head>
      <div className="mb-6">
        <h3 className="mb-2 text-xl font-medium text-dark0">{nameNFT}</h3>
        <p className="text-sm font-medium text-dark1">{symbolNFT}</p>
      </div>
      <div className="flex gap-x-10">
        <div className="w-[50%] flex flex-col items-center">
          <Image
            src={imageNFT}
            alt="test"
            width={776}
            height={776}
            className="w-full h-full rounded-lg"
            unoptimized
          />
          <p
            className="mt-1 text-sm cursor-pointer text-secondary5 hover:text-secondary3"
            onClick={handleShowDetail}
          >
            See detail
          </p>
        </div>
        <div className="w-[50%]">
          <div className="px-4 py-6 border rounded-lg border-dark3">
            <div className="flex mb-6 text-dark1">
              <div className="basis-1/3">
                <div className="">
                  <span>{nameNFT}/</span>
                  <span>{symbolToken}</span>
                </div>
                {account && activeChoice === "BUY" && (
                  <p className="">
                    Balance:{balanceToken} {symbolToken}
                  </p>
                )}
                {account && activeChoice === "SELL" && (
                  <p className="">Balance:{balanceNFT} NFT</p>
                )}
                {reserves && (
                  <p className="text-dark3 mt-[60px]">
                    Reverse NFT:{Number(reserves[1])}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-center basis-1/3">
                <TwoTab
                  firstChoice="BUY"
                  secondChoice="SELL"
                  activeChoice={activeChoice}
                  onChoiceChange={handleChoiceChange}
                />
                <p className="text-4xl text-secondary3">100 ETH</p>
              </div>
              <div className=" basis-1/3">
                <a
                  href={`https://mumbai.polygonscan.com/address/${dmlToken}`}
                  target="_blank"
                  className="flex justify-end font-medium text-dark2 "
                >
                  <PoolIcon width={24} height={24} />
                  <p>Pool</p>
                </a>
                {reserves && (
                  <p className="text-dark3 mt-[80px] text-end">Reverse Token:{handleBignumbertoDec(reserves[0],decimals)}</p> 
                )}
              </div>
            </div>
            <form>
              <div className="relative">
                <input
                  type="number"
                  name="amountNFT"
                  id="amountNFT"
                  placeholder="Input amount NFT"
                  className={
                    showRequiredMessage
                      ? "w-full py-2 pl-2 mb-4 rounded-lg border-2 border-red"
                      : styles.inputItem
                  }
                  value={inputNFT}
                  onChange={(e) => {
                    setInputNFT(e.target.value);
                    setShowRequiredMessage(false);
                  }}
                />
                <div
                  className="absolute px-2 py-1 transition duration-150 ease-out bg-white border rounded-lg cursor-pointer hover:text-white hover:bg-secondary5 active:bg-secondary3 text-secondary5 right-1 top-1 border-secondary5 "
                  onClick={handleSearchNFT}
                >
                  {/* <NFTIcon
                          width={24}
                          height={24}
                          className="fill-white"
                        /> */}
                  {symbolNFT}
                </div>
              </div>
              {dmlToken !== "0x0000000000000000000000000000000000000000" &&
                !isSufficientNFT && (
                  <p
                    className="mb-2 ml-3 -mt-3 text-xs text-red"
                    key="NFTbalance"
                  >
                    Insufficient NFT balance
                  </p>
                )}
              {dmlToken === "0x0000000000000000000000000000000000000000" && (
                <p className="mb-2 ml-3 -mt-3 text-xs text-red">
                  DML Token doesn't exist yet
                </p>
              )}
              {showRequiredMessage && (
                <p className="mb-2 ml-3 -mt-3 text-xs text-red" key="emptyNFT">
                  Required
                </p>
              )}
              <div className="relative">
                {activeChoice === "BUY" ? (
                  <div className={styles.inputItem}>{amountTokenBuy}</div>
                ) : (
                  <div className={styles.inputItem}>{amountTokenSell}</div>
                )}
                <div
                  className="absolute px-2 py-1 transition duration-150 ease-out bg-white border rounded-lg cursor-pointer hover:text-white hover:bg-secondary5 active:bg-secondary3 text-secondary5 right-1 top-1 border-secondary5 "
                  onClick={handleSearchToken}
                >
                  {/* <NFTIcon
                          width={24}
                          height={24}
                          className="fill-white"
                        /> */}
                  {symbolToken}
                </div>
              </div>

              <div className="flex justify-center w-full">
                {isApprovedToken && activeChoice === "BUY" && (
                  <button
                    type="button"
                    className="py-2 w-[144px] bg-green rounded-lg text-sm text-white"
                    onClick={handleBuyNFT}
                  >
                    BUY NFT
                  </button>
                )}
                {isApprovedNFT && activeChoice === "SELL" && (
                  <button
                    type="button"
                    className="py-2 w-[144px] bg-red rounded-lg text-sm text-white"
                    onClick={handleSellNFT}
                  >
                    SELL NFT
                  </button>
                )}
                {!isApprovedNFT && activeChoice === "SELL" && (
                  <Button
                    className="w-[126px] py-2"
                    primary
                    onClick={hanldeApproveNFT}
                  >
                    APPROVE NFT
                  </Button>
                )}
                {!isApprovedToken && activeChoice === "BUY" && (
                  <Button
                    className="w-[126px] py-2"
                    primary
                    onClick={handleApproveToken}
                  >
                    APPROVE TOKEN
                  </Button>
                )}
              </div>
            </form>
          </div>
          <div className="px-4 py-6 mt-6 border rounded-lg border-dark3">
            <div className="mb-12">
              <ul>
                <li className="text-dark3">Volume and Price</li>
                <li className="text-dark1">1.2997 ETH</li>
                <li className="text-dark2">Avg.Price: 0.0762 ETH</li>
                <li className="text-dark3">7:00 Am, May 17, 2023 (UTC)</li>
              </ul>
            </div>
          </div>
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
};

export default Swap;
