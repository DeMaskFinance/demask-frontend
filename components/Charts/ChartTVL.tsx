import { categoryAPI } from "@/libs/service/categoriesChartService";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO, subDays } from "date-fns";
import React, { useState, useEffect, useContext } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import ChartLoading from "./ChartLoading";
import formatNumber from "@/libs/utils/formatNumer";
import AccountContext from "@/context/AccountContext";
import { EtherIcon } from "../Icons";

interface ChartTVLProps {}

const ChartTVL: React.FC<ChartTVLProps> = () => {
  const { chainId } = useContext(AccountContext);
  const {
    data: Chart,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["chart", chainId],
    queryFn: async () => {
      const res = await categoryAPI(
        `tvlChart?chainId=${chainId}&intervalDate=30`
      );
      return res;
    },
  });

  const chartData = Chart?.map((dataPoint: any) => ({
    date: dataPoint.date,
    value: Number(dataPoint.dailyTVL),
  }));

  const lastData = chartData && chartData[chartData.length - 1];
  const [activeData, setActiveData] = useState<number | null>(null);

  const [hasInitialSetting, setHasInitialSetting] = useState(false);
  const [activeDate, setActiveDate] = useState<string | null>(null);

  useEffect(() => {
    if (lastData && !hasInitialSetting) {
      setActiveData(lastData.value);
      setHasInitialSetting(true);
      setActiveDate(lastData.date);
    }
  }, [lastData, hasInitialSetting, chainId]);
  useEffect(() => {
    setHasInitialSetting(!true);
  }, [chainId]);

  const handleMouseMove = (event: any) => {
    if (event && event.activePayload && event.activePayload.length) {
      const { value } = event.activePayload[0].payload;
      const { date } = event.activePayload[0].payload;
      setActiveData(value);
      setActiveDate(date);
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return <div className="hidden custom-tooltip"></div>;
    }

    return null;
  };

  return (
    <div className="h-full p-6 border rounded-lg bg_main">
      {Chart && (
        <div>
          <div className="mb-2 text-dark1 ">
            <p className="title text-shader_100">Total Volume Locked (TVL)</p>
            {activeData && (
              <div className="flex items-center my-2 text-2xl font-bold text-white gap-x-1">
                {formatNumber(Number(activeData).toFixed(2))}
                <p>
                  <EtherIcon
                    width={18}
                    height={18}
                    className="fill-dark0 dark:fill-white"
                  />
                </p>
              </div>
            )}
            <p className="text-sm text-primary_300">
              {activeDate && format(parseISO(activeDate), "MMM d, yyyy")} (UTC)
            </p>
          </div>
          <div className="h-[212px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 0,
                  left: 0,
                  bottom: 0,
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => {
                  setActiveData(lastData.value);
                  setActiveDate(lastData.date);
                }}
              >
                <defs>
                  <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="30%" stopColor="#AD97FE" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#AD97FE" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#B2B2B2" }}
                  tickFormatter={(str) => {
                    const date = parseISO(str);
                    if (date.getDate() % 3 === 0) {
                      return format(date, "d");
                    }
                    return "";
                  }}
                />
                {/* <YAxis
              dataKey="value"
              tickLine={false}
              axisLine={false}
              tickCount={6}
              tickFormatter={(number) => `$${number.toFixed(2)}`}
            /> */}
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ strokeDasharray: "4 4" }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#AD97FE"
                  strokeWidth="2"
                  fill="url(#color)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      {(isLoading || isFetching) && <ChartLoading />}
    </div>
  );
};

export default ChartTVL;
