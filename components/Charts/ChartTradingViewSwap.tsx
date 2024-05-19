import AccountContext from "@/context/AccountContext";
import { categoryAPI } from "@/libs/service/categoriesChartService";
import { formatDate, formatPercent } from "@/libs/utils/formatComon";
import { useQuery } from "@tanstack/react-query";
import { createChart, PriceScaleMode } from "lightweight-charts";
import { useTheme } from "next-themes";
import { useContext, useEffect, useRef, useState } from "react";
import FormatNumber from "../Common/FormatNumber";
import { EtherIcon, NFTIcon } from "../Icons";
import ChartLoading from "./ChartLoading";
import ChartNoTransfers from "./ChartNoTransfers";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
interface BarData {
  time: string;
  value: number;
  close: number;
  high: number;
  low: number;
  open: number;
  change: string;
}
interface DataItem {
  closePrice: string;
  highPrice: string;
  lowPrice: string;
  openPrice: string;
  date: string;
  changePrice: string;
  volume: string;
  dayStartTimestamp: string;
}
interface ChartSwapProps {
  dataSwap: DataBase;
  typeERC: string;
  height: number;
}
const ChartTradingViewSwap: React.FunctionComponent<ChartSwapProps> = ({
  dataSwap,
  typeERC,
  height,
}) => {
  const chartContainerRef = useRef(null);
  const [currentHour, setCurrentHour] = useState(0);
  const [currentMinute, setCurrentMinute] = useState(0);
  const [currentSecond, setCurrentSecond] = useState(0);
  const { chainId } = useContext(AccountContext);
  const [newData, setNewData] = useState<any>([]);
  const [volume, setVolume] = useState<BarData[]>([]);
  const [intervalTime, setIntervalTime] = useQueryParam(
    "intervalTime",
    withDefault(StringParam, "1d")
  );
  const [legendData, setLegendData] = useState<any>(
    newData[newData.length - 1]
  );
  const { data, isLoading } = useQuery({
    queryKey: ["chart", chainId, dataSwap.dmlAddress, typeERC, intervalTime],
    queryFn: async () => {
      const res = await categoryAPI(
        `chart?chainId=${chainId}&dmlAddress=${dataSwap.dmlAddress}&type=${typeERC}&interval=${intervalTime}`
      );
      return res;
    },
  });
  useEffect(() => {
    setLegendData(volume[volume.length - 1]);
  }, [volume]);

  useEffect(() => {
    if (Array.isArray(data)) {
      const convertedData = data?.map((item: DataItem) => ({
        close: parseFloat(item.closePrice),
        high: parseFloat(item.highPrice),
        low: parseFloat(item.lowPrice),
        open: parseFloat(item.openPrice),
        time: Number(item.dayStartTimestamp),
        change: item.changePrice,
      }));
      setNewData(convertedData);
      // @ts-ignore
      const convertedDataVolume: BarData[] = data?.map((item: DataItem) => ({
        time: Number(item.dayStartTimestamp),
        value: parseFloat(item.volume),
        close: parseFloat(item.closePrice),
        high: parseFloat(item.highPrice),
        low: parseFloat(item.lowPrice),
        open: parseFloat(item.openPrice),
        change: item.changePrice,
      }));
      setVolume(convertedDataVolume);
    }
  }, [data]);
  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentTime = new Date();
      setCurrentHour(currentTime.getHours());
      setCurrentMinute(currentTime.getMinutes());
      setCurrentSecond(currentTime.getSeconds());
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);
  const { theme } = useTheme();
  useEffect(() => {
    if (chartContainerRef.current) {
      const chart = createChart(chartContainerRef.current, {
        autoSize: true,
        layout: {
          background: {
            color: theme === "dark" ? "#1A1A1A" : "white",
          },
          textColor: "#ffffff",
          fontSize: 10,
        },
      });

      chart.applyOptions({
        grid: {
          vertLines: {
            visible: true,
            color: "#D6DCDE",
            style: 1,
          },
          horzLines: {
            visible: true,
            color: "#D6DCDE",
            style: 1,
          },
        },
        localization: {
          priceFormatter: (price: number) => {
            const countDecimals = (price: number) => {
              if (Math.floor(price) !== price) {
                return (price.toString().split(".")[1]?.length || 0) + 1;
              }
              return 0;
            };
            if (price < 0.000001) {
              return price.toFixed(countDecimals(price));
            } else if (price >= 0.000001 && price < 1) {
              return parseFloat(price.toPrecision(6));
            } else {
              return parseFloat(price.toPrecision(6));
            }
          },
          locale: "en-US",
        },
      });
      const candlestickSeries = chart.addCandlestickSeries({
        upColor: "rgb(14,203,129)",
        borderUpColor: "rgb(14,203,129)",
        downColor: "rgb(246,70,93)",
        borderDownColor: "rgb(246,70,93)",
        // priceFormat: {
        //   type: "volume",
        //   precision: 3,
        // },
        // priceScaleId: "candles",
      });
      const volumeSeries = chart.addHistogramSeries({
        priceFormat: {
          type: "volume",
        },
        priceScaleId: "volume",
      });
      volumeSeries.priceScale().applyOptions({
        // set the positioning of the volume series
        scaleMargins: {
          top: 0.9, // highest point of the series will be 70% away from the top
          bottom: 0,
        },
      });
      candlestickSeries.setData(newData);
      volumeSeries.setData(
        volume.map((bar) =>
          Object.assign({}, bar, {
            color:
              bar.close - bar.open > 0
                ? "rgba(132,226,190, 1.0)"
                : "rgba(247,160,171, 1.0)",
            overlay: true,
          })
        )
      );
      // volumeSeries.applyOptions({
      //   priceFormat: {
      //     type: "volume",
      //     precision: 6,
      //     minMove: 0.0001,
      //   },
      // });
      chart.priceScale("right").applyOptions({
        borderColor: "#D6DCDE",
        autoScale: true,
        mode: PriceScaleMode.Normal,
      });

      // Setting the border color for the horizontal axis
      chart.timeScale().applyOptions({
        borderColor: "#D6DCDE",
      });
      chart.timeScale().scrollToPosition(30, false);
      // chart
      //   .timeScale()
      //   .setVisibleLogicalRange({ from: 0, to: 100 });

      chart.subscribeCrosshairMove((param) => {
        if (param.point === undefined) {
          // Mouse is outside the chart area
          setLegendData(volume[volume.length - 1]);
        } else if (param.time) {
          const candleData: any = param.seriesData.get(candlestickSeries);
          const VolumeData: any = param.seriesData.get(volumeSeries);
          if (candleData && VolumeData) {
            const open = candleData.open;
            const close = candleData.close;
            const high = candleData.high;
            const low = candleData.low;
            const value = VolumeData?.value;
            const time = VolumeData?.time;
            const change = Number(candleData.open) > Number(candleData.close);
            setLegendData({
              open,
              close,
              high,
              low,
              value,
              time,
              change,
            });
          }
        }
      });
    }
    return () => {
      // Remove chart when component unmounts
      if (chartContainerRef.current) {
        (chartContainerRef.current as HTMLElement).innerHTML = "";
      }
    };
  }, [data, volume, newData, theme, intervalTime]);
  const optionTime = [
    { key: "5m" },
    { key: "15m" },
    { key: "1h" },
    { key: "1d" },
    // { key: "1W" },
    // { key: "1Y" },
    // { key: "All" },
  ];

  return (
    <div className="w-full h-full">
      {isLoading ? (
        <div className="h-full p-4 border rounded-lg lg:mt-0 border-dark3 area_darkBG1 ">
          <div className="flex-wrap hidden p-2 mb-2 text-sm font-medium border rounded-lg gap-x-2 lg:flex border-dark3 w-fit text-dark3">
            <div className="w-20 h-4 p-2 rounded bg-slate-200 dark:bg-slate-700"></div>
            <div className="w-20 h-4 rounded bg-slate-200 dark:bg-slate-700"></div>
            <div className="w-20 h-4 rounded bg-slate-200 dark:bg-slate-700"></div>
          </div>
          <div className="h-4 w-[60%] bg-slate-200 dark:bg-slate-700 rounded"></div>
          <ChartLoading />
        </div>
      ) : data && newData?.length > 0 ? (
        <div className="w-full h-full py-4 pl-4 mt-6 border rounded-lg lg:mt-0 border-dark3 area_darkBG1">
          <div>
            <div className="hidden mb-2 text-sm font-medium rounded-lg lg:flex bg-dark5 w-fit text-dark3 area_input ">
              <div className="flex items-center px-2 py-4 border-r border-dark3 text-dark2">
                <p className="mr-1 text-dark3">Price 1D:</p>
                <FormatNumber number={data[data.length - 1]?.closePrice} />(
                {formatPercent(data[data.length - 1]?.changePrice)}%)
              </div>
              <div className="flex items-center px-2 py-4 border-r border-dark3 text-dark2">
                <p className="mr-1 text-dark3">Volume 1D:</p>
                <div className="flex items-center">
                  <FormatNumber number={data[data.length - 1]?.volume} />
                  <EtherIcon width={16} height={16} className="fill-dark2" />
                </div>
              </div>
              <div className="flex items-center p-4 text-dark2">
                <div className="flex items-center text-sm ">
                  <div className="flex items-center mr-2">
                    <span className="text-dark3">LP:</span>
                    <FormatNumber number={dataSwap.reserveNFT} />
                    <NFTIcon
                      width={24}
                      height={24}
                      className="fill-dark2 ml-[2px]"
                    />
                  </div>
                  <FormatNumber number={dataSwap.reserveToken} />
                  <span>
                    <EtherIcon
                      width={16}
                      height={16}
                      className="fill-dark2 ml-[-1px]"
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div
            id="legend"
            className="secondary heading-XXS"
            style={{
              marginBottom: "0.5rem",
              fontFamily: "unset",
            }}
          >
            <div className="flex items-center gap-3 md:flex-wrap mb-2.5 text-xs flex-wrap">
              <div className="flex">
                <span className="text-xs text-dark3">Time:</span>
                <span>{formatDate(legendData?.time)}</span>
              </div>
              <div className="flex ">
                <span className="text-xs text-dark3">O:</span>
                <div
                  className={`${
                    legendData?.change ? "text-red" : "text-green"
                  }`}
                >
                  <FormatNumber number={legendData?.open} />
                </div>
              </div>
              <div className="flex ">
                <span className="text-xs text-dark3">L:</span>
                <div
                  className={`${
                    legendData?.change ? "text-red" : "text-green"
                  }`}
                >
                  <FormatNumber number={legendData?.low} />
                </div>
              </div>
              <div className="flex ">
                <span className="text-xs text-dark3">H:</span>
                <div
                  className={`${
                    legendData?.change ? "text-red" : "text-green"
                  }`}
                >
                  <FormatNumber number={legendData?.high} />
                </div>
              </div>
              <div className="flex text-xs ">
                <span className="text-xs text-dark3">C:</span>
                <div
                  className={`${
                    legendData?.change ? "text-red" : "text-green"
                  }`}
                >
                  <FormatNumber number={legendData?.close} />
                </div>
              </div>
              <div className="flex ">
                <span className="text-xs text-dark3">Vol:</span>
                <div
                  className={`${
                    legendData?.change ? "text-red" : "text-green"
                  }`}
                >
                  <FormatNumber number={legendData?.value} />
                </div>
              </div>
            </div>
          </div>
          <div
            ref={chartContainerRef}
            id="chart"
            // className="w-full h-[calc(100%-120px)]"
            className={`w-full `}
            style={{
              height: `${height}px`,
            }}
          />
          <div className="flex justify-between text-[12px] text-[#222] dark:text-dark5 font-medium items-center pr-4">
            <ul className="flex mt-2 gap-x-3">
              {optionTime.map((item, index) => (
                <li
                  className={`cursor-pointer ${
                    item.key === intervalTime &&
                    " text-secondary5 font-semibold"
                  }`}
                  key={index}
                  onClick={() => setIntervalTime(item.key)}
                >
                  {item.key}
                </li>
              ))}
            </ul>
            <div>
              {currentHour}:{currentMinute}:{currentSecond}(UTC)
            </div>
          </div>
        </div>
      ) : (
        <div className="h-full p-4 border rounded-lg lg:mt-0 border-dark3">
          <ChartNoTransfers />
        </div>
      )}
    </div>
  );
};

export default ChartTradingViewSwap;
