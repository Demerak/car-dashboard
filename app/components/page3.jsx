import React from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import AutoSizer from "react-virtualized-auto-sizer";

import styles from './page3.module.css';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });
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

  let coolantTempLineChartLayout = createApexChartLine('Engine Coolant Temperature (°C)', coolantTemp);
  let intakeTempLineChartLayout = createApexChartLine('Intake Air Temp (°C)', intakeTemp);
  let ambientAirTempLineChartLayout = createApexChartLine('Ambient Air Temp (°C)', ambientTemp);

  let listOfChart = [coolantTempLineChartLayout, intakeTempLineChartLayout, ambientAirTempLineChartLayout];

  const createPlotlyIndicatorData = (data) => ([{
    type: "indicator",
    mode: "number",
    value: data,
 
    number: {font: {size:50}, suffix: "°C" },
    domain: { x: [0, 1], y: [0, 1] }
  }]);

  let plotlyChartLayout = (height, width) => ({ 
    width: width, 
    height: height,
    paper_bgcolor:'rgba(0,0,0,0)',
    plot_bgcolor:'rgba(0,0,0,0)'
  });
    
  let listOfIndicator = [
    createPlotlyIndicatorData(coolantTemp.slice(-1)[0].y), 
    createPlotlyIndicatorData(intakeTemp.slice(-1)[0].y), 
    createPlotlyIndicatorData(ambientTemp.slice(-1)[0].y)
  ];

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
      {listOfIndicator.map((indicatorLayout, index) => (
        <div key={index} className={styles[`tempDisplay${index+1}`]}>
          <div className={styles.indicator}>
            <AutoSizer>
              {({ height, width }) => (
                <Plot 
                  data={indicatorLayout}
                  config={{ autosizable: true }} 
                  layout={plotlyChartLayout(height, width)} />
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


