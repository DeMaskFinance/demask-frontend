import abiDML from "@/abi/abiDML.json";
import abiRouter from "@/abi/abiRouter.json";
import { Button } from "@/components/Buttons";
import { TabGroups } from "@/components/NavChoice";
import TransitionURL from "@/components/Toast/TransionURL";
import AccountContext from "@/context/AccountContext";
import useAllowanceDML from "@/hooks/useAllowanceDML";
import useBananceOfDML from "@/hooks/useBalanceOfDML";
import useFetchReservesDML from "@/hooks/useFetchReservesDML";
import useTotalSupply from "@/hooks/useTotalSupply";
import { getProvider } from "@/libs/connection/getProvider";
import approveNFT from "@/libs/utils/approveNFT";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import formatNumber from "@/libs/utils/formatNumer";
import handleApproveNFT from "@/libs/utils/handleApproveNFT";
import handleBignumber from "@/libs/utils/handleBignumber";
import BigNumber from "bignumber.js";
import { ethers } from "ethers";
import { useEffect, useState, useContext } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ModalTransation } from "../ModalTransation";
import { ModalWallet } from "../ModalWallet";
import Wrapper from "../Wrapper";
interface ModalRemoveLiquidityProps {
  isOpenRemoveLiquidity: boolean;
  data: any;
  account: string;
  wallet: string;
  setIsOpenRemoveLiquidity: React.Dispatch<React.SetStateAction<boolean>>;
}
const styles = {
  title: "block mb-4 text-base font-medium text-black24",
  inputItem: "w-full p-2 mb-4 border rounded-lg border-dark3",
};
const ModalRemmoveLiquidity: React.FunctionComponent<
  ModalRemoveLiquidityProps
