import abiRouter from "@/abi/abiRouter.json";
import { Button } from "@/components/Buttons";
import FormatNumber from "@/components/Common/FormatNumber";
import { DetailIcon, DownIcon, EtherIcon } from "@/components/Icons";
import { FaChevronLeft } from "react-icons/fa";
import AccountContext from "@/context/AccountContext";
import useAmountInMax from "@/hooks/useAmountInMax";
import useInforFee from "@/hooks/useInforFee";
import useInformationDML from "@/hooks/useInformationDML";
import useInformationToken from "@/hooks/useInformationToken";
import { getProvider } from "@/libs/connection/getProvider";
import { exponentialToDecimal } from "@/libs/utils/convertExponential";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import handleApproveToken from "@/libs/utils/handleApproveToken";
import { ethers } from "ethers";
import { memo, useContext, useEffect, useState } from "react";
import { CgClose } from "react-icons/cg";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ModalDocument from "../ModalLength/ModalDocument";
import { ModalTransation } from "../ModalTransation";
import { ModalWallet } from "../ModalWallet";
import Wrapper from "../Wrapper";
import { BiLoaderAlt } from "react-icons/bi";
interface ModalBuyNFTProps {
    isOpenBuyNFT: boolean;
    tokenAddress: string;
    data: any;
    inputNFT: string;
    nftAddress: string;
    idNFT: string;
    isOpenTransaction: boolean,
    setIsOpenTransaction: React.Dispatch<React.SetStateAction<boolean>>,
    setIsOpenBuyNFT: React.Dispatch<React.SetStateAction<boolean>>;
    setInputNFT: React.Dispatch<React.SetStateAction<string>>;
    setIsOpenSuccess: React.Dispatch<React.SetStateAction<boolean>>;
    setIsOpenError: React.Dispatch<React.SetStateAction<boolean>>;
    setHash: React.Dispatch<React.SetStateAction<string>>;
}

const ModalBuyNFT: React.FunctionComponent<
    ModalBuyNFTProps
