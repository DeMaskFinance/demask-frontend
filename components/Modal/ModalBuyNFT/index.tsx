import abiRouter from "@/abi/abiRouter.json";
import { Button } from "@/components/Buttons";
import { DownIcon } from "@/components/Icons";
import TransitionURL from "@/components/Toast/TransionURL";
import AccountContext from "@/context/AccountContext";
import useInformationDML from "@/hooks/useInformationDML";
import useInformationToken from "@/hooks/useInformationToken";
import { getProvider } from "@/libs/connection/getProvider";
import { exponentialToDecimal } from "@/libs/utils/convertExponential";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import formatNumber from "@/libs/utils/formatNumer";
import { getBuyPrice, getFeeBuy } from "@/libs/utils/getPrice";
import handleApproveToken from "@/libs/utils/handleApproveToken";
import { ethers } from "ethers";
import { memo, useContext, useEffect, useState } from "react";
import { CgClose } from "react-icons/cg";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ModalTransation } from "../ModalTransation";
import { ModalWallet } from "../ModalWallet";
import Wrapper from "../Wrapper";
interface ModalBuyNFTProps {
    isOpenBuyNFT: boolean;
    tokenAddress: string;
    data: any;
    inputNFT: string;
    symbolToken: string;
    nftAddress: string;
    idNFT: string;
    isOpenTransaction: boolean,
    setIsOpenTransaction: React.Dispatch<React.SetStateAction<boolean>>,
    setIsOpenBuyNFT: React.Dispatch<React.SetStateAction<boolean>>;
    setInputNFT: React.Dispatch<React.SetStateAction<string>>;
}

const ModalBuyNFT: React.FunctionComponent<
    ModalBuyNFTProps
