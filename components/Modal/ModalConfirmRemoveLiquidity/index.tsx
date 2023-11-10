import abiDML from "@/abi/abiDML.json";
import abiRouter from "@/abi/abiRouter.json";
import { Button } from "@/components/Buttons";
import AccountContext from "@/context/AccountContext";
import useAllowanceDML from "@/hooks/useAllowanceDML";
import useBananceOfDML from "@/hooks/useBalanceOfDML";
import useInformationDML from "@/hooks/useInformationDML";
import { getProvider } from "@/libs/connection/getProvider";
import handleBignumber from "@/libs/utils/handleBignumber";
import BigNumber from "bignumber.js";
import { ethers } from "ethers";
import { memo, useContext, useEffect, useState } from "react";
import { CgClose } from "react-icons/cg";
import "react-toastify/dist/ReactToastify.css";
import { ModalTransation } from "../ModalTransation";
import { ModalWallet } from "../ModalWallet";
import Wrapper from "../Wrapper";
import { exponentialToDecimal } from "@/libs/utils/convertExponential";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import { BiLoaderAlt } from "react-icons/bi";
import formatNumber from "@/libs/utils/formatNumer";
import TransitionURL from "@/components/Toast/TransionURL";
import { toast } from "react-toastify";
interface ModalConfirmRemoveLiquidityProps {
    isOpenConfirmRemoveLiquidity: boolean;
    data: any;
    inputLiquidity: string;
    symbolToken: string;
    isOpenTransaction: boolean;
    totalSupply: string;
    setIsOpenTransaction: React.Dispatch<React.SetStateAction<boolean>>,
    setIsOpenConfirmRemoveLiquidity: React.Dispatch<React.SetStateAction<boolean>>;
    setInputLiquidity: React.Dispatch<React.SetStateAction<string>>;
    setIsOpenRemoveLiquidity: React.Dispatch<React.SetStateAction<boolean>>,
}

const ModalConfirmRemoveLiquidity: React.FunctionComponent<
    ModalConfirmRemoveLiquidityProps