> = ({
  isOpenRemoveLiquidity,
  data,
  account,
  wallet,
  setIsOpenRemoveLiquidity,
}) => {
    const [inputLiquidity, setInputLiquidity] = useState<any>("");
    const [activeChoice, setActiveChoice] = useState<string>("0%");
    const [isSufficientLiquidity, setIsSufficientLiquidity] = useState<boolean>(false);
    const [isApprovedLiquidity, setIsApprovedLiquidity] = useState<boolean>(false);
    const [isApprovedDML, setIsApprovedDML] = useState<boolean>(false);
    const [isApprovedNFT, setIsApprovedNFT] = useState<boolean>(false);
    const [showRequiredMessage, setShowRequiredMessage] = useState(false);
    const [amountNFT, setAmountNFT] = useState('');
    const [amountToken, setAmountToken] = useState('');
    const [tokenAddress, setTokenAddress] = useState("");
    const [amountTokenMin, setAmountTokenMin] = useState("");
    const [amountTokenDec, setAmountTokenDec] = useState("");
    const [amountNFTMin, setAmountNFTMin] = useState("");
    const [tokenSymbol, setTokenSymbol] = useState("");
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [checkApproveNFT, setCheckApproveNFT] = useState<boolean>(false);
    const [checkApproveDML, setCheckApproveDML] = useState<boolean>(false);
    const [isOpenTransaction, setIsOpenTransaction] = useState<boolean>(false);
    const { demask } = useContext(AccountContext);
    const { ROUTER: routerAddress, RPC: rpc } = demask;
    const handleClose = (e: any) => {
      e.preventDefault();
      document.body.style.overflowY = "auto";
      setIsOpenRemoveLiquidity(false);
    };
    const handleChoiceChange = (choice: string) => {
      setActiveChoice(choice);
    };

    const { balanceOfDML } = useBananceOfDML(account, data.dmlAddress, wallet, isOpenTransaction);
    const handleGetLiquidity = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputLiquidity(e.target.value);
      setShowRequiredMessage(false);
      setActiveChoice('');
      if (Number(e.target.value) > Number(balanceOfDML)) {
        setIsSufficientLiquidity(true);
      } else {
        setIsSufficientLiquidity(false);
      }
    };

    useEffect(() => {
      if (balanceOfDML) {
        if (activeChoice === '25%') {
          setInputLiquidity(((Number(balanceOfDML)) * 0.25).toString())
        } else if (activeChoice === '50%') {
          setInputLiquidity(((Number(balanceOfDML)) * 0.5).toString())
        } else if (activeChoice === '75%') {
          setInputLiquidity(((Number(balanceOfDML)) * 0.7).toString())
        } else if (activeChoice === '100%') {
          setInputLiquidity(((Number(balanceOfDML)) * 1).toString())
        }
        setIsSufficientLiquidity(false);
      }
    }, [activeChoice])
    const totalSupply = useTotalSupply(account, wallet, data.dmlAddress, isApprovedDML);
    // console.log(totalSupply);
    // console.log(handleBignumber(Number(inputLiquidity), 18));

    useEffect(() => {
      if (reserves[0] && reserves[1]) {
        const amountLIQUIDITY = handleBignumber(Number(inputLiquidity), 18);
        const resAmountNFT = Number(amountLIQUIDITY) * Number(reserves[1].toString()) / Number(totalSupply);
        const amountToken = Number(amountLIQUIDITY) * Number(reserves[0].toString()) / Number(totalSupply);
        const resAmountToken = Number(amountLIQUIDITY) * Number(reserves[0].toString()) / Number(totalSupply) + (Number(amountLIQUIDITY) * Number(reserves[1].toString()) % Number(totalSupply)) * (Number(reserves[0].toString()) - Number(amountToken.toFixed(0))) / ((Number(reserves[1].toString()) - Math.floor(Number(resAmountNFT))) * Number(totalSupply));
        const resAmountTokenMinShow = divideByDecimal(resAmountToken.toString(), data.dmlDecimals)
        const resAmountNFTMin = Math.floor(Number(resAmountNFT * 0.95));
        const resAmountTokenMin = Math.floor(Number(resAmountToken * 0.95));
        setAmountNFT(resAmountNFT.toString());
        setAmountToken(resAmountToken.toString());
        setAmountNFTMin(resAmountNFTMin.toString());
        setAmountTokenMin(resAmountTokenMin.toString());
        setAmountTokenDec(resAmountTokenMinShow)
      }
    }, [inputLiquidity])
    // console.log(amountNFT);
    // console.log(amountTokenMin);
    // console.log(amountTokenDec);
    const currentAllowance = useAllowanceDML(
      account,
      data.dmlAddress,
      wallet,
      isApprovedDML,
      inputLiquidity,
      routerAddress,
    );
    console.log(currentAllowance);
    // console.log(inputLiquidity);
    // console.log(Number(handleBignumber(Number(inputLiquidity), 18)));
    useEffect(() => {
      const checkApproveNFT = async () => {
        const result = await approveNFT(
          account,
          wallet,
          data.nftAddress,
          routerAddress
        );
        setIsApprovedNFT(result);
      };
      checkApproveNFT();
    }, [account, data.nftAddress, wallet, checkApproveNFT]);
    useEffect(() => {
      const checkApproveToken = async () => {
        console.log(currentAllowance);
        if (currentAllowance && Number(currentAllowance) < Number(handleBignumber(Number(inputLiquidity), Number(data.dmlDecimals)))) {
          setIsApprovedLiquidity(false);
        } else {
          setIsApprovedLiquidity(true);
        }
      };
      checkApproveToken();
    }, [account, wallet, inputLiquidity, isApprovedDML, currentAllowance, checkApproveDML]);

    const { reserves, isLoadingReserves }: any = useFetchReservesDML(
      account,
      data.dmlAddress,
      wallet,
    );
    console.log(reserves);
    // console.log(reserves[0].toString());
    // console.log(reserves[1].toString());
    //   console.log(data);

    // console.log(isApprovedDML);
    // console.log(isApprovedLiquidity);
    // console.log(isApprovedNFT);

    const handleApproveDML = async (account: string, wallet: string, dmlAddress: string, inputLiquidity: string, setIsApprovedDML: any) => {
      if (inputLiquidity) {
        setShowRequiredMessage(false);
        console.log(wallet, dmlAddress, inputLiquidity);

        const providerChoice = getProvider(wallet);
        const provider = new ethers.providers.Web3Provider(providerChoice);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(dmlAddress, abiDML, signer);
        const inputLiquidityBN = new BigNumber(inputLiquidity)
          .times(new BigNumber(10).pow(Number(data.dmlDecimals)))
          .toFixed(0);
        console.log(inputLiquidityBN);

        try {
          const result = await contract.approve(routerAddress, inputLiquidityBN);
          await provider.waitForTransaction(result.hash);
          setCheckApproveDML(true);
        } catch (error) {
          setCheckApproveDML(false);
          console.error(error);
        }
      } else {
        setShowRequiredMessage(true);
      }
    };
    useEffect(() => {
      if (account && data) {
        if (
          data.tokenAddress === process.env.NEXT_PUBLIC_NATIVE_ADDRESS
        ) {
          setTokenSymbol("MATIC");
          setTokenAddress("MATIC");
        } else {
          setTokenSymbol(data.tokenSymbol);
          setTokenAddress(data.tokenAddress);
        }
      }
    }, [data, account]);
    // console.log(account);
    // console.log(tokenAddress);

    const removeLiquidity = async () => {
      if (inputLiquidity && !isSufficientLiquidity) {
        const providerChoice = getProvider(wallet);
        const provider = new ethers.providers.Web3Provider(providerChoice);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(routerAddress, abiRouter, signer);
        const liquidity = handleBignumber(Number(inputLiquidity), Number(data.dmlDecimals));
        console.log(liquidity);
        console.log(amountTokenMin);
        console.log(amountNFTMin);

        try {
          let result;
          let transactionHash;
          setIsOpenTransaction(true);
          if (tokenAddress === "MATIC") {
            result = await contract.removeLiquidityETH(
              data.nftAddress,
              data.nftId,
              (Number(liquidity)).toFixed(0),
              amountTokenMin,
              amountNFTMin,
              account,
              Math.floor((new Date().getTime() + 20 * 60000) / 1000),
              { gasLimit: 8000000 }
            );
            transactionHash = result.hash;
          } else {
            result = await contract.removeLiquidity(
              data.tokenAddress,
              data.nftAddress,
              data.nftId,
              (Number(liquidity)).toFixed(0),
              amountTokenMin,
              amountNFTMin,
              account,
              Math.floor((new Date().getTime() + 20 * 60000) / 1000),
              { gasLimit: 8000000 }
            );
            transactionHash = result.hash;
          }
          await provider.waitForTransaction(transactionHash);
          setIsOpenTransaction(false);
          setInputLiquidity('');
          toast.success(
            <TransitionURL
              type={"Remove Liquidity"}
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
        setShowRequiredMessage(true);
      }
    }
    return (
      <Wrapper isOpen={isOpenRemoveLiquidity} onClick={handleClose}>
        <div className="relative z-50 flex flex-col justify-center cursor-default h-fit">
          <div className="bg-white h-fit w-[360px] md:w-[400px] lg:w-[432px] rounded-lg p-4 relative">
            <p className="flex items-center mb-4 text-xl font-semibold text-dark1">
              Remove
              {data && (
                <div className="flex items-center leading-[16px] ml-1">
                  <span> {data.metadata.symbol}</span>
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
                      <p className="font-semibold">Liquidity</p>
                      <p>Balance: {formatNumber(balanceOfDML)}</p>
                    </div>
                    <input
                      className={styles.inputItem}
                      type="number"
                      placeholder="Input amount Liquidity"
                      value={inputLiquidity}
                      onChange={handleGetLiquidity}
                    />
                    {isSufficientLiquidity && (
                      <p
                        className="mb-2 ml-1 -mt-1 text-xs text-red"
                        key="liquidity"
                      >
                        Insufficient Liquidity balance
                      </p>
                    )}
                    {showRequiredMessage && (
                      <p
                        className="mx-auto ml-3 -mt-3 text-xs text-red"
                        key="emptyNFT"
                      >
                        Required
                      </p>
                    )}
                    <div>
                      <TabGroups
                        choices={["25%", "50%", "75%", "100%"]}
                        activeChoice={activeChoice}
                        onChoiceChange={handleChoiceChange}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between my-4 text-dark2">
                      <p className="font-semibold">You will recieve</p>
                    </div>
                    <div className={styles.inputItem} >
                      <div className="flex justify-between">
                        {reserves[0] && reserves[1] ? (<p>{amountNFTMin}</p>) : (
                          <BiLoaderAlt className="text-3xl animate-spin text-secondary5" />
                        )}
                        <p className="text-dark3">NFT</p>
                      </div>
                    </div>
                    <div className={styles.inputItem}>
                      <div className="flex justify-between">
                        <p>{amountTokenDec}</p>
                        <p className="text-dark3">{tokenSymbol}</p>
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
                              data.nftAddress,
                              setIsOpen,
                              setCheckApproveNFT,
                              routerAddress
                            )
                          }
                        >
                          APPROVE NFT
                        </Button>
                      )}
                      {!isApprovedLiquidity && account && (
                        <Button
                          className="w-[126px] py-2 mx-auto"
                          primary
                          onClick={() =>
                            handleApproveDML(
                              account,
                              wallet,
                              data.dmlAddress,
                              inputLiquidity,
                              setIsApprovedDML,
                            )
                          }
                        >
                          APPROVE DML
                        </Button>
                      )}
                      {(isApprovedLiquidity && isApprovedNFT) && (
                        <Button
                          className="p-2 mx-auto"
                          primary
                          onClick={removeLiquidity}
                        >
                          Remove Liquidity
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
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
        <ModalWallet isOpen={isOpen} setIsOpen={setIsOpen} />
        <ModalTransation isOpenTransation={isOpenTransaction} setIsOpenTransaction={setIsOpenTransaction} isTransaction={true} />
        <ToastContainer />
      </Wrapper>
    );
  };

export default ModalRemmoveLiquidity;
