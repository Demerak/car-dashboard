import React from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import AutoSizer from "react-virtualized-auto-sizer";

import styles from './page2.module.css';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const backgroundColor = '#242424';
const backgroundColorLayer = '#161717';
const blueColor = '#146ca4';

export default function Page2({timeStamps, speedArrayData}) {

  let lineChartLayout = (height, width) => ({ 
    width: width, 
    height: height,
    title: 'Speed (Km/h)',
    xaxis: { title: 'Time' },
    yaxis: { title: 'Speed' },
    paper_bgcolor : backgroundColorLayer,
    plot_bgcolor : backgroundColorLayer,
  });

  return (
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
  );
};

Page2.propTypes = {
  timeStamps: PropTypes.array.isRequired,
  speedArrayData: PropTypes.array.isRequired 
};