> = ({
    isOpenBuyNFT,
    tokenAddress,
    data,
    inputNFT,
    symbolToken,
    nftAddress,
    idNFT,
    isOpenTransaction,
    setIsOpenTransaction,
    setIsOpenBuyNFT,
    setInputNFT,
}) => {
        const [isOpen, setIsOpen] = useState<boolean>(false);
        const [isApprovedToken, setIsApprovedToken] = useState<boolean>(false);
        const { demask, tokenDefault, account, wallet, slippage } = useContext(AccountContext);
        const { ROUTER: routerAddress, RPC: rpc, NATIVE_ADDRESS: nativeAddress } = demask;
        const [amountBuy, setAmountBuy] = useState<number>(0);
        const [amountBuyDec, setAmountBuyDec] = useState<number>(0);
        const [feeTrading, setFeeTrading] = useState<string>('0');
        console.log(data);
        const { allowanceToken } =
            useInformationToken(account, tokenAddress, wallet, routerAddress, rpc, nativeAddress, isOpenTransaction, isOpenBuyNFT);
        const handleClose = (e: any) => {
            e.preventDefault();
            document.body.style.overflowY = "auto";
            setIsOpenBuyNFT(false);
        };
        const { reserveNFT, reserveToken } = useInformationDML(data.dmlAddress, wallet, account, isOpenTransaction, isOpenBuyNFT)
        console.log(reserveNFT.toString());
        console.log(Number(reserveToken));
        useEffect(() => {
            if (inputNFT && data) {
                setAmountBuy(getBuyPrice(Number(reserveNFT), data.reserveToken, +(inputNFT)))
                setAmountBuyDec(getBuyPrice(Number(reserveNFT), Number(reserveToken), Number(inputNFT)) * Number(inputNFT) * 1.05)
                setFeeTrading(getFeeBuy(Number(reserveNFT), Number(reserveToken), +(inputNFT)).toString());
            } else {
                setAmountBuy(0);
                setAmountBuyDec(0);
            }
        }, [inputNFT, data, reserveNFT, reserveToken])
        // console.log(amountBuyDec);
        // console.log('allowance', allowanceToken);
        // console.log(isOpenTransaction);

        useEffect(() => {
            const checkApproveToken = async () => {
                if (tokenAddress !== nativeAddress) {
                    if (Number(allowanceToken) < Number(amountBuyDec)) {
                        setIsApprovedToken(false);
                    } else {
                        setIsApprovedToken(true);
                    }
                } else {
                    setIsApprovedToken(true);
                }
            };
            checkApproveToken();
        }, [account, wallet, data, inputNFT, amountBuyDec, isOpenTransaction, tokenAddress, allowanceToken, reserveNFT, reserveToken]);
        const handleBuyNFT = async (e: any) => {
            e.preventDefault();
            if (!account) {
                setIsOpen(true);
                return;
            }
            if (
                Number(reserveNFT) > 1 &&
                Number(reserveToken) > 0 &&
                Math.floor(amountBuyDec) > 0
            ) {
                const providerChoice = getProvider(wallet);
                const provider = new ethers.providers.Web3Provider(providerChoice);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(routerAddress, abiRouter, signer);
                try {
                    let result;
                    setIsOpenTransaction(true);
                    if (tokenAddress === nativeAddress) {
                        result = await contract.buyETH(
                            nftAddress,
                            idNFT,
                            inputNFT,
                            account,
                            Math.floor((new Date().getTime() + 20 * 60000) / 1000),
                            { gasLimit: 8000000, value: exponentialToDecimal(Math.floor(amountBuyDec)) }
                        );
                    } else {
                        result = await contract.buy(
                            tokenAddress,
                            nftAddress,
                            idNFT,
                            inputNFT,
                            exponentialToDecimal(Math.floor(amountBuyDec)),
                            account,
                            Math.floor((new Date().getTime() + 20 * 60000) / 1000),
                            { gasLimit: 8000000 }
                        );
                    }
                    const check = await provider.waitForTransaction(result.hash);
                    setIsOpenTransaction(false);
                    setIsOpenBuyNFT(false);
                    if (check.status === 1) {
                        toast.success(
                            <TransitionURL type={"Buy NFT success"} transactionHash={result.hash} />,
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
                            <TransitionURL type={"Buy NFT failed"} transactionHash={result.hash} />,
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


                    setInputNFT("");
                } catch (error) {
                    setIsOpenTransaction(false);
                    console.error(error);
                }
            }
        };
        console.log(inputNFT);
        // setIsOpenTransaction(true)
        return (
            <Wrapper isOpen={isOpenBuyNFT} onClick={handleClose}>
                <div className="relative z-50 flex flex-col justify-center cursor-default h-fit">
                    <div className="bg-white h-fit w-[360px] md:w-[400px] lg:w-[480px] rounded-lg p-4 relative">
                        <p className="flex items-center mb-4 text-xl font-semibold text-dark1">
                            Confirm Buy
                        </p>
                        <div className="flex justify-between text-lg font-semibold text-dark2">
                            <p>{inputNFT}</p>
                            <p>{data.metadata.symbol}</p>
                        </div>
                        <div>
                            <DownIcon width={24} height={24} className="mx-auto cursor-pointer hover:fill-secondary5" />
                        </div>
                        <div className="flex justify-between text-lg font-semibold text-dark2">
                            <p>{formatNumber(
                                divideByDecimal(amountBuyDec.toString(), data.tokenDecimals)
                            )}</p>
                            <p>{symbolToken}</p>
                        </div>
                        <div className="flex justify-between mt-8 text-lg font-semibold text-secondary1">
                            <p>Slippage tolerance</p>
                            <p>{slippage}%</p>
                        </div>
                        <p className="mt-2 mb-6 text-sm text-dark2">Output is estimated. You will receive at least {inputNFT} NFT1 or the transaction will revert</p>
                        <div className="flex flex-col p-4 rounded-lg bg-dark4 gap-y-3">
                            <div className="flex justify-between text-sm text-dark1">
                                <p>Price</p>
                                <p>{formatNumber(
                                    (Number(divideByDecimal(amountBuyDec.toString(), data.tokenDecimals)) / Number(inputNFT)).toString()
                                )}</p>
                            </div>
                            <div className="flex justify-between text-sm text-dark1">
                                <p>Minimum received</p>
                                <div className="flex gap-x-1">
                                    <p>{inputNFT}</p>
                                    <p>{data.metadata.symbol}</p>
                                </div>
                            </div>
                            <div className="flex justify-between text-sm text-dark1">
                                <p>Trading fee</p>
                                <div className="flex gap-x-1">
                                    {formatNumber(
                                        divideByDecimal(feeTrading.toString(), data.tokenDecimals)
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-center mt-6">
                            {isApprovedToken ? (
                                <button
                                    type="button"
                                    className="py-2 w-[144px] bg-secondary2 rounded-lg text-sm text-white mx-auto block"
                                    onClick={handleBuyNFT}
                                >
                                    BUY NFT
                                </button>
                            ) : (
                                <Button
                                    className="w-[126px] py-2 mx-auto"
                                    type="button"
                                    primary
                                    onClick={() =>
                                        handleApproveToken(
                                            account,
                                            wallet,
                                            tokenAddress,
                                            amountBuyDec,
                                            routerAddress,
                                            setIsOpen,
                                            setIsOpenTransaction
                                        )
                                    }
                                >
                                    APPROVE TOKEN
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

export default memo(ModalBuyNFT);
