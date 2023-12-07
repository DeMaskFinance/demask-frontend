import React, { useEffect, useRef, useState } from 'react'
import { createChart } from 'lightweight-charts';
import { useQuery } from '@tanstack/react-query';
import { categoryAPI } from '@/libs/service/categoriesChartService';

const ChartTradingViewSwap = () => {
    const chartContainerRef = useRef();
    const [newData, setNewData] = useState([]);
    const { data, isLoading } = useQuery({
        queryKey: ["chart"],
        queryFn: async () => {
            const res = await categoryAPI(`chart?chainId=280&dmlAddress=0x2c857792258bba34a973bda22ec1d36b7fb98456`);
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
                time: parseInt(item.dayStartTimestamp) * 1000,
            }));
            setNewData(convertedData);
        }
    }, [data]);
    console.log(data);

    useEffect(() => {
        if (chartContainerRef.current) {
            const chart = createChart(chartContainerRef.current, { width: 600, height: 500 });
            const candlestickSeries = chart.addCandlestickSeries({
                priceFormat: {
                    type: 'volume',
                    precision: 6,
                    minMove: 0.000001,
                },
            });
            const volumeSeries = chart.addHistogramSeries({
                priceScaleId: 'left',
                overlay:true,
                scaleMargins: {
                    top:0.8,
                    bottom:0
                }
            });

            candlestickSeries.setData([
                { time: '2023-11-28', open: 0.01805989096799099, high: 0.01805989096799099, low: 0.017267112271644983, close: 0.017267112271644983 },
                { time: '2023-11-29', open: 0.017267112271644983, high: 0.016890164462352318, low: 0.015830549232917556, close: 0.015830549232917556 },
                { time: '2023-11-30', open: 0.021454, high: 0.00125, low: 0.014867644001271037, close: 0.014867644001271037 },
                { time: '2023-12-01', open: 0.0456, high: 0.00125, low: 0.014867644001271037, close: 0.014867644001271037 },
                { time: '2023-12-02', open: 0.031454, high: 0.0125, low: 0.044867644001271037, close: 0.094867644001271037 },
                { time: '2023-12-03', open: 0.081454, high: 0.004125, low: 0.024867644001271037, close: 0.034867644001271037 },
                { time: '2023-12-04', open: 0.0021454, high: 0.002125, low: 0.084867644001271037, close: 0.024867644001271037 },
                // thêm dữ liệu ở đây
            ]);
            const volumeData = [
                { time: '2023-11-28', value: 13 },
                { time: '2023-11-29', value: 15 },
                { time: '2023-11-30', value: 21 },
                { time: '2023-12-01', value: 16 },
                { time: '2023-12-02', value: 8 },
                { time: '2023-12-03', value: 7 },
                // thêm dữ liệu ở đây
            ];
            volumeSeries.setData(volumeData.map((bar) => ({
                ...bar,
                color: bar.value > 22 ? 'rgba(255, 99, 132, 0.8)' : 'rgba(0, 150, 136, 0.8)',
                overlay: true,
            })));
            volumeSeries.applyOptions({
                priceFormat: {
                    type: 'volume',
                    precision: 6,
                    minMove: 0.000001,
                },
            });
        }

        return () => {
            // Remove chart when component unmounts
            if (chartContainerRef.current) {
                chartContainerRef.current.innerHTML = '';
            }
        };
    }, []);
    return (
        <div>
            <div ref={chartContainerRef} id="chart" />
        </div>
    )
}

export default ChartTradingViewSwap
