import React, { useContext, useEffect, useRef, useState } from 'react'
import {
    createChart, ChartOptions,
    DeepPartial,
    IChartApi,
    UTCTimestamp
} from 'lightweight-charts';
import { useQuery } from '@tanstack/react-query';
import { categoryAPI } from '@/libs/service/categoriesChartService';
import ChartLoading from './ChartLoading';
import ChartNoTransfers from './ChartNoTransfers';
import FormatNumber from '../Common/FormatNumber';
import AccountContext from '@/context/AccountContext';
interface BarData {
    time: string;
    value: number;
    close: number;
    high: number;
    low: number;
    open: number;
}
interface CandleData {
    open: number;
    close: number;
    high: number;
    low: number;
    time: string;
}
const ChartTradingViewSwap = ({ dmlAddress }: any) => {
    const chartContainerRef = useRef(null);
    const [currentHour, setCurrentHour] = useState(0);
    const [currentMinute, setCurrentMinute] = useState(0);
    const [currentSecond, setCurrentSecond] = useState(0);
    const { chainId } = useContext(AccountContext);
    const [newData, setNewData] = useState([]);
    const [volume, setVolume] = useState<BarData[]>([]);
    const [legendData, setLegendData] = useState<any>(newData[newData.length - 1]);
    const { data, isLoading } = useQuery({
        queryKey: ["chart", chainId, dmlAddress],
        queryFn: async () => {
            const res = await categoryAPI(`chart?chainId=${chainId}&dmlAddress=${dmlAddress}`);
            return res;
        },
    });
    // console.log(volume[volume.length - 1]);
    // console.log(legendData);
    useEffect(() => {
        setLegendData(volume[volume.length - 1]);
    }, [volume]);
    useEffect(() => {
        if (data) {
            const convertedData = data.map((item: any) => ({
                close: parseFloat(item.closePrice),
                high: parseFloat(item.highPrice),
                low: parseFloat(item.lowPrice),
                open: parseFloat(item.openPrice),
                time: item.date,
            }));
            setNewData(convertedData);
            const convertedDataVolume: BarData[] = data.map((item: any) => ({
                time: item.date,
                value: parseFloat(item.volume),
                close: parseFloat(item.closePrice),
                high: parseFloat(item.highPrice),
                low: parseFloat(item.lowPrice),
                open: parseFloat(item.openPrice),
            }));
            setNewData(convertedData);
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

    useEffect(() => {
        if (chartContainerRef.current) {
            const chart = createChart(chartContainerRef.current, { autoSize: true, });
            chart.applyOptions({
                grid: {
                    vertLines: {
                        visible: true,
                        color: '#D6DCDE',
                        style: 1,
                    },
                    horzLines: {
                        visible: true,
                        color: '#D6DCDE',
                        style: 1,
                    },
                }
            });
            const candlestickSeries = chart.addCandlestickSeries({
                upColor: 'rgb(14,203,129)',
                borderUpColor: 'rgb(14,203,129)',
                downColor: 'rgb(246,70,93)',
                borderDownColor: 'rgb(246,70,93)',
                priceFormat: {
                    type: 'volume',
                    precision: 6,
                    minMove: 0.000001,
                },
            });
            const volumeSeries = chart.addHistogramSeries({
                priceFormat: {
                    type: 'volume',
                },
                priceScaleId: ''
            });
            volumeSeries.priceScale().applyOptions({
                // set the positioning of the volume series
                scaleMargins: {
                    top: 0.9, // highest point of the series will be 70% away from the top
                    bottom: 0,
                },
            });
            candlestickSeries.setData(newData);
            volumeSeries.setData(volume.map((bar) => Object.assign({}, bar, {
                color: bar.close - bar.open > 0 ? 'rgba(132,226,190, 1.0)' : 'rgba(247,160,171, 1.0)',
                overlay: true,
            })));
            volumeSeries.applyOptions({
                priceFormat: {
                    type: 'volume',
                    precision: 6,
                    minMove: 0.000001,
                },
            });
            chart.timeScale().scrollToPosition(50, false);
            chart.timeScale().setVisibleLogicalRange({ from: 0, to: newData.length + 80 });
            chart.subscribeCrosshairMove(param => {
                if (param.time) {
                    const candleData: any = param.seriesData.get(candlestickSeries);
                    const VolumeData: any = param.seriesData.get(volumeSeries);
                    if (candleData && VolumeData) {
                        const open = candleData.open;
                        const close = candleData.close;
                        const high = candleData.high;
                        const low = candleData.low;
                        const value = VolumeData?.value;
                        const time = VolumeData?.time;
                        setLegendData({
                            open,
                            close,
                            high,
                            low,
                            value,
                            time
                        })
                    }
                }
            });
        }
        return () => {
            // Remove chart when component unmounts
            if (chartContainerRef.current) {
                (chartContainerRef.current as HTMLElement).innerHTML = '';
            }
        };
    }, [data, volume, newData]);

    return (
        <div>
            {isLoading ? (
                <div className="h-[355px] p-4 border rounded-lg lg:mt-0 border-dark3">
                    <ChartLoading />
                </div>
            ) : data && newData?.length > 0 ? (
                <div className='w-full p-4 mt-6 border rounded-lg lg:mt-0 border-dark3'>
                    <div
                        id="legend"
                        className="secondary heading-XXS"
                        style={{
                            marginLeft: "1rem",
                            marginBottom: "0.5rem",
                            fontFamily: "unset",
                        }}
                    >
                        <div className="flex items-center gap-3 md:flex-wrap mb-2.5 text-xs flex-wrap">
                            <span className="flex rounded-lg py-[5px] px-2.5 bg-gray-50 heading-XS text-gray-500 border border-gray-200">
                                Open: <FormatNumber number={legendData?.open} />
                            </span>
                            <span className="flex rounded-lg py-[5px] px-2.5 bg-gray-50 heading-XS text-gray-500 border border-gray-200">
                                Low: <FormatNumber number={legendData?.low} />
                            </span>
                            <span className="flex rounded-lg py-[5px] px-2.5 bg-gray-50 heading-XS text-gray-500 border border-gray-200">
                                High: <FormatNumber number={legendData?.high} />
                            </span>
                            <span className="flex rounded-lg py-[5px] px-2.5 bg-gray-50 heading-XS text-gray-500 border border-gray-200">
                                Close: <FormatNumber number={legendData?.close} />
                            </span>
                            <span className="flex rounded-lg py-[5px] px-2.5 bg-gray-50 heading-XS text-gray-500 border border-gray-200">
                                Vol: <FormatNumber number={legendData?.value} />
                            </span>
                            <span className="flex rounded-lg py-[5px] px-2.5 bg-gray-50 heading-XS text-gray-500 border border-gray-200">
                                Time: {legendData?.time}
                            </span>
                        </div>
                    </div>
                    <div ref={chartContainerRef} id="chart" className='w-full h-[350px] lg:h-[550px]' />
                    <div className='flex justify-between text-[12px] text-[#222] font-medium items-center'>
                        <ul className='flex mt-2 gap-x-3'>
                            <li className='cursor-pointer hover:text-secondary4'>1H</li>
                            <li className='cursor-pointer hover:text-secondary4'>1D</li>
                            <li className='cursor-pointer hover:text-secondary4'>1W</li>
                            <li className='cursor-pointer hover:text-secondary4'>1Y</li>
                            <li className='cursor-pointer hover:text-secondary4'>All</li>
                        </ul>
                        <div>
                            {currentHour}:{currentMinute}:{currentSecond}(UTC)
                        </div>
                    </div>
                </div>
            ) : (
                <div className="h-[355px] p-4 border rounded-lg lg:mt-0 border-dark3">
                    <ChartNoTransfers />
                </div>
            )}
        </div>
    )
}

export default ChartTradingViewSwap
