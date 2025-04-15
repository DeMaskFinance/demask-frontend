import { Button } from "@/components/Buttons";
import FormatNumber from "@/components/Common/FormatNumber";
import { NFTIcon } from "@/components/Icons";
import TokenDropdown from "@/components/InputSymbol";
import TokenIcon from "@/components/Logo/TokenIcon";
import { TabGroups } from "@/components/NavChoice";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AccountContext from "@/context/AccountContext";
import useNFTBalance from "@/hooks/useBalanceNFT";
import useBananceOfDML from "@/hooks/useBalanceOfDML";
import useCheckApproveNFT from "@/hooks/useCheckApproveNFT";
import useDebounce from "@/hooks/useDebounce";
import useInformationToken from "@/hooks/useInformationToken";
import { queryClient } from "@/libs/constants";
import { getPaymentTokens } from "@/libs/service/contractsService";
import { getMetadata } from "@/libs/service/nftService";
import { erc1155TradingAdd } from "@/libs/service/tradeService";
import { replaceDot } from "@/libs/utils/formatComon";
import formatNumber from "@/libs/utils/formatNumer";
import useApproveNFT from "@/libs/utils/handleApproveNFT";
import handleBignumber from "@/libs/utils/handleBignumber";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Fragment, useContext, useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { NumberFormatValues, NumericFormat } from "react-number-format";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import { ModalWallet } from "../../ModalWallet";
import { ModalError, ModalTransation } from "../../ModalTransation";
import { ModalConfirmAddLiquidity } from "../../ModalConfirmAddLiquidity";
import { ModalSuccess } from "../../ModalTransation/ModalSuccess";


interface ModalAddLiquidityERC1155Props {
    setIsOpenSuccess: React.Dispatch<React.SetStateAction<boolean>>;
    setIsOpenError: React.Dispatch<React.SetStateAction<boolean>>;
    setIsOpenAddLiquidity: React.Dispatch<React.SetStateAction<boolean>>;
    setHash: React.Dispatch<React.SetStateAction<string>>;
}

const ModalAddLiquidityERC1155: React.FunctionComponent<
    ModalAddLiquidityERC1155Props
