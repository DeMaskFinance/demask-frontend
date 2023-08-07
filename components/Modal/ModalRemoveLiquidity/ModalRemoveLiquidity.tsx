import { CgClose } from "react-icons/cg";
import Wrapper from "../Wrapper";
import { useState, useEffect } from "react";
import { Button } from "@/components/Buttons";
import { TabGroups } from "@/components/NavChoice";
import useBananceOfDML from "@/hooks/useBalanceOfDML";
import formatNumber from "@/libs/utils/formatNumer";
import allowanceDML from "@/libs/utils/allowanceDML";
import { getProvider } from "@/libs/connection/getProvider";
import { ethers } from "ethers";
import abiDML from "@/abi/abiDML.json";
import abiRouter from "@/abi/abiRouter.json";
import BigNumber from "bignumber.js";
import useInformationToken from "@/hooks/useInformationToken";
import useAllowanceDML from "@/hooks/useAllowanceDML";
import useFetchReservesDML from "@/hooks/useFetchReservesDML";
import useTotalSupply from "@/hooks/useTotalSupply";
import TransitionURL from "@/components/Toast/TransionURL";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import handleBignumber from "@/libs/utils/handleBignumber";
interface ModalRemmoveLiquidityProps {
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
  ModalRemmoveLiquidityProps
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
    const [showRequiredMessage, setShowRequiredMessage] = useState(false);
    const [amountNFT, setAmountNFT] = useState('');
    const [amountToken, setAmountToken] = useState('');
    const [tokenAddress, setTokenAddress] = useState("");
    const [amountTokenMin, setAmountTokenMin] = useState("");
    const [amountNFTMin, setAmountNFTMin] = useState("");
    const handleClose = (e: any) => {
      e.preventDefault();
      document.body.style.overflowY = "auto";
      setIsOpenRemoveLiquidity(false);
    };
    const handleChoiceChange = (choice: string) => {
      setActiveChoice(choice);
    };

    const { balanceOfDML } = useBananceOfDML(account, data.fullInfoMetadata.dmlAddress);
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
    const totalSupply = useTotalSupply(account, wallet, data.fullInfoMetadata.dmlAddress, isApprovedDML);
    console.log(totalSupply);
    useEffect(() => {
      if (reserves[0] && reserves[1]) {
        const resAmountNFT = Number(inputLiquidity) * Number(reserves[1].toString()) / Number(totalSupply);
        const amountToken = Number(inputLiquidity) * Number(reserves[0].toString()) / Number(totalSupply);
        const resAmountToken = Number(inputLiquidity) * Number(reserves[0].toString()) / Number(totalSupply) + (Number(inputLiquidity) * Number(reserves[1].toString()) % Number(totalSupply)) * (Number(reserves[0].toString()) - Number(amountToken.toFixed(0))) / ((Number(reserves[1].toString()) - Number(resAmountNFT.toFixed(0))) * Number(totalSupply));
        const resAmountNFTMin = new BigNumber(resAmountNFT).times(0.95)
          .times(new BigNumber(10).pow(Number(decimals)))
          .toFixed(0);
        const resAmountTokenMin = resAmountToken * 0.95;
        setAmountNFT(resAmountNFT.toString());
        setAmountToken(resAmountToken.toString());
        setAmountNFTMin(resAmountNFTMin);
        setAmountTokenMin(resAmountTokenMin.toFixed(0));
        console.log(resAmountNFT);
        console.log(amountToken.toFixed(0));
        console.log(resAmountToken);
        
      }
    }, [inputLiquidity])
    console.log(amountNFTMin);
    console.log(amountTokenMin);


    const currentAllowance = useAllowanceDML(
      account,
      data.fullInfoMetadata.dmlAddress,
      wallet,
      isApprovedDML
    );
    // console.log(currentAllowance);
    // console.log(inputLiquidity);
    // console.log(Number(handleBignumber(Number(inputLiquidity), 18)));

