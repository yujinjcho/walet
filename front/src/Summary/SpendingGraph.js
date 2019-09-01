import React, { Component } from 'react'
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import classes from "./SpendingGraph.css";
import values from '../values';

import 'chartjs-plugin-colorschemes';

const getPassedMonths = (selectedYear) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  return currentYear === parseInt(selectedYear) ? values.months.slice(0, currentMonth) : values.months;
}

export default class SpendingGraph extends Component {
  chartRef = React.createRef();
  chart = undefined;

  buildChart() {
    const myChartRef = this.chartRef.current.getContext("2d");

    const { data, currentYear } = this.props;
    const labels = getPassedMonths(currentYear);
    const datasets = Object.keys(data).map(category => {
      return {
        label: category,
        stack: 'month',
        data: labels.map(m => Math.round(data[category][m]) || 0)
      };
    })

    if (this.chart) this.chart.destroy();

    this.chart = new Chart(myChartRef, {
      type: "bar",
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        tooltips: {
          mode: 'index',
          intersect: false
        },
        responsive: true,
        scales: {
          xAxes: [{
            stacked: true,
          }],
          yAxes: [{
            stacked: true
          }]
        },
        plugins: {
          datalabels: {
            color: 'white',
            display: (c) => Math.abs(c.dataset.data[c.dataIndex]) > 100,
            formatter: Math.round
          },
          colorschemes: {
            scheme: 'brewer.Paired12'
          }
        }
      }
    });
  }

  componentDidMount() {
    this.buildChart();
  }

  componentDidUpdate() {
    this.buildChart();
  }

  render() {
    return (
      <div className={classes.graphContainer}>
        <canvas
          id="spendingChart"
          ref={this.chartRef}
        />
      </div>
    )
  }
}
