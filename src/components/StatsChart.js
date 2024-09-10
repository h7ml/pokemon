import React from "react";
import { Typography } from "antd";

const { Text } = Typography;

const StatsChart = ({ stats }) => {
  return (
    <div style={{ marginTop: "20px" }}>
      <h4>能力值：</h4>
      {Object.entries(stats).map(([stat, value]) => (
        <div key={stat} style={{ marginBottom: "5px" }}>
          <Text strong>{stat}: </Text>
          <div
            style={{
              width: `${(value / 150) * 100}%`,
              height: "10px",
              backgroundColor: "#1890ff",
              borderRadius: "5px",
            }}
          ></div>
          <Text>{value}</Text>
        </div>
      ))}
    </div>
  );
};

export default StatsChart;
