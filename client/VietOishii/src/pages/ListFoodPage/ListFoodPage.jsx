import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { Select, Input, Row, Col, Spin, Alert } from 'antd';
import FoodCard from '../../components/FoodCard/FoodCard';
import DishService from '../../services/DishService';

const { Option } = Select;
const { Search } = Input;

const ListFoodPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const initialSearchTerm = location.state?.searchTerm || '';
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [data, setData] = useState(location.state?.searchResults || []);
  const [loading, setLoading] = useState(!location.state?.searchResults);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!location.state?.searchResults) {
      const fetchDishes = async () => {
        try {
          const dishes = await DishService.getDishes();
          setData(dishes);
        } catch (error) {
          setError(error);
        } finally {
          setLoading(false);
        }
      };

      fetchDishes();
    } else {
      setLoading(false);
    }
  }, [location.state]);

  const handleSearch = async (value) => {
    setSearchTerm(value);
    setLoading(true);
    try {
      const searchResults = await DishService.searchDishes(value);
      setData(searchResults);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spin tip="Loading..." />;
  }

  if (error) {
    return <Alert message="Error" description="Failed to fetch dishes." type="error" showIcon />;
  }

  return (
    <div style={{ padding: "20px", flex: 1 }}>
      <h2 style={{ marginBottom: 20 }}>{t('list_food')}</h2>
      <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Select defaultValue="Sort by" style={{ width: 120 }}>
          <Option value="asc">A-Z</Option>
          <Option value="desc">Z-A</Option>
        </Select>
        <Search
          placeholder={t("search_placeholder")}
          onSearch={handleSearch}
          style={{ width: 300 }}
        />
      </div>
      <p>{t('searching_for')}: <b>{searchTerm}</b></p> {/* Display the search term */}
      <Row gutter={[16, 16]}>
        {data.map((food, index) => (
          <Col key={index} xs={24} sm={12} md={8} lg={6}>
            <FoodCard
              id={food.id}
              name={food.name}
              description={food.description}
              img_path={food.img_path}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ListFoodPage;