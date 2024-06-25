import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const PieChart = ({ selectedMonth }) => {
  const [pieChartData, setPieChartData] = useState([]);

  const fetchPieChartData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/pie-chart/${selectedMonth}`);
      console.log('pia', response.data)
      setPieChartData(response.data);
    } catch (error) {
      console.error('Error fetching pie chart data:', error);
    }
  };

  useEffect(() => {
    fetchPieChartData();
  }, [selectedMonth]);

  const data = {
    labels: pieChartData.map(item => item.category),
    datasets: [
      {
        label: '# of Items',
        data: pieChartData.map(item => item.count),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
      },
    ],
  };

  return (
    <div>
      <h3>Pie Chart for {selectedMonth}</h3>
      <Pie data={data} />
    </div>
  );
};

export default PieChart;

