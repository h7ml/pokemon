import React from "react";

const StatsChart = ({ stats }) => {
  return (
    <div className="mt-6">
      <h4 className="text-xl font-bold mb-4">能力值：</h4>
      {Object.entries(stats).map(([stat, value]) => (
        <div key={stat} className="mb-3">
          <div className="flex justify-between mb-1">
            <span className="font-semibold">{stat}:</span>
            <span>{value}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full animate__animated animate__fadeInLeft"
              style={{ width: `${(value / 150) * 100}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsChart;
