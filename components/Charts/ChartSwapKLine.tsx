import { useEffect, useState } from 'react';
import { init, dispose } from 'klinecharts';

const ChartKline = () => {
    const [currentHour, setCurrentHour] = useState(0);
    const [currentMinute, setCurrentMinute] = useState(0);
    const [currentSecond, setCurrentSecond] = useState(0);

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

    function genData(timestamp = new Date().getTime(), length = 800) {
        let basePrice = 5000
        timestamp = Math.floor(timestamp / 1000 / 60) * 60 * 1000 - length * 60 * 1000
        const dataList = []
        for (let i = 0; i < length; i++) {
            const prices = []
            for (let j = 0; j < 4; j++) {
                prices.push(basePrice + Math.random() * 60 - 30)
            }
            prices.sort()
            const open = +(prices[Math.round(Math.random() * 3)].toFixed(2))
            const high = +(prices[3].toFixed(2))
            const low = +(prices[0].toFixed(2))
            const close = +(prices[Math.round(Math.random() * 3)].toFixed(2))
            const volume = Math.round(Math.random() * 100) + 10
            const turnover = (open + high + low + close) / 4 * volume
            dataList.push({ timestamp, open, high, low, close, volume, turnover })

            basePrice = close
            timestamp += 60 * 1000
        }
        return dataList
    }
    useEffect(() => {
        // initialize the chart
        const chart = init('chart');
        chart?.createIndicator('VOL')
        // add data to the chart
        chart?.applyNewData(genData())
        chart?.setStyles({
            candle: {
                tooltip: {
                    text: {
                        color: '#222',
                    }
                }

            },
            xAxis: {
                show: true,
                size: 'auto',
                axisLine: {
                    show: true,
                    color: '#222',
                    size: 1
                },
                tickText: {
                    show: true,
                    color: '#222',
                    family: 'Helvetica Neue',
                    weight: 'normal',
                    size: 12,
                    marginStart: 4,
                    marginEnd: 4
                },
                tickLine: {
                    show: true,
                    size: 1,
                    length: 3,
                    color: '#222'
                }
            },
            yAxis: {
                axisLine: {
                    show: true,
                    color: '#222',
                    size: 1
                },
            },
            indicator: {
                ohlc: {
                    upColor: '#222',
                    downColor: '#222',
                    noChangeColor: '#222'
                },
            }
        })
        return () => {
            // destroy chart
            dispose('chart');
        };
    }, []);

    return (
        <div className='w-full mt-6 lg:mt-0'>
            <div id="chart" className='w-full h-[600px]' />
            <div className='flex justify-between text-[12px] text-[#222] font-medium'>
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
    );
};

export default ChartKline;