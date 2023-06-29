import React, { PureComponent, useState } from "react";

import Highcharts, { Point } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsStock from "highcharts/modules/stock";
interface ChartSwapProps {}
const data1 = [
  {
    name: "May 11",
    uv: 590,
    pv: 800,
    amt: 1400,
    cnt: 490,
  },
  {
    name: "May 12",
    uv: 868,
    pv: 967,
    amt: 1506,
    cnt: 590,
  },
  {
    name: "May 13",
    uv: 1397,
    pv: 1098,
    amt: 989,
    cnt: 350,
  },
  {
    name: "May 14",
    uv: 680,
    pv: 1200,
    amt: 1228,
    cnt: 480,
  },
  {
    name: "May 15",
    uv: 1520,
    pv: 1108,
    amt: 1100,
    cnt: 460,
  },
  {
    name: "May 16",
    uv: 1400,
    pv: 680,
    amt: 1700,
    cnt: 380,
  },
];
const data = [
  { name: "May 11", uv: 59.78, pv: 18.12 },
  { name: "May 12", uv: 86.02, pv: 79.32 },
  { name: "May 13", uv: 53.41, pv: 10.45 },
  { name: "May 14", uv: 76.05, pv: 42.55 },
  { name: "May 15", uv: 65.12, pv: 51.50 },
  { name: "May 16", uv: 34.87, pv: 76.00 },
  { name: "May 17", uv: 90.7, pv: 41.12 },
  { name: "May 18", uv: 48.00, pv: 46.01 },
];
if (typeof Highcharts === "object") {
  HighchartsStock(Highcharts);
}

const ChartSwap: React.FunctionComponent<ChartSwapProps> = () => {
  const [volumeValue, setVolumeValue] = useState(12.85);
  const [avgPrice, setAvgPrice] = useState(42.15);

  const options = {
    title: {
      text: "",
    },
    chart: {
      pinchType: null,
      zoomType: null,
      scrollablePlotArea: null,
      zooming: {
        mouseWheel: false,
      },
    },
    credits: {
      enabled: false,
    },
    xAxis: [
      {
        categories: data.map((item) => item.name),
        crosshair: {
          className: "highcharts-crosshair-thin",
          zIndex: 2,
          color: "#cccccc",
          width: 1,
        },
        lineWidth: 0,
      },
    ],
    yAxis: [
      {
        // Primary yAxis
        labels: {
          format: "{value}K",
        },
        title: {
          text: "Volume",
        },
      },
      {
        // Secondary yAxis
        title: {
          text: "Average price",
        },
        labels: {
          format: "{value} B",
        },
        opposite: true,
      },
    ],
    legend: {
      enabled: false,
    },
    tooltip: {
      shared: true,
      crosshairs: [{ width: 1, color: "red", dashStyle: "dash" }],
    },
    series: [
      {
        name: "Volume",
        type: "column",
        yAxis: 1,
        data: data.map((item) => ({
          y:item.uv,
          events: {
            mouseOver: function () {
              setAvgPrice(item.pv)
              setVolumeValue(item.uv)
            },
            mouseOut: function () {
              console.log(123);
            },
          },
        })
        
        ),
        tooltip: {
          valueSuffix: " K",
        },
        color: "#D5D0FF",
        states: {
          hover: {
            color: "#7413DC",
          },
        },
      },
      {
        name: "Average price",
        type: "line",
        data: data.map((item) => ({
            y: item.pv,
            events: {
              mouseOver: function () {
                setVolumeValue(item.uv)
                setAvgPrice(item.pv)
              },
              mouseOut: function () {
                console.log(123);
              },
            },
          })),
        tooltip: {
          valueSuffix: "B",
        },
        color: "#636977",
        lineWidth: 2,
        marker: {
          enabled: false,
          states: {
            hover: {
              enabled: true,
              fillColor: "#800080",
              lineWidth: 2,
            },
          },
        },
      },
      
    ],
    
  };
  
  return (
    <div>
      <ul>
        <li className="text-dark3">Volume and Price</li>
        <li className="text-dark1">{volumeValue} ETH</li>
        <li className="text-dark2">Avg.Price: {avgPrice} ETH</li>
        <li className="text-dark3">7:00 Am, May 17, 2023 (UTC)</li>
      </ul>
      <div className="mt-12">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </div>
  );
};

export default ChartSwap;
