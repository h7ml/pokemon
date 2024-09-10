import React from "react";
import { Row, Col, Empty, Button, notification } from "antd";
import { usePokemon } from "../PokemonContext";
import PokemonCard from "./PokemonCard";

const Battle = () => {
  const { state, dispatch } = usePokemon();
  const { battlePokemon } = state;

  const simulateBattle = () => {
    if (battlePokemon.length !== 2) {
      notification.error({
        message: "无法开始对战",
        description: "需要选择两个宝可梦才能开始对战",
      });
      return;
    }

    const [pokemon1, pokemon2] = battlePokemon;
    const totalStats1 = Object.values(pokemon1.stats).reduce(
      (sum, stat) => sum + stat,
      0
    );
    const totalStats2 = Object.values(pokemon2.stats).reduce(
      (sum, stat) => sum + stat,
      0
    );

    let winner;
    if (totalStats1 > totalStats2) {
      winner = pokemon1;
    } else if (totalStats2 > totalStats1) {
      winner = pokemon2;
    } else {
      winner = Math.random() < 0.5 ? pokemon1 : pokemon2;
    }

    notification.success({
      message: "对战结果",
      description: `激烈的战斗过后，${winner.name} 凭借优秀的表现赢得了胜利！`,
      duration: 5,
    });
  };

  if (battlePokemon.length < 2) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          battlePokemon.length === 0
            ? "选择两个宝可梦来开始激动人心的对战吧！"
            : "再选择一个宝可梦来开始对战"
        }
      >
        <Button
          type="primary"
          onClick={() => dispatch({ type: "SET_ACTIVE_TAB", payload: "1" })}
        >
          去选择宝可梦
        </Button>
      </Empty>
    );
  }

  return (
    <>
      <Row gutter={16}>
        {battlePokemon.map((item) => (
          <Col span={12} key={item.id}>
            <PokemonCard pokemon={item} showCompare={false} />
          </Col>
        ))}
      </Row>
      <Button onClick={simulateBattle} type="primary" style={{ marginTop: 16 }}>
        开始精彩对战！
      </Button>
    </>
  );
};

export default Battle;
