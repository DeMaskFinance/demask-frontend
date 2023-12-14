import abiRouter from "@/abi/abiRouter.json";
import FormatNumber from "@/components/Common/FormatNumber";
import { DownIcon, EtherIcon } from "@/components/Icons";
import AccountContext from "@/context/AccountContext";
import useAmountOutMin from "@/hooks/useAmountOutMin";
import useNFTBalance from "@/hooks/useBalanceNFT";
import useInformationDML from "@/hooks/useInformationDML";
import useInformationToken from "@/hooks/useInformationToken";
import { getProvider } from "@/libs/connection/getProvider";
import { exponentialToDecimal } from "@/libs/utils/convertExponential";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import { ethers } from "ethers";
import { memo, useContext, useEffect, useState } from "react";
import { CgClose } from "react-icons/cg";
import "react-toastify/dist/ReactToastify.css";
import { ModalTransation } from "../ModalTransation";
import { ModalWallet } from "../ModalWallet";
import Wrapper from "../Wrapper";
interface ModalSellNFTProps {
    isOpenSellNFT: boolean;
    tokenAddress: string;
    data: any;
    inputNFT: string;
    symbolToken: string;
    nftAddress: string;
    idNFT: string;
    isOpenTransaction: boolean,
    royaltiesPercent: number | null,
    setIsOpenTransaction: React.Dispatch<React.SetStateAction<boolean>>,
    setIsOpenSellNFT: React.Dispatch<React.SetStateAction<boolean>>;
    setInputNFT: React.Dispatch<React.SetStateAction<string>>;
    setIsOpenSuccess: React.Dispatch<React.SetStateAction<boolean>>;
    setIsOpenError: React.Dispatch<React.SetStateAction<boolean>>;
    setHash: React.Dispatch<React.SetStateAction<string>>;
    setRoyaltiesPercent: React.Dispatch<React.SetStateAction<number | null>>;
}

const ModalSellNFT: React.FunctionComponent<
    ModalSellNFTProps
