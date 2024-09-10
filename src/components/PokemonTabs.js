import React, { useState } from "react";
import { Tabs } from "antd";
import AllPokemon from "./AllPokemon";
import Favorites from "./Favorites";
import Compare from "./Compare";
import Battle from "./Battle";

const { TabPane } = Tabs;

const PokemonTabs = () => {
  const [activeTab, setActiveTab] = useState("1");

  return (
    <Tabs activeKey={activeTab} onChange={setActiveTab}>
      <TabPane tab="所有宝可梦" key="1">
        <AllPokemon />
      </TabPane>
      <TabPane tab="收藏夹" key="2">
        <Favorites />
      </TabPane>
      <TabPane tab="比较" key="3">
        <Compare />
      </TabPane>
      <TabPane tab="对战" key="4">
        <Battle />
      </TabPane>
    </Tabs>
  );
};

export default PokemonTabs;
