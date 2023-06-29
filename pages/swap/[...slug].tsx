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
import formatNumber from "@/libs/utils/formatNumer";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import ChartSwap from "@/components/Charts/ChartSwap";
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

  const dmlToken = useDMLToken(
    account,
    nftAddress,
    idNFT,
    tokenAddress
  );
  const reserves: any[] = useFetchReservesDML(
    account,
    dmlToken,
    wallet,
    inputNFT
  );
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
  const amountBuy = new BigNumber(amountTokenBuy);
  const amountSell = new BigNumber(amountTokenSell);
  // console.log(bigNumberBalance);
  // console.log(amountSell.toFixed());

  // console.log(amountTokenBuy);
  // console.log(isSufficientToken);
  console.log(dmlToken);
  console.log(reserves);

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
    if (Number(amountSell.toFixed()) > Number(bigNumberBalance)) {
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

  useEffect(() => {
    const checkApproveToken = async () => {
      const currentAllowance = await approveToken(
        account,
        wallet,
        tokenAddress
      );
      // console.log(Number(currentAllowance));
      // console.log(amountBuy.toFixed());
      if (Number(currentAllowance) < Number(amountTokenBuy)) {
        setIsApprovedToken(false);
      } else {
        setIsApprovedToken(true);
      }
    };
    checkApproveToken();
  }, [account, wallet, tokenAddress, inputNFT, amountTokenBuy]);

  const handleApproveToken = async (e: any) => {
    e.preventDefault();
    if (account) {
      const providerChoice = getProvider(wallet);
      const provider = new ethers.providers.Web3Provider(providerChoice);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(tokenAddress, abiErc20, signer);
      const routerAddress = process.env.NEXT_PUBLIC_ROUTER || "";
      try {
        await contract.approve(routerAddress, amountBuy.toFixed());
        setInputNFT("");
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
              { gasLimit: 8000000, value: amountBuy.toFixed() }
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
  const priceBuy = Number(amountBuy) / Number(inputNFT);
  const priceSell = Number(amountSell) / Number(inputNFT);
  console.log(priceBuy);

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
          {imageNFT && (
            <Image
              src={imageNFT}
              alt="test"
              width={680}
              height={576}
              sizes="(max-width: 772px) 100vw"
              className="rounded-lg max-h-[772px] max-w-[772px]"
              unoptimized
            />
          )}
          {!imageNFT && animationUrl && (
            <video
              src={animationUrl}
              autoPlay
              loop
              muted
              controls
              className="max-h-[772px] max-w-[772px] rounded-2xl"
            />
          )}
          {imageNFT && animationUrl && (
            <audio
              autoPlay
              loop
              muted
              controls
              src={animationUrl}
              className="mt-4 mb-2"
            >
              Your browser does not support the
              <code>audio</code> element.
            </audio>
          )}
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
                    Balance:{formatNumber(balanceToken)} {symbolToken}
                  </p>
                )}
                {account && activeChoice === "SELL" && (
                  <p className="">Balance:{formatNumber(balanceNFT)} NFT</p>
                )}
              </div>
              <div className="flex flex-col items-center basis-1/3">
                <TwoTab
                  firstChoice="BUY"
                  secondChoice="SELL"
                  activeChoice={activeChoice}
                  onChoiceChange={handleChoiceChange}
                />
                {activeChoice === "BUY" && account && (
                  <div className="text-4xl text-secondary3">
                    {inputNFT ? (
                      <span>
                        {Number(
                          divideByDecimal(priceBuy.toString(), decimals)
                        ).toFixed(2)}
                      </span>
                    ) : (
                      <span>0</span>
                    )}
                    <span className="ml-2">{symbolToken}</span>
                  </div>
                )}
                {activeChoice === "SELL" && account && (
                  <div className="text-4xl text-secondary3">
                    {inputNFT ? (
                      <span>
                        {Number(
                          divideByDecimal(priceSell.toString(), decimals)
                        ).toFixed(2)}
                      </span>
                    ) : (
                      <span>0</span>
                    )}
                    <span className="ml-2">{symbolToken}</span>
                  </div>
                )}
              </div>
              <div className=" basis-1/3">
                <a
                  href={`https://mumbai.polygonscan.com/address/${dmlToken}`}
                  target="_blank"
                  className="flex justify-end font-medium transition-all duration-150 ease-linear text-dark2 group"
                >
                  <PoolIcon
                    width={24}
                    height={24}
                    className="group-hover:fill-secondary3"
                  />
                  <p className="group-hover:text-secondary3">Pool</p>
                </a>
              </div>
            </div>
            <form className="grid grid-cols-2 gap-x-4">
              <div>
                {reserves && (
                  <p className="mb-4 text-dark3">
                    Reverse NFT:{formatNumber(reserves[1])}
                  </p>
                )}
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
              </div>
              
              <div>
                {reserves && (
                  <p className="mb-4 text-dark3 text-end">
                    Reverse Token:
                    {formatNumber(
                      Number(
                        divideByDecimal(reserves[0].toString(), decimals)
                      ).toFixed(2)
                    )}
                  </p>
                )}
                <div className="relative">
                  {activeChoice === "BUY" ? (
                    <div className={styles.inputItem}>
                      {formatNumber(
                        divideByDecimal(amountBuy.toFixed(), decimals)
                      )}
                    </div>
                  ) : (
                    <div className={styles.inputItem}>
                      {formatNumber(
                        divideByDecimal(amountSell.toFixed(), decimals)
                      )}
                    </div>
                  )}
                  <div
                    className="absolute px-2 py-1 transition duration-150 ease-out bg-white border rounded-lg cursor-pointer hover:text-white hover:bg-secondary5 active:bg-secondary3 text-secondary5 right-1 top-1 border-secondary5 "
                    onClick={handleSearchToken}
                  >
                    {symbolToken}
                  </div>
                </div>
              </div>
            </form>
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
              {!isApprovedNFT && activeChoice  === "SELL" && (
                <Button
                  className="w-[126px] py-2"
                  primary
                  onClick={hanldeApproveNFT}
                >
                  APPROVE NFT
                </Button>
              )}
              {!isApprovedToken &&
                tokenAddress !== "MATIC" &&
                activeChoice === "BUY" && (
                  <Button
                    className="w-[126px] py-2"
                    type="button"
                    primary
                    onClick={handleApproveToken}
                  >
                    APPROVE TOKEN
                  </Button>
                )}
            </div>
          </div>
          <div className="px-4 py-6 mt-6 border rounded-lg border-dark3">
            <ChartSwap />
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
