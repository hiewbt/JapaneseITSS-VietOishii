/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Button, Card, Rate, Typography, Row, Col, Spin, Alert, Input, notification, Tag } from "antd";
import { ArrowLeftOutlined, UserOutlined, HeartOutlined, HeartFilled, CameraOutlined } from "@ant-design/icons";
import DishService from "../../services/DishService";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from 'axios';
import styled from "@emotion/styled";
import ImageUploader from '../../components/ImageUploader'; 
import JapanRate from '../../components/JapanRate';
const { Paragraph, Title, Text } = Typography;

const FoodDetail = () => {
  const [userReviews, setUserReviews] = useState([]);
  const [dishDetail, setDishDetail] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewContent, setReviewContent] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewImageUrl, setReviewImageUrl] = useState(''); // State to store uploaded image URL
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likedDishes, setLikedDishes] = useState([]);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

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
    const fetchLikedDishes = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/liked_dishes`, {
          params: { language: i18n.language },
          withCredentials: true,
        });
        setLikedDishes(response.data);
        setLiked(response.data.some(dish => dish.id === parseInt(id)));
      } catch (error) {
        console.error('Failed to fetch liked dishes:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedDishes();
  }, [id, i18n.language]);

  const fetchUserReviews = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/get_comments`, {
        dish_id: id,
        language: i18n.language,
      });
      let myData = response.data;
      console.log(myData);
      setUserReviews(response.data);
    } catch (error) {
      console.error('Error fetching user reviews:', error);
    }
  };

  useEffect(() => {
    fetchUserReviews();
  }, [id, i18n.language]);

  const handleAddReview = () => {
    setShowReviewForm(true);
  };

  const handleReviewSubmit = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/comment`, {
        dish_id: parseInt(id),
        content: reviewContent,
        stars: reviewRating,
        img_url: reviewImageUrl, // Include the uploaded image URL
      }, {
        withCredentials: true,
      });
      setReviewContent('');
      setReviewRating(0);
      setReviewImageUrl(''); // Reset the image URL
      setShowReviewForm(false);
      fetchUserReviews(); // Refetch reviews after submitting
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const handleLikeDish = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/like`, {
        dish_id: id,
      }, {
        withCredentials: true,
      });
      setLiked(true);
      notification.success({
        message: t('success'),
        description: t('added_to_favorites'),
      });
    } catch (error) {
      console.error('Error liking dish:', error);
      notification.error({
        message: t('error'),
        description: t('failed_to_add_to_favorites'),
      });
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

  const getLocalizedText = (text) => {
    const [viText, jpText] = text.split('|');
    return i18n.language === 'vi' ? viText : jpText;
  };

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
            <div className="food_detail_header" style={{ flex: 1, textAlign: "center", fontSize: "24px", fontWeight: "bold" }}>
              {t('food_detail')}
            </div>
          </div>

          <Card style={{ width: "100%" }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
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
                      alt={getLocalizedText(dishDetail.name)}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div style={{ position: "relative" }}>
                  <Title level={2}>{getLocalizedText(dishDetail.name)}</Title>
                  {liked ? (
                    <HeartFilled style={{ position: "absolute", top: 0, right: 0, fontSize: "24px", marginTop: "8px", cursor: "pointer", color: "red" }} />
                  ) : (
                    <HeartOutlined style={{ position: "absolute", top: 0, right: 0, fontSize: "24px", marginTop: "8px", cursor: "pointer" }}
                      onClick={handleLikeDish}
                    />
                  )}
                </div>
                <Paragraph style={{fontSize: 18}}>{getLocalizedText(dishDetail.description)}</Paragraph>
                <div style={{ marginTop: "20px", borderRadius: "8px" }}>
                  <Title level={4} style={{ borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>{t('ingredients')}</Title>
                  <Paragraph style={{fontSize: 18}}>
                    {getLocalizedText(dishDetail.ingredients)}
                  </Paragraph>
                </div>
                <div style={{ marginTop: "20px", borderRadius: "8px" }}>
                  <Title level={4} style={{ borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>{t('flavors')}</Title>
                  <Paragraph style={{fontSize: 18}}>
                    {getLocalizedText(dishDetail.flavor)}
                  </Paragraph>
                </div>
                <div style={{ marginTop: "20px", borderRadius: "8px" }}>
                  <Title level={4} style={{ borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>{t('thanh_phan_de_gay_di_ung')}</Title>
                  <Paragraph style={{fontSize: 18}}>
                    {getLocalizedText(dishDetail.allergy)}
                  </Paragraph>
                </div>
                
              </Col>
            </Row>
            <div style={{ marginTop: "20px", padding: "20px", background: "#fafafa", borderRadius: "8px" }}>
                  <Title level={4} style={{ borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>{t('Vung_phu_hop_voi_mon_an')}</Title>
                  {getLocalizedText(dishDetail.region).split('/').map((region, index) => (
                    <Tag color="red" style={{fontSize: 18}} key={index}>
                      {region.trim()}
                    </Tag>
                  ))}
                </div>
            <div style={{ marginTop: "20px", padding: "20px", background: "#fafafa", borderRadius: "8px" }}>
              <Title level={4} style={{ borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>{t('similar_japanese_dish')}</Title>
              <Paragraph style={{fontSize: 18}}>
                {getLocalizedText(dishDetail.similar_japanese_dish)}
              </Paragraph>
            </div>
            {/* Review Section */}
            <div style={{ marginTop: "20px", padding: "20px", textAlign: "center" }}>
            <JapanRate id={dishDetail.id} j_likes={dishDetail.j_likes} j_dislike={dishDetail.j_dislike} />
            </div> 

            {/* Ratings Section */}
            <div style={{ marginTop: "30px", padding: "20px", background: "#f9f9f9", borderRadius: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>
                <Title level={4} style={{ margin: 0 }}>{t('review')}</Title>
                <RedButton type="primary" onClick={handleAddReview} style={{ marginTop: '20px' }}>
                  {t('add_comment')}
                </RedButton>
              </div>
              {showReviewForm && (
                <div style={{ marginTop: '20px' }}>
                  <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <Text style={{ marginRight: '10px' }}>{t('chat_luong_mon_an')} :</Text>
                    <Rate
                      value={reviewRating}
                      onChange={(value) => setReviewRating(value)}
                    />
                  </div>
                  <Input.TextArea
                    rows={4}
                    value={reviewContent}
                    onChange={(e) => setReviewContent(e.target.value)}
                    placeholder={t('nhap_binh_luan_cua_ban')}
                    style={{ borderColor: '#d9d9d9', transition: 'border-color 0.3s' }}
                    onFocus={(e) => e.target.style.borderColor = '#E4003A'}
                    onBlur={(e) => e.target.style.borderColor = '#E4003A'}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                    <ImageUploader onUpload={setReviewImageUrl} /> {/* Use ImageUploader here */}
                    <RedButton type="primary" onClick={handleReviewSubmit}>
                      {t('gui_danh_gia')}
                    </RedButton>
                  </div>
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
                    {getLocalizedText(user.content)}
                  </Paragraph>
                  {user.img_url && <img src={user.img_url} alt="Review" style={{ maxWidth: "100%", maxHeight: "200px", objectFit: "cover" }} />}
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

const RedButton = styled(Button)`
  background-color: #E4003A;
  border-color: #E4003A;
  color: #fff;
  &:hover, &:focus {
    background-color: #ff4d4f !important;
    border-color: #ff4d4f !important;
    color: #fff !important;
  }
`;


export default FoodDetail;