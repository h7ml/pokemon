import React from "react";
import { Modal, Button, Typography } from "antd";
import { usePokemon } from "../PokemonContext";
import StatsChart from "./StatsChart";

const { Text } = Typography;

const PokemonModal = ({ pokemon, visible, onClose }) => {
  const { dispatch } = usePokemon();

  if (!pokemon) return null;

  const toggleFavorite = () => {
    dispatch({ type: "TOGGLE_FAVORITE", payload: pokemon });
  };

  const addToCompare = () => {
    dispatch({ type: "ADD_TO_COMPARE", payload: pokemon });
  };

  const addToBattle = () => {
    dispatch({ type: "ADD_TO_BATTLE", payload: pokemon });
  };

  return (
    <Modal
      title={pokemon.name}
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          关闭
        </Button>,
        <Button key="favorite" onClick={toggleFavorite}>
          {pokemon.isFavorite ? "移出收藏" : "添加收藏"}
        </Button>,
        <Button key="compare" onClick={addToCompare}>
          添加到比较
        </Button>,
        <Button key="battle" onClick={addToBattle}>
          添加到对战
        </Button>,
      ]}
    >
      <img
        src={pokemon.image}
        alt={pokemon.name}
        style={{ display: "block", margin: "0 auto" }}
      />
      <p>
        <Text strong>ID:</Text> {pokemon.id}
      </p>
      <p>
        <Text strong>类型:</Text> {pokemon.types.join(", ")}
      </p>
      <p>
        <Text strong>身高:</Text> {pokemon.height / 10} 米
      </p>
      <p>
        <Text strong>体重:</Text> {pokemon.weight / 10} 千克
      </p>
      <p>
        <Text strong>特性:</Text> {pokemon.abilities.join(", ")}
      </p>
      <StatsChart stats={pokemon.stats} />
    </Modal>
  );
};

export default PokemonModal;
