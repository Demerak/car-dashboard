'use client'

import { React, useState, useEffect} from 'react';
import styles from './page.module.css';
import { Swiper, SwiperSlide } from 'swiper/react';

import "swiper/css";

import Page1 from './components/page1';
import Page2 from './components/page2';
import Page3 from './components/page3';

export default function Home() {

  const [speed, setSpeed] = useState(200);
  const [rpm, setRPM] = useState(0);
  const [engineLoad, setEngineLoad] = useState(0);
  const [absoluteLoad, setAbsoluteLoad] = useState(0);
  const [throttlePos, setThrottlePos] = useState(0);
  const [fuelLevel, setFuelLevel] = useState(100);
  const [engineRunTime, setEngineRunTime] = useState(0);

  const [coolantTemp, setCoolantTemp] = useState([]); 
  const [intakeTemp, setIntakeTemp] = useState([]); 
  const [ambientTemp, setAmbientTemp] = useState([]); 

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

      setCoolantTemp((prevTemp) => [
        ...prevTemp,
        {
          x: new Date().getTime(),
          y: parseFloat(obj.coolantTemp).toFixed(2)
        }
      ]);

      setIntakeTemp((prevTemp) => [
        ...prevTemp,
        {
          x: new Date().getTime(),
          y: parseFloat(obj.intakeTemp).toFixed(2)
        }
      ]);

      setAmbientTemp((prevTemp) => [
        ...prevTemp,
        {
          x: new Date().getTime(),
          y: parseFloat(obj.ambientTemp).toFixed(2)
        }
      ]);

      setTimeStamps((prevTimeStamps) => [...prevTimeStamps, new Date()]);
      setSpeedArrayData((prevSpeedData) => [...prevSpeedData, parseFloat(obj.speed).toFixed(2)]);
      setIsConnected(true);
    };

    socket.onclose = () => {
      console.log('Socket closed!');
      setIsConnected(false);
    }
  }, []);

  return (
    <body>
      {!isConnected ? 
        <div className={styles.errorContainer}>
          <h1>WebSocket Not Connected</h1>
        </div>
        : 
        <Swiper>
          <SwiperSlide>
            <Page1 speed={speed} rpm={rpm} engineLoad={engineLoad} absoluteLoad={absoluteLoad} throttlePos={throttlePos} fuelLevel={fuelLevel} engineRunTime={engineRunTime}/>
          </SwiperSlide>
          <SwiperSlide>
            <Page2 timeStamps={timeStamps} speedArrayData={speedArrayData}/>
          </SwiperSlide>
          <SwiperSlide>
            <Page3 coolantTemp={coolantTemp} intakeTemp={intakeTemp} ambientTemp={ambientTemp}/>
          </SwiperSlide>
        </Swiper>
      }
    </body>
  )
}
