'use client'

import { React, useState, useEffect} from 'react';
import styles from './page.module.css';
import Plot from 'react-plotly.js';
import Chart from "react-apexcharts";
import { Swiper, SwiperSlide } from 'swiper/react';

import "swiper/css";

let socket;
const backgroundColor = '#46648c'

export default function Home() {

  const [speed, setSpeed] = useState(200);
  const [rpm, setRPM] = useState(0);
  const [engineLoad, setEngineLoad] = useState(0);
  const [absoluteLoad, setAbsoluteLoad] = useState(0);
  const [throttlePos, setThrottlePos] = useState(0);
  const [fuelLevel, setFuelLevel] = useState(100);

  const [coolantTemp, setCoolantTemp] = useState(0);

  const [timeStamps, setTimeStamps] = useState([]);
  const [speedArrayData, setSpeedArrayData] = useState([]);


  useEffect(() => {
   
    const socket = new WebSocket('ws://localhost:8765');

    console.log('Socket connected!', socket);

    socket.onmessage = (event) => {
      const obj = JSON.parse(event.data);
      setSpeed(parseFloat(obj.speed).toFixed(2));
      setRPM(parseFloat(obj.rpm).toFixed(2));
      setEngineLoad(parseFloat(obj.engineLoad).toFixed(2));
      setAbsoluteLoad(parseFloat(obj.absoluteLoad).toFixed(2));
      setThrottlePos(parseFloat(obj.throttlePos).toFixed(2));
      setFuelLevel(parseFloat(obj.fuelLevel).toFixed(2)); 

      setTimeStamps((prevTimeStamps) => [...prevTimeStamps, new Date()]);
      setSpeedArrayData((prevSpeedData) => [...prevSpeedData, parseFloat(obj.speed).toFixed(2)]);
    };

    return () => {
      socket.close();
    };
  }, []);

  let speedData = [
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

  let RPM_Data = [
    {
      type: "indicator",
      mode: "gauge+number+delta",
      value: rpm,
      title: { text: "RPM", font: { size: 24 } },
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

  const lineChartLayout = {
    width: 960, 
    height: 540, 
    title: 'Speed (Km/h)',
    xaxis: { title: 'Time' },
    yaxis: { title: 'Speed' },
    paper_bgcolor : backgroundColor,
    plot_bgcolor : backgroundColor,
  }

  let gaugeChartLayout = { 
    width: 400, 
    height: 200, 
    margin: { t: 30, b: 0 }, 
    paper_bgcolor : backgroundColor};

  const createBarChartOptions = (titleText, data) => ({
    chart: {
      height: 70,
      type: 'bar',
      stacked: true,
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
      text: titleText
    },
    subtitle: {
      floating: true,
      align: 'right',
      offsetY: 0,
      text: data + '%',
      style: {
        fontSize: '20px'
      }
    },
    tooltip: {
      enabled: false
    },
    xaxis: {
      categories: [titleText],
    },
    yaxis: {
      max: 100
    },
    fill: {
      opacity: 1
    }
  });
  
  const optionsEngineLoad = createBarChartOptions('Engine Load', engineLoad)
  const optionsAbsoluteLoad = createBarChartOptions('Absolute Load', absoluteLoad)
  const optionsThorttlePos = createBarChartOptions('Throttle Pos', throttlePos)
  const optionsFuelLevel = createBarChartOptions('Fuel Level', fuelLevel)

  return (
    <Swiper>
        <SwiperSlide>
          <div className={styles.main}>
            <div className={styles.container}>
              {<Plot data={speedData} layout={gaugeChartLayout} />};
            </div>
            <div className={styles.container}>
              {<Plot data={RPM_Data} layout={gaugeChartLayout} />};
            </div>
            <div className={styles.container}>
              <Chart
                options={optionsEngineLoad}
                series={optionsEngineLoad.series}
                type="bar"
                height={70}
              />
              <Chart
                options={optionsAbsoluteLoad}
                series={optionsAbsoluteLoad.series}
                type="bar"
                height={70}
              />
              <Chart
                options={optionsThorttlePos}
                series={optionsThorttlePos.series}
                type="bar"
                height={70}
              />
              <Chart
                options={optionsFuelLevel}
                series={optionsFuelLevel.series}
                type="bar"
                height={70}
              />
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className={styles.main}>
            <div className={styles.lineChart}>
              <Plot
                data={[{
                  x: timeStamps,
                  y: speedArrayData,
                  type: 'scatter',
                  mode: 'lines+markers',
                  marker: { color: 'black' },
                  }]}
                layout={lineChartLayout}
              />
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
  )
}

  // useEffect(() => {
   
  //   socket = io('http://localhost:8765');

  //   console.log('Socket connected!', socket);

  //   socket.on('speed', (data) => {
  //     console.log('Speed data received!');
  //     console.log(data);
  //     setSpeed(data);
  //   });

  //   return (() => { 
  //     socket.disconnect();
  //   })
  // }, [speed]);

  // let data = [
  //   {
  //     domain: { x: [0, 100], y: [0, 100] },
  //     value: speed,
  //     title: { text: "Speed" },
  //     type: "indicator",
  //     mode: "gauge+number"
  //   }
  // ];