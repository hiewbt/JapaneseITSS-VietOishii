import PropTypes from "prop-types"; // Import PropTypes
import { Card, Rate, notification, Tag } from "antd";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

const FoodCard = ({
  id,
  name,
  img_path,
  num_likes,
  isLike,
  rating,
  region,
  description,
}) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(isLike);
  const [likes, setLikes] = useState(num_likes);
  const { t } = useTranslation();

  const handleCardClick = () => {
    navigate(`/food-detail/${id}`);
  };

  const handleLikeDish = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/like`,
        {
          dish_id: id,
        },
        {
          withCredentials: true,
        }
      );
      setLiked(true);
      setLikes(likes + 1);
      notification.success({
        message: t("success"),
        description: t("added_to_favorites"),
      });
    } catch (error) {
      console.error("Error liking dish:", error);
      notification.error({
        message: t("error"),
        description: t("failed_to_add_to_favorites"),
      });
    }
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    handleLikeDish();
  };

  return (
    <>
      <Card
        hoverable
        style={{
          width: 340,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
        cover={
          <img
            alt={name}
            src={img_path}
            style={{ height: 160, objectFit: "cover" }}
          />
        }
        onClick={handleCardClick}
      >
        <div style={{ textAlign: "center" }}>
          <Card.Meta
            title={<span style={{ fontSize: "22px" }}>{name}</span>}
            style={{ marginBottom: 20 }}
            description={
              <span style={{ fontSize: '18px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {description}
              </span>
            }
          />
        </div>

        {region.split("/").map((region, index) => (
          <Tag color="red" style={{ fontSize: 18 }} key={index}>
            {region.trim()}
          </Tag>
        ))}

        <div
          style={{
            marginTop: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <Rate disabled allowHalf value={rating} />
            <span style={{ marginLeft: 5, fontSize: "18px" }}>
              {rating.toFixed(1)}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            {liked ? (
              <HeartFilled style={{ fontSize: 20, color: "red" }} />
            ) : (
              <HeartOutlined
                style={{ fontSize: 20, cursor: "pointer" }}
                onClick={handleLikeClick}
              />
            )}
            <span style={{ marginLeft: 5, fontSize: "18px" }}>
              {likes ?? 0}
            </span>
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
  region: PropTypes.string.isRequired,
};

export default FoodCard;
