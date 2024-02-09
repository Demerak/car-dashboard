'use client'

import { React, useState, useEffect} from 'react';
import styles from './page.module.css';
import { Swiper, SwiperSlide } from 'swiper/react';

import "swiper/css";

import Page1 from './components/page1';
import Page2 from './components/page2';
import Page3 from './components/page3';

export default function Home() {

  const MAX_ARRAY_LENGTH = 600;

  const [vehicleMetrics, setVehicleMetrics] = useState({
    speed: 0,
    rpm: 0,
    engineLoad: 0,
    absoluteLoad: 0,
    throttlePos: 0,
    fuelLevel: 100,
    engineRunTime: 0
  });

  const [temperatureData, setTemperatureData] = useState({
    coolantTemp: [],
    intakeTemp: [],
    ambientTemp: []
  });

  const [speedArrayData, setSpeedArrayData] = useState({
    timeStamps: [],
    speedData: []
  });

  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {

    const socket = new WebSocket('ws://localhost:8765');
   
    socket.onopen = () => {
      console.log('Socket connected!', socket);
      setIsConnected(true);
    }

    socket.onmessage = (event) => {
      const obj = JSON.parse(event.data);
      const readTime = new Date();
      
      setVehicleMetrics(prevMetrics => ({
        ...prevMetrics,
        speed: parseFloat(obj.speed).toFixed(2),
        rpm: parseFloat(obj.rpm).toFixed(2),
        engineLoad: parseFloat(obj.engineLoad).toFixed(2),
        absoluteLoad: parseFloat(obj.absoluteLoad).toFixed(2),
        throttlePos: parseFloat(obj.throttlePos).toFixed(2),
        fuelLevel: parseFloat(obj.fuelLevel).toFixed(2),
        engineRunTime: parseFloat(obj.engineRunTime).toFixed(2)
      }));

      setTemperatureData(prevData => ({
        coolantTemp: [
          ...prevData.coolantTemp,
          {
            x: readTime.getTime(),
            y: parseFloat(obj.coolantTemp).toFixed(2)
          }
        ].slice(-MAX_ARRAY_LENGTH),
        intakeTemp: [
          ...prevData.intakeTemp,
          {
            x: readTime.getTime(),
            y: parseFloat(obj.intakeTemp).toFixed(2)
          }
        ].slice(-MAX_ARRAY_LENGTH),
        ambientTemp: [
          ...prevData.ambientTemp,
          {
            x: readTime.getTime(),
            y: parseFloat(obj.ambientTemp).toFixed(2)
          }
        ].slice(-MAX_ARRAY_LENGTH)
      }));
      

      setSpeedArrayData(prevSpeedData => ({
        timeStamps: [...prevSpeedData.timeStamps, readTime].slice(-MAX_ARRAY_LENGTH),
        speedData: [...prevSpeedData.speedData, parseFloat(obj.speed).toFixed(2)].slice(-MAX_ARRAY_LENGTH)
      }));

  
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
            <Page1 vehicleMetrics={vehicleMetrics}/>
          </SwiperSlide>
          <SwiperSlide>
            <Page2 speedArrayData={speedArrayData}/>
          </SwiperSlide>
          <SwiperSlide>
            <Page3 temperatureData={temperatureData}/>
          </SwiperSlide>
        </Swiper>
      }
    </body>
  )
}