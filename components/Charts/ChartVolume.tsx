import { categoryAPI } from "@/libs/service/categoriesChartService";
import { useQuery } from "@tanstack/react-query";
import { format, getWeek, parseISO } from "date-fns";
import React, { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis } from "recharts";
import { TabGroups } from "../NavChoice";
import ChartLoading from "./ChartLoading";
import { startOfWeek, endOfWeek, addDays } from 'date-fns';
interface ChartVolumnProps {}
const styles = {
  btnActive: "rounded-full bg-secondary5",
};
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
  const [dailyData,setDailyData] = useState('');
  const [weeklyData,setWeeklyData] = useState('');
  const [monthlyData,setMonthlyData] = useState('');
  const { data, isLoading: LoadingVolume } = useQuery({
    queryKey: ["ChartVolume"],
    queryFn: async () => {
      const res = await categoryAPI(
        "/volumeChart?intervalDate=30"
      );
      return res;
    },
  });
  console.log(data);
  // const groupDataByWeek = (data: DataPoint[]): GroupedData[] => {
  //   const groupedData: { [key: string]: GroupedData } = {};
  
  //   data.forEach((dataPoint) => {
  //     const date = new Date(dataPoint.date);
  //     const year = date.getFullYear();
  //     const weekNumber = getWeek(date);
  //     const weekKey = `${year}-${weekNumber}`;
  
  //     if (!groupedData[weekKey]) {
  //       const startDate = format(startOfWeek(date), 'yyyy-MM-dd');
  //       const endDate = format(endOfWeek(date), 'yyyy-MM-dd');
  //       groupedData[weekKey] = {
  //         startDate,
  //         endDate,
  //         totalVolume: 0,
  //       };
  //     }
  
  //     groupedData[weekKey].totalVolume += dataPoint.volumeInDay;
  //   });
  
  //   return Object.values(groupedData);
  // };
  // const test = groupDataByWeek(data);
  // console.log(test);
  
  const chartVolume = data?.map((dataPoint: any) => ({
    date: dataPoint.date,
    value: dataPoint.volumeInDay,
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
  useEffect(()=>{
    switch (activeChoice) {
      case "D":
        console.log("day hihi");
        
        // setDailyData(data);
        break;
      case "W":
        // Calculate weekly data by aggregating volumeInDay values for each week
        // const weeklyData = groupDataByWeek(data);
        // const weekChart = weeklyData?.map((dataPoint: any) => ({
        //   date: dataPoint.startDate,
        //   value: dataPoint.totalVolume,
        // }))
        // // setWeeklyData(weeklyData);
        // console.log(weekChart);
        break;
      case "M":
        // Calculate monthly data by aggregating volumeInDay values for each month
        // const monthlyData = calculateMonthlyData(data);
        // setMonthlyData(monthlyData);
        console.log("m hihi");
        break;
      default:
        break;
    }
  },[activeChoice])
  return (
    <div className="hidden p-6 rounded-lg shadow-chart lg:block">
      {chartVolume && (
        <div>
          <div className="flex justify-between mb-2">
            <div className="mb-2 text-dark1">
              <p className="font-medium ">Volume</p>
              <p className="my-2 text-2xl font-medium text-dark0">
                ${activeData?.toFixed(2)}M
              </p>
              <p className="">
                {activeDate && format(parseISO(activeDate), "MMM d, yyyy")}{" "}
                (UTC)
              </p>
            </div>
            <div className="h-fit">
              <TabGroups
                choices={["D", "W", "M"]}
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
      )}
      {LoadingVolume && <ChartLoading />}
    </div>
  );
};

export default ChartVolumn;