> = ({
    isOpenConfirmRemoveLiquidity,
    data,
    inputLiquidity,
    symbolToken,
    isOpenTransaction,
    totalSupply,
    setIsOpenTransaction,
    setIsOpenConfirmRemoveLiquidity,
    setInputLiquidity,
    setIsOpenRemoveLiquidity
}) => {
        const [isSufficientLiquidity, setIsSufficientLiquidity] = useState<boolean>(false);
        const [isApprovedLiquidity, setIsApprovedLiquidity] = useState<boolean>(false);
        const [amountNFT, setAmountNFT] = useState('');
        const [amountToken, setAmountToken] = useState('');
        const [amountTokenMin, setAmountTokenMin] = useState("");
        const [amountTokenDec, setAmountTokenDec] = useState("");
        const [amountNFTMin, setAmountNFTMin] = useState("");
        const [isOpen, setIsOpen] = useState<boolean>(false);
        const { demask, tokenDefault, account, wallet } = useContext(AccountContext);
        const { ROUTER: routerAddress, RPC: rpc, NATIVE_ADDRESS: nativeAddress, FACTORY: factoryAddress } = demask;

        const { balanceOfDML } = useBananceOfDML(account, data.dmlAddress, wallet, isOpenTransaction);
        const currentAllowance = useAllowanceDML(
            account,
            data.dmlAddress,
            wallet,
            isOpenTransaction,
            inputLiquidity,
            routerAddress,
        );
        console.log(currentAllowance);
        const { reserveNFT, reserveToken } = useInformationDML(
            data.dmlAddress,
            wallet,
            account,
            isOpenTransaction,
            false,
            false,
            false,
            isOpenConfirmRemoveLiquidity
        );
        console.log(reserveNFT.toString());
        console.log(Number(reserveToken));
        useEffect(() => {
            const checkApproveToken = async () => {
                console.log(currentAllowance);
                if (currentAllowance && Number(currentAllowance) < Number(Number(handleBignumber(Number(inputLiquidity), Number(data.dmlDecimals))).toFixed(0))) {
                    setIsApprovedLiquidity(false);
                } else {
                    setIsApprovedLiquidity(true);
                }
            };
            checkApproveToken();
        }, [account, wallet, inputLiquidity, currentAllowance, isOpenTransaction]);
        console.log(currentAllowance);
        console.log(Number(handleBignumber(Number(inputLiquidity), Number(data.dmlDecimals))).toFixed(0));

        useEffect(() => {
            if (data && inputLiquidity) {
                const amountLIQUIDITY = handleBignumber(Number(inputLiquidity), Number(data.dmlDecimals));
                const resAmountNFT = Number(amountLIQUIDITY) * Number(reserveNFT) / Number(totalSupply);
                const amountToken = Number(amountLIQUIDITY) * Number(reserveToken) / Number(totalSupply);
                const resAmountToken = Number(amountLIQUIDITY) * Number(reserveToken) / Number(totalSupply) + (Number(amountLIQUIDITY) * Number(reserveNFT) % Number(totalSupply)) * (Number(reserveToken) - Number(amountToken.toFixed(0))) / ((Number(reserveNFT) - Math.floor(Number(resAmountNFT))) * Number(totalSupply));
                const resAmountTokenMinShow = divideByDecimal(resAmountToken.toString(), data.dmlDecimals)
                const resAmountNFTMin = Math.floor(Number(resAmountNFT * 0.95));
                const resAmountTokenMin = Math.floor(Number(resAmountToken * 0.95));
                setAmountNFT(resAmountNFT.toString());
                setAmountToken(resAmountToken.toString());
                setAmountNFTMin(resAmountNFTMin.toString());
                // setAmountTokenMin(resAmountTokenMin.toString());
                setAmountTokenMin(Math.floor(resAmountTokenMin).toString());
                setAmountTokenDec(resAmountTokenMinShow)
            }
        }, [inputLiquidity, reserveNFT, reserveToken])

        console.log(handleBignumber(Number(inputLiquidity), 18));
        const handleApproveDML = async () => {
            const providerChoice = getProvider(wallet);
            const provider = new ethers.providers.Web3Provider(providerChoice);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(data.dmlAddress, abiDML, signer);
            const inputLiquidityBN = new BigNumber(inputLiquidity)
                .times(new BigNumber(10).pow(Number(data.dmlDecimals)))
                .toFixed(0);
            console.log(inputLiquidityBN);

            try {
                const result = await contract.approve(routerAddress, inputLiquidityBN);
                setIsOpenTransaction(true);
                await provider.waitForTransaction(result.hash);
                setIsOpenTransaction(false);
            } catch (error) {
                setIsOpenTransaction(false);
                console.error(error);
            }
        };
        const handleClose = (e: any) => {
            e.preventDefault();
            document.body.style.overflowY = "auto";
            setIsOpenConfirmRemoveLiquidity(false);
        };

        const removeLiquidity = async () => {
            if (inputLiquidity && !isSufficientLiquidity && Number(amountTokenMin) > 0) {
                const providerChoice = getProvider(wallet);
                const provider = new ethers.providers.Web3Provider(providerChoice);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(routerAddress, abiRouter, signer);
                const liquidity = handleBignumber(Number(inputLiquidity), Number(data.dmlDecimals));
                console.log(liquidity);
                console.log(amountTokenMin);
                console.log(amountNFTMin);

                try {
                    let transactionHash;
                    setIsOpenTransaction(true);
                    const result = await contract.removeERC20ERC1155(
                        data.tokenAddress,
                        data.nftAddress,
                        data.nftID,
                        Math.floor(Number(liquidity)).toString(),
                        exponentialToDecimal(Number(amountTokenMin)),
                        exponentialToDecimal(Number(amountNFTMin)),
                        account,
                        Math.floor((new Date().getTime() + 20 * 60000) / 1000),
                        { gasLimit: 8000000 }
                    );
                    const check = await provider.waitForTransaction(result.hash);
                    setIsOpenTransaction(false);
                    setInputLiquidity('');
                    setIsOpenRemoveLiquidity(false);
                    setIsOpenConfirmRemoveLiquidity(false);
                    if (check.status === 1) {
                        toast.success(
                            <TransitionURL
                                type={"Remove Liquidity success"}
                                transactionHash={result.hash}
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
                    } else {
                        toast.error(
                            <TransitionURL
                                type={"Remove Liquidity failed"}
                                transactionHash={result.hash}
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
                    }
                } catch (error) {
                    setIsOpenTransaction(false);
                    console.error(error);
                }
            } else {
                //   setShowRequiredMessage(true);
            }
        }


        return (
            <Wrapper isOpen={isOpenConfirmRemoveLiquidity} onClick={handleClose}>
                <div className="relative z-50 flex flex-col justify-center cursor-default h-fit">
                    <div className="bg-white h-fit w-[360px] md:w-[400px] lg:w-[480px] rounded-lg p-4 relative">
                        <p className="flex items-center mb-4 text-xl font-semibold text-dark1">
                            You will receive
                        </p>
                        <div className="flex justify-between text-lg font-semibold text-dark2">
                            {reserveToken ? (<p>{amountNFTMin}</p>) : (
                                <BiLoaderAlt className="text-3xl animate-spin text-secondary5" />
                            )}
                            <p>{data.metadata.symbol}</p>
                        </div>
                        <div className="flex justify-center mx-auto text-xl font-semibold text-dark2">
                            +
                        </div>
                        <div className="flex justify-between text-lg font-semibold text-dark2">
                            <p>{formatNumber(amountTokenDec)}</p>
                            <p>{symbolToken}</p>
                        </div>
                        <div className="flex justify-between my-2 text-xs font-semibold text-secondary1">
                            <p>Output is estimate if the price changes by more than 0.5% your transaction will revert.</p>
                        </div>
                        <div className="flex justify-between text-sm font-semibold text-dark2">
                            <div className="flex items-center leading-[13px]">
                                <span>{data.metadata.symbol}</span>
                                <span className="overflow-hidden">/</span>
                                <span>{symbolToken}</span>
                            </div>
                            <div>
                                {formatNumber(inputLiquidity)}
                            </div>
                        </div>
                        <div className="flex flex-col items-center mt-6">
                            {!isApprovedLiquidity && account && (
                                <Button
                                    className="w-[126px] py-2 mx-auto"
                                    primary
                                    onClick={handleApproveDML}
                                >
                                    APPROVE
                                </Button>
                            )}
                            {(isApprovedLiquidity) && (
                                <Button
                                    className="p-2 w-[126px] mx-auto"
                                    primary
                                    onClick={removeLiquidity}
                                >
                                    CONFIRM
                                </Button>
                            )}
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
            </Wrapper>
        );
    };

export default memo(ModalConfirmRemoveLiquidity);
