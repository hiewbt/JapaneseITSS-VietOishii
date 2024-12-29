import PropTypes from "prop-types"; // Import PropTypes
import { Card, Rate } from "antd";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from 'axios';
const API_URL = `${import.meta.env.VITE_API_URL}`;

const FoodCard = ({ id, name, description, img_path, num_likes, isLike }) => {
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [userReviews, setUserReviews] = useState([]);
  const [averageStars, setAverageStars] = useState(5); 

  const handleCardClick = () => {
    navigate(`/food-detail/${id}`);
  };

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        const response = await axios.post(`${API_URL}/get_comments`, {
          dish_id: id,
        });
        let myData = response.data;
        console.log(myData);
        setUserReviews(myData);

        if (myData.length > 0) {
          const totalStars = myData.reduce((acc, review) => acc + review.stars, 0);
          const average = totalStars / myData.length;
          setAverageStars(average);
        } else {
          setAverageStars(5); 
        }
      } catch (error) {
        console.error('Error fetching user reviews:', error);
      }
    };
    fetchUserReviews();
  }, [id]);

  return (
    <>
      <Card
        hoverable
        style={{ width: 240 }}
        cover={<img alt={name} src={img_path} style={{ height: 150, objectFit: "cover" }} />}
        onClick={handleCardClick}
      >
        <Card.Meta 
          title={<span style={{ fontSize: '18px' }}>{name}</span>} 
          description={<span style={{ fontSize: '16px' }}>{description}</span>} 
        />
        <div style={{ marginTop: 10 }}></div>
        <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Rate disabled allowHalf value={averageStars} />
          <div style={{ display: "flex", alignItems: "center" }}>
            {isLike ? (
              <HeartFilled style={{ fontSize: 20, color: "red" }} />
            ) : (
              <HeartOutlined style={{ fontSize: 20, cursor: "pointer" }} />
            )}
            <span style={{ marginLeft: 5 }}>{num_likes ?? 0}</span>
          </div>
        </div>
      </Card>
    </>
  );
};

FoodCard.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  img_path: PropTypes.string,
  num_likes: PropTypes.number,
  isLike: PropTypes.number.isRequired,
};

export default FoodCard;