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
import { EtherIcon } from '../Icons';
import { formatPercent } from '@/libs/utils/formatToUnit';
interface BarData {
    time: string;
    value: number;
    close: number;
    high: number;
    low: number;
    open: number;
    change: string;
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
    // console.log(data);

    // console.log(volume[volume.length - 1]);
    // console.log({
    //     legendData,
    // });
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
                change: item.changePrice
            }));
            setNewData(convertedData);
            const convertedDataVolume: BarData[] = data.map((item: any) => ({
                time: item.date,
                value: parseFloat(item.volume),
                close: parseFloat(item.closePrice),
                high: parseFloat(item.highPrice),
                low: parseFloat(item.lowPrice),
                open: parseFloat(item.openPrice),
                change: item.changePrice
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
                        const change = Number(candleData.open) > Number(candleData.close);
                        setLegendData({
                            open,
                            close,
                            high,
                            low,
                            value,
                            time,
                            change
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
    console.log(data);

    return (
        <div>
            {isLoading ? (
                <div className="h-[355px] p-4 border rounded-lg lg:mt-0 border-dark3">
                    <ChartLoading />
                </div>
            ) : data && newData?.length > 0 ? (
                <div className='w-full p-4 mt-6 border rounded-lg lg:mt-0 border-dark3'>
                    <div className='flex-wrap hidden mb-2 text-xs border rounded-lg lg:flex border-dark3 w-fit text-dark3'>
                        <div className='flex p-4 border-r border-dark3'>
                            <p>Price:</p>
                            <FormatNumber number={data[data.length - 1].closePrice} />
                            ({formatPercent(data[data.length - 1].changePrice)}%)
                        </div>
                        <div className='flex p-4 border-r border-dark3'>
                            <p>Volume:</p>
                            <div className='flex items-center'>
                                <FormatNumber number={data[data.length - 1].volume} />
                                <EtherIcon width={12} height={12} className='fill-dark2' />
                            </div>
                        </div>
                        <div className='flex p-4 border-r border-dark3 gap-x-1'>
                            <p>Supply</p>
                            <p>125</p>
                        </div>
                        <div className='flex p-4 border-r border-dark3 gap-x-1'>
                            <p>Liquidity</p>
                            <div className='flex items-center'>
                                <p>123</p>
                                <EtherIcon width={12} height={12} className='fill-dark2' />
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
                                <span className='text-xs text-dark3'>Time:</span>
                                <span>{legendData?.time}</span>
                            </div>
                            <div className="flex ">
                                <span className='text-xs text-dark3'>O:</span>
                                <div className={`${legendData?.change ? "text-red" : "text-green"}`}>
                                    <FormatNumber number={legendData?.open} />
                                </div>
                            </div>
                            <div className="flex ">
                                <span className='text-xs text-dark3'>
                                    L:</span>
                                <div className={`${legendData?.change ? "text-red" : "text-green"}`}>
                                    <FormatNumber number={legendData?.low} />
                                </div>
                            </div>
                            <div className="flex ">
                                <span className='text-xs text-dark3'>
                                    H:
                                </span>
                                <div className={`${legendData?.change ? "text-red" : "text-green"}`}>
                                    <FormatNumber number={legendData?.high} />
                                </div>
                            </div>
                            <div className="flex text-xs ">
                                <span className='text-xs text-dark3'>
                                    C:
                                </span>
                                <div className={`${legendData?.change ? "text-red" : "text-green"}`}>
                                    <FormatNumber number={legendData?.close} />
                                </div>
                            </div>
                            <div className="flex ">
                                <span className='text-xs text-dark3'>Vol:</span>
                                <div className={`${legendData?.change ? "text-red" : "text-green"}`}>
                                    <FormatNumber number={legendData?.value} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div ref={chartContainerRef} id="chart" className='w-full h-[350px] lg:h-[450px]' />
                    <div className='flex justify-between text-[12px] text-[#222] font-medium items-center'>
                        <ul className='flex mt-2 gap-x-3'>
                            <li className='cursor-pointer hover:text-secondary4'>15m</li>
                            <li className='cursor-pointer hover:text-secondary4'>1H</li>
                            <li className='cursor-pointer hover:text-secondary4'>4H</li>
                            <li className='font-bold cursor-pointer text-secondary4'>1D</li>
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
