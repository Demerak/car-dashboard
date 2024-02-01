import React from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import AutoSizer from "react-virtualized-auto-sizer";

import styles from './page3.module.css';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function Page3({coolantTemp, intakeTemp, ambientTemp}) {

  const createApexChartLine = (titleText, data) => ({
    series: [{
      data: data.slice(-600).filter((_, index) => index % 2 === 0),
    }],
    options: {
      chart: {
        id: 'realtime',
        animations: {
          enabled: true,
          easing: 'linear',
          dynamicAnimation: {
            speed: 10
          }
        },
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
      title: {
        text: titleText,
        align: 'left',
        margin: 10,
        offsetX: 0,
        offsetY: 0,
        floating: false,
        style: {
          fontSize:  '14px',
          fontWeight:  'bold',
          color:  '#263238'
        }
      },
      xaxis: {
        type: "datetime",
      },
      legend: {
        show: false,
      },    
      grid: {
        xaxis: {
          lines: {
              show: false
          }
        },   
        yaxis: {
            lines: {
                show: false
            }
        }
      }
    },
  });

  let coolantTempLineChartLayout = createApexChartLine('Engine Coolant Temperature', coolantTemp);
  let intakeTempLineChartLayout = createApexChartLine('Intake Air Temp', intakeTemp);
  let ambientAirTempLineChartLayout = createApexChartLine('Ambient Air Temp', ambientTemp);

  let listOfChart = [coolantTempLineChartLayout, intakeTempLineChartLayout, ambientAirTempLineChartLayout];

  return (
    <div className={styles.page}>
      {listOfChart.map((chartLayout, index) => (
        <div key={chartLayout.options.title.text} className={styles[`lineChartContainer${index+1}`]}>
          <div className={styles.lineChart}> 
            <AutoSizer>
              {({ height, width }) => (
                <Chart
                  key={chartLayout.options.title.text}
                  height={height+20}
                  width={width}
                  options={chartLayout.options}
                  series={chartLayout.series}
                  type="area"
                />
              )}
            </AutoSizer>
          </div> 
        </div>
      ))}
    </div>
  );
};

Page3.propTypes = {
  coolantTemp: PropTypes.array.isRequired,
  intakeTemp: PropTypes.array.isRequired,
  ambientTemp: PropTypes.array.isRequired,
};


