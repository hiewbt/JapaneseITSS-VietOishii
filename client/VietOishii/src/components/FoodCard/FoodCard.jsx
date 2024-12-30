import PropTypes from "prop-types"; // Import PropTypes
import { Card, Rate } from "antd";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useState} from 'react';


const FoodCard = ({ id, name, description, img_path, num_likes, isLike, rating }) => {
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [userReviews, setUserReviews] = useState([]);

  const handleCardClick = () => {
    navigate(`/food-detail/${id}`);
  };


  return (
    <>
      <Card
        hoverable
        style={{ width: 340, display: "flex", flexDirection: "column", justifyContent: "space-between" }}
        cover={<img alt={name} src={img_path} style={{ height: 160, objectFit: "cover" }} />}
        onClick={handleCardClick}
      >
        <div>
          <Card.Meta 
            title={<span style={{ fontSize: '22px' }}>{name}</span>} 
            description={<span style={{ fontSize: '18px' }}>{description}</span>} 
          />
        </div>
        <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Rate disabled allowHalf value={rating} />
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
  rating: PropTypes.number,
};

export default FoodCard;