// PokemonContext.js
import React, { createContext, useContext, useReducer } from "react";

const PokemonContext = createContext();

const initialState = {
  pokemon: [],
  filteredPokemon: [],
  favorites: [],
  comparePokemon: [],
  battlePokemon: [],
  loading: true,
  currentPage: 1,
  searchTerm: "",
  selectedPokemon: null,
};

function pokemonReducer(state, action) {
  switch (action.type) {
    case "SET_POKEMON":
      return {
        ...state,
        pokemon: action.payload,
        filteredPokemon: action.payload,
        loading: false,
      };
    case "SET_FILTERED_POKEMON":
      return { ...state, filteredPokemon: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_CURRENT_PAGE":
      return { ...state, currentPage: action.payload };
    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload };
    case "SET_SELECTED_POKEMON":
      return { ...state, selectedPokemon: action.payload };
    case "TOGGLE_FAVORITE":
      const isFavorite = state.favorites.some(
        (fav) => fav.id === action.payload.id
      );
      return {
        ...state,
        favorites: isFavorite
          ? state.favorites.filter((fav) => fav.id !== action.payload.id)
          : [...state.favorites, action.payload],
      };
    case "SET_COMPARE_POKEMON":
      return { ...state, comparePokemon: action.payload };
    case "SET_BATTLE_POKEMON":
      return { ...state, battlePokemon: action.payload };
    default:
      return state;
  }
}

export function PokemonProvider({ children }) {
  const [state, dispatch] = useReducer(pokemonReducer, initialState);

  return (
    <PokemonContext.Provider value={{ state, dispatch }}>
      {children}
    </PokemonContext.Provider>
  );
}

export function usePokemon() {
  const context = useContext(PokemonContext);
  if (!context) {
    throw new Error("usePokemon must be used within a PokemonProvider");
  }
  return context;
}
