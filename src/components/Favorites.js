import React from "react";
import { List, Empty, Button } from "antd";
import { usePokemon } from "../PokemonContext";
import PokemonCard from "./PokemonCard";

const Favorites = () => {
  const { state, dispatch } = usePokemon();
  const { favorites } = state;

  if (favorites.length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="你还没有收藏任何宝可梦哦！去探索一下吧~"
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
    <List
      grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 6 }}
      dataSource={favorites}
      renderItem={(item) => (
        <List.Item>
          <PokemonCard pokemon={item} />
        </List.Item>
      )}
    />
  );
};

export default Favorites;
