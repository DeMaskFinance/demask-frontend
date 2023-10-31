import abiDML from "@/abi/abiDML.json";
import abiRouter from "@/abi/abiRouter.json";
import { Button } from "@/components/Buttons";
import { TabGroups } from "@/components/NavChoice";
import TransitionURL from "@/components/Toast/TransionURL";
import AccountContext from "@/context/AccountContext";
import useAllowanceDML from "@/hooks/useAllowanceDML";
import useBananceOfDML from "@/hooks/useBalanceOfDML";
import useTotalSupply from "@/hooks/useTotalSupply";
import { getProvider } from "@/libs/connection/getProvider";
import approveNFT from "@/libs/utils/approveNFT";
import { exponentialToDecimal } from "@/libs/utils/convertExponential";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import formatNumber from "@/libs/utils/formatNumer";
import handleApproveNFT from "@/libs/utils/handleApproveNFT";
import handleBignumber from "@/libs/utils/handleBignumber";
import BigNumber from "bignumber.js";
import { ethers } from "ethers";
import { memo, useContext, useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ModalTransation } from "../ModalTransation";
import { ModalWallet } from "../ModalWallet";
import Wrapper from "../Wrapper";
import { DownIcon } from "@/components/Icons";
import useInformationDML from "@/hooks/useInformationDML";
import { getBuyPrice, getSellPrice } from "@/libs/utils/getPrice";
import useInformationToken from "@/hooks/useInformationToken";
import handleApproveToken from "@/libs/utils/handleApproveToken";
interface ModalBuyNFTProps {
    isOpenBuyNFT: boolean;
    tokenAddress: string;
    data: any;
    inputNFT: string;
    symbolToken: string;
    setIsOpenBuyNFT: React.Dispatch<React.SetStateAction<boolean>>;
}
const styles = {
    title: "block mb-4 text-base font-medium text-black24",
    inputItem: "w-full p-2 mb-4 border rounded-lg border-dark3",
};
const ModalBuyNFT: React.FunctionComponent<
    ModalBuyNFTProps
> = ({
    isOpenBuyNFT,
    tokenAddress,
    data,
    inputNFT,
    symbolToken,
    setIsOpenBuyNFT,
}) => {
        const [isOpen, setIsOpen] = useState<boolean>(false);
        const [isOpenTransaction, setIsOpenTransaction] = useState<boolean>(false);
        const [isApprovedToken, setIsApprovedToken] = useState<boolean>(false);
        const { demask, tokenDefault, account, wallet } = useContext(AccountContext);
        const { ROUTER: routerAddress, RPC: rpc, NATIVE_ADDRESS: nativeAddress } = demask;
        const [amountBuy, setAmountBuy] = useState<number>(0);
        const [amountSell, setAmountSell] = useState<number>(0);
        const [amountBuyDec, setAmountBuyDec] = useState<number>(0);
        const [amountSellDec, setAmountSellDec] = useState<number>(0);
        console.log(data);
        const { balanceToken, bigNumberBalance, allowanceToken } =
            useInformationToken(account, tokenAddress, wallet, routerAddress, rpc, nativeAddress, isOpenTransaction);
        const handleClose = (e: any) => {
            e.preventDefault();
            document.body.style.overflowY = "auto";
            setIsOpenBuyNFT(false);
        };
        const { reserveNFT, reserveToken } = useInformationDML(data.dmlAddress, wallet, account)
        console.log(reserveNFT.toString());
        console.log(Number(reserveToken));
        useEffect(() => {
            if (inputNFT && data) {
                setAmountBuy(getBuyPrice(Number(reserveNFT), data.reserveToken, +(inputNFT)))
                setAmountSell(getSellPrice(Number(reserveNFT), data.reserveToken, +(inputNFT)))
                setAmountBuyDec(getBuyPrice(Number(reserveNFT), data.reserveTokenDecimals, Number(inputNFT)) * Number(inputNFT) * 1.05)
                setAmountSellDec(getSellPrice(Number(reserveNFT), data.reserveTokenDecimals, +(inputNFT)) * Number(inputNFT) * 0.95)
            } else {
                setAmountBuy(0);
                setAmountSell(0);
                setAmountBuyDec(0);
                setAmountSellDec(0);
            }
        }, [inputNFT, data])
        console.log(amountBuyDec);
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
                            <p>20.00%</p>
                        </div>
                        <p className="mt-2 mb-6 text-sm text-dark2">Output is estimated. You will receive at least 12,000 NFT1 or the transaction will revert</p>
                        <div className="flex flex-col p-4 rounded-lg bg-dark4 gap-y-3">
                            <div className="flex justify-between text-sm text-dark1">
                                <p>Price</p>
                                <p>123</p>
                            </div>
                            <div className="flex justify-between text-sm text-dark1">
                                <p>Minimum received</p>
                                <p>NFT1</p>
                            </div>
                            <div className="flex justify-between text-sm text-dark1">
                                <p>Trading fee</p>
                                <p>NFT1</p>
                            </div>
                        </div>
                        <div className="mt-6">
                            {isApprovedToken ? (
                                <button
                                    type="button"
                                    className="py-2 w-[144px] bg-secondary2 rounded-lg text-sm text-white mx-auto block"
                                    onClick={() => setIsOpenBuyNFT(true)}
                                >
                                    BUY NFT
                                </button>
                            ) : (
                                <Button
                                    className="w-[126px] py-2"
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
