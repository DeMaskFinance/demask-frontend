import { categoryAPI } from "@/libs/service/categoriesChartService";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import React, { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis } from "recharts";
interface ChartVolumnProps {}
const styles = {
  btnActive: "rounded-full bg-secondary5",
};
const ChartVolumn: React.FC<ChartVolumnProps> = () => {
  const [activeDate, setActiveDate] = useState<string | null>(null);
  const [activeButton, setActiveButton] = useState<string>("D");

  const { data: ChartColumn, isLoading: LoadingColumn } = useQuery({
    queryKey: ["ChartColumn"],
    queryFn: async () => {
      const res = await categoryAPI(
        "/dml-chart?address=0xef29f693daff0dddeb28b1dec36eb37de7cc42eb"
      );
      return res;
    },
  });
  const chartColumn = ChartColumn?.map((dataPoint: any) => ({
    date: dataPoint.date,
    value: dataPoint.volume,
  }));
  const lastData = chartColumn && chartColumn[chartColumn.length - 1];

  const [activeData, setActiveData] = useState<number | null>(null);

  const [hasInitialSetting, setHasInitialSetting] = useState(false);

  useEffect(() => {
    if (lastData && !hasInitialSetting) {
      setActiveData(lastData.value);
      setActiveDate(lastData.date);
      setHasInitialSetting(true);
    }
  }, [lastData, hasInitialSetting]);

  const handleButtonClick = (button: string) => {
    setActiveButton(button);
  };

  return (
    <div className="p-6 shadow-chart rounded-lg">
      <div className="flex justify-between mb-2">
        <div className="mb-2 text-dark1">
          <p className="font-medium ">Volume</p>
          <p className="my-2 text-2xl font-medium text-dark0">
            ${activeData?.toFixed(2)}M
          </p>
          <p className="">
            {activeDate && format(parseISO(activeDate), "MMM d, yyyy")} (UTC)
          </p>
        </div>
        <div className="grid h-8 grid-cols-3 rounded-full w-28 bg-dark2 gap-[6px] text-white">
          <button
            className={activeButton === "D" ? styles.btnActive : ""}
            onClick={() => handleButtonClick("D")}
          >
            D
          </button>
          <button
            className={activeButton === "W" ? styles.btnActive : ""}
            onClick={() => handleButtonClick("W")}
          >
            W
          </button>
          <button
            className={activeButton === "M" ? styles.btnActive : ""}
            onClick={() => handleButtonClick("M")}
          >
            M
          </button>
        </div>
      </div>
      <div className="h-[212px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={chartColumn}
            margin={{
              top: 10,
              right: 0,
              left: 0,
              bottom: 0,
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
            <Bar dataKey="value" fill="#A398FF" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartVolumn;
