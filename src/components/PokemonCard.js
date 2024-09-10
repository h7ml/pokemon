import React from "react";
import { Card, Button, Tooltip } from "antd";
import {
  HeartOutlined,
  HeartFilled,
  SearchOutlined,
  ThunderboltOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { usePokemon } from "../PokemonContext";

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

  const renderButton = (icon, text, onClick, condition = true) => (
    <Tooltip title={text}>
      <Button
        icon={icon}
        onClick={onClick}
        className={`flex items-center justify-center ${
          condition
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : "bg-gray-200 hover:bg-gray-300"
        }`}
      >
        <span className="hidden sm:inline ml-1">{text}</span>
      </Button>
    </Tooltip>
  );

  const actions = [
    renderButton(
      isFavorite ? <HeartFilled /> : <HeartOutlined />,
      isFavorite ? "取消" : "收藏",
      toggleFavorite
    ),
    renderButton(<SearchOutlined />, "详情", showDetails),
    renderButton(
      <ThunderboltOutlined />,
      isInBattle ? "移出" : "添加",
      toggleBattle
    ),
  ];

  if (showCompare) {
    actions.push(
      renderButton(
        <SwapOutlined />,
        isInCompare ? "移除" : "添加",
        toggleCompare
      )
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="animate__animated animate__fadeIn"
    >
      <Card
        hoverable
        cover={
          <img
            alt={pokemon.name}
            src={pokemon.image}
            className="w-full h-48 object-contain bg-gray-100"
          />
        }
        actions={actions}
        className="shadow-lg"
      >
        <Card.Meta
          title={<span className="text-lg font-bold">{pokemon.name}</span>}
          description={
            <div>
              <p className="text-gray-500">#{pokemon.id}</p>
              <p className="text-blue-500">{pokemon.types.join(", ")}</p>
            </div>
          }
        />
      </Card>
    </motion.div>
  );
};

export default PokemonCard;
