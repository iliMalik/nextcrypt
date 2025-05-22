"use cleint";

import React, { use, useEffect, useRef } from "react";
import { createChart, BarSeries } from "lightweight-charts";
import axios from "axios";

const CandleChart = () => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chart = createChart(chartRef.current!, {
      width: 600,
      height: 400,
    });

    const barSeries = chart.addSeries(BarSeries);
    const fetchData = async () => {
      const res = await axios.get(
        "https://api.binance.us/api/v3/klines?symbol=BTCUSDT&interval=1h&limit=100"
      );

      console.log(res.data);

      const data = res.data.map((d: any) => ({
        time: d[0] / 1000,
        open: parseFloat(d[1]),
        high: parseFloat(d[2]),
        low: parseFloat(d[3]),
        close: parseFloat(d[4]),
      }));

      barSeries.setData(data);
    };

    fetchData();
    return () => chart.remove();
  }, []);

  return <div ref={chartRef} />;
};

export default CandleChart;
