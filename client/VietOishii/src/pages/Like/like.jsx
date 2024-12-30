import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import Col from 'antd/es/grid/col';
import axios from 'axios';
import FoodCard from '../../components/FoodCard/FoodCard';
import { Spin, Alert,} from 'antd';
const API_URL = `${import.meta.env.VITE_API_URL}`;

const LikePage = () => {
  const { t, i18n } = useTranslation();
  const [likedDishes, setLikedDishes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getLocalizedText = (text) => {
    const [viText, jpText] = text.split('|');
    return i18n.language === 'vi' ? viText : jpText;
  };

  useEffect(() => {
    const fetchLikedDishes = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/liked_dishes`, {
          params: { language: i18n.language },
          withCredentials: true,
        });
        setLikedDishes(response.data);
      } catch (error) {
        console.error('Failed to fetch liked dishes:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedDishes();
  }, [i18n.language]);
  if (loading) {
    return (
      <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Spin size="large" tip={t('loading')} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert message={t('error')} description={t('failed_to_fetch_liked_dishes')} type="error" showIcon />
      </Container>
    );
  }

  return (
    <div>
      <PageHeader>{t('favorite food list')}</PageHeader>
      <DishesContainer>
        {likedDishes.map(dish => (
            <Col key={dish.id} xs={24} sm={12} md={8} lg={6} style={{ display: 'flex', justifyContent: 'center' , marginTop: 25 , marginBottom: 25 }}>
          <FoodCard
                          id={dish.id}
                          name={getLocalizedText(dish.name)}
                          description={getLocalizedText(dish.description)}
                          img_path={dish.img_path}
                          num_likes={dish.num_likes+105}
                          isLike={likedDishes.some(dish => dish.id === dish.id) ? 1 : 0}
                        />
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
const Container = styled.div`
  padding: 20px;
`;

export default LikePage;