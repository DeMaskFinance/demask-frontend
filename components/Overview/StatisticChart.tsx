import AccountContext from "@/context/AccountContext";
import { categoryAPI } from "@/libs/service/categoriesChartService";
import formatNumber from "@/libs/utils/formatNumer";
import { useQuery } from "@tanstack/react-query";
import React, { useContext } from "react";
import { BsArrowDown, BsArrowUp } from "react-icons/bs";

function StatisticChart() {
  const { chainId } = useContext(AccountContext);;
  const getCurrentDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const currentDateFormatted = getCurrentDate();

  const {
    isLoading,
    data: TVL,
    isFetching,
    refetch,
    isPreviousData,
  } = useQuery({
    queryKey: ["tvl", chainId],
    queryFn: async () => {
      const res = await categoryAPI(`/v2/tvlChart?chainId=${chainId}&date=${currentDateFormatted}`);
      return res;
    },

    keepPreviousData: true,
  });
  
  const { data: volume } = useQuery({
    queryKey: ["volumne", chainId],
    queryFn: async () => {
      const res = await categoryAPI(
        `/v2/volumeChart?chainId=${chainId}&date=${currentDateFormatted}`
      );
      return res;
    },

    keepPreviousData: true,
  });
  
  return (
    <div className="flex flex-col gap-6 my-6 text-base font-medium lg:flex-row md:flex-row text-dark2">
      <div className="flex">
        <span className="mr-2 ">
          Volume 24H:{" "}
          {volume && volume?.volumeInDay !== undefined ? formatNumber(volume?.volumeInDay) : 0}
        </span>{" "}
        (
        <span
          className={`flex items-center ${volume && volume?.volumePercent >= 0 ? "text-green" : "text-red"
            } `}
        >
          {volume && volume.volumePercent >= 0 ? (
            <BsArrowUp />
          ) : (
            <BsArrowDown />
          )}
          {volume && volume?.volumePercent !== undefined ? volume?.volumePercent.toFixed(2) : 0}%
        </span>
        )
      </div>
      <div className="flex ">
        <span className="mr-2 ">
          Fees 24H: {volume && volume?.volumeInDay !== undefined ? formatNumber((volume?.volumeInDay * 0.005).toString()) : 0}
        </span>
        (
        <span
          className={`flex items-center ${volume && volume?.volumePercent >= 0 ? "text-green" : "text-red"
            } `}
        >
          {volume && volume?.volumePercent >= 0 ? (
            <BsArrowUp />
          ) : (
            <BsArrowDown />
          )}
          {volume && volume?.volumePercent !== undefined ? volume?.volumePercent.toFixed(2) : 0}%
        </span>
        )
      </div>
      <div className="flex">
        <span className="mr-2 ">
          TVL: {TVL && TVL.tvlInDay !==undefined ? formatNumber(TVL && TVL?.tvlInDay) : 0}{" "}
        </span>
        (
        <span
          className={`flex items-center ${TVL && TVL?.tvlPercent >= 0 ? "text-green" : "text-red"
            } `}
        >
          {TVL && TVL?.tvlPercent >= 0 ? <BsArrowUp /> : <BsArrowDown />}
          {TVL && TVL?.tvlPercent !== undefined ? TVL?.tvlPercent.toFixed(2) : 0}%
        </span>
        )
      </div>
    </div>
  );
}

export default StatisticChart;