    useEffect(() => {
      const checkApproveToken = async () => {
        console.log('123kkhihi');
        console.log(currentAllowance);
        if (currentAllowance && Number(currentAllowance) < Number(handleBignumber(Number(inputLiquidity), Number(decimals)))) {
          setIsApprovedLiquidity(false);
        } else {
          setIsApprovedLiquidity(true);
        }
      };
      checkApproveToken();
    }, [account, wallet, inputLiquidity, isApprovedDML, currentAllowance]);
    const { reserves, isLoadingReserves,res }: any = useFetchReservesDML(
      account,
      data.fullInfoMetadata.dmlAddress,
      wallet,
    );
    // console.log(reserves);
    // console.log(reserves[0].toString());
    // console.log(reserves[1].toString());
    const { balanceToken, decimals, bigNumberBalance, symbolToken } =
      useInformationToken(account, tokenAddress, wallet);
    console.log(isApprovedDML);
    console.log(isApprovedLiquidity);
    const handleApproveDML = async (account: string, wallet: string, dmlAddress: string, inputLiquidity: string, setIsApprovedDML: any) => {
      if (inputLiquidity) {
        setShowRequiredMessage(false);
        console.log(wallet, dmlAddress, inputLiquidity);

        const providerChoice = getProvider(wallet);
        const provider = new ethers.providers.Web3Provider(providerChoice);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(dmlAddress, abiDML, signer);
        const routerAddress = process.env.NEXT_PUBLIC_ROUTER || "";
        const inputLiquidityBN = new BigNumber(inputLiquidity)
          .times(new BigNumber(10).pow(Number(decimals)))
          .toFixed(0);
        console.log(inputLiquidityBN);

        try {
          console.log("abc");

          await contract.approve(routerAddress, inputLiquidityBN);
          setIsApprovedDML(true);
        } catch (error) {
          console.error(error);
        }
      } else {
        setShowRequiredMessage(true);
      }
    };
    useEffect(() => {
      if (account && data) {
        if (
          data.fullInfoMetadata.tokenAddress ===
          "0x734aef51d427b2f745210ec4bf1062abd48eceb6"
        ) {
          setTokenAddress("MATIC");
        } else {
          setTokenAddress(data.fullInfoMetadata.tokenAddress);
        }
      }
    }, [data, account]);
    const removeLiquidity = async () => {
      if (inputLiquidity && !isSufficientLiquidity ) {
        const providerChoice = getProvider(wallet);
        const provider = new ethers.providers.Web3Provider(providerChoice);
        const signer = provider.getSigner();
        const routerAddress = process.env.NEXT_PUBLIC_ROUTER || "";
        const contract = new ethers.Contract(routerAddress, abiRouter, signer);
        const liquidity = handleBignumber(Number(inputLiquidity), Number(decimals));
        console.log(liquidity);
        
        try {
          let result;
          let transactionHash;

          if (tokenAddress === "MATIC") {
            result = await contract.removeLiquidityETH(
              data.fullInfoMetadata.nft,
              data.fullInfoMetadata.tokenId,
              (Number(liquidity)).toFixed(0),
              amountTokenMin,
              amountNFTMin,
              account,
              Math.floor((new Date().getTime() + 20 * 60000) / 1000),
              { gasLimit: 8000000}
            );
            transactionHash = result.hash;
          } else {
            result = await contract.removeLiquidity(
              data.fullInfoMetadata.tokenAddress,
              data.fullInfoMetadata.nft,
              data.fullInfoMetadata.tokenId,
              (Number(liquidity)).toFixed(0),
              amountTokenMin,
              amountNFTMin,
              account,
              Math.floor((new Date().getTime() + 20 * 60000) / 1000),
              { gasLimit: 8000000}
            );
            transactionHash = result.hash;
          }
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
          console.error(error);
        }
      } else {
        setShowRequiredMessage(true);
      }
    }
    return (
      <Wrapper isOpen={isOpenRemoveLiquidity} onClick={handleClose}>
        <div className="relative z-50 flex flex-col justify-center cursor-default h-fit">
          <div className="bg-white h-fit w-[432px] rounded-lg p-4 relative">
            <p className="flex items-center mb-4 text-xl font-semibold text-dark1">
              Remove
              {data && (
                <div className="flex items-center leading-[16px] ml-1">
                  <span> {data.fullInfoMetadata.metadata.symbol}</span>
                  <span className="overflow-hidden">/</span>
                  <span>{data.tokenSymbol}</span>
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
                        <p>{amountNFTMin}</p>
                        <p className="text-dark3">NFT</p>
                      </div>
                    </div>
                    <div className={styles.inputItem}>
                      <div className="flex justify-between">
                        <p>{amountToken}</p>
                        <p className="text-dark3">{data.tokenSymbol}</p>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      {!isApprovedLiquidity && account && (
                        <Button
                          className="w-[126px] py-2 mx-auto"
                          primary
                          onClick={() =>
                            handleApproveDML(
                              account,
                              wallet,
                              data.fullInfoMetadata.dmlAddress,
                              inputLiquidity,
                              setIsApprovedDML,
                            )
                          }
                        >
                          APPROVE DML
                        </Button>
                      )}
                      {(isApprovedLiquidity) && (
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
        <ToastContainer />
      </Wrapper>
    );
  };

export default ModalRemmoveLiquidity;
