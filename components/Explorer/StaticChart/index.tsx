import FormatNumber from "@/components/Common/FormatNumber";
import { DownPriceIcon, EtherIcon, UpPriceIcon } from "@/components/Icons";
import AccountContext from "@/context/AccountContext";
import { categoryAPI } from "@/libs/service/categoriesChartService";
import { formatPercent } from "@/libs/utils/formatComon";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";

function StatisticAnalytics() {
  const { chainId } = useContext(AccountContext);
  const { isLoading, data, isFetching } = useQuery({
    queryKey: ["tvl_volume", chainId],
    queryFn: async () => {
      const res = await categoryAPI(`current-volume-tvl?chainId=${chainId}`);
      return res.data;
    },

    keepPreviousData: true,
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4  text-white font-semibold">
      <div className="bg_main p-3">
        <span className=" text-sm text-shader_200">Volume 24H </span>
        <div className="flex items-center  gap-x-1 font-bold">
          <div>
            {data && data?.currentDateVolume !== undefined ? (
              <FormatNumber number={data?.currentDateVolume} />
            ) : (
              "0M"
            )}
          </div>
          <EtherIcon width={16} height={16} />
          <span
            className={`flex items-center gap-x-1 ml-1 ${
              data && data?.currentDateVolume >= 0 ? "text-green" : "text-red"
            } `}
          >
            {data && data?.currentDateVolume >= 0 ? (
              <UpPriceIcon />
            ) : (
              <DownPriceIcon />
            )}
            {data && data?.volume1DChange !== undefined
              ? formatPercent(data?.volume1DChange)
              : 0}
            %
          </span>
        </div>
      </div>
      <div className="bg_main p-3">
        <span className=" text-sm text-shader_200">Fees 24H </span>
        <div className="flex items-center  gap-x-1 font-bold">
          <p>
            {data && data?.currentDateVolume !== undefined ? (
              <FormatNumber
                number={(data?.currentDateVolume * 0.005).toString()}
              />
            ) : (
              "0M"
            )}
          </p>
          <EtherIcon width={16} height={16} />
          <span
            className={`flex items-center gap-x-1 ml-1 ${
              data && data?.volume1DChange >= 0 ? "text-green" : "text-red"
            } `}
          >
            {data && data?.volume1DChange >= 0 ? (
              <UpPriceIcon />
            ) : (
              <DownPriceIcon />
            )}
            {data && data?.volume1DChange !== undefined
              ? formatPercent(data?.volume1DChange)
              : "0"}
            %
          </span>
        </div>
      </div>
      <div className="bg_main p-3">
        <span className=" text-sm text-shader_200">TVL 24H </span>
        <div className="flex items-center  gap-x-1 font-bold">
          <div>
            {data && data.currentDateTVL !== undefined ? (
              <FormatNumber number={data?.currentDateTVL} />
            ) : (
              "0M"
            )}
          </div>
          <EtherIcon width={16} height={16} />
          <span
            className={`flex items-center gap-x-1 ml-1 ${
              data && data?.tvl1DChange >= 0 ? "text-green" : "text-red"
            } `}
          >
            {data && data?.tvl1DChange >= 0 ? (
              <UpPriceIcon />
            ) : (
              <DownPriceIcon />
            )}
            {data && data?.tvl1DChange !== undefined
              ? formatPercent(data?.tvl1DChange)
              : "0"}
            %
          </span>
        </div>
      </div>
      <div className="bg_main p-3">
        <span className=" text-sm text-shader_200">Revenue 24H </span>
        <div className="flex items-center  gap-x-1 font-bold">
          <p>
            {/* {data && data?.currentDateVolume !== undefined
              ? formatNumber((data?.currentDateVolume * 0.005).toString())
              : "0M"} */}
            0M
          </p>
          <EtherIcon width={16} height={16} />
          <span
            className={`flex items-center gap-x-1 ml-1 ${
              data && data?.volume1DChange >= 0 ? "text-green" : "text-red"
            } `}
          >
            {data && data?.volume1DChange >= 0 ? (
              <UpPriceIcon />
            ) : (
              <DownPriceIcon />
            )}
            {data && data?.volume1DChange !== undefined
              ? formatPercent(data?.volume1DChange)
              : "0"}
            %
          </span>
        </div>
      </div>
    </div>
  );
}

export default StatisticAnalytics;
