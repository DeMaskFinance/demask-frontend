import { categoryAPI } from "@/libs/service/categoriesChartService";
import formatNumber from "@/libs/utils/formatNumer";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { BsArrowDown, BsArrowUp } from "react-icons/bs";

function StatisticChart() {
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
    queryKey: ["tvl"],
    queryFn: async () => {
      const res = await categoryAPI(`/tvlChart?date=${currentDateFormatted}`);
      return res;
    },

    keepPreviousData: true,
  });
  const { data: volume } = useQuery({
    queryKey: ["volumne"],
    queryFn: async () => {
      const res = await categoryAPI(
        `/volumeChart?date=${currentDateFormatted}`
      );
      return res;
    },

    keepPreviousData: true,
  });
  return (
    <div className="flex lg:flex-row md:flex-row flex-col gap-6 my-6 text-base font-medium text-dark2">
      <div className="flex">
        <span className="mr-2 ">
          Volume 24H: {volume && formatNumber(volume.volumeInDay)}{" "}
        </span>{" "}
        (
        <span className="flex items-center text-red">
          <BsArrowDown />
          89.95%
        </span>
        )
      </div>
      <div className="flex ">
        <span className="mr-2 ">
          Fees 24H: {volume && formatNumber(volume.volumeInDay * 0.5)}
        </span>
        (
        <span className="flex items-center text-red">
          <BsArrowDown />
          19.81%
        </span>
        )
      </div>
      <div className="flex">
        <span className="mr-2 ">TVL: {formatNumber(TVL && TVL.tvlInDay)} </span>
        (
        <span className="flex items-center text-green">
          <BsArrowUp />
          1.35%
        </span>
        )
      </div>
    </div>
  );
}

export default StatisticChart;
