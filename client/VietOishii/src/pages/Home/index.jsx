import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Tabs, Row, Button, Input, Carousel, Modal } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";
import { useTranslation } from 'react-i18next';
import { regionData } from "./regionData";
import FilterComponent from "../../components/Filter/FilterComponent";
import ArrowLeftCircle from "../../assets/arrow-left-circle-fill.svg";
import ArrowRightCircle from "../../assets/arrow-right-circle-fill.svg";
import DishService from '../../services/DishService';
import FoodCard from '../../components/FoodCard/FoodCardHome';
import axios from 'axios';
const API_URL = `${import.meta.env.VITE_API_URL}`;
const { Content } = Layout;

const Home = () => {
  const { t, i18n } = useTranslation();
  const regions = Object.keys(regionData);
  const carouselRef = useRef([]);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [dishesByRegion, setDishesByRegion] = useState({});
  const [likedDishes, setLikedDishes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDishesByRegion = async () => {
      const dishes = {};
      for (const region of regions) {
        try {
          const regionResults = await DishService.getDishesByRegion(region);
          dishes[region] = regionResults;
        } catch (error) {
          console.error(`Error fetching dishes for region ${region}:`, error);
        }
      }
      setDishesByRegion(dishes);
    };

    if (Object.keys(dishesByRegion).length === 0) {
      fetchDishesByRegion();
    }
  }, [regions, dishesByRegion]);
  useEffect(() => {
    const fetchLikedDishes = async () => {
      try {
        const response = await axios.get(`${API_URL}/liked_dishes`, {
          params: { language: i18n.language },
          withCredentials: true,
        });
        setLikedDishes(response.data);
      } catch (error) {
        console.error('Failed to fetch liked dishes:', error);
      }
    };

    fetchLikedDishes();
  }, [i18n.language]);

  const handleSearch = async (value) => {
    try {
      const searchResults = await DishService.searchDishes(value);
      navigate('/list-food', { state: { searchResults, searchTerm: value } });
    } catch (error) {
      console.error('Error searching dishes:', error);
    }
  };

  const handleFilter = async (filters) => {
    try {
      const filteredResults = await DishService.filterDishes(filters);
      localStorage.setItem('appliedFilters', JSON.stringify(filters)); // Save filters
      navigate('/list-food', { 
        state: { 
          filteredResults, 
          filters,
          fromHome: true 
        } 
      });
    } catch (error) {
      console.error('Error filtering dishes:', error);
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
            <FilterComponent onFilter={handleFilter}/>
          </StyledModal>

          <PageHeader style={{ marginTop: 50 }}>{t('explore_taste')}</PageHeader>
          <StyledTabs
            defaultActiveKey="Hokkaido"
            centered
            size="large"
          >
            {regions.map((region, idx) => (
              <Tabs.TabPane tab={regionData[region].name[i18n.language]} key={region}>
                <TabContent>
                  <div style={{ display: "flex", marginBottom: 32, justifyContent: "center" }}>
                    <RegionImage
                      src={regionData[region].image}
                      alt={regionData[region].name[i18n.language]}
                    />
                    <RegionInfo>
                      <h2 style={{ fontSize: "28px", fontWeight: "bold" }}>{regionData[region].name[i18n.language]}</h2>
                      <ul>
                        <li>
                          <p>
                            <strong>{t('Dac_diem')}:</strong>{" "}
                            {regionData[region].characteristics[i18n.language]}
                          </p>
                        </li>
                        <li>
                          <p>
                            <strong>{t('Khau_vi')}:</strong> {regionData[region].taste[i18n.language]}
                          </p>
                        </li>
                      </ul>
                    </RegionInfo>
                  </div>
                  <div style={{ textAlign: "center", fontSize: "26px", fontWeight: "bold" }}>{t('de_xuat_mon_an_hop_khau_vi')}</div>
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
                      {dishesByRegion[region]?.map((dish, index) => (
                        <div key={index} style={{ padding: "16px 32px" }}>
                          <FoodCard dish={dish}
                          isLike={likedDishes.some(likedDish => likedDish.id === dish.id)} />
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
  font-size: 20px;
  padding: 24px;
  border: 2px solid #f0f0f0;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
`;

const RegionImage = styled.img`
  width: 500px;
  height: 380px;
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
    font-size: 26px;
    margin-bottom: 16px;
    color: #111;
  }

  ul {
    padding-left: 20px;
    li {
      font-size: 16px;
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
  font-size: 20px;
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
  &:active {
    background: rgba(228, 0, 58, 0.1) !important;
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