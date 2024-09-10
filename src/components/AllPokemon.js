import React, { useEffect } from "react";
import { List, Pagination, Spin } from "antd";
import { usePokemon } from "../PokemonContext";
import PokemonCard from "./PokemonCard";

const AllPokemon = () => {
  const { state, dispatch } = usePokemon();
  const { filteredPokemon, loading, currentPage } = state;
  const pageSize = 20;

  useEffect(() => {
    const results = state.pokemon.filter(
      (p) =>
        p.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        p.types.some((type) =>
          type.toLowerCase().includes(state.searchTerm.toLowerCase())
        )
    );
    dispatch({ type: "SET_FILTERED_POKEMON", payload: results });
  }, [state.searchTerm, state.pokemon, dispatch]);

  const handlePageChange = (page) => {
    dispatch({ type: "SET_CURRENT_PAGE", payload: page });
  };

  const paginatedPokemon = filteredPokemon.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 3,
          lg: 4,
          xl: 4,
          xxl: 6,
        }}
        dataSource={paginatedPokemon}
        renderItem={(item) => (
          <List.Item>
            <PokemonCard pokemon={item} />
          </List.Item>
        )}
      />
      <Pagination
        current={currentPage}
        total={filteredPokemon.length}
        pageSize={pageSize}
        onChange={handlePageChange}
        style={{ marginTop: "20px", textAlign: "center" }}
      />
    </>
  );
};

export default AllPokemon;
