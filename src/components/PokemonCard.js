import React from "react";
import { Card, Button, Typography } from "antd";
import {
  HeartOutlined,
  HeartFilled,
  SearchOutlined,
  ThunderboltOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { usePokemon } from "../PokemonContext";

const { Text } = Typography;

const PokemonCard = ({ pokemon, showCompare = true }) => {
  const { state, dispatch } = usePokemon();
  const { favorites, comparePokemon, battlePokemon } = state;

  const isFavorite = favorites.some((fav) => fav.id === pokemon.id);
  const isInBattle = battlePokemon.some((p) => p.id === pokemon.id);
  const isInCompare = comparePokemon.some((p) => p.id === pokemon.id);

  const toggleFavorite = () => {
    dispatch({ type: "TOGGLE_FAVORITE", payload: pokemon });
  };

  const showDetails = () => {
    dispatch({ type: "SET_SELECTED_POKEMON", payload: pokemon });
  };

  const toggleBattle = () => {
    if (isInBattle) {
      dispatch({ type: "REMOVE_FROM_BATTLE", payload: pokemon });
    } else {
      dispatch({ type: "ADD_TO_BATTLE", payload: pokemon });
    }
  };

  const toggleCompare = () => {
    if (isInCompare) {
      dispatch({ type: "REMOVE_FROM_COMPARE", payload: pokemon });
    } else {
      dispatch({ type: "ADD_TO_COMPARE", payload: pokemon });
    }
  };

  const actions = [
    <Button
      icon={isFavorite ? <HeartFilled /> : <HeartOutlined />}
      onClick={toggleFavorite}
    >
      {isFavorite ? "取消收藏" : "收藏"}
    </Button>,
    <Button icon={<SearchOutlined />} onClick={showDetails}>
      查看详情
    </Button>,
    <Button icon={<ThunderboltOutlined />} onClick={toggleBattle}>
      {isInBattle ? "移出对战" : "添加对战"}
    </Button>,
  ];

  if (showCompare) {
    actions.push(
      <Button icon={<SwapOutlined />} onClick={toggleCompare}>
        {isInCompare ? "移除比较" : "添加比较"}
      </Button>
    );
  }

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Card
        hoverable
        cover={<img alt={pokemon.name} src={pokemon.image} />}
        actions={actions}
      >
        <Card.Meta
          title={pokemon.name}
          description={
            <>
              <Text>#{pokemon.id}</Text>
              <br />
              <Text>{pokemon.types.join(", ")}</Text>
            </>
          }
        />
      </Card>
    </motion.div>
  );
};

export default PokemonCard;
