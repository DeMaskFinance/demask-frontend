import { categoryAPI } from "@/libs/service/categoriesChartService";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO, subDays } from "date-fns";
import React, { useState, useEffect } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import ChartLoading from "./ChartLoading";
import formatNumber from "@/libs/utils/formatNumer";
import useNetWork from "@/hooks/useNetwork";

interface ChartTVLProps { }

const ChartTVL: React.FC<ChartTVLProps> = () => {
  const { chainId } = useNetWork();
  const { data: Chart, isLoading } = useQuery({
    queryKey: ["chart", chainId],
    queryFn: async () => {
      const res = await categoryAPI(`v2/tvlChart?chainId=${chainId}&intervalDate=30`);
      return res;
    },
  });

  const chartData = Chart?.map((dataPoint: any) => ({
    date: dataPoint.date,
    value: dataPoint.tvlInDay,
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
  }, [lastData, hasInitialSetting]);

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
    <div>
      {
        Chart && (
          <div className="h-full p-6 rounded-lg lg:shadow-chart">
            <div className="mb-2 text-dark1">
              <p className="font-medium ">TVL</p>
              {activeData && (
                <p className="my-2 text-2xl font-medium text-dark0">
                  ${formatNumber(activeData?.toFixed(2))}
                </p>
              )}
              <p className="">
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
                      <stop offset="30%" stopColor="#A398FF" stopOpacity={1.0} />
                      <stop offset="100%" stopColor="#D9D9D9" stopOpacity={0} />
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
                    stroke="#A398FF"
                    strokeWidth="2"
                    fill="url(#color)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )
      }
      {isLoading && (
        <div className="h-full rounded-lg shadow-chart">
          <ChartLoading />
        </div>
      )}
    </div>
  );
};

export default ChartTVL;
