import { CgClose } from "react-icons/cg";
import Wrapper from "../Wrapper";
import { useState, useEffect } from "react";
import { Button } from "@/components/Buttons";
import useBalanceToken from "@/hooks/useInformationToken";
import useNFTBalance from "@/hooks/useBalanceNFT";
import formatNumber from "@/libs/utils/formatNumer";
import handleBignumbertoDec from "@/libs/utils/handleBigNumbertoDec";
import handleBignumber from "@/libs/utils/handleBignumber";
import useFetchReservesDML from "@/hooks/useFetchReservesDML";
import { ethers } from "ethers";
import approveToken from "@/libs/utils/approveToken";
import approveNFT from "@/libs/utils/approveNFT";
import handleApproveToken from "@/libs/utils/handleApproveToken";
import { getProvider } from "@/libs/connection/getProvider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import abiRouter from "@/abi/abiRouter.json";
import TransitionURL from "@/components/Toast/TransionURL";
import handleApproveNFT from "@/libs/utils/handleApproveNFT";
import { BiLoaderAlt } from "react-icons/bi";
interface ModalAddLiquidityProps {
  isOpenAddLiquidity: boolean;
  data: any;
  account: string;
  wallet: string;
  setIsOpenLiquidity: React.Dispatch<React.SetStateAction<boolean>>;
}
const styles = {
  title: "block mb-4 text-base font-medium text-black24",
  inputItem: "w-full p-2 mb-4 border rounded-lg border-dark3",
};
const ModalAddLiquidity: React.FunctionComponent<ModalAddLiquidityProps> = ({
  isOpenAddLiquidity,
  data,
  account,
  wallet,
  setIsOpenLiquidity,
}) => {
  const [inputNFT, setInputNFT] = useState<string>("");
  const [isSufficientNFT, setIsSufficientNFT] = useState<boolean>(false);
  const [isSufficientToken, setIsSufficientToken] = useState<boolean>(false);
  const [isInputNFT, setIsInputNFT] = useState<boolean>(false);
  const [inputToken, setInputToken] = useState<string>("");
  const [amountErcDesired, setAmountErcDesired] = useState<any>();
  const [amountErcDesiredToDec, setAmountErcDesiredToDec] = useState<any>('0');
  const [isApprovedNFT, setIsApprovedNFT] = useState<boolean>(false);
  const [isApprovedToken, setIsApprovedToken] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const handleClose = (e: any) => {
    e.preventDefault();
    document.body.style.overflowY = "auto";
    setIsOpenLiquidity(false);
  };
  useEffect(() => {
    if (account && data) {
      if (
        data.fullInfoMetadata.tokenAddress ===
        "0x734aef51d427b2f745210ec4bf1062abd48eceb6"
      ) {
        setTokenSymbol("MATIC");
        setTokenAddress("MATIC");
      } else {
        setTokenSymbol(data.tokenName);
        setTokenAddress(data.fullInfoMetadata.tokenAddress);
      }
    }
  }, [data, account]);
  const balanceNFT = useNFTBalance(
    account,
    data.fullInfoMetadata.nft,
    data.fullInfoMetadata.tokenId,
    wallet
  );

  const { balanceToken, decimals, bigNumberBalance, symbolToken } =
    useBalanceToken(account, tokenAddress, wallet);
  const { reserves, isLoadingReserves }: any = useFetchReservesDML(
    account,
    data.fullInfoMetadata.dmlAddress,
    wallet
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
  const handleGetToken = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputToken(e.target.value);
    if (Number(e.target.value) > Number(balanceToken)) {
      console.log("Insufficient Token balance");
      setIsSufficientToken(true);
    } else {
      setIsSufficientToken(false);
    }
  };

  useEffect(() => {
    if (tokenAddress !== "MATIC") {
      let amountErcDesired;
      if (
        data.fullInfoMetadata.dmlAddress !==
        "0x0000000000000000000000000000000000000000" &&
        reserves &&
        inputNFT
      ) {
        if (reserves[0] && reserves[1]) {
          amountErcDesired = ethers.BigNumber.from(inputNFT)
            .mul(reserves[0])
            .div(reserves[1])
            .mul(105)
            .div(100);
        }
      } else {
        amountErcDesired = handleBignumber(
          Number(inputToken),
          Number(decimals)
        );
      }
      if (reserves[0] && reserves[1]) {
        setAmountErcDesired(amountErcDesired);
        const amountErcDesiredToDec = handleBignumbertoDec(
          amountErcDesired,
          18
        );
        setAmountErcDesiredToDec(amountErcDesiredToDec.toString());
      }
    }
  }, [inputNFT, inputToken]);
  useEffect(() => {
    const checkApproveToken = async () => {
      if (tokenAddress !== "MATIC") {
        const currentAllowance = await approveToken(
          account,
          wallet,
          tokenAddress
        );
        if (Number(currentAllowance) < Number(amountErcDesired)) {
          setIsApprovedToken(false);
        } else {
          setIsApprovedToken(true);
        }
      } else {
        setIsApprovedToken(true);
      }
    };
    checkApproveToken();
  }, [account, wallet, tokenAddress, inputToken]);
  useEffect(() => {
    const checkApproveNFT = async () => {
      const result = await approveNFT(
        account,
        wallet,
        data.fullInfoMetadata.nft
      );
      setIsApprovedNFT(result);
    };
    checkApproveNFT();
  }, [account, data.fullInfoMetadata.nft, wallet]);
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
      const value = handleBignumber(Number(inputToken), 18);

      try {
        let result;
        let transactionHash;

        if (tokenAddress === "MATIC") {
          result = await contract.addLiquidityETH(
            data.fullInfoMetadata.nft,
            data.fullInfoMetadata.tokenId,
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
            data.fullInfoMetadata.nft,
            data.fullInfoMetadata.tokenId,
            amountErcDesired,
            inputNFT,
            0,
            account,
            Math.floor((new Date().getTime() + 20 * 60000) / 1000),
            { gasLimit: 8000000 }
          );
          transactionHash = result.hash;
        }
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
  return (
    <Wrapper isOpen={isOpenAddLiquidity} onClick={handleClose}>
      <div className="z-50 flex flex-col justify-center cursor-default h-fit">
        <div className="bg-white h-fit w-[432px] rounded-lg p-4 relative">
          <p className="flex items-center mb-4 text-xl font-semibold text-dark1">
            Add
            {data && (
              <div className="flex items-center leading-[16px] ml-1">
                <span> {data.fullInfoMetadata.metadata.symbol}</span>
                <span className="overflow-hidden">/</span>
                <span>{tokenSymbol}</span>
              </div>
            )}
          </p>
          <div>
            <div className="relative">
              <div>
                <div>
                  <div className="flex justify-between mb-4 text-dark2">
                    <p className="font-semibold">NFT</p>
                    <p>Balance: {formatNumber(balanceNFT)}</p>
                  </div>
                  <input
                    className={styles.inputItem}
                    type="number"
                    placeholder="Input amount NFT"
                    value={inputNFT}
                    onChange={handleGetNFT}
                  />
                  {isSufficientNFT && (
                    <p
                      className="mb-2 ml-3 -mt-1 text-xs text-red"
                      key="totalSale"
                    >
                      Insufficient NFT balance
                    </p>
                  )}
                  {isInputNFT && (
                    <p
                      className="mb-2 ml-3 -mt-1 text-xs text-red"
                      key="inputNFT"
                    >
                      Required
                    </p>
                  )}
                </div>
                <div>
                  <div className="flex justify-between mb-4 text-dark2">
                    <p className="font-semibold">Token</p>
                    <p>Balance: {formatNumber(balanceToken)}</p>
                  </div>
                  {tokenAddress === "MATIC" ||
                    data.fullInfoMetadata.dmlAddress ===
                    "0x0000000000000000000000000000000000000000" ? (
                    <input
                      className={styles.inputItem}
                      type="number"
                      placeholder="Input amount Token"
                      value={inputToken}
                      onChange={handleGetToken}
                    />
                  ) : (
                    <div>
                      {reserves[0] && reserves[1] ? (
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
                    <p
                      className="mb-2 ml-3 -mt-1 text-xs text-red"
                      key="inputNFT"
                    >
                      Insufficient Token balance
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              {!isApprovedNFT && (
                <Button
                  className="w-[126px] py-2 mx-auto"
                  primary
                  onClick={() =>
                    handleApproveNFT(
                      account,
                      wallet,
                      data.fullInfoMetadata.nft,
                      setIsOpen
                    )
                  }
                >
                  APPROVE NFT
                </Button>
              )}
              {isApprovedNFT && !isApprovedToken && (
                <Button
                  className="w-[126px] py-2"
                  primary
                  onClick={() =>
                    handleApproveToken(
                      account,
                      wallet,
                      tokenAddress,
                      inputToken,
                      setIsApprovedToken,
                      setIsOpen
                    )
                  }
                >
                  APPROVE TOKEN
                </Button>
              )}
              {isApprovedNFT && isApprovedToken && (
                <Button
                  className="w-[126px] py-2 mx-auto"
                  primary
                  onClick={addLiquidity}
                >
                  ADD LIQUIDITY
                </Button>
              )}
            </div>
          </div>
        </div>
        <button
          className="absolute top-0 right-0 p-2 text-lg"
          onClick={handleClose}
        >
          <CgClose className="text-xl transition-colors duration-100 ease-linear hover:text-red" />
        </button>
      </div>
    </Wrapper>
  );
};

export default ModalAddLiquidity;
