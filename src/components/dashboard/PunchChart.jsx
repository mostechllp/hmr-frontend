import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PunchChart = () => {
  const data = {
    labels: ['Today', 'Yesterday'],
    datasets: [
      {
        label: 'In',
        data: [0, 14],
        backgroundColor: '#2ecc71',
        borderRadius: 8,
      },
      {
        label: 'Out',
        data: [0, 0],
        backgroundColor: '#ef4444',
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#2ecc71',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 2,
          font: {
            size: 11,
          },
        },
        grid: {
          color: 'rgba(0,0,0,0.05)',
        },
      },
      x: {
        ticks: {
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">Punch Activity</h3>
      <div className="h-[200px] mb-4">
        <Bar data={data} options={options} />
      </div>
      <div className="flex justify-center gap-6 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
          <span className="text-gray-600 dark:text-gray-400">Punched In</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-red-500 rounded-full"></span>
          <span className="text-gray-600 dark:text-gray-400">Punched Out</span>
        </div>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="py-2 text-center text-xs font-semibold text-gray-500 dark:text-gray-400"></th>
            <th className="py-2 text-center text-xs font-semibold text-gray-500 dark:text-gray-400">Today</th>
            <th className="py-2 text-center text-xs font-semibold text-gray-500 dark:text-gray-400">Yesterday</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-2 text-center font-semibold text-gray-700 dark:text-gray-300">In</td>
            <td className="py-2 text-center text-green-600 dark:text-green-400 font-bold">0</td>
            <td className="py-2 text-center text-green-600 dark:text-green-400 font-bold">14</td>
          </tr>
          <tr>
            <td className="py-2 text-center font-semibold text-gray-700 dark:text-gray-300">Out</td>
            <td className="py-2 text-center text-red-500 font-bold">0</td>
            <td className="py-2 text-center text-red-500 font-bold">0</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PunchChart;