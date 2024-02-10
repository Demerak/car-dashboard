import React from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import AutoSizer from "react-virtualized-auto-sizer";

import styles from './page2.module.css';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const backgroundColorLayer = '#161717';
const blueColor = '#146ca4';

export default function Page2({speedArrayData}) {

  let lineChartLayout = (height, width) => ({ 
    width: width, 
    height: height,
    title: 'Speed (Km/h)',
    xaxis: { 
      title: 'Time',
      type: 'date',
    },
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
              x: speedArrayData.timeStamps,
              y: speedArrayData.speedData,
              type: 'scatter',
              mode: 'lines',
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
  speedArrayData: PropTypes.object.isRequired 
};


