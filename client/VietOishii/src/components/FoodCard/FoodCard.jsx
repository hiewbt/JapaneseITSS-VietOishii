
import PropTypes from "prop-types"; // Import PropTypes
import { Card, Tag, Rate } from "antd";
import { HeartOutlined } from "@ant-design/icons";

const FoodCard = ({ name, tags, rating }) => {
  return (
    <Card
      hoverable
      style={{ width: 240 }}
      cover={<div style={{ height: 150, background: "#f0f0f0" }} />}
    >
      <Card.Meta title={name} />
      <div style={{ marginTop: 10 }}>
        {tags.map((tag, index) => (
          <Tag key={index} color="blue">
            {tag}
          </Tag>
        ))}
      </div>
      <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Rate disabled defaultValue={rating} allowHalf />
        <HeartOutlined style={{ fontSize: 20, cursor: "pointer" }} />
      </div>
    </Card>
  );
};

// Add PropTypes validation
FoodCard.propTypes = {
  name: PropTypes.string.isRequired, // `name` is a required string
  tags: PropTypes.arrayOf(PropTypes.string).isRequired, // `tags` is an array of strings
  rating: PropTypes.number.isRequired, // `rating` is a required number
};

export default FoodCard;
