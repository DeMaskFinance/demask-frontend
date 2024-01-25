import { Button } from "@/components/Buttons";
import FormatNumber from "@/components/Common/FormatNumber";
import { TabGroups } from "@/components/NavChoice";
import AccountContext from "@/context/AccountContext";
import useBananceOfDML from "@/hooks/useBalanceOfDML";
import useTotalSupply from "@/hooks/useTotalSupply";
import approveNFT from "@/libs/utils/approveNFT";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import handleApproveNFT from "@/libs/utils/handleApproveNFT";
import handleBignumber from "@/libs/utils/handleBignumber";
import { useContext, useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import "react-toastify/dist/ReactToastify.css";
import ModalConfirmRemoveLiquidity from "../ModalConfirmRemoveLiquidity";
import { ModalTransation } from "../ModalTransation";
import { ModalWallet } from "../ModalWallet";
import Wrapper from "../Wrapper";
interface ModalRemoveLiquidityProps {
  isOpenRemoveLiquidity: boolean;
  data: any;
  setIsOpenRemoveLiquidity: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenError: React.Dispatch<React.SetStateAction<boolean>>;
  setHash: React.Dispatch<React.SetStateAction<string>>
}
const styles = {
  title: "block mb-4 text-base font-medium text-black24",
  inputItem: "w-full p-2 mb-4 border rounded-lg border-dark3",
};
const ModalRemoveLiquidity: React.FunctionComponent<
  ModalRemoveLiquidityProps
> = ({
  isOpenRemoveLiquidity,
  data,
  setIsOpenRemoveLiquidity,
  setHash,
  setIsOpenSuccess,
  setIsOpenError
}) => {
    const [inputLiquidity, setInputLiquidity] = useState<any>("");
    const [activeChoice, setActiveChoice] = useState<string>("0%");
    const [isSufficientLiquidity, setIsSufficientLiquidity] = useState<boolean>(false);
    const [isApprovedNFT, setIsApprovedNFT] = useState<boolean>(false);
    const [showRequiredMessage, setShowRequiredMessage] = useState(false);
    const [amountNFT, setAmountNFT] = useState('');
    const [amountToken, setAmountToken] = useState('');
    const [amountTokenMin, setAmountTokenMin] = useState("");
    const [amountTokenDec, setAmountTokenDec] = useState("");
    const [amountNFTMin, setAmountNFTMin] = useState("");
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isOpenTransaction, setIsOpenTransaction] = useState<boolean>(false);
    const [isOpenConfirmRemoveLiquidity, setIsOpenConfirmRemoveLiquidity] = useState<boolean>(false);
    const { demask, tokenDefault, account, wallet, slippage } = useContext(AccountContext);
    const { ROUTER: routerAddress, RPC: rpc, NATIVE_ADDRESS: nativeAddress } = demask;
    const handleClose = (e: React.MouseEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement>) => {
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
      if (balanceOfDML && activeChoice !== '' && activeChoice !== '0%') {
        let liquidityPercentage = 0;
        if (activeChoice === '25%') {
          liquidityPercentage = 0.25;
        } else if (activeChoice === '50%') {
          liquidityPercentage = 0.5;
        } else if (activeChoice === '75%') {
          liquidityPercentage = 0.75;
        } else if (activeChoice === '100%') {
          liquidityPercentage = 1;
        }
        const calculatedLiquidity = (Number(balanceOfDML) * liquidityPercentage).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 18,
        });

        setInputLiquidity(calculatedLiquidity);
        setShowRequiredMessage(false);
        setIsSufficientLiquidity(false);
      }
    }, [balanceOfDML, activeChoice]);
    const totalSupply = useTotalSupply(account, wallet, data.dmlAddress, isOpenTransaction);

    useEffect(() => {
      if (data && inputLiquidity) {
        const amountLIQUIDITY = handleBignumber(Number(inputLiquidity), Number(data.dmlDecimals));
        const resAmountNFT = Number(amountLIQUIDITY) * Number(data.reserveNFT) / Number(totalSupply);
        const amountToken = Number(amountLIQUIDITY) * Number(data.reserveTokenDecimals) / Number(totalSupply);
        const resAmountToken = Number(amountLIQUIDITY) * Number(data.reserveTokenDecimals) / Number(totalSupply) + (Number(amountLIQUIDITY) * Number(data.reserveNFT) % Number(totalSupply)) * (Number(data.reserveTokenDecimals) - Number(amountToken.toFixed(0))) / ((Number(data.reserveNFT) - Math.floor(Number(resAmountNFT))) * Number(totalSupply));
        const resAmountTokenMinShow = divideByDecimal(resAmountToken.toString(), data.dmlDecimals)
        const resAmountNFTMin = Math.floor(Number(resAmountNFT * (1 - (slippage / 100))));
        const resAmountTokenMin = Math.floor(Number(resAmountToken * (1 - (slippage / 100))));
        setAmountNFT(resAmountNFT.toString());
        setAmountToken(resAmountToken.toString());
        setAmountNFTMin(resAmountNFTMin.toString());
        // setAmountTokenMin(resAmountTokenMin.toString());
        setAmountTokenMin(Math.floor(resAmountTokenMin).toString());
        setAmountTokenDec(resAmountTokenMinShow)
      }
    }, [inputLiquidity, data])
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
    }, [account, data.nftAddress, wallet, isOpenTransaction]);

    const handleRemoveLiquidity = () => {
      if (inputLiquidity === "") {
        setShowRequiredMessage(true);
      } else if (!isSufficientLiquidity && Number(amountTokenMin) > 0) {
        setIsOpenConfirmRemoveLiquidity(true);
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
                  <span> {data?.metadata?.symbol}</span>
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
                      <div className="flex">Balance: <FormatNumber number={balanceOfDML} /></div>
                    </div>
                    <input
                      className={styles.inputItem}
                      inputMode="decimal"
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
                        {data.reserveTokenDecimals ? (<p>{amountNFTMin}</p>) : (
                          <BiLoaderAlt className="text-3xl animate-spin text-secondary5" />
                        )}
                        <p className="text-dark3">NFT</p>
                      </div>
                    </div>
                    <div className={styles.inputItem}>
                      <div className="flex justify-between">
                        <FormatNumber number={amountTokenDec} />
                        <p className="text-dark3">{data.tokenSymbol}</p>
                      </div>
                    </div>
                    {Number(amountTokenMin) < 1 && inputLiquidity && (
                      <p className="my-2 ml-3 text-xs text-red" key="inputNFT">
                        Can't remove liquidity
                      </p>
                    )}
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
                              setIsOpenTransaction,
                              routerAddress
                            )
                          }
                        >
                          APPROVE NFT
                        </Button>
                      )}
                      {(isApprovedNFT) && (
                        <Button
                          className="p-2 mx-auto"
                          primary
                          onClick={handleRemoveLiquidity}
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
        <ModalConfirmRemoveLiquidity isOpenConfirmRemoveLiquidity={isOpenConfirmRemoveLiquidity} isOpenTransaction={isOpenTransaction} setIsOpenTransaction={setIsOpenTransaction} data={data} inputLiquidity={inputLiquidity} setIsOpenConfirmRemoveLiquidity={setIsOpenConfirmRemoveLiquidity} totalSupply={totalSupply} setInputLiquidity={setInputLiquidity} setIsOpenRemoveLiquidity={setIsOpenRemoveLiquidity} setHash={setHash} setIsOpenSuccess={setIsOpenSuccess} setIsOpenError={setIsOpenError} />
        <ModalWallet isOpen={isOpen} setIsOpen={setIsOpen} />
        <ModalTransation isOpenTransation={isOpenTransaction} setIsOpenTransaction={setIsOpenTransaction} isTransaction={true} />
      </Wrapper>
    );
  };

export default ModalRemoveLiquidity;
