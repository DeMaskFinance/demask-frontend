import { subDays, parseISO, format } from "date-fns";
import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  CartesianGridProps,
} from "recharts";

interface ChartTVLProps {}
const data: any[] = [];
for (let num = 28; num >= 0; num--) {
  data.push({
    date: subDays(new Date(), num).toISOString().substring(0, 10),
    value: 1.2 + Math.random(),
  });
}

const ChartTVL: React.FC<ChartTVLProps> = () => {
  const [activeData, setActiveData] = useState<number | null>(112.20);
  const [activeDate, setActiveDate] = useState<any>("2019-01-16");
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return <div className="hidden custom-tooltip"></div>;
    }

    return null;
  };
  return (
    <div className="p-6 border rounded-lg border-dark">
      <div className="mb-2">
        <p className="font-bold text-black">TVL</p>
        <p className="my-2 text-xl font-bold text-black">
          ${activeData?.toFixed(2)}M
        </p>
        <p className="">{format(parseISO(activeDate), "MMM d, yyyy")} (UTC)</p>
      </div>
      <div className="h-[212px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
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
                setActiveDate(event.activeLabel);
              }
            }}
          >
            <defs>
              <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
                <stop offset="30%" stopColor="#27E1C1" stopOpacity={1.0} />
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
              stroke="#0EA293"
              strokeWidth="1.5"
              fill="url(#color)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartTVL;