> = () => {
    const router = useRouter();
    const [nftAddress, setNftAddress] = useState<string>("");
    const [hash, setHash] = useState<string>("");
    const [inputNFT, setInputNFT] = useState<string>("");
    const [inputToken, setInputToken] = useState<string>("");
    const [idNFT, setIdNFT] = useState("");
    const [isSufficientNFT, setIsSufficientNFT] = useState<boolean>(false);
    const [isSufficientToken, setIsSufficientToken] = useState<boolean>(false);
    const [isOpenConfirmAddLiquidity, setIsOpenConfirmAddLiquidity] =
        useState<boolean>(false);
    const [amountErcDesired, setAmountErcDesired] = useState<any>();
    const slug = router.query.slug as string[] || [];
    const collectionAddress = slug[0] || "";
    const tokenAddress = slug[1] || "";
    const { account, wallet, chainId, slippage } = useContext(AccountContext);
    const [isInputNFT, setIsInputNFT] = useState<boolean>(false);
    const [isOpenTransaction, setIsOpenTransaction] = useState<boolean>(false);
    const [activeChoiceNFT, setActiveChoiceNFT] = useState<string>("");
    const [version] = useQueryParam("version", withDefault(StringParam, "v1"));
    const [isOpenSuccess, setIsOpenSuccess] = useState<boolean>(false);
    const [isOpenError, setIsOpenError] = useState<boolean>(false);

    const contracts = queryClient.getQueryData<ContractAddresses>([
        "contracts",
        chainId,
        version,
    ]);

    const { balanceToken, bigNumberBalance } = useInformationToken(
        account,
        wallet,
        chainId
    );
    const [selectedToken, setSelectedToken] = useState<Token>();

    const { balanceDML } = useBananceOfDML(
        account,
        selectedToken?.tokenAddress,
        wallet
    );

    let inputNFTValue = useDebounce(inputNFT, 1000);

    const { data: paymentTokens = [] } = useQuery<Token[]>({
        queryKey: ["paymentTokens", chainId],
        queryFn: async () => {
            const res = await getPaymentTokens(chainId);
            return res.data;
        },
    });
    const currentTokenBalance = selectedToken?.isNative ? bigNumberBalance : balanceDML;


    useEffect(() => {
        if (!selectedToken && paymentTokens?.length > 0) {
            const matchedToken = paymentTokens.find(
                (token) => token.tokenAddress.toLowerCase() === tokenAddress?.toLowerCase()
            );

            if (matchedToken) {
                setSelectedToken(matchedToken);
            } else {
                setSelectedToken(paymentTokens[0]);
            }
        }
    }, [paymentTokens, selectedToken, tokenAddress]);

    useEffect(() => {
        if (slug) {
            setNftAddress(slug[0]);
            setIdNFT(slug[2]);
            setInputNFT("");
            setIsSufficientNFT(false);
            setIsSufficientToken(false);
        }
    }, [slug]);



    const { isLoading, data, isFetching, isSuccess, refetch } = useQuery({
        queryKey: ["metadata", idNFT, nftAddress, chainId, selectedToken?.tokenAddress, version],
        queryFn: async () => {
            const res = await getMetadata(
                chainId,
                nftAddress.toLowerCase(),
                idNFT,
                selectedToken?.tokenAddress || "",
                version
            );
            return res;
        },
        enabled: !!paymentTokens
    });

    const { data: dataTradingAdd, isFetching: isFetchingAdd } = useQuery<DataAdd>(
        {
            queryKey: [
                "1155TradingAdd",
                selectedToken?.tokenAddress,
                chainId,
                nftAddress,
                idNFT,
                inputNFTValue,
                slippage,
                version,
            ],
            queryFn: async () => {
                const res = await erc1155TradingAdd(
                    selectedToken?.tokenAddress || "",
                    chainId,
                    nftAddress,
                    idNFT,
                    +inputNFTValue,
                    slippage,
                    version
                );
                return res.data;
            },
            refetchInterval: 20000,
            enabled: !!paymentTokens
        }
    );
    const { isApprovedNFT, refetch: refetchNFT } = useCheckApproveNFT(
        account,
        nftAddress,
        contracts?.ERC1155_ROUTER_ADDRESS || "",
        "erc1155"
    );


    const { balanceNFT } = useNFTBalance(
        account,
        nftAddress,
        idNFT,
    );


    useEffect(() => {
        let amountErcDesired;
        if (data?.dmlAddress !== null && dataTradingAdd && inputNFT) {
            amountErcDesired = dataTradingAdd?.amountETHDecimals;
        } else {
            amountErcDesired = handleBignumber(Number(inputToken), 18);
        }
        if (!inputNFT) {
            setAmountErcDesired("");
        }
        setAmountErcDesired(amountErcDesired);
        if (amountErcDesired) {
            if (Number(amountErcDesired) > Number(currentTokenBalance)) {
                setIsSufficientToken(true);
            } else {
                setIsSufficientToken(false);
            }

        }
    }, [inputNFT, inputToken, dataTradingAdd, bigNumberBalance]);

    const handleGetNFT = (values: NumberFormatValues) => {
        const { value } = values;
        setInputNFT(value);
        const numericValue = Number(value.replace(/,/g, ""));
        if (numericValue > Number(balanceNFT)) {
            setIsSufficientNFT(true);
        } else {
            setIsSufficientNFT(false);
        }
    };
    const handleGetToken = (values: NumberFormatValues) => {
        const { value } = values;
        const inputValue = replaceDot(value);
        setInputToken(inputValue);
        if (Number(inputValue) > Number(currentTokenBalance)) {
            setIsSufficientToken(true);
        } else {
            setIsSufficientToken(false);
        }
    };

    const handleAddLiquidity = () => {
        if (inputNFT && !isSufficientNFT && !isSufficientToken) {
            setIsOpenConfirmAddLiquidity(true);
        } else {
            setIsInputNFT(true);
        }
    };

    const handleChoicePercent = (item: string) => {
        {
            dataTradingAdd &&
                setInputNFT(
                    Math.floor((parseFloat(item) / 100) * +balanceNFT).toString()
                );
        }
        setActiveChoiceNFT(item);
    };

    const { handleApproveNFT } = useApproveNFT();

    console.log(inputToken)

    return (
        <>
            <Fragment>
                <div className="h-fit w-[360px] md:w-[400px] lg:w-[480px] rounded-lg relative">
                    <div className="title_modal"
                    >Add Liquidity</div>

                    <div className="mt-5 border-t border-shader_600">
                        <p className="title_label">
                            <span className="">Deposit</span>
                            <span className="text-red">*</span>
                        </p>
                        <div>
                            <div className="flex justify-between mb-1 font-semibold text-primary_300">
                                <p>NFT balance</p>
                                <p className="flex items-center font-bold text-white gap-x-1">
                                    {account ? formatNumber(Number(balanceNFT)) : 0}
                                    <NFTIcon width={12} height={12} />
                                </p>
                            </div>
                            <div className="relative flex gap-x-2">
                                <div className="relative w-[60%]">
                                    <NumericFormat
                                        name="amountNFT"
                                        id="amountNFT"
                                        autoComplete="off"
                                        placeholder="NFT quantity"
                                        pattern="^[1-9][0-9]*$"
                                        decimalScale={0}
                                        decimalSeparator=","
                                        thousandSeparator="."
                                        className="input_item"
                                        value={inputNFT}
                                        onValueChange={handleGetNFT}
                                    />
                                </div>
                                <div className="w-[40%]">
                                    <TabGroups
                                        choices={["25%", "50%", "75%", "100%"]}
                                        activeChoice={activeChoiceNFT}
                                        onChoiceChange={handleChoicePercent}
                                    />
                                </div>
                            </div>

                            {isSufficientNFT && (
                                <p
                                    className="mt-1 mb-2 ml-3 text-xs text-red"
                                    key="totalSale"
                                >
                                    Insufficient NFT balance
                                </p>
                            )}
                            {!inputNFT && isInputNFT && (
                                <p className="mt-1 mb-2 ml-3 text-xs text-red" key="inputNFT">
                                    Required
                                </p>
                            )}
                        </div>
                        <div className="mb-4">
                            <div className="flex justify-between mt-4 mb-1 font-semibold text-primary_300">
                                <p>Token</p>
                                <div className="flex items-center font-bold text-white gap-x-1">
                                    {account && selectedToken?.isNative ? formatNumber(balanceToken) : formatNumber(Number(balanceDML) / 1e18)}
                                    <TokenIcon token={selectedToken?.symbol || ""} w={16} h={16} />
                                </div>
                            </div>

                            {data?.dmlAddress === null ? (
                                <div className="relative">
                                    <NumericFormat
                                        name="amountToken"
                                        id="amountToken"
                                        autoComplete="off"
                                        placeholder="Input amount Token"
                                        className="input_item"
                                        value={inputToken}
                                        inputMode="decimal"
                                        onValueChange={handleGetToken}
                                        decimalSeparator=","
                                        thousandSeparator="."
                                        minLength={1}
                                        maxLength={30}
                                    />
                                    <div className="absolute top-1 right-1">
                                        <TokenDropdown
                                            selectedToken={selectedToken}
                                            setSelectedToken={setSelectedToken}
                                            dataToken={paymentTokens}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="input_item relative">
                                    {dataTradingAdd ? (
                                        <FormatNumber number={dataTradingAdd.amountETH} />
                                    ) : (
                                        <BiLoaderAlt className="text-xl animate-spin text-primary_400" />
                                    )}

                                    <div className="absolute top-1 right-1">
                                        <TokenDropdown
                                            selectedToken={selectedToken}
                                            setSelectedToken={setSelectedToken}
                                            dataToken={paymentTokens}
                                        />
                                    </div>
                                </div>
                            )}
                            {isSufficientToken && (
                                <p className="mt-1 mb-2 ml-3 text-xs text-red" key="inputNFT">
                                    Insufficient Token balance
                                </p>
                            )}
                        </div>
                    </div>
                    {!account ? (
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="w-full py-2" primary>
                                    Connect Wallet
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="w-[350px] p-0 border-none">
                                <ModalWallet />
                            </DialogContent>
                        </Dialog>
                    ) : !isApprovedNFT && contracts ? (
                        <Button
                            className="w-full py-3"
                            primary
                            onClick={() =>
                                handleApproveNFT(
                                    account,
                                    nftAddress,
                                    setIsOpenTransaction,
                                    contracts.ERC1155_ROUTER_ADDRESS,
                                    "erc1155",
                                    refetchNFT
                                )
                            }
                        >
                            Approve NFT
                        </Button>
                    ) : (
                        <Button
                            className="w-full py-3"
                            active={isSufficientNFT || Number(inputNFT) === 0}
                            disabled={isSufficientNFT || Number(inputNFT) === 0}
                            primary
                            onClick={handleAddLiquidity}
                        >
                            Add Liquidity
                        </Button>
                    )}
                    {Math.floor(amountErcDesired) === 0 &&
                        inputNFT &&
                        inputToken === "0" && (
                            <p className="mt-3 ml-3 text-xs text-red" key="inputNFT">
                                Can't add liquidity
                            </p>
                        )}
                </div>
            </Fragment>

            <ModalTransation
                isOpenTransation={isOpenTransaction}
                setIsOpenTransaction={setIsOpenTransaction}
            />
            {data && account && (
                <ModalConfirmAddLiquidity
                    isOpenConfirmAddLiquidity={isOpenConfirmAddLiquidity}
                    isOpenTransaction={isOpenTransaction}
                    isFetching={isFetchingAdd}
                    amountErcDesired={amountErcDesired}
                    setIsOpenTransaction={setIsOpenTransaction}
                    tokenAddress={selectedToken as any}
                    nftAddress={nftAddress}
                    idNFT={idNFT}
                    data={data}
                    setInputToken={setInputToken}
                    setIsOpenConfirmAddLiquidity={setIsOpenConfirmAddLiquidity}
                    inputNFT={inputNFT}
                    setInputNFT={setInputNFT}
                    setHash={setHash}
                    setIsOpenSuccess={setIsOpenSuccess}
                    setIsOpenError={setIsOpenError}
                />
            )}
            <ModalSuccess
                isOpenSuccess={isOpenSuccess}
                transactionHash={hash}
                type="Add Liquidity Success"
                setIsOpenSuccess={setIsOpenSuccess}
            />
            <ModalError
                isOpenError={isOpenError}
                transactionHash={hash}
                type="Add Liquidity Failed"
                setIsOpenError={setIsOpenError}
            />
        </>

    );
};

export default ModalAddLiquidityERC1155;