> = ({
    isOpenBuyNFT,
    tokenAddress,
    data,
    inputNFT,
    nftAddress,
    idNFT,
    isOpenTransaction,
    setIsOpenTransaction,
    setIsOpenBuyNFT,
    setInputNFT,
    setIsOpenError,
    setIsOpenSuccess,
    setHash,
}) => {
        const [isOpen, setIsOpen] = useState<boolean>(false);
        const [isApprovedToken, setIsApprovedToken] = useState<boolean>(false);
        const [isSufficientNFT, setIsSufficientNFT] = useState<boolean>(false);
        const [isSufficientTokenBuy, setIsSufficientTokenBuy] =
            useState<boolean>(false);
        const [seeDetail, setSeeDetail] = useState<boolean>(false);
        const [amountBuyDec, setAmountBuyDec] = useState<number>(0);
        const [totalProcessBuy, setTotalProcessBuy] = useState<number>(0);
        const [gasLimit, setGasLimit] = useState<string>('0');
        const [preFectch, setPreFetch] = useState<boolean>(false);
        const [updatePrice, setUpdatePrice] = useState<boolean>(false);
        const [royaltiesFeeBuy, setRoyaltiesFeeBuy] = useState<number>(0);
        const { demask, tokenDefault, account, wallet, slippage, txDeadline } = useContext(AccountContext);
        const { ROUTER: routerAddress, RPC: rpc, NATIVE_ADDRESS: nativeAddress } = demask;
        const { allowanceToken, bigNumberBalance } =
            useInformationToken(account, tokenAddress, wallet, routerAddress, rpc, nativeAddress, isOpenTransaction, isOpenBuyNFT);
        const handleClose = (e: any) => {
            e.preventDefault();
            document.body.style.overflowY = "auto";
            setIsOpenBuyNFT(false);
        };
        const { reserveNFT, reserveToken, isLoadingInforDML } = useInformationDML(data.dmlAddress, wallet, account, isOpenTransaction, isOpenBuyNFT, true, true, updatePrice)
        const { amountTokenBuy, feeTradingBuy } = useAmountInMax(inputNFT, data.dmlAddress, tokenAddress, nftAddress, idNFT, wallet, account, rpc, routerAddress, updatePrice);

        // console.log(amountTokenBuy);
        const { tip, gasUse } = useInforFee(account, wallet);

        // console.log({
        //     tip,
        //     gasUse
        // });
        useEffect(() => {
            if (inputNFT && data && amountTokenBuy) {
                setAmountBuyDec(amountTokenBuy * (1 + (slippage / 100)) + amountTokenBuy * Number(data.royaltyFee) / 100);
                setTotalProcessBuy(Number(amountTokenBuy) + (amountTokenBuy * Number(data.royaltyFee) / 100));
                setRoyaltiesFeeBuy(amountTokenBuy * Number(data.royaltyFee) / 100);
            } else {
                setAmountBuyDec(0);
                setTotalProcessBuy(0);
                setRoyaltiesFeeBuy(0);
            }
        }, [inputNFT, data, slippage, amountTokenBuy])
        useEffect(() => {
            const load = setInterval(() => {
                if (isOpenBuyNFT) {
                    setPreFetch(true);
                } else {
                    setPreFetch(false);
                }
            }, 20000)
            return () => {
                clearInterval(load)
            }
        }, [isOpenBuyNFT, preFectch])

        useEffect(() => {
            const checkReservesNFT = () => {
                if (data && Number(inputNFT) <= Number(reserveNFT)) {
                    setIsSufficientNFT(true);
                } else {
                    setIsSufficientNFT(false);
                }
            };
            checkReservesNFT();
            if (Number(amountBuyDec.toFixed()) > Number(bigNumberBalance)) {
                setIsSufficientTokenBuy(false);
            } else {
                setIsSufficientTokenBuy(true);
            }
        }, [inputNFT, account, amountBuyDec, data, reserveNFT]);

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
        }, [account, wallet, data, inputNFT, amountBuyDec, isOpenTransaction, tokenAddress, allowanceToken]);

        const test1 = ethers.utils.formatUnits((748302 * (250000000 + 1500000000)).toString(), 'ether');
        const test2 = ethers.utils.formatUnits((748302 * (250000000)).toString(), 'ether');
        // console.log({
        //     test1,
        //     test2
        // });
        console.log(seeDetail);

        const handleBuyNFT = async (e: any) => {
            e.preventDefault();
            if (!account) {
                setIsOpen(true);
                return;
            }
            if (
                Number(reserveNFT) > 1 &&
                Number(reserveToken) > 0 &&
                Math.floor(amountBuyDec) > 0 &&
                isSufficientNFT &&
                isSufficientTokenBuy
            ) {

                try {
                    let result;
                    setIsOpenTransaction(true);
                    const providerChoice = await getProvider(wallet);
                    const provider = new ethers.providers.Web3Provider(providerChoice);
                    const signer = provider.getSigner();
                    const contract = new ethers.Contract(routerAddress, abiRouter, signer);
                    const fee = data.royaltyFee === 0 ? '5000' : data.royaltyFee! * 10000;
                    const value = (tokenAddress === nativeAddress) ? exponentialToDecimal(Math.floor(amountBuyDec)) : 0;
                    const estimatedGas = await contract.estimateGas.buyERC20ERC1155(
                        tokenAddress,
                        nftAddress,
                        idNFT,
                        inputNFT,
                        exponentialToDecimal(Math.floor(amountBuyDec)),
                        fee,
                        account,
                        Math.floor((new Date().getTime() + txDeadline * 60000) / 1000),
                        { value: value }
                    );

                    result = await contract.buyERC20ERC1155(
                        tokenAddress,
                        nftAddress,
                        idNFT,
                        inputNFT,
                        exponentialToDecimal(Math.floor(amountBuyDec)),
                        fee,
                        account,
                        Math.floor((new Date().getTime() + txDeadline * 60000) / 1000),
                        { gasLimit: estimatedGas, value: value }
                    );
                    setHash(result.hash)
                    const check = await provider.waitForTransaction(result.hash);
                    setIsOpenTransaction(false);
                    setIsOpenBuyNFT(false);
                    if (check.status === 1) {
                        setIsOpenSuccess(true);
                    } else {
                        setIsOpenError(false);
                    }
                    setInputNFT("");
                } catch (error) {
                    setIsOpenTransaction(false);
                    console.error(error);
                }
            }
        };

        return (
            <Wrapper isOpen={isOpenBuyNFT} onClick={handleClose}>
                <div className="relative z-50 flex flex-col justify-center cursor-default h-fit">
                    <div className="bg-white h-fit w-[360px] md:w-[400px] lg:w-[480px] rounded-lg p-4 relative">
                        <p className="flex items-center mb-4 text-xl font-semibold text-dark1">
                            Confirm Buy
                        </p>
                        <div className="flex justify-between text-lg font-semibold text-dark2">
                            <FormatNumber number={divideByDecimal(totalProcessBuy.toString(), data.tokenDecimals).toString()} />
                            <p>{data?.tokenSymbol}</p>
                        </div>
                        <div>
                            <DownIcon width={24} height={24} className="mx-auto cursor-pointer hover:fill-secondary5" />
                        </div>
                        <div className="flex justify-between text-lg font-semibold text-dark2">
                            <p>{inputNFT}</p>
                            <div className="max-w-[260px]">
                                <ModalDocument data={data?.metadata?.symbol} />
                            </div>
                        </div>
                        {
                            preFectch && (
                                <div className="flex items-center justify-between p-4 mt-8 font-semibold text-white rounded-lg bg-secondary5">
                                    <p className="text-xs">Price Updated</p>
                                    <Button disabled={isLoadingInforDML} primary className="px-6 py-2 bg-secondary5" onClick={() => {
                                        setUpdatePrice(!updatePrice);
                                        setPreFetch(false);
                                    }}>Accept</Button>
                                </div>
                            )
                        }
                        <div className="flex justify-between mt-8 text-lg font-semibold text-secondary1">
                            <p>Slippage tolerance</p>
                            <p>{slippage}%</p>
                        </div>
                        <p className="mt-2 mb-6 text-sm text-dark2">Output is estimated. You will receive at least {inputNFT} NFT or the transaction will revert</p>
                        <div className="flex flex-col p-4 rounded-lg bg-dark4 gap-y-3">
                            <div className="flex justify-between text-sm text-dark1">
                                <p>Price</p>
                                <div className="flex items-center">
                                    <FormatNumber number={(Number(divideByDecimal(amountTokenBuy.toString(), data.tokenDecimals)) / Number(inputNFT)).toString()} />
                                    <p>
                                        <EtherIcon width={14} height={14} className="fill-dark2" />
                                    </p>
                                </div>
                            </div>
                            <div className="flex justify-between text-sm text-dark1">
                                <p>Maximum amount</p>
                                <div className="flex gap-x-1">
                                    <div className="flex items-center">
                                        <FormatNumber number={(Number(divideByDecimal(amountBuyDec.toString(), data.tokenDecimals))).toString()} />
                                        <p>
                                            <EtherIcon width={14} height={14} className="fill-dark2" />
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between pt-2 text-sm border-t cursor-pointer group border-dark3 text-dark1" onClick={() => setSeeDetail(!seeDetail)}>
                                <div className="flex items-center gap-x-1">
                                    <p>Total fee</p>
                                    <div className={`p-1 text-sm rounded-lg bg-dark3 transition-all duration-100 ease-linear ${seeDetail ? '-rotate-90' : ''}`}><FaChevronLeft /></div>
                                </div>
                                <div className="flex items-center">
                                    <FormatNumber number={divideByDecimal((+feeTradingBuy + +royaltiesFeeBuy).toString(), data.tokenDecimals).toString()} />
                                    <p>
                                        <EtherIcon width={14} height={14} className="fill-dark2" />
                                    </p>
                                </div>
                            </div>
                            <div className={`overflow-hidden will-change-[height] ${seeDetail ? 'h-[56px] opacity-100' : 'h-0 opacity-0'} transition-all duration-100 ease-linear`}>
                                <div className="flex justify-between mb-4 text-sm text-dark1">
                                    <p>Trading fee</p>
                                    <div className="flex items-center">
                                        <FormatNumber number={divideByDecimal(feeTradingBuy.toString(), data.tokenDecimals).toString()} />
                                        <p>
                                            <EtherIcon width={14} height={14} className="fill-dark2" />
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-between text-sm text-dark1">
                                    <p>Royalties Fee</p>
                                    <div className="flex items-center">
                                        <FormatNumber number={(royaltiesFeeBuy / 1e18).toString()} />
                                        <p>
                                            <EtherIcon width={14} height={14} className="fill-dark2" />
                                        </p>
                                    </div>
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
                                )
                            }
                            {
                                !isSufficientTokenBuy &&
                                reserveToken && (
                                    <p
                                        className="text-xs text-red"
                                        key="NFTbalance"
                                    >
                                        Insufficient Token balance
                                    </p>
                                )
                            }
                        </div>
                        <div className="flex flex-col items-center mt-6">
                            {isApprovedToken ? (
                                <button
                                    type="button"
                                    disabled={isLoadingInforDML || preFectch}
                                    className={`py-2 flex justify-center items-center gap-x-1 w-[144px] hover:bg-white border hover:text-secondary5 hover:border-secondary5 ${isLoadingInforDML || preFectch ? 'bg-dark4' : 'bg-secondary5'} rounded-lg text-sm text-white mx-auto block`}
                                    onClick={handleBuyNFT}
                                >
                                    BUY NFT
                                    {isLoadingInforDML && (
                                        <BiLoaderAlt className="text-white animate-spin" />
                                    )}
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
