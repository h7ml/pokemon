import React from "react";
import ReactDOM from "react-dom";
import { PokemonProvider } from "./PokemonContext";
import PokemonApp from "./PokemonApp";

ReactDOM.render(
  <PokemonProvider>
    <PokemonApp />
  </PokemonProvider>,
  document.getElementById("root")
);
