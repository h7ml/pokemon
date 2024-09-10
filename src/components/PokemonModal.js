import React from "react";
import { Modal, Button } from "antd";
import { usePokemon } from "../PokemonContext";
import StatsChart from "./StatsChart";

const PokemonModal = ({ pokemon, visible, onClose }) => {
  const { dispatch } = usePokemon();

  if (!pokemon) return null;

  // ... (保持其他函数不变)

  return (
    <Modal
      title={<span className="text-2xl font-bold">{pokemon.name}</span>}
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button
          key="close"
          onClick={onClose}
          className="bg-gray-200 hover:bg-gray-300"
        >
          关闭
        </Button>,
        <Button
          key="favorite"
          onClick={toggleFavorite}
          className="bg-pink-500 text-white hover:bg-pink-600"
        >
          {pokemon.isFavorite ? "移出收藏" : "添加收藏"}
        </Button>,
        <Button
          key="compare"
          onClick={addToCompare}
          className="bg-blue-500 text-white hover:bg-blue-600"
        >
          添加到比较
        </Button>,
        <Button
          key="battle"
          onClick={addToBattle}
          className="bg-red-500 text-white hover:bg-red-600"
        >
          添加到对战
        </Button>,
      ]}
      className="animate__animated animate__fadeInUp"
    >
      <img
        src={pokemon.image}
        alt={pokemon.name}
        className="w-48 h-48 mx-auto mb-4 object-contain bg-gray-100 rounded-full"
      />
      <div className="grid grid-cols-2 gap-4">
        <p>
          <span className="font-bold">ID:</span> {pokemon.id}
        </p>
        <p>
          <span className="font-bold">类型:</span> {pokemon.types.join(", ")}
        </p>
        <p>
          <span className="font-bold">身高:</span> {pokemon.height / 10} 米
        </p>
        <p>
          <span className="font-bold">体重:</span> {pokemon.weight / 10} 千克
        </p>
      </div>
      <p className="mt-4">
        <span className="font-bold">特性:</span> {pokemon.abilities.join(", ")}
      </p>
      <StatsChart stats={pokemon.stats} />
    </Modal>
  );
};

export default PokemonModal;
