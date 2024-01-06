'use client'

import { React, useState, useEffect} from 'react';
import styles from './page.module.css';
import Plot from 'react-plotly.js';



let socket;

export default function Home() {

  const [speed, setSpeed] = useState(200);
  const [rpm, setRPM] = useState(0);
  const [coolantTemp, setCoolantTemp] = useState(0);

  useEffect(() => {
   
    const socket = new WebSocket('ws://localhost:8765');

    console.log('Socket connected!', socket);

    socket.onmessage = (event) => {
      const obj = JSON.parse(event.data);
      setSpeed(parseFloat(obj.speed).toFixed(2));
      setRPM(parseFloat(obj.rpm).toFixed(2));
      
    };

    return () => {
      socket.close();
    };
  }, []);

  let speed_data = [
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

  let rpm_data = [
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

  let layout = { width: 300, height: 200, margin: { t: 0, b: 0 }, paper_bgcolor : '#46648c'};
  

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {<Plot data={speed_data} layout={layout} />};
      </div>
      <div className={styles.container}>
        {<Plot data={rpm_data} layout={layout} />};
      </div>
      <div className={styles.container}>
      
      </div>
    </main>
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