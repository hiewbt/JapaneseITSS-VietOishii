import {useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Tabs, Row, Card, Button, Input, Carousel, Modal } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";
import { useTranslation } from 'react-i18next';
import { regionData } from "./regionData";
import FilterComponent from "../../components/Filter/FilterComponent ";
import ArrowLeftCircle from "../../assets/arrow-left-circle-fill.svg";
import ArrowRightCircle from "../../assets/arrow-right-circle-fill.svg";
import DishService from '../../services/DishService';


const { Content } = Layout;

const Home = () => {
  const { t } = useTranslation();
  const regions = Object.keys(regionData);
  const carouselRef = useRef([]);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (value) => {
    try {
      const searchResults = await DishService.searchDishes(value);
      navigate('/list-food', { state: { searchResults, searchTerm: value } });
    } catch (error) {
      console.error('Error searching dishes:', error);
    }
  };

  return (
    <Layout>
      <Content style={{ minHeight: "100vh", background: "#fff" }}>
        <Container>
          <PageHeader>{t('explore_dishes')}</PageHeader>

          <Row justify="center" align="middle" style={{ marginBottom: 32 }}>
            <FilterButton
              icon={<SearchOutlined />}
              style={{ marginRight: 16 }}
              size="large"
              onClick={() => setIsFilterVisible(true)}
            >
              {t('filter')}
            </FilterButton>
            <StyledSearch
              placeholder={t('search_placeholder')}
              onSearch={handleSearch}
              style={{ width: 400 }}
              size="large"
            />
          </Row>
          <StyledModal 
            open={isFilterVisible}
            onCancel={() => setIsFilterVisible(false)}
            footer={null}
            width={1000}
          >
            <FilterComponent />
          </StyledModal>

          <PageHeader>{t('explore_taste')}</PageHeader>
          <StyledTabs
            defaultActiveKey="Hokkaido"
            centered
            size="large"
          >
            {regions.map((region, idx) => (
              <Tabs.TabPane tab={region} key={region}>
                <TabContent>
                  <div style={{ display: "flex", marginBottom: 32 }}>
                    <RegionImage
                      src={regionData[region].image}
                      alt={regionData[region].name}
                    />
                    <RegionInfo>
                      <h2>{regionData[region].name}</h2>
                      <ul>
                        <li>
                          <p>
                            <strong>Đặc điểm:</strong>{" "}
                            {regionData[region].characteristics}
                          </p>
                        </li>
                        <li>
                          <p>
                            <strong>Khẩu vị:</strong> {regionData[region].taste}
                          </p>
                        </li>
                      </ul>
                    </RegionInfo>
                  </div>

                  <CarouselContainer>
                    <NavButton
                      className="prev"
                      icon={
                        <img
                          src={ArrowLeftCircle}
                          alt="Previous"
                          style={{
                            width: "24px",
                            height: "24px",
                          }}
                        />
                      }
                      onClick={() => carouselRef.current[idx]?.prev()}
                    />

                    <Carousel
                      ref={(el) => (carouselRef.current[idx] = el)} 
                      key={region} 
                      slidesToShow={2}
                      dots={false}
                      infinite={true}
                      style={{ margin: "0 40px" }}
                    >
                      {regionData[region].dishes?.map((dish, index) => (
                        <div key={index} style={{ padding: "16px 32px" }}>
                          <FoodCard
                            hoverable
                            style={{
                              margin: "0 16px",
                              width: "calc(100% - 32px)",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center" }}>
                              <img
                                src={dish.image}
                                alt={dish.name}
                                style={{
                                  width: 140,
                                  height: 140,
                                  marginRight: 20,
                                  borderRadius: 8,
                                  objectFit: "cover",
                                }}
                              />
                              <div>
                                <h3>{dish.name}</h3>
                                <p>
                                  ⭐ {dish.rating} ❤️ {dish.likes}
                                </p>
                              </div>
                            </div>
                          </FoodCard>
                        </div>
                      ))}
                    </Carousel>

                    <NavButton
                      className="next"
                      icon={
                        <img
                          src={ArrowRightCircle}
                          alt="Next"
                          style={{
                            width: "24px",
                            height: "24px",
                          }}
                        />
                      }
                      onClick={() => carouselRef.current[idx]?.next()}
                    />
                  </CarouselContainer>
                </TabContent>
              </Tabs.TabPane>
            ))}
          </StyledTabs>
        </Container>
      </Content>
    </Layout>
  );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  background: #fff;
`;

const PageHeader = styled.div`
  text-align: center;
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 34px;
  background: linear-gradient(to right, #e4003a, #ff9c73);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const TabContent = styled.div`
  background: #fff;
  padding: 24px;
  border: 2px solid #f0f0f0;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
`;

const FoodCard = styled(Card)`
  width: 100%;
  border-radius: 8px;
  transition: all 0.3s ease;
  border: 2px solid #f5f5f5;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(228, 0, 58, 0.08);
  }
`;

const RegionImage = styled.img`
  width: 500px;
  height: 350px;
  object-fit: cover;
  border-radius: 12px;
  margin-right: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

const RegionInfo = styled.div`
  flex: 1;
  justify-content: center;
  color: #333;

  h2 {
    font-size: 24px;
    margin-bottom: 16px;
    color: #111;
  }

  ul {
    padding-left: 20px;
    li {
      margin-bottom: 12px;
      line-height: 1.6;

      strong {
        color: #111;
      }
    }
  }
`;

const CarouselContainer = styled.div`
  position: relative;
  margin: 20px 0;
  .ant-carousel {
    padding: 0 20px;
  }
  .slick-slide {
    padding: 0 12px;
  }
`;

const NavButton = styled(Button)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  background: transparent !important;
  border: none;
  box-shadow: none;
  &:hover {
    background: transparent !important;
  }
  &.prev {
    left: 0;
  }
  &.next {
    right: 0;
  }
  &::after {
    display: none !important;
  }
`;
const StyledTabs = styled(Tabs)`
  .ant-tabs-tab {
    color: #333;
    font-size: 16px;
    transition: all 0.3s ease;

    &:hover {
      color: #E4003A !important;
    }
  }

  .ant-tabs-tab.ant-tabs-tab-active {
    .ant-tabs-tab-btn {
      color: #E4003A !important;
    }
  }

  .ant-tabs-ink-bar {
    background: #E4003A !important;
  }
`;

const StyledSearch = styled(Input.Search)`
  .ant-input {
    border-radius: 4px;
    &:hover, &:focus {
      border-color: #E4003A !important;
    }
  }
  
  .ant-input-search-button {
    background: #fff;
    border-color: #d9d9d9;
    color: #333;
    transition: all 0.3s ease;

    &:hover {
      color: #E4003A !important;
      border-color: #E4003A !important;
      background: rgba(228, 0, 58, 0.05) !important;
    }
  }
`;

const FilterButton = styled(Button)`
  background: #fff;
  border-color: #d9d9d9;
  color: #333;
  transition: all 0.3s ease;

  &:hover {
    color: #E4003A !important;
    border-color: #E4003A !important;
    background: rgba(228, 0, 58, 0.05) !important;
  }
`;
const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 12px;
  }
  
  .ant-modal-header {
    border-bottom: 1px solid #f0f0f0;
    padding: 16px 24px;
    border-radius: 12px 12px 0 0;
  }

  .ant-modal-body {
    padding: 24px;
  }
`;

export default Home;
