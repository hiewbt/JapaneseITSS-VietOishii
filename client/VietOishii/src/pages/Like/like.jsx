import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import Col from 'antd/es/grid/col';
import axios from 'axios';
import FoodLikeCard from '../../components/FoodCard/FoodLikeCard';
const API_URL = `${import.meta.env.VITE_API_URL}`;

const LikePage = () => {
  const { t } = useTranslation();
  const [dishes, setDishes] = useState([]);

  useEffect(() => {
    const fetchLikedDishes = async () => {
      try {
        const response = await axios.get(`${API_URL}/liked_dishes`, { withCredentials: true });
        setDishes(response.data);
      } catch (error) {
        console.error('Failed to fetch liked dishes:', error);
      }
    };

    fetchLikedDishes();
  }, []);

  return (
    <div>
      <PageHeader>{t('favorite food list')}</PageHeader>
      <DishesContainer>
        {dishes.map(dish => (
            <Col key={dish.id} xs={24} sm={12} md={8} lg={6} style={{ display: 'flex', justifyContent: 'center' , marginTop: 25 , marginBottom: 25 }}>
          <FoodLikeCard key={dish.id} {...dish} />
          </Col>
        ))}
      </DishesContainer>
    </div>
  );
};

const PageHeader = styled.div`
  margin-top: 40px;
  text-align: center;
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 34px;
  background: linear-gradient(to right, #e4003a, #ff9c73);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const DishesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
`;

export default LikePage;