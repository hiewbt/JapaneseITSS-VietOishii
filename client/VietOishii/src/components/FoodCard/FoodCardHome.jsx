import PropTypes from "prop-types";
import { Card} from "antd";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from 'axios';
import styled from "@emotion/styled";
import { useTranslation } from "react-i18next";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";

const API_URL = `${import.meta.env.VITE_API_URL}`;

const FoodCardHome = ({ dish, isLike }) => {
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [userReviews, setUserReviews] = useState([]);
  const [averageStars, setAverageStars] = useState(5); 
  const { i18n } = useTranslation();
  const handleCardClick = () => {
    navigate(`/food-detail/${dish.id}`);
  };

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        const response = await axios.post(`${API_URL}/get_comments`, {
          dish_id: dish.id,
        });
        let myData = response.data;
        console.log(myData);
        setUserReviews(myData);

        if (myData.length > 0) {
          const totalStars = myData.reduce((acc, review) => acc + review.stars, 0);
          const average = totalStars / myData.length;
          setAverageStars(average.toFixed(1));
        } else {
          setAverageStars(5.0.toFixed(1)); 
        }
      } catch (error) {
        console.error('Error fetching user reviews:', error);
      }
    };

    fetchUserReviews();
  }, [dish.id]);
  const getLocalizedText = (text) => {
    const [viText, jpText] = text.split('|');
    return i18n.language === 'vi' ? viText : jpText;
  };
  return (
    <StyledCard
      hoverable
      style={{
        margin: "0 16px",
        width: "calc(100% - 32px)",
      }}
      onClick={handleCardClick}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src={dish.img_path}
          alt={dish.name}
          style={{
            width: 140,
            height: 140,
            marginRight: 20,
            borderRadius: 8,
            objectFit: "cover",
          }}
        />
        <div style={{ flex: 1 }}>
          <h3>{getLocalizedText(dish.name)}</h3>
          
          <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
            <span>⭐ {averageStars}</span>
            <div style={{ marginLeft:20 ,display: "flex", alignItems: "center" }}>
              {isLike ? (
                <HeartFilled style={{ fontSize: 20, color: "red" }} />
              ) : (
                <HeartOutlined style={{ fontSize: 20, cursor: "pointer" }} />
              )}
              <span style={{ marginLeft: 5, fontSize: '18px' }}>{dish.num_likes + 105}</span>
            </div>
          </div>
        </div>
      </div>
    </StyledCard>
  );
};

FoodCardHome.propTypes = {
  dish: PropTypes.shape({
    id: PropTypes.number.isRequired,
    img_path: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    num_likes: PropTypes.number.isRequired,
  }).isRequired,
    isLike: PropTypes.bool.isRequired,
};

const StyledCard = styled(Card)`
  width: 100%;
  font-size: 18px;
  border-radius: 8px;
  transition: all 0.3s ease;
  border: 2px solid #f5f5f5;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(228, 0, 58, 0.08);
  }
`;

export default FoodCardHome;