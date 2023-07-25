import React, { PureComponent, useState, useEffect } from "react";
import Highcharts, { Point } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsStock from "highcharts/modules/stock";
import Image from "next/image";
interface ChartSwapProps {
  dataChart: [];
}
if (typeof Highcharts === "object") {
  HighchartsStock(Highcharts);
}

const ChartSwap: React.FunctionComponent<ChartSwapProps> = ({ dataChart }) => {
  const averagePrice = [],
    volume = [];
  const dataChartSwap = dataChart.map((item) => Object.values(item));

  for (let i = 0; i < dataChartSwap.length; i += 1) {
    const dateTimestamp = new Date(dataChartSwap[i][0] as any).getTime();
    averagePrice.push([
      dateTimestamp,
      dataChartSwap[i][2], // averagePrice
    ]);

    volume.push([
      dateTimestamp,
      dataChartSwap[i][1], // the volume
    ]);
  }
  console.log(averagePrice);
  console.log(volume);

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
      height: 500,
    },
    navigator: {
      enabled: true,
      handles: {
        symbols: ["HandlesHightChart.svg", "HandlesHightChart.svg"],
        backgroundColor: "#D5D0FF",
        border: "none",
      },
      maskFill: "rgba(128,128,128,0.3)",
      outlineColor: "#D5D0FF",
    },
    credits: {
      enabled: false,
    },
    xAxis: [
      {
        crosshair: {
          className: "highcharts-crosshair-thin",
          zIndex: 2,
          color: "#cccccc",
          width: 1,
        },
      },
    ],
    yAxis: [
      {
        // Primary yAxis
        labels: {
          format: "{value}",
          align: "left",
        },
        height: "80%",
        resize: {
          enabled: true,
        },
      },
      {
        // Secondary yAxis
        labels: {
          enable: false,
        },
        top: "80%",
        height: "20%",
        offset: 0,
      },
    ],
    legend: {
      enabled: false,
    },
    tooltip: {
      shared: true,
      crosshairs: [{ width: 1, color: "red", dashStyle: "dash" }],
      formatter: function (
        this: Highcharts.TooltipFormatterContextObject
      ): string {
        const timestamp = this.x as number;
        const date: any = new Date(timestamp);
        const formattedDate = Highcharts.dateFormat("%Y-%m-%d", date);

        let tooltipContent = `<b>${formattedDate}</b><br>`;
        this.points?.forEach((point) => {
          tooltipContent += `<span style="color:${point.color}">\u25CF</span> ${point.series.name}: <b>${point.y}</b><br>`;
        });
        return tooltipContent;
      },
      followPointer: true,
      followTouchMove: true,
      yAxis: 0,
    },
    scrollbar: {
      enabled: false,
    },
    series: [
      {
        name: "Volume",
        type: "column",
        yAxis: 1,
        data: volume,
        // tooltip: {
        //   valueSuffix: "USD",
        // },
        color: "#D5D0FF",
        states: {
          hover: {
            color: "#7413DC",
          },
        },
      },
      {
        name: "Average price",
        type: "area",
        data: averagePrice,
        // tooltip: {
        //   valueSuffix: "USD",
        // },
        color: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, "#A398FF"],
            [1, "#FFFFFF"],
          ],
        },

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
      {/* <ul>
        <li className="text-dark3">Volume and Price</li>
        <li className="my-2 text-xl text-dark1">{volumeValue} ETH</li>
        <li className="mb-2 text-dark2">Avg.Price: {avgPrice} ETH</li>
        <li className="text-dark3">7:00 Am, May 17, 2023 (UTC)</li>
      </ul> */}
      <div className="">
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          constructorType={"stockChart"}
        />
      </div>
    </div>
  );
};

export default ChartSwap;
