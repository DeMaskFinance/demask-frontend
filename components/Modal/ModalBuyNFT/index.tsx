import abiRouter from "@/abi/abiRouter.json";
import { Button } from "@/components/Buttons";
import { DownIcon, EtherIcon } from "@/components/Icons";
import TransitionURL from "@/components/Toast/TransionURL";
import AccountContext from "@/context/AccountContext";
import useAmountInMax from "@/hooks/useAmountInMax";
import useInformationDML from "@/hooks/useInformationDML";
import useInformationToken from "@/hooks/useInformationToken";
import { getProvider } from "@/libs/connection/getProvider";
import { exponentialToDecimal } from "@/libs/utils/convertExponential";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import formatNumber from "@/libs/utils/formatNumer";
import handleApproveToken from "@/libs/utils/handleApproveToken";
import { ethers } from "ethers";
import { memo, useContext, useEffect, useState } from "react";
import { CgClose } from "react-icons/cg";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ModalTransation } from "../ModalTransation";
import { ModalWallet } from "../ModalWallet";
import Wrapper from "../Wrapper";
import Web3 from "web3";
import ModalDocument from "../ModalLength/ModalDocument";
import FormatNumber from "@/components/Common/FormatNumber";
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
        const [isSufficientNFT, setIsSufficientNFT] = useState<boolean>(false);
        const [isSufficientTokenBuy, setIsSufficientTokenBuy] =
            useState<boolean>(false);
        const [amountBuyDec, setAmountBuyDec] = useState<number>(0);
        const { demask, tokenDefault, account, wallet, slippage, txDeadline } = useContext(AccountContext);
        const { ROUTER: routerAddress, RPC: rpc, NATIVE_ADDRESS: nativeAddress } = demask;
        const { allowanceToken, bigNumberBalance } =
            useInformationToken(account, tokenAddress, wallet, routerAddress, rpc, nativeAddress, isOpenTransaction, isOpenBuyNFT);
        const handleClose = (e: any) => {
            e.preventDefault();
            document.body.style.overflowY = "auto";
            setIsOpenBuyNFT(false);
        };
        const { reserveNFT, reserveToken } = useInformationDML(data.dmlAddress, wallet, account, isOpenTransaction, isOpenBuyNFT)
        const { amountTokenBuy, feeTradingBuy } = useAmountInMax(inputNFT, data.dmlAddress, tokenAddress, nftAddress, idNFT, wallet, account, rpc, routerAddress);
        const web3 = new Web3;
        console.log(amountTokenBuy);
        console.log(exponentialToDecimal(Math.floor(amountBuyDec)));

        // console.log(inputNFT);
        // console.log(reserveNFT.toString());
        // console.log(reserveToken.toString());
        useEffect(() => {
            if (inputNFT && data && amountTokenBuy) {
                setAmountBuyDec(amountTokenBuy * (1 + (slippage / 100)));
            } else {
                setAmountBuyDec(0);
            }
        }, [inputNFT, data, slippage, amountTokenBuy])
        console.log(amountBuyDec);

        useEffect(() => {
            const checkReservesNFT = () => {
                if (data && Number(inputNFT) < Number(reserveNFT)) {
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
        const gasPriceGwei = ethers.utils.formatUnits(250000000, 'gwei');
        const test = web3.utils.fromWei((Number(250000000) * Number(8000000)).toString(), 'ether');
        console.log({
            gasPriceGwei,
            test
        });

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
                const providerChoice = getProvider(wallet);
                const provider = new ethers.providers.Web3Provider(providerChoice);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(routerAddress, abiRouter, signer);
                try {
                    let result;
                    setIsOpenTransaction(true);
                    const value = (tokenAddress === nativeAddress) ? exponentialToDecimal(Math.floor(amountBuyDec)) : 0;
                    const estimatedGas = await contract.estimateGas.buyERC20ERC1155(
                        tokenAddress,
                        nftAddress,
                        idNFT,
                        inputNFT,
                        exponentialToDecimal(Math.floor(amountBuyDec)),
                        account,
                        Math.floor((new Date().getTime() + txDeadline * 60000) / 1000),
                        { value: value }
                    );
                    // const gasUse = await provider.getGasPrice();
                    // const gasPriceGwei = ethers.utils.formatUnits(gasUse, 'gwei');
                    // const gasPrice = await ethers.getDefaultProvider().getGasPrice();
                    // const test = web3.utils.fromWei((Number(gasPriceGwei) * Number(estimatedGas)).toString(), 'gwei');
                    // const gasUseInEther = web3.utils.fromWei(gasUse.toString(), 'ether');
                    // const gasLimitEther = web3.utils.fromWei(estimatedGas.toString(), 'ether');
                    // const gasCostInWei = gasUse.mul(estimatedGas);
                    // const gasCostInEth = ethers.utils.formatEther(gasCostInWei);
                    // const aTest = gasPrice.mul(estimatedGas);
                    // const aEth = ethers.utils.formatEther(aTest);
                    // console.log({
                    //     gasLimit: estimatedGas.toString(),
                    //     limit: gasLimitEther.toString(),
                    //     gasUse: gasUse.toString(),
                    //     use: gasUseInEther.toString(),
                    //     test: test.toString(),
                    //     costETH: gasCostInEth.toString(),
                    //     gasPrice: gasPrice.toString(),
                    //     ETHdefault: aEth.toString(),
                    //     gasPriceGwei: gasPriceGwei.toString(),
                    // });

                    result = await contract.buyERC20ERC1155(
                        tokenAddress,
                        nftAddress,
                        idNFT,
                        inputNFT,
                        exponentialToDecimal(Math.floor(amountBuyDec)),
                        account,
                        Math.floor((new Date().getTime() + txDeadline * 60000) / 1000),
                        { gasLimit: estimatedGas, value: value }
                    );

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
        // setIsOpenTransaction(true)
        return (
            <Wrapper isOpen={isOpenBuyNFT} onClick={handleClose}>
                <div className="relative z-50 flex flex-col justify-center cursor-default h-fit">
                    <div className="bg-white h-fit w-[360px] md:w-[400px] lg:w-[480px] rounded-lg p-4 relative">
                        <p className="flex items-center mb-4 text-xl font-semibold text-dark1">
                            Confirm Buy
                        </p>
                        <div className="flex justify-between text-lg font-semibold text-dark2">
                            <FormatNumber number={divideByDecimal(amountTokenBuy.toString(), data.tokenDecimals).toString()} />
                            <p>{symbolToken}</p>
                        </div>
                        <div>
                            <DownIcon width={24} height={24} className="mx-auto cursor-pointer hover:fill-secondary5" />
                        </div>
                        <div className="flex justify-between text-lg font-semibold text-dark2">
                            <p>{inputNFT}</p>
                            <div className="max-w-[260px]">
                                <ModalDocument data={data.metadata.symbol} />
                            </div>
                        </div>
                        <div className="flex justify-between mt-8 text-lg font-semibold text-secondary1">
                            <p>Slippage tolerance</p>
                            <p>{slippage}%</p>
                        </div>
                        <p className="mt-2 mb-6 text-sm text-dark2">Output is estimated. You will receive at least {inputNFT} NFT1 or the transaction will revert</p>
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
                                        <FormatNumber number={(Number(divideByDecimal(amountBuyDec.toString(), data.tokenDecimals)) / Number(inputNFT)).toString()} />
                                        <p>
                                            <EtherIcon width={14} height={14} className="fill-dark2" />
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between text-sm text-dark1">
                                <p>Trading fee</p>
                                <div className="flex items-center">
                                    <FormatNumber number={divideByDecimal(feeTradingBuy.toString(), data.tokenDecimals).toString()} />
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
