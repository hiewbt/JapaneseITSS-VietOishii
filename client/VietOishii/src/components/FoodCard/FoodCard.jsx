import PropTypes from "prop-types"; // Import PropTypes
import { Card} from "antd";
import { HeartOutlined } from "@ant-design/icons";

const FoodCard = ({ name, description,}) => {
  return (
    <Card
      hoverable
      style={{ width: 240 }}
      cover={<div style={{ height: 150, background: "#f0f0f0" }} />}
    >
      <Card.Meta title={name} description={description} />
      <div style={{ marginTop: 10 }}>
      </div>
      <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <HeartOutlined style={{ fontSize: 20, cursor: "pointer" }} />
      </div>
    </Card>
  );
};

FoodCard.propTypes = {
  name: PropTypes.string.isRequired, 
  description: PropTypes.string.isRequired, 
  flavor: PropTypes.string.isRequired, 
  ingredients: PropTypes.string.isRequired, 
  similarJapaneseDish: PropTypes.string.isRequired, 
};

export default FoodCard;