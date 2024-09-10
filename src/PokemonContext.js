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
  activeTab: "1",
};

const pokemonReducer = (state, action) => {
  switch (action.type) {
    case "SET_POKEMON":
      return { ...state, pokemon: action.payload, loading: false };
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
    case "ADD_TO_COMPARE":
      if (state.comparePokemon.length < 2) {
        return {
          ...state,
          comparePokemon: [...state.comparePokemon, action.payload],
        };
      }
      return state;
    case "REMOVE_FROM_COMPARE":
      return {
        ...state,
        comparePokemon: state.comparePokemon.filter(
          (p) => p.id !== action.payload.id
        ),
      };
    case "ADD_TO_BATTLE":
      if (state.battlePokemon.length < 2) {
        return {
          ...state,
          battlePokemon: [...state.battlePokemon, action.payload],
        };
      }
      return state;
    case "REMOVE_FROM_BATTLE":
      return {
        ...state,
        battlePokemon: state.battlePokemon.filter(
          (p) => p.id !== action.payload.id
        ),
      };
      case 'SET_ACTIVE_TAB':
        return { ...state, activeTab: action.payload };
    default:
      return state;
  }
};

export const PokemonProvider = ({ children }) => {
  const [state, dispatch] = useReducer(pokemonReducer, initialState);

  return (
    <PokemonContext.Provider value={{ state, dispatch }}>
      {children}
    </PokemonContext.Provider>
  );
};

export const usePokemon = () => {
  const context = useContext(PokemonContext);
  if (!context) {
    throw new Error("usePokemon must be used within a PokemonProvider");
  }
  return context;
};
