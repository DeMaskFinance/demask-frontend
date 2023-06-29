import { format, parseISO, subDays } from "date-fns";
import React, { PureComponent, useState } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
interface ChartVolumnProps {}
const styles = {
  btnActive: "rounded-full bg-secondary5",
};
const ChartVolumn: React.FC<ChartVolumnProps> = () => {
  const [activeData, setActiveData] = useState<number | null>(8.18);
  const [activeDate, setActiveDate] = useState<any>("2019-01-16");
  const [activeButton, setActiveButton] = useState<string>("D");
  const data: any[] = [];
  for (let num = 28; num >= 0; num--) {
    data.push({
      date: subDays(new Date(), num).toISOString().substring(0, 10),
      value: 1.2 + Math.random(),
    });
  }
  const handleButtonClick = (button: string) => {
    setActiveButton(button);
  };
  return (
    <div className="p-6 border rounded-lg border-dark3">
      <div className="flex justify-between mb-2">
      <div className="mb-2 text-dark1">
        <p className="font-medium ">Volume</p>
        <p className="my-2 text-2xl font-medium text-dark0">
          ${activeData?.toFixed(2)}M
        </p>
        <p className="">{format(parseISO(activeDate), "MMM d, yyyy")} (UTC)</p>
      </div>
        <div className="grid h-8 grid-cols-3 rounded-full w-28 bg-dark2 gap-[6px] text-white">
          <button
            className={activeButton === "D" ? styles.btnActive : ""}
            onClick={() => handleButtonClick("D")}
          >
            D
          </button>
          <button
            className={activeButton === "W" ? styles.btnActive: ""}
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
            data={data}
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
