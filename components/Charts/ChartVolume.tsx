import AccountContext from "@/context/AccountContext";
import { categoryAPI } from "@/libs/service/categoriesChartService";
import formatNumber from "@/libs/utils/formatNumer";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import React, { useContext, useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis } from "recharts";
import { TabGroups } from "../NavChoice";
import ChartLoading from "./ChartLoading";
import { EtherIcon } from "../Icons";
interface ChartVolumnProps {}

interface DataPoint {
  _id: string;
  date: string;
  volumeInDay: number;
}

interface GroupedData {
  startDate: string;
  endDate: string;
  totalVolume: number;
}
const ChartVolumn: React.FC<ChartVolumnProps> = () => {
  const [activeDate, setActiveDate] = useState<string | null>(null);
  const [activeChoice, setActiveChoice] = useState<string>("D");
  const { chainId } = useContext(AccountContext);
  const { data, isLoading: LoadingVolume } = useQuery({
    queryKey: ["ChartVolume", chainId],
    queryFn: async () => {
      const res = await categoryAPI(
        `volumeChart?chainId=${chainId}&intervalDate=30`
      );
      return res;
    },
  });

  const chartVolume = data?.map((dataPoint: any) => ({
    date: dataPoint.date,
    value: Number(dataPoint.dailyVolume),
  }));
  const lastData = chartVolume && chartVolume[chartVolume.length - 1];

  const [activeData, setActiveData] = useState<number | null>(null);

  const [hasInitialSetting, setHasInitialSetting] = useState(false);

  useEffect(() => {
    if (lastData && !hasInitialSetting) {
      setActiveData(lastData.value);
      setActiveDate(lastData.date);
      setHasInitialSetting(true);
    }
  }, [lastData, hasInitialSetting]);

  const handleChoiceChange = (choice: string) => {
    setActiveChoice(choice);
  };

  return (
    <div className="p-6 bg_main">
      {chartVolume && (
        <div>
          <div className="flex justify-between mb-2">
            <div className="mb-2 text-dark1 dark:text-dark3">
              <p className="title text-shader_100">Volume</p>
              <div className="flex items-center my-2 text-2xl font-bold text-white gap-x-1">
                {formatNumber(Number(activeData)?.toFixed(2))}
                <p>
                  <EtherIcon
                    width={18}
                    height={18}
                    className="fill-dark0 dark:fill-white"
                  />
                </p>
              </div>
              <p className="text-sm text-primary_300">
                {activeDate && format(parseISO(activeDate), "MMM d, yyyy")}{" "}
                (UTC)
              </p>
            </div>
            <div className="h-fit w-[136px]">
              <TabGroups
                choices={["1D", "7D", "30D"]}
                activeChoice={activeChoice}
                onChoiceChange={handleChoiceChange}
              />
            </div>
          </div>
          <div className="h-[212px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                width={500}
                height={300}
                data={chartVolume}
                margin={{
                  top: 10,
                  right: 0,
                  left: 0,
                  bottom: 0,
                }}
                onMouseLeave={() => {
                  setActiveData(lastData.value);
                  setActiveDate(lastData.date);
                }}
                onMouseMove={(event) => {
                  if (event && event.activeLabel && event.activePayload) {
                    const { value } = event.activePayload[0];
                    setActiveData(value);
                    if (activeDate !== event.activeLabel) {
                      setActiveDate(event.activeLabel);
                    }
                  }
                }}
              >
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
                <Bar dataKey="value" fill="#A398FF" radius={[2, 2, 2, 2]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      {LoadingVolume && <ChartLoading />}
    </div>
  );
};

export default ChartVolumn;