> = ({
    isOpenSellNFT,
    tokenAddress,
    data,
    inputNFT,
    symbolToken,
    nftAddress,
    idNFT,
    isOpenTransaction,
    royaltiesPercent,
    setIsOpenTransaction,
    setIsOpenSellNFT,
    setInputNFT,
    setIsOpenError,
    setIsOpenSuccess,
    setHash,
    setRoyaltiesPercent
}) => {
        const [isOpen, setIsOpen] = useState<boolean>(false);
        const { demask, tokenDefault, account, wallet, slippage, txDeadline } = useContext(AccountContext);
        const { ROUTER: routerAddress, RPC: rpc, NATIVE_ADDRESS: nativeAddress } = demask;
        const [amountSellDec, setAmountSellDec] = useState<number>(0);
        const [isSufficientNFT, setIsSufficientNFT] = useState<boolean>(false);
        const [isSufficientTokenSell, setIsSufficientTokenSell] =
            useState<boolean>(false);
        console.log(data);
        const { bigNumberBalance } =
            useInformationToken(account, tokenAddress, wallet, routerAddress, rpc, nativeAddress, isOpenTransaction, isOpenSellNFT);
        const handleClose = (e: any) => {
            e.preventDefault();
            document.body.style.overflowY = "auto";
            setIsOpenSellNFT(false);
        };
        const { reserveNFT, reserveToken } = useInformationDML(data.dmlAddress, wallet, account, isOpenTransaction, false, isOpenSellNFT)
        const { amountTokenSell, isLoadingSell, feeTradingSell } = useAmountOutMin(inputNFT, data.dmlAddress, tokenAddress, nftAddress, idNFT, wallet, account, rpc, routerAddress);

        const balanceNFT = useNFTBalance(account, nftAddress, idNFT, wallet, isOpenTransaction);
        useEffect(() => {
            const checkReservesNFT = () => {
                if (Number(inputNFT) <= Number(balanceNFT)) {
                    setIsSufficientNFT(true);
                } else {
                    setIsSufficientNFT(false);
                }
            };
            checkReservesNFT();
            if (Number(amountSellDec.toFixed()) > Number(bigNumberBalance)) {
                setIsSufficientTokenSell(false);
            } else {
                setIsSufficientTokenSell(true);
            }

        }, [inputNFT, account, amountSellDec]);
        useEffect(() => {
            if (inputNFT && data && amountTokenSell && royaltiesPercent) {
                setAmountSellDec(amountTokenSell * (1 - (slippage / 100)) - amountTokenSell * Number(royaltiesPercent) / 100);
            } else {
                setAmountSellDec(0);
            }
        }, [inputNFT, data, slippage, amountTokenSell, royaltiesPercent])
        console.log(amountSellDec);
        
        const handleSellNFT = async (e: any) => {
            e.preventDefault();
            if (!account) {
                setIsOpen(true);
                return;
            }
            if (
                isSufficientNFT &&
                isSufficientTokenSell &&
                Number(reserveNFT) > 0 &&
                Number(reserveToken) > 0 &&
                Math.floor(amountSellDec) > 0
            ) {
                const providerChoice = getProvider(wallet);
                const provider = new ethers.providers.Web3Provider(providerChoice);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(routerAddress, abiRouter, signer);
                try {
                    let result;
                    setIsOpenTransaction(true);
                    const estimatedGas = await contract.estimateGas.sellERC20ERC1155(
                        tokenAddress,
                        nftAddress,
                        idNFT,
                        inputNFT,
                        exponentialToDecimal(Math.floor(amountSellDec)),
                        royaltiesPercent! * 10000,
                        account,
                        Math.floor((new Date().getTime() + txDeadline * 60000) / 1000)
                    );
                    result = await contract.sellERC20ERC1155(
                        tokenAddress,
                        nftAddress,
                        idNFT,
                        inputNFT,
                        exponentialToDecimal(Math.floor(amountSellDec)),
                        royaltiesPercent! * 10000,
                        account,
                        Math.floor((new Date().getTime() + txDeadline * 60000) / 1000),
                        { gasLimit: estimatedGas }
                    );
                    setHash(result.hash);
                    const check = await provider.waitForTransaction(result.hash);
                    setIsOpenTransaction(false);
                    setIsOpenSellNFT(false);
                    if (check.status === 1) {
                        setIsOpenSuccess(true);
                    } else {
                        setIsOpenError(true);
                    }
                    setInputNFT("");
                    setRoyaltiesPercent(null);
                } catch (error) {
                    setIsOpenTransaction(false);
                    console.error(error);
                }
            }
        };
        return (
            <Wrapper isOpen={isOpenSellNFT} onClick={handleClose}>
                <div className="relative z-50 flex flex-col justify-center cursor-default h-fit">
                    <div className="bg-white h-fit w-[360px] md:w-[400px] lg:w-[480px] rounded-lg p-4 relative">
                        <p className="flex items-center mb-4 text-xl font-semibold text-dark1">
                            Confirm Sell
                        </p>
                        <div className="flex justify-between text-lg font-semibold text-dark2">
                            <p>{inputNFT}</p>
                            <p>{data.metadata.symbol}</p>
                        </div>
                        <div>
                            <DownIcon width={24} height={24} className="mx-auto cursor-pointer hover:fill-secondary5" />
                        </div>
                        <div className="flex justify-between text-lg font-semibold text-dark2">
                            <FormatNumber number={divideByDecimal(amountTokenSell.toString(), data.tokenDecimals)} />
                            <p>{symbolToken}</p>
                        </div>
                        <div className="flex justify-between mt-8 text-lg font-semibold text-secondary1">
                            <p>Slippage tolerance</p>
                            <p>{slippage}%</p>
                        </div>
                        <div className="flex flex-wrap mt-2 mb-6 text-sm text-dark2 gap-x-1">
                            <span>Output is estimated. You will receive at least</span>
                            <span className="flex gap-x-1"><FormatNumber number={divideByDecimal(amountSellDec.toString(), data.tokenDecimals)} /> {symbolToken}</span>
                            <span> or the transaction will revert</span>
                        </div>
                        <div className="flex flex-col p-4 rounded-lg bg-dark4 gap-y-3">
                            <div className="flex justify-between text-sm text-dark1">
                                <p>Price</p>
                                <div className="flex items-center">
                                    <FormatNumber number={(Number(divideByDecimal(amountSellDec.toString(), data.tokenDecimals)) / Number(inputNFT)).toString()} />
                                    <p>
                                        <EtherIcon width={14} height={14} className="fill-dark2" />
                                    </p>
                                </div>
                            </div>
                            <div className="flex justify-between text-sm text-dark1">
                                <p>Minimum received</p>
                                <div className="flex items-center">
                                    <FormatNumber number={divideByDecimal(amountSellDec.toString(), data.tokenDecimals)} />
                                    <p>
                                        <EtherIcon width={14} height={14} className="fill-dark2" />
                                    </p>
                                </div>
                            </div>
                            <div className="flex justify-between text-sm text-dark1">
                                <p>Trading fee</p>
                                <div className="flex items-center">
                                    <FormatNumber number={divideByDecimal(feeTradingSell.toString(), data.tokenDecimals)} />
                                    <p>
                                        <EtherIcon width={14} height={14} className="fill-dark2" />
                                    </p>
                                </div>
                            </div>
                            {
                                !isSufficientNFT &&
                                reserveNFT && (
                                    <p
                                        className="text-xs text-red"
                                        key="NFTbalance"
                                    >
                                        Insufficient NFT balance
                                    </p>
                                )}
                            {
                                (!isSufficientTokenSell &&
                                    reserveToken
                                ) && (
                                    <p
                                        className="text-xs text-red"
                                        key="Tokenbalance"
                                    >
                                        Insufficient Token balance
                                    </p>
                                )
                            }
                            {Math.floor(amountSellDec) === 0 && inputNFT && (
                                <p className="text-xs text-red">
                                    Can't sell
                                </p>
                            )}
                        </div>
                        <div className="flex flex-col items-center mt-6">
                            <button
                                type="button"
                                className="py-2 w-[144px] bg-secondary2 rounded-lg text-sm text-white mx-auto block"
                                onClick={handleSellNFT}
                            >
                                Sell NFT
                            </button>
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

export default memo(ModalSellNFT);
