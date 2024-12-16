import PropTypes from "prop-types"; // Import PropTypes
import { Card } from "antd";
import { HeartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const FoodCard = ({ id, name, description, img_path }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/food-detail/${id}`);
  };

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
          <HeartOutlined style={{ fontSize: 20, cursor: "pointer" }} />
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
};

export default FoodCard;