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
import { ModalWallet } from "../ModalWallet";
import abiDML from "@/abi/abiDML.json";
import BigNumber from "bignumber.js";
import useInformationToken from "@/hooks/useInformationToken";
import useAllowanceDML from "@/hooks/useAllowanceDML";
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
    const currentAllowance = useAllowanceDML(
      account,
      data.fullInfoMetadata.dmlAddress,
      wallet,
      isApprovedDML
    );
    console.log(currentAllowance);

    useEffect(() => {
      const checkApproveToken = async () => {
        console.log('123hihi');
        console.log(currentAllowance);
        if (Number(currentAllowance) < Number(inputLiquidity)) {
          setIsApprovedLiquidity(false);
        } else {
          setIsApprovedLiquidity(true);
        }
      };
      checkApproveToken();
    }, [account, wallet, inputLiquidity, isApprovedDML,currentAllowance]);
    const { balanceToken, decimals, bigNumberBalance, symbolToken } =
      useInformationToken(account, data.fullInfoMetadata.tokenAddress, wallet);
    console.log(isApprovedDML);
    console.log(isApprovedLiquidity);
    const handleApproveLiquidity = async (account: string, wallet: string, dmlAddress: string, inputLiquidity: string, setIsApprovedDML: any) => {
      if (inputLiquidity) {
        setShowRequiredMessage(false);
        const providerChoice = getProvider(wallet);
        const provider = new ethers.providers.Web3Provider(providerChoice);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(dmlAddress, abiDML, signer);
        const routerAddress = process.env.NEXT_PUBLIC_ROUTER || "";
        const inputLiquidityBN = new BigNumber(inputLiquidity)
          .times(new BigNumber(10).pow(Number(decimals)))
          .toFixed();
        try {
          await contract.approve(routerAddress, inputLiquidityBN);
          setIsApprovedDML(true);
        } catch (error) {
          console.error(error);
        }
      } else {
        setShowRequiredMessage(true);
      }
    };
    return (
      <Wrapper isOpen={isOpenRemoveLiquidity} onClick={handleClose}>
        <div className="z-50 flex flex-col justify-center cursor-default h-fit">
          <div className="bg-white h-fit w-[432px] rounded-lg p-4 relative">
            <p className="flex items-center mb-4 text-xl font-semibold text-dark1">
              Remove
              {data && (
                <div className="flex items-center leading-[16px] ml-1">
                  <span> {data.fullInfoMetadata.metadata.symbol}</span>
                  <span className="overflow-hidden">/</span>
                  <span>{data.tokenName}</span>
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
                    <div className={styles.inputItem}>
                      <p className="text-dark3">NFT</p>
                    </div>
                    <div className={styles.inputItem}>
                      <p className="text-dark3">Tokens</p>
                    </div>
                    <div className="flex justify-center">
                      {!isApprovedLiquidity && account && (
                        <Button
                          className="w-[126px] py-2 mx-auto"
                          primary
                          onClick={() =>
                            handleApproveLiquidity(
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
                      {/* {isApprovedLiquidity && (
                        <Button
                          className="w-[126px] py-2 mx-auto"
                          primary
                          onClick={addLiquidity}
                        >
                          Remove LIQUIDITY
                        </Button>
                      )} */}
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
      </Wrapper>
    );
  };

export default ModalRemmoveLiquidity;
