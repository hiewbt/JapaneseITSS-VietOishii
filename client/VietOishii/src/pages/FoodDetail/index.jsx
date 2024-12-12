import { Button, Card, Rate, Typography, Row, Col, Spin, Alert } from "antd";
import {ArrowLeftOutlined,UserOutlined } from "@ant-design/icons";
import DishService from "../../services/DishService";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
const { Paragraph, Title, Text } = Typography;

const FoodDetail = () => {
  const userReviews = [
    { name: "Nguyễn Văn A", rating: 4, comment: "Món ăn rất ngon, hương vị đậm đà." },
    { name: "Trần Thị B", rating: 5, comment: "Thích cách trình bày và nguyên liệu rất tươi!" },
  ];
  const [dishDetail, setDishDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchDishDetail = async () => {
      try {
        setLoading(true);
        const response = await DishService.getDetailDish(id);
        setDishDetail(response);
      } catch (error) {
        console.error("Failed to fetch dish details:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDishDetail();
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px" }}>
        <Alert
          message="Error"
          description="Failed to load dish details"
          type="error"
          showIcon
        />
      </div>
    );
  }

  if (!dishDetail) {
    return (
      <div style={{ padding: "20px" }}>
        <Alert
          message="Not Found"
          description="Dish details not found"
          type="warning"
          showIcon
        />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ padding: "20px", width: "70%" }}>
        <div style={{ display: "flex", marginBottom: "20px", position: "relative" }}>
          <Button 
            icon={<ArrowLeftOutlined />} 
            type="text"
            onClick={() => navigate(-1)}
          >
          </Button>
          <div className="food_detail_header">{t('food_detail')}</div>
        </div>

        <Card style={{ width: "100%" }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <div>
                <div
                  style={{
                    width: "100%",
                    height: "400px",
                    background: "#f0f0f0",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  {dishDetail.img_path && (
                    <img
                      src={dishDetail.img_path}
                      alt={dishDetail.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </div>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <Title level={2}>{dishDetail.name}</Title>
              <Paragraph>{dishDetail.description}</Paragraph>
              <div style={{ marginTop: "30px", borderRadius: "8px" }}>
                <Title level={5} style={{ borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>{t('ingredients')}</Title>
                <Paragraph>
                  {dishDetail.ingredients}
                </Paragraph>
              </div>
              <div style={{ marginTop: "30px", borderRadius: "8px" }}>
                <Title level={5} style={{ borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>{t('flavors')}</Title>
                <Paragraph>
                  {dishDetail.flavor}
                </Paragraph>
              </div>
            </Col>
          </Row>
          <div style={{ marginTop: "30px", padding: "20px", background: "#fafafa", borderRadius: "8px" }}>
            <Title level={5} style={{ borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>{t('similar_japanese_dish')}</Title>
            <Paragraph>
              {dishDetail.similar_japanese_dish}
            </Paragraph>
          </div>

          {/* Ratings Section */}
          <div style={{ marginTop: "30px", padding: "20px", background: "#f9f9f9", borderRadius: "8px" }}>
            <Title level={5} style={{ borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>{t('review')}</Title>
            {userReviews.map((user, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "20px",
                  padding: "10px",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                  <UserOutlined style={{ fontSize: "20px", marginRight: "10px" }} />
                  <Text style={{ flex: 1, fontWeight: "bold" }}>{user.name}</Text>
                  <Rate disabled defaultValue={user.rating} />
                </div>
                <Paragraph style={{ marginLeft: "30px", color: "gray" }}>
                  {user.comment}
                </Paragraph>
              </div>
            ))}
          </div>
          
        </Card>
      </div>
    </div>
  );
};

export default FoodDetail;