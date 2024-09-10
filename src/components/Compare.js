import React from "react";
import { Row, Col, Empty, Button } from "antd";
import { usePokemon } from "../PokemonContext";
import PokemonCard from "./PokemonCard";
import StatsChart from "./StatsChart";

const Compare = () => {
  const { state } = usePokemon();
  const { comparePokemon } = state;

  if (comparePokemon.length < 2) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          comparePokemon.length === 0
            ? "选择两个宝可梦来进行比较吧！"
            : "再选择一个宝可梦来完成比较"
        }
      >
        <Button type="primary" onClick={() => (window.location.hash = "#1")}>
          去选择宝可梦
        </Button>
      </Empty>
    );
  }

  return (
    <Row gutter={16}>
      {comparePokemon.map((item) => (
        <Col span={12} key={item.id}>
          <PokemonCard pokemon={item} showCompare={false} />
          <StatsChart stats={item.stats} />
        </Col>
      ))}
    </Row>
  );
};

export default Compare;
