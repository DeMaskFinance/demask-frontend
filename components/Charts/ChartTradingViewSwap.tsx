import React, { useEffect, useRef, useState } from 'react'
import { createChart } from 'lightweight-charts';
import { useQuery } from '@tanstack/react-query';
import { categoryAPI } from '@/libs/service/categoriesChartService';

const ChartTradingViewSwap = () => {
    const chartContainerRef = useRef();
    const [newData, setNewData] = useState([]);
    const [volume,setVolume] = useState([]);
    const { data, isLoading } = useQuery({
        queryKey: ["chart"],
        queryFn: async () => {
            const res = await categoryAPI(`chart?chainId=280&dmlAddress=0xa19925881297cc0b313d28aebab0dc7c16f565ae`);
            return res;
        },
    });
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
            const convertedDataVolume = data.map((item: any) => ({
                time: item.date,
                value:parseFloat(item.volume),
            }));
            setNewData(convertedData);
            setVolume(convertedDataVolume);
        }
    }, [data]);
    console.log(newData);
    console.log(volume);
    
    useEffect(() => {
        // if (chartContainerRef.current) {
        //     const chart = createChart(chartContainerRef.current, { width: 600, height: 600 });
        //     const candlestickSeries = chart.addCandlestickSeries({
        //         priceFormat: {
        //             type: 'volume',
        //             precision: 6,
        //             minMove: 0.000001,
        //         },
        //     });
        //     const volumeSeries = chart.addHistogramSeries({
        //         priceFormat: {
        //             type: 'volume',
        //         },
        //         priceScaleId: ''
        //     });
        //     volumeSeries.priceScale().applyOptions({
        //         // set the positioning of the volume series
        //         scaleMargins: {
        //             top: 0.9, // highest point of the series will be 70% away from the top
        //             bottom: 0,
        //         },
        //     });
        //     candlestickSeries.setData(newData);
        //     const volumeData = [
        //         { time: '2023-11-28', value: 13 },
        //         { time: '2023-11-29', value: 15 },
        //         { time: '2023-11-30', value: 21 },
        //         { time: '2023-12-01', value: 16 },
        //         { time: '2023-12-02', value: 8 },
        //         { time: '2023-12-03', value: 7 },
        //     ];
        //     volumeSeries.setData(volume.map((bar) => ({
        //         ...bar,
        //         color: bar.value > 6 ? 'rgba(255, 99, 132, 0.8)' : 'rgba(0, 150, 136, 0.8)',
        //         overlay: true,
        //     })));
        //     volumeSeries.applyOptions({
        //         priceFormat: {
        //             type: 'volume',
        //             precision: 6,
        //             minMove: 0.000001,
        //         },
        //     });
        // }

        // return () => {
        //     // Remove chart when component unmounts
        //     if (chartContainerRef.current) {
        //         chartContainerRef.current.innerHTML = '';
        //     }
        // };
    }, [data,volume,newData]);
    return (
        <div>
            {/* <div ref={chartContainerRef} id="chart" /> */}
        </div>
    )
}

export default ChartTradingViewSwap
