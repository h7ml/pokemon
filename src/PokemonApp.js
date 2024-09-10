import React, { useEffect } from "react";
import {
  Layout,
  List,
  Card,
  Typography,
  Input,
  Pagination,
  Modal,
  Spin,
  Button,
  Row,
  Col,
  Tabs,
  notification,
  message,
  Empty,
} from "antd";
import {
  SearchOutlined,
  HeartOutlined,
  HeartFilled,
  ThunderboltOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { motion } from "framer-motion";
import { usePokemon } from "./PokemonContext";

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

const PokemonApp = () => {
  const { state, dispatch } = usePokemon();
  const {
    pokemon,
    filteredPokemon,
    favorites,
    comparePokemon,
    battlePokemon,
    loading,
    currentPage,
    searchTerm,
    selectedPokemon,
  } = state;
  const pageSize = 20;

  useEffect(() => {
    const fetchPokemon = async () => {
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
    };

    fetchPokemon();
  }, [dispatch]);

  useEffect(() => {
    const results = pokemon.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.types.some((type) =>
          type.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
    dispatch({ type: "SET_FILTERED_POKEMON", payload: results });
    dispatch({ type: "SET_CURRENT_PAGE", payload: 1 });
  }, [searchTerm, pokemon, dispatch]);

  const handleSearch = (e) => {
    dispatch({ type: "SET_SEARCH_TERM", payload: e.target.value });
  };

  const handlePageChange = (page) => {
    dispatch({ type: "SET_CURRENT_PAGE", payload: page });
  };

  const showPokemonDetails = (pokemon) => {
    dispatch({ type: "SET_SELECTED_POKEMON", payload: pokemon });
  };

  const handleModalClose = () => {
    dispatch({ type: "SET_SELECTED_POKEMON", payload: null });
  };

  const toggleFavorite = (pokemon) => {
    dispatch({ type: "TOGGLE_FAVORITE", payload: pokemon });
    const isFavorite = favorites.some((fav) => fav.id === pokemon.id);
    if (isFavorite) {
      message.success(`${pokemon.name} 已从收藏夹中移除`);
    } else {
      message.success(`${pokemon.name} 已添加到收藏夹`);
    }
  };

  const addToCompare = (pokemon) => {
    if (comparePokemon.length < 2) {
      dispatch({
        type: "SET_COMPARE_POKEMON",
        payload: [...comparePokemon, pokemon],
      });
      message.success(`${pokemon.name} 已添加到比较列表`);
    } else {
      message.warning("比较列表已满，请先移除一个宝可梦再添加新的");
    }
  };

  const removeFromCompare = (pokemon) => {
    dispatch({
      type: "SET_COMPARE_POKEMON",
      payload: comparePokemon.filter((p) => p.id !== pokemon.id),
    });
    message.success(`${pokemon.name} 已从比较列表中移除`);
  };

  const addToBattle = (pokemon) => {
    if (battlePokemon.length < 2) {
      dispatch({
        type: "SET_BATTLE_POKEMON",
        payload: [...battlePokemon, pokemon],
      });
      message.success(`${pokemon.name} 已准备好战斗！`);
    } else {
      message.warning("对战队伍已满，请先移除一个宝可梦再添加新的");
    }
  };

  const removeFromBattle = (pokemon) => {
    dispatch({
      type: "SET_BATTLE_POKEMON",
      payload: battlePokemon.filter((p) => p.id !== pokemon.id),
    });
    message.success(`${pokemon.name} 已从对战队伍中移除`);
  };

  const simulateBattle = () => {
    if (battlePokemon.length !== 2) {
      message.error("需要选择两个宝可梦才能开始对战");
      return;
    }

    const [pokemon1, pokemon2] = battlePokemon;
    const totalStats1 = Object.values(pokemon1.stats).reduce(
      (sum, stat) => sum + stat,
      0
    );
    const totalStats2 = Object.values(pokemon2.stats).reduce(
      (sum, stat) => sum + stat,
      0
    );

    let winner;
    if (totalStats1 > totalStats2) {
      winner = pokemon1;
    } else if (totalStats2 > totalStats1) {
      winner = pokemon2;
    } else {
      winner = Math.random() < 0.5 ? pokemon1 : pokemon2;
    }

    notification.success({
      message: "对战结果",
      description: `激烈的战斗过后，${winner.name} 凭借优秀的表现赢得了胜利！`,
      duration: 5,
    });
  };

  const renderPokemonCard = (item, actions) => (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Card
        hoverable
        cover={<img alt={item.name} src={item.image} />}
        actions={actions}
      >
        <Card.Meta
          title={item.name}
          description={
            <>
              <Text>#{item.id}</Text>
              <br />
              <Text>{item.types.join(", ")}</Text>
            </>
          }
        />
      </Card>
    </motion.div>
  );

  const renderStatsChart = (stats) => {
    return (
      <div style={{ marginTop: "20px" }}>
        <h4>能力值：</h4>
        {Object.entries(stats).map(([stat, value]) => (
          <div key={stat} style={{ marginBottom: "5px" }}>
            <Text strong>{stat}: </Text>
            <div
              style={{
                width: `${(value / 150) * 100}%`,
                height: "10px",
                backgroundColor: "#1890ff",
                borderRadius: "5px",
              }}
            ></div>
          </div>
        ))}
      </div>
    );
  };

  const paginatedPokemon = filteredPokemon.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <Layout>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Title level={2} style={{ color: "white", margin: 0 }}>
          宝可梦图鉴
        </Title>
        <Input
          placeholder="搜索宝可梦或属性"
          prefix={<SearchOutlined />}
          style={{ width: 250 }}
          onChange={handleSearch}
        />
      </Header>
      <Content style={{ padding: "24px" }}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="所有宝可梦" key="1">
            {loading ? (
              <div style={{ textAlign: "center", marginTop: "50px" }}>
                <Spin size="large" />
              </div>
            ) : (
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
                      {renderPokemonCard(item, [
                        <Button
                          icon={
                            favorites.some((fav) => fav.id === item.id) ? (
                              <HeartFilled />
                            ) : (
                              <HeartOutlined />
                            )
                          }
                          onClick={() => toggleFavorite(item)}
                        />,
                        <Button
                          icon={<SearchOutlined />}
                          onClick={() => showPokemonDetails(item)}
                        />,
                        <Button
                          icon={<ThunderboltOutlined />}
                          onClick={() => addToBattle(item)}
                        />,
                      ])}
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
            )}
          </TabPane>
          <TabPane tab="收藏夹" key="2">
            {favorites.length === 0 ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="你还没有收藏任何宝可梦哦！去探索一下吧~"
              />
            ) : (
              <List
                grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 6 }}
                dataSource={favorites}
                renderItem={(item) => (
                  <List.Item>
                    {renderPokemonCard(item, [
                      <Button
                        icon={<HeartFilled />}
                        onClick={() => toggleFavorite(item)}
                      >
                        取消收藏
                      </Button>,
                      <Button
                        icon={<SearchOutlined />}
                        onClick={() => showPokemonDetails(item)}
                      >
                        查看详情
                      </Button>,
                    ])}
                  </List.Item>
                )}
              />
            )}
          </TabPane>
          <TabPane tab="比较" key="3">
            <Row gutter={16}>
              {comparePokemon.map((item) => (
                <Col span={12} key={item.id}>
                  {renderPokemonCard(item, [
                    <Button onClick={() => removeFromCompare(item)}>
                      移除比较
                    </Button>,
                  ])}
                  {renderStatsChart(item.stats)}
                </Col>
              ))}
            </Row>
            {comparePokemon.length < 2 && (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  comparePokemon.length === 0
                    ? "选择两个宝可梦来进行比较吧！"
                    : "再选择一个宝可梦来完成比较"
                }
              >
                <Button
                  type="primary"
                  onClick={() =>
                    dispatch({ type: "SET_SELECTED_POKEMON", payload: null })
                  }
                >
                  选择宝可梦
                </Button>
              </Empty>
            )}
          </TabPane>
          <TabPane tab="对战" key="4">
            <Row gutter={16}>
              {battlePokemon.map((item) => (
                <Col span={12} key={item.id}>
                  {renderPokemonCard(item, [
                    <Button onClick={() => removeFromBattle(item)}>
                      移出队伍
                    </Button>,
                  ])}
                </Col>
              ))}
            </Row>
            {battlePokemon.length === 2 ? (
              <Button
                onClick={simulateBattle}
                type="primary"
                style={{ marginTop: 16 }}
              >
                开始精彩对战！
              </Button>
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  battlePokemon.length === 0
                    ? "选择两个宝可梦来开始激动人心的对战吧！"
                    : "再选择一个宝可梦来开始对战"
                }
              >
                <Button
                  type="primary"
                  onClick={() =>
                    dispatch({ type: "SET_SELECTED_POKEMON", payload: null })
                  }
                >
                  选择宝可梦
                </Button>
              </Empty>
            )}
          </TabPane>
        </Tabs>
      </Content>
      <Modal
        title={selectedPokemon?.name}
        visible={!!selectedPokemon}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            关闭
          </Button>,
          <Button
            key="favorite"
            onClick={() => toggleFavorite(selectedPokemon)}
          >
            {favorites.some((fav) => fav.id === selectedPokemon?.id)
              ? "移出收藏"
              : "添加收藏"}
          </Button>,
          <Button key="compare" onClick={() => addToCompare(selectedPokemon)}>
            添加到比较
          </Button>,
          <Button key="battle" onClick={() => addToBattle(selectedPokemon)}>
            添加到对战
          </Button>,
        ]}
      >
        {selectedPokemon && (
          <>
            <img
              src={selectedPokemon.image}
              alt={selectedPokemon.name}
              style={{ display: "block", margin: "0 auto" }}
            />
            <p>
              <strong>ID:</strong> {selectedPokemon.id}
            </p>
            <p>
              <strong>类型:</strong> {selectedPokemon.types.join(", ")}
            </p>
            <p>
              <strong>身高:</strong> {selectedPokemon.height / 10} 米
            </p>
            <p>
              <strong>体重:</strong> {selectedPokemon.weight / 10} 千克
            </p>
            <p>
              <strong>特性:</strong> {selectedPokemon.abilities.join(", ")}
            </p>
            {renderStatsChart(selectedPokemon.stats)}
          </>
        )}
      </Modal>
    </Layout>
  );
};

export default PokemonApp;
