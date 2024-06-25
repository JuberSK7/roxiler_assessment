// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Bar } from 'react-chartjs-2';

// const BarChart = ({ selectedMonth }) => {
//   const [barChartData, setBarChartData] = useState([]);

//   const fetchBarChartData = async () => {
//     try {
//       const response = await axios.get(`http://localhost:5000/api/bar-chart/${selectedMonth}`);
//       setBarChartData(response.data);
//     } catch (error) {
//       console.error('Error fetching bar chart data:', error);
//     }
//   };

//   useEffect(() => {
//     fetchBarChartData();
//   }, [selectedMonth]);

//   const data = {
//     labels: barChartData.map(item => item.range),
//     datasets: [
//       {
//         label: '# of Items',
//         data: barChartData.map(item => item.count),
//         backgroundColor: 'rgba(75, 192, 192, 0.2)',
//         borderColor: 'rgba(75, 192, 192, 1)',
//         borderWidth: 1,
//       },
//     ],
//   };

//   return (
//     <div>
//       <h3>Bar Chart for {selectedMonth}</h3>
//       <Bar data={data} />
//     </div>
//   );
// };

// export default BarChart;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ selectedMonth }) => {
  const [barChartData, setBarChartData] = useState([]);

  const fetchBarChartData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/bar-chart/${selectedMonth}`);
      console.log('barchart',response.data)
      setBarChartData(response.data);
    } catch (error) {
      console.error('Error fetching bar chart data:', error);
    }
  };

  useEffect(() => {
    fetchBarChartData();
  }, [selectedMonth]);

  const data = {
    labels: barChartData.map(item => item.range),
    datasets: [
      {
        label: '# of Items',
        data: barChartData.map(item => item.count),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h3>Bar Chart for {selectedMonth}</h3>
      <Bar data={data} />
    </div>
  );
};

export default BarChart;

