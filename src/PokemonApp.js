import React, { useEffect, useCallback } from "react";
import { Layout, Input, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import { usePokemon } from "./PokemonContext";
import PokemonTabs from "./components/PokemonTabs";
import PokemonModal from "./components/PokemonModal";
import "animate.css";

const { Header, Content } = Layout;

const PokemonApp = () => {
  const { state, dispatch } = usePokemon();
  const { searchTerm, selectedPokemon } = state;

  const fetchPokemon = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://pokeapi.co/api/v2/pokemon?limit=151"
      );
      const results = response.data.results;
      const pokemonData = await Promise.all(
        results.map(async (pokemon) => {
          const detailResponse = await axios.get(pokemon.url);
          return {
            id: detailResponse.data.id,
            name: detailResponse.data.name,
            image: detailResponse.data.sprites.front_default,
            types: detailResponse.data.types.map((type) => type.type.name),
            height: detailResponse.data.height,
            weight: detailResponse.data.weight,
            abilities: detailResponse.data.abilities.map(
              (ability) => ability.ability.name
            ),
            stats: detailResponse.data.stats.reduce((acc, stat) => {
              acc[stat.stat.name] = stat.base_stat;
              return acc;
            }, {}),
          };
        })
      );
      dispatch({ type: "SET_POKEMON", payload: pokemonData });
    } catch (error) {
      console.error("获取宝可梦数据时出错:", error);
      dispatch({ type: "SET_LOADING", payload: false });
      message.error("获取宝可梦数据失败，请稍后重试");
    }
  }, [dispatch]);

  useEffect(() => {
    fetchPokemon();
  }, [fetchPokemon]);

  const handleSearch = (e) => {
    dispatch({ type: "SET_SEARCH_TERM", payload: e.target.value });
  };

  const handleModalClose = () => {
    dispatch({ type: "SET_SELECTED_POKEMON", payload: null });
  };

  return (
    <Layout className="min-h-screen bg-gray-100">
      <Header className="flex items-center justify-between bg-blue-600 p-4">
        <h1 className="text-2xl font-bold text-white animate__animated animate__fadeIn">
          宝可梦图鉴
        </h1>
        <Input
          placeholder="搜索宝可梦或属性"
          prefix={<SearchOutlined />}
          className="w-64 animate__animated animate__fadeInRight"
          onChange={handleSearch}
          value={searchTerm}
        />
      </Header>
      <Content className="p-6">
        <PokemonTabs />
      </Content>
      <PokemonModal
        pokemon={selectedPokemon}
        visible={!!selectedPokemon}
        onClose={handleModalClose}
      />
    </Layout>
  );
};

export default PokemonApp;
