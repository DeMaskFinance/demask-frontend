import { useEffect } from 'react';
import { init, dispose } from 'klinecharts';

const ChartKline = () => {
    useEffect(() => {
        // initialize the chart
        const chart = init('chart');

        // add data to the chart
        chart?.applyNewData([
            { close: 4976.16, high: 4977.99, low: 4970.12, open: 4972.89, timestamp: 1587660000000, volume: 204, change: 0.6 },
            { close: 4977.33, high: 4979.94, low: 4971.34, open: 4973.20, timestamp: 1587660060000, volume: 194, change: 5.6 },
            { close: 4977.93, high: 4977.93, low: 4974.20, open: 4976.53, timestamp: 1587660120000, volume: 197, change: 0.8 },
            { close: 4966.77, high: 4968.53, low: 4962.20, open: 4963.88, timestamp: 1587660180000, volume: 28, change: 0.6 },
            { close: 4961.56, high: 4972.61, low: 4961.28, open: 4961.28, timestamp: 1587660240000, volume: 184, change: 10.6 },
            { close: 4964.19, high: 4964.74, low: 4961.42, open: 4961.64, timestamp: 1587660300000, volume: 191, change: 51.6 },
            { close: 4968.93, high: 4972.70, low: 4964.55, open: 4966.96, timestamp: 1587660360000, volume: 105, change: 13.6 },
            { close: 4979.31, high: 4979.61, low: 4973.99, open: 4977.06, timestamp: 1587660420000, volume: 35, change: 0.6 },
            { close: 4977.02, high: 4981.66, low: 4975.14, open: 4981.66, timestamp: 1587660480000, volume: 135, change: 0.6 },
            { close: 4985.09, high: 4988.62, low: 4980.30, open: 4986.72, timestamp: 1687660540000, volume: 76, change: 0.6 },
            { close: 4976.16, high: 4977.99, low: 4970.12, open: 4972.89, timestamp: 1588660000000, volume: 204, change: 0.6 },
            { close: 4977.33, high: 4979.94, low: 4971.34, open: 4973.20, timestamp: 1589660060000, volume: 194, change: 5.6 },
            { close: 4977.93, high: 4977.93, low: 4974.20, open: 4976.53, timestamp: 1581660120000, volume: 197, change: 0.8 },
            { close: 4966.77, high: 4968.53, low: 4962.20, open: 4963.88, timestamp: 1557660180000, volume: 28, change: 0.6 },
            { close: 4961.56, high: 4972.61, low: 4961.28, open: 4961.28, timestamp: 1597660240000, volume: 184, change: 10.6 },
            { close: 4964.19, high: 4964.74, low: 4961.42, open: 4961.64, timestamp: 1567660300000, volume: 191, change: 51.6 },
            { close: 4968.93, high: 4972.70, low: 4964.55, open: 4966.96, timestamp: 1517660360000, volume: 105, change: 13.6 },
            { close: 4979.31, high: 4979.61, low: 4973.99, open: 4977.06, timestamp: 1527660420000, volume: 35, change: 0.6 },
            { close: 4977.02, high: 4981.66, low: 4975.14, open: 4981.66, timestamp: 1507660480000, volume: 135, change: 0.6 },
            { close: 4985.09, high: 4988.62, low: 4980.30, open: 4986.72, timestamp: 1617660540000, volume: 76, change: 0.6 }
        ]);

        return () => {
            // destroy chart
            dispose('chart');
        };
    }, []);

    return <div id="chart" style={{ width: 1000, height: 600 }} />;
};

export default ChartKline;