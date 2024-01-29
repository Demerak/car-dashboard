'use client'

import { React, useState, useEffect} from 'react';
import styles from './page.module.css';
import dynamic from 'next/dynamic';
import AutoSizer from "react-virtualized-auto-sizer";
import { Swiper, SwiperSlide } from 'swiper/react';

import "swiper/css";

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const backgroundColor = '#242424';
const backgroundColorLayer = '#161717';
const blueColor = '#146ca4';

export default function Home() {

  const [speed, setSpeed] = useState(200);
  const [rpm, setRPM] = useState(0);
  const [engineLoad, setEngineLoad] = useState(0);
  const [absoluteLoad, setAbsoluteLoad] = useState(0);
  const [throttlePos, setThrottlePos] = useState(0);
  const [fuelLevel, setFuelLevel] = useState(100);
  const [engineRunTime, setEngineRunTime] = useState(0);

  const [coolantTemp, setCoolantTemp] = useState(0);

  const [timeStamps, setTimeStamps] = useState([]);
  const [speedArrayData, setSpeedArrayData] = useState([]);

  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {

    const socket = new WebSocket('ws://localhost:8765');
   
    socket.onopen = () => {
      console.log('Socket connected!', socket);
      setIsConnected(true);
    }

    socket.onmessage = (event) => {
      const obj = JSON.parse(event.data);
      setSpeed(parseFloat(obj.speed).toFixed(2));
      setRPM(parseFloat(obj.rpm).toFixed(2));
      setEngineLoad(parseFloat(obj.engineLoad).toFixed(2));
      setAbsoluteLoad(parseFloat(obj.absoluteLoad).toFixed(2));
      setThrottlePos(parseFloat(obj.throttlePos).toFixed(2));
      setFuelLevel(parseFloat(obj.fuelLevel).toFixed(2)); 

      setEngineRunTime(parseFloat(obj.engineRunTime).toFixed(2));

      setTimeStamps((prevTimeStamps) => [...prevTimeStamps, new Date()]);
      setSpeedArrayData((prevSpeedData) => [...prevSpeedData, parseFloat(obj.speed).toFixed(2)]);
      setIsConnected(true);
    };

    socket.onclose = () => {
      console.log('Socket closed!');
      setIsConnected(false);
    }
  }, []);

  const speedData = [
    {
      type: "indicator",
      mode: "gauge+number+delta",
      value: speed,
      title: { text: "Speed", font: { size: 24 } },
      delta: { reference: 90, decreasing: { color: "green" } },
      gauge: {
        axis: { range: [null, 240], tickwidth: 1, tickcolor: "#146ca4" },
        bar: { color: "darkblue" },
        bgcolor: "white",
        borderwidth: 2,
        bordercolor: "gray",
        steps: [
          { range: [0, 130], color: "#52b7e9" },
          { range: [130, 205], color: "#189de4" },
          { range: [205, 240], color: "#242444" }
        ],
        threshold: {
          line: { color: "red", width: 4 },
          thickness: 0.75,
          value: 205
        }
      }
    }
  ];

  const RPM_Data = [
    {
      type: "indicator",
      mode: "gauge+number+delta",
      value: rpm,
      title: { text: "RPM", font: { size: 24 }},
      delta: { reference: 90, decreasing: { color: "green" } },
      gauge: {
        axis: { range: [null, 5500], tickwidth: 1, tickcolor: "#146ca4" },
        bar: { color: "darkblue" },
        bgcolor: "white",
        borderwidth: 2,
        bordercolor: "gray",
        steps: [
          { range: [0, 130], color: "#52b7e9" },
          { range: [130, 205], color: "#189de4" },
          { range: [205, 240], color: "#242444" }
        ],
        threshold: {
          line: { color: "red", width: 4 },
          thickness: 0.75,
          value: 205
        }
      }
    }
  ];

  let chartLayout = (height, width) => ({ 
    width: width, 
    height: height,
    paper_bgcolor:'rgba(0,0,0,0)',
    plot_bgcolor:'rgba(0,0,0,0)'
  });

  const createBarChartOptions = (titleText, data) => ({
    chart: {
      type: 'bar',
      sparkline: {
        enabled: true
      }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '20%',
        colors: {
          backgroundBarColors: ['#40475D']
        }
      },
    },
    stroke: {
      width: 0,
    },
    series: [{
      titleText,
      data: [data]
    }],
    title: {
      floating: true,
      offsetX: -10,
      offsetY: 5,
      text: titleText,
    },
    subtitle: {
      floating: true,
      align: 'right',
      offsetY: 0,
      text: data + '%',
      style: {
        fontSize: '18px',
      }
    },
    tooltip: {
      enabled: false
    },
    yaxis: {
      max: 100
    },
    fill: {
      opacity: 1
    }
  });

  const optionsEngineLoad = createBarChartOptions('Engine Load', engineLoad);
  const optionsAbsoluteLoad = createBarChartOptions('Absolute Load', absoluteLoad);
  const optionsThorttlePos = createBarChartOptions('Throttle Pos', throttlePos);
  const optionsFuelLevel = createBarChartOptions('Fuel Level', fuelLevel);

  const runtimeData = [
    {
      type: "indicator",
      mode: "number",
      value: engineRunTime,
      number: { suffix: "s" },
      domain: { x: [0, 1], y: [0, 1] }
    }
  ];

  let lineChartLayout = (height, width) => ({ 
    width: width, 
    height: height,
    // paper_bgcolor:'rgba(0,0,0,0)',
    // plot_bgcolor:'rgba(0,0,0,0)',
    title: 'Speed (Km/h)',
    xaxis: { title: 'Time' },
    yaxis: { title: 'Speed' },
    paper_bgcolor : backgroundColorLayer,
    plot_bgcolor : backgroundColorLayer,
  });



  return (
    <body>
      {!isConnected ? 
        <div className={styles.errorContainer}>
          <h1>WebSocket Not Connected</h1>
        </div>
        : 
        <Swiper>
          <SwiperSlide>
            <div className={styles.page}>
              <div className={styles.gaugeChartFirst}>
                <AutoSizer>
                  {({ height, width }) => (
                    <Plot data={speedData} config={{ autosizable: true }} layout={chartLayout(height, width)} />
                  )}
                </AutoSizer>
              </div>
              <div className={styles.gaugeChartSecond}>
                <AutoSizer>
                  {({ height, width }) => (
                    <Plot data={RPM_Data} config={{ autosizable: true }} layout={chartLayout(height, width)} />
                  )}
                </AutoSizer>
              </div>
              <div className={styles.barChartContainer}>
                <div className={styles.barChart}> 
                  <AutoSizer>
                    {({ height, width }) => (
                      <Chart
                        height= {height}
                        width= {width}
                        series={optionsEngineLoad.series}
                        options={optionsEngineLoad}
                        type="bar"
                      />
                    )}
                  </AutoSizer>
                </div>
                <div className={styles.barChart}> 
                  <AutoSizer>
                    {({ height, width }) => (
                      <Chart
                        height= {height}
                        width= {width}
                        options={optionsAbsoluteLoad}
                        series={optionsAbsoluteLoad.series}
                        type="bar"
                      />
                    )}
                  </AutoSizer>
                </div>
                <div className={styles.barChart}> 
                  <AutoSizer>
                    {({ height, width }) => (
                      <Chart
                        height= {height}
                        width= {width}
                        options={optionsThorttlePos}
                        series={optionsThorttlePos.series}
                        type="bar"
                      />
                    )}
                  </AutoSizer>
                </div>
                <div className={styles.barChart}> 
                  <AutoSizer>
                    {({ height, width }) => (
                      <Chart
                        height= {height}
                        width= {width}
                        options={optionsFuelLevel}
                        series={optionsFuelLevel.series}
                        type="bar"
                      />
                    )}
                  </AutoSizer>
                </div>
              </div>
              <div className={styles.FourthContainer}>
                <AutoSizer>
                  {({ height, width }) => (
                    <Plot data={runtimeData} config={{ autosizable: true }} layout={chartLayout(height, width)} />
                  )}
                </AutoSizer>     
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className={styles.page}>
              <div className={styles.lineChart}>
                <AutoSizer>
                  {({ height, width }) => (
                    <Plot
                    data={[{
                      x: timeStamps,
                      y: speedArrayData,
                      type: 'scatter',
                      mode: 'lines+markers',
                      marker: { color: blueColor },
                      }]}
                    layout={lineChartLayout(height, width)}
                  />
                  )}
                </AutoSizer>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      }
    </body>
  )
}
