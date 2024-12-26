import { Button, Card, Rate, Typography, Row, Col, Spin, Alert, Input } from "antd";
import {ArrowLeftOutlined,UserOutlined } from "@ant-design/icons";
import DishService from "../../services/DishService";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import axios from 'axios';
import styled from "@emotion/styled";
const { Paragraph, Title, Text } = Typography;

const FoodDetail = () => {
  const [userReviews, setUserReviews] = useState([]);
  const [dishDetail, setDishDetail] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewContent, setReviewContent] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const { id } = useParams();
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

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/get_comments`, {
          dish_id: id,
        });
        let myData = response.data;
        console.log(myData);
        setUserReviews(response.data);
      } catch (error) {
        console.error('Error fetching user reviews:', error);
      }
    };

    fetchUserReviews();
  }, [id]);

  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleAddReview = () => {
    setShowReviewForm(true);
  };

  const handleReviewSubmit = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/comment`, {
        dish_id: parseInt(id),
        content: reviewContent,
        stars: reviewRating,
      }, {
        withCredentials: true,
      });
      setUserReviews([...userReviews, response.data]);
      setReviewContent('');
      setReviewRating(0);
      setShowReviewForm(false);
      // const reviewData = {
      //   dish_id: parseInt(id),
      //   content: reviewContent,
      //   stars: reviewRating,
      // };
    
      // console.log('Review Data:', reviewData);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

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
    <PageContainer>
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
              <Paragraph style={{fontSize: 18}}>{dishDetail.description}</Paragraph>
              <div style={{ marginTop: "30px", borderRadius: "8px" }}>
                <Title level={4} style={{ borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>{t('ingredients')}</Title>
                <Paragraph style={{fontSize: 18}}>
                  {dishDetail.ingredients}
                </Paragraph>
              </div>
              <div style={{ marginTop: "30px", borderRadius: "8px" }}>
                <Title level={4} style={{ borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>{t('flavors')}</Title>
                <Paragraph style={{fontSize: 18}}>
                  {dishDetail.flavor}
                </Paragraph>
              </div>
            </Col>
          </Row>
          <div style={{ marginTop: "30px", padding: "20px", background: "#fafafa", borderRadius: "8px" }}>
            <Title level={4} style={{ borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>{t('similar_japanese_dish')}</Title>
            <Paragraph style={{fontSize: 18}}>
              {dishDetail.similar_japanese_dish}
            </Paragraph>
          </div>

          {/* Ratings Section */}
          <div style={{ marginTop: "30px", padding: "20px", background: "#f9f9f9", borderRadius: "8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>
            <Title level={4} style={{ margin: 0 }}>{t('review')}</Title>
            <Button type="primary" onClick={handleAddReview} style={{ marginTop: '20px' }}>
              Thêm
            </Button>
          </div>
          {showReviewForm && (
            <div style={{ marginTop: '20px' }}>
              <Input.TextArea
                rows={4}
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
                placeholder="Nhập nội dung đánh giá"
              />
              <Rate
                value={reviewRating}
                onChange={(value) => setReviewRating(value)}
                style={{ marginTop: '10px' }}
              />
              <Button type="primary" onClick={handleReviewSubmit} style={{ marginTop: '10px' }}>
                Gửi đánh giá
              </Button>
            </div>
          )}
            
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
                  <Text style={{ flex: 1, fontWeight: "bold" }}>{user.username}</Text>
                  <Rate disabled defaultValue={user.stars} />
                </div>
                <Paragraph style={{ marginLeft: "30px", color: "gray" }}>
                  {user.content}
                </Paragraph>
                {user.image && <img src={user.image} alt="Review" style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }} />}
              </div>
            ))}
          </div>
          
        </Card>
      </div>
    </div>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  font-size: 20px; 
`;

export default FoodDetail;