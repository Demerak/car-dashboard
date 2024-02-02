import React from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import AutoSizer from "react-virtualized-auto-sizer";

import styles from './page1.module.css';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function Page1({speed, rpm, engineLoad, absoluteLoad, throttlePos, fuelLevel, engineRunTime}) {
  const speed_Data = [
    {
      type: "indicator",
      mode: "gauge+number+delta",
      value: speed,
      title: { text: "Speed (km/h)", font: { size: 24 } },
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
        axis: { range: [null, 8000], tickwidth: 1, tickcolor: "#146ca4" },
        bar: { color: "darkblue" },
        bgcolor: "white",
        borderwidth: 2,
        bordercolor: "gray",
        steps: [
          { range: [0, 1000], color: "#52b7e9" },
          { range: [1000, 6500], color: "#189de4" },
          { range: [6500, 8000], color: "#242444" }
        ],
        threshold: {
          line: { color: "red", width: 4 },
          thickness: 0.75,
          value: 6500
        }
      }
    }
  ];

  let plotlyChartLayout = (height, width) => ({ 
    width: width, 
    height: height,
    paper_bgcolor:'rgba(0,0,0,0)',
    plot_bgcolor:'rgba(0,0,0,0)'
  });

  const createHorizontalBarChartLayout = (titleText, data) => ({
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

  const engineLoadLayout = createHorizontalBarChartLayout('Engine Load', engineLoad);
  const absoluteLoadLayout = createHorizontalBarChartLayout('Absolute Load', absoluteLoad);
  const thorttlePosLayout = createHorizontalBarChartLayout('Throttle Pos', throttlePos);
  const fuelLevelLayout = createHorizontalBarChartLayout('Fuel Level', fuelLevel);

  const runtimeData = [
    {
      type: "indicator",
      mode: "number",
      value: engineRunTime,
      title: { text: "Engine runtime", font: { size: 24 } },
      number: { suffix: "s" },
      domain: { x: [0, 1], y: [0, 1] }
    }
  ];

  return (
    <div className={styles.page}>
      <div className={styles.firstContainer}>
        <AutoSizer>
          {({ height, width }) => (
            <Plot data={speed_Data} config={{ autosizable: true }} layout={plotlyChartLayout(height + 30, width)} />
          )}
        </AutoSizer>
      </div>
      <div className={styles.secondContainer}>
        <AutoSizer>
          {({ height, width }) => (
            <Plot data={RPM_Data} config={{ autosizable: true }} layout={plotlyChartLayout(height + 30, width)} />
          )}
        </AutoSizer>
      </div>
      <div className={styles.thirdContainer}>
        <div className={styles.horitontalBarChart}> 
          <AutoSizer>
            {({ height, width }) => (
              <Chart
                height= {height}
                width= {width}
                series={engineLoadLayout.series}
                options={engineLoadLayout}
                type="bar"
              />
            )}
          </AutoSizer>
        </div>
        <div className={styles.horitontalBarChart}> 
          <AutoSizer>
            {({ height, width }) => (
              <Chart
                height= {height}
                width= {width}
                options={absoluteLoadLayout}
                series={absoluteLoadLayout.series}
                type="bar"
              />
            )}
          </AutoSizer>
        </div>
        <div className={styles.horitontalBarChart}> 
          <AutoSizer>
            {({ height, width }) => (
              <Chart
                height= {height}
                width= {width}
                options={thorttlePosLayout}
                series={thorttlePosLayout.series}
                type="bar"
              />
            )}
          </AutoSizer>
        </div>
        <div className={styles.horitontalBarChart}> 
          <AutoSizer>
            {({ height, width }) => (
              <Chart
                height= {height}
                width= {width}
                options={fuelLevelLayout}
                series={fuelLevelLayout.series}
                type="bar"
              />
            )}
          </AutoSizer>
        </div>
      </div>
      <div className={styles.FourthContainer}>
        <AutoSizer>
          {({ height, width }) => (
            <Plot data={runtimeData} config={{ autosizable: true }} layout={plotlyChartLayout(height + 30, width)} />
          )}
        </AutoSizer>     
      </div>
    </div>
  );
};

Page1.propTypes = {
  speed: PropTypes.string.isRequired,
  rpm: PropTypes.string.isRequired, 
  engineLoad: PropTypes.string.isRequired, 
  absoluteLoad: PropTypes.string.isRequired, 
  throttlePos: PropTypes.string.isRequired, 
  fuelLevel: PropTypes.string.isRequired, 
  engineRunTime: PropTypes.string.isRequired
};


