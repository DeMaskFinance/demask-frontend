import { Pagination } from "@/components/Common/Pagination";
import AccountContext from "@/context/AccountContext";
import { categoryAPI } from "@/libs/service/categoriesChartService";
import { useQuery } from "@tanstack/react-query";
import React, { useContext, useState } from "react";
import HistoryItem from "./HistoryItem";
import { TabGroups } from "@/components/NavChoice";
import { liquidityHistory } from "@/libs/service/liquidityService";
interface HistorySwapProps {
    data: DataBase;
    typeERC: string;
    paymentToken: string;
}
const HistorySwap1155: React.FunctionComponent<HistorySwapProps> = ({
    data,
    typeERC,
    paymentToken,
}) => {
    const [page, setPage] = useState(1);
    const [activeChoice, setActiveChoice] = useState<string>("All");
    const { account, wallet, chainId, demask } = useContext(AccountContext);
    const {
        isLoading,
        data: dataHistory,
        isFetching,
        refetch,
        isSuccess,
        isPlaceholderData,
    } = useQuery({
        queryKey: ["historySwap", chainId, activeChoice, data, page, paymentToken],
        queryFn: async () => {
            const res = await categoryAPI(
                `transaction-list?chainId=${chainId}&sortField=blockTime&sortOrder=desc&page=${page}&limit=10&dmlAddress=${data.dmlAddress}&action=${activeChoice}&type=${typeERC}`
            );
            return res;
        },
    });


    const {
        isLoading: isLoadingLiquidity,
        data: dataLiquidity,
        isFetching: isFetchingLiquidity,
        refetch: refetchLiquidity,
        isSuccess: isSuccessLiquidity,
        isPlaceholderData: isPlaceholderDataLiquidity,
    } = useQuery({
        queryKey: ["liquidityHistory", account, data.dmlAddress, chainId, activeChoice],
        queryFn: async () => {
            if (account && data.dmlAddress) {
                const res = await liquidityHistory(
                    account,
                    data.dmlAddress,
                    page,
                    chainId,
                    activeChoice
                );
                return res;
            }
        },
    });

    const options = ["All", "Buy", "Sell", "Add", "Remove"];
    const handleChoiceChange = (choice: string) => {
        setActiveChoice(choice);
    };


    return (
        <div className="w-full font-semibold lg:mb-0">
            <div className="w-full overflow-x-scroll border border-shader_500 lg:overflow-visible bg-shader_800">
                <TabGroups
                    choices={options}
                    activeChoice={activeChoice}
                    onChoiceChange={handleChoiceChange}
                    isDefault
                />
                <table className="w-full text-left border-collapse">
                    <thead className=" bg-shader_600 text-shader_200">
                        <tr className="flex px-4 py-3 text-sm">
                            <th className="flex justify-start pl-2 md:w-[70%] w-[100px]">
                                TYPE
                            </th>
                            <th className="flex justify-center lg:w-full md:w-full w-[100px]">
                                NFT AMOUNT
                            </th>
                            <th className="flex justify-end lg:w-full md:w-full w-[140px]">
                                AVG PRICE
                            </th>
                            <th className="flex justify-end lg:w-full md:w-full w-[140px]">
                                TOTAL
                            </th>
                            <th className="flex justify-center lg:w-full md:w-full w-[140px]">
                                FROM
                            </th>
                            <th className="flex justify-center lg:w-full md:w-full w-[140px]">
                                TX
                            </th>
                            <th className="flex  lg:w-full md:w-full w-[200px] pr-2">
                                <p className="lg:w-full flex items-center justify-end md:w-[175px] w-[200px]">
                                    TIME
                                </p>
                            </th>
                        </tr>
                    </thead>

                    <tbody className="flex flex-col h-[620px]">
                        <HistoryItem
                            data={dataHistory}
                            isFetching={isFetching}
                            isSuccess={isSuccess}
                            isLoading={isLoading}
                            demask={demask}
                        />
                    </tbody>
                </table>
            </div>
            {isSuccess && (
                <Pagination
                    data={dataHistory}
                    isPlaceholderData={isPlaceholderData}
                    page={page}
                    setPage={setPage}
                    refetch={refetch}
                    isFetching={isFetching}
                />
            )}
        </div>
    );
};
export default HistorySwap1155;
