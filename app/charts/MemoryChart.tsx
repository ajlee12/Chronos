import React, { useContext } from 'react';
import Plot from 'react-plotly.js';
import { HealthContext } from '../context/HealthContext';

const MemoryChart = React.memo(() => {
  const { healthData } = useContext(HealthContext);
  const createChart = () => {
    const free: number[] = healthData.freememory;
    const used: number[] = healthData.usedmemory;
    const active: number[] = healthData.activememory;

    return (
      <Plot
        data={[
          {
            type: 'scattergl',
            fill: 'tonexty',
            fillcolor: '#fc4039',
            mode: 'none',
            y: free,
            name: 'Free Memory',
          },
          {
            type: 'scatter',
            fill: 'tonexty',
            fillcolor: '#4b54ea',
            mode: 'none',
            y: used,
            name: 'Used Memory',
          },
          {
            type: 'scatter',
            fill: 'tonexty',
            fillcolor: '#3788fc',
            mode: 'none',
            y: active,
            name: 'Active Memory',
          },
        ]}
        layout={{
          title: 'Memory Traces',
          height: 300,
          width: 300,
          font: {
            color: '#444d56',
            size: 11.5,
            family: 'Roboto',
          },
          paper_bgcolor: 'white',
          plot_bgcolor: 'white',
          legend: {
            orientation: 'h',
            xanchor: 'center',
            x: 0.5,
            y: -1.0,
            font: {
              size: 9
            }
          },
          xaxis: {
            tickmode: 'linear',
            tick0: 0,
            dtick: 10,
            title: 'Time Elapsed (min)',
          },
          yaxis: {
            title: 'Bytes'
          }
        }}
      />
    );
  };

  return <div className="chart">{createChart()}</div>;
});

export default MemoryChart;
