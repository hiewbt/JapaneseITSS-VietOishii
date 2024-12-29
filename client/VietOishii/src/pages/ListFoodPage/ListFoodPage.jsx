import  { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { Select, Input, Row, Col, Spin, Alert, Modal, Button, Typography } from 'antd';
import { SearchOutlined } from "@ant-design/icons";
import FoodCard from '../../components/FoodCard/FoodCard';
import styled from "@emotion/styled";
import axios from 'axios';
import DishService from '../../services/DishService';
import FilterComponent from "../../components/Filter/FilterComponent ";
const API_URL = `${import.meta.env.VITE_API_URL}`;
const { Search } = Input;
const { Title } = Typography;

const ListFoodPage = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  
  const getInitialSearchTerm = () => {
    return location.state?.searchTerm || localStorage.getItem('searchTerm') || '';
  };

  const getInitialFilters = () => {
    const savedFilters = localStorage.getItem('filters');
    return savedFilters ? JSON.parse(savedFilters) : {};
  };

  const [searchTerm, setSearchTerm] = useState(getInitialSearchTerm());
  const [filters, setFilters] = useState(getInitialFilters());
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [likedDishes, setLikedDishes] = useState([]);

  const getLocalizedText = (text) => {
    const [viText, jpText] = text.split('|');
    return i18n.language === 'vi' ? viText : jpText;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams(location.search);
        const categorical = params.get('categorical');
        let results = [];

        const categoricalResults = categorical 
          ? (await axios.get(`${API_URL}/by_category/${encodeURIComponent(categorical)}`)).data 
          : [];
        const searchResults = searchTerm 
          ? (await DishService.searchDishes(searchTerm)).data 
          : [];
        const filterResults = Object.keys(filters).length > 0 ? await DishService.filterDishes(filters) : [];

        if (categoricalResults.length > 0) {
          results = categoricalResults;
          if (searchResults.length > 0) {
            results = results.filter(dish => searchResults.some(searchDish => searchDish.id === dish.id));
          }
          if (filterResults.length > 0) {
            results = results.filter(dish => filterResults.some(filterDish => filterDish.id === dish.id));
          }
        } else if (searchResults.length > 0) {
          results = searchResults;
          if (filterResults.length > 0) {
            results = results.filter(dish => filterResults.some(filterDish => filterDish.id === dish.id));
          }
        } else if (filterResults.length > 0) {
          results = filterResults;
        } else {
          results = await DishService.getDishes(); // Lấy danh sách mặc định
        }

        setData(results);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchTerm, filters, location]);

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

  useEffect(() => {
    localStorage.setItem('searchTerm', searchTerm);
    localStorage.setItem('filters', JSON.stringify(filters));
  }, [searchTerm, filters]);

  const handleSearch = async (value) => {
    setSearchTerm(value);
  };

  const handleFilter = async (filters) => {
    setFilters(filters);
    setIsFilterVisible(false);
  };

  const resetFilters = async () => {
    const params = new URLSearchParams(location.search);
    const categorical = params.get('categorical');
    setSearchTerm('');
    setFilters({});
    setLoading(true);
    try {
      const results = categorical 
        ? (await axios.get(`${API_URL}/by_category/${encodeURIComponent(categorical)}`)).data 
        : await DishService.getDishes(); // Lấy danh sách mặc định
      setData(results);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Spin size="large" tip={t('loading')} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert message={t('error')} description={t('failed_to_fetch_dishes')} type="error" showIcon />
      </Container>
    );
  }

  return (
    <Container>
      <Header level={2}>{t('list_food')}</Header>
      <div style={{ 
        marginBottom: 20, 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        gap: "16px", 
        flexWrap: "wrap" 
      }}>
        <ResetButton type="primary" onClick={resetFilters}>{t("reset")}</ResetButton>
        <SelectWrapper defaultValue={t("sort_by")}>
        </SelectWrapper>
       
        <StyledSearch
          placeholder={t("search_placeholder")}
          onSearch={handleSearch}
          style={{ width: 350 }}
        />
         <FilterButton
          icon={<SearchOutlined />}
          size="large"
          onClick={() => setIsFilterVisible(true)}
        >
          {t('filter')}
        </FilterButton>
        {(searchTerm || Object.keys(filters).length > 0) && (
          <p style={{ textAlign: "center", margin: "0 16px" }}>
            {searchTerm && (
              <>
                {t('searching_for')}: <b>{searchTerm}</b> ,{' '}
              </>
            )}
            {Object.keys(filters).length > 0 && (
              <>
                {Object.keys(filters).map((key) => (
                  <span key={key}>
                    {t(key)}: <b>{filters[key].join(', ')}</b>,{' '}
                  </span>
                ))}
              </>
            )}
          </p>
        )}
      </div>
      <StyledModal 
        open={isFilterVisible}
        onCancel={() => setIsFilterVisible(false)}
        footer={null}
        width={1000}
      >
        <FilterComponent onFilter={handleFilter} />
      </StyledModal>
      
      <Row gutter={[16, 16]} style={{  marginTop: 50 ,  minWidth: 1600 }}>
        {data.map((food, index) => (
          <Col key={index} xs={24} sm={12} md={8} lg={6} style={{ display: 'flex', justifyContent: 'center' , marginTop: 25 }}>
            <FoodCard
              id={food.id}
              name={getLocalizedText(food.name)}
              description={getLocalizedText(food.description)}
              img_path={food.img_path}
              num_likes={food.num_likes}
              isLike={likedDishes.some(dish => dish.id === food.id) ? 1 : 0}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

const Container = styled.div`
  min-width: 1600;
  font-size: 20px;
  margin: 0 auto;
  padding: 24px;
`;
const ResetButton = styled(Button)`
  background: #fff;
  border-color: #d9d9d9;
  color: #333;
  padding: 3px 10px;
  &:hover ,
  &:focus .ant-select-selector {
    color: #E4003A !important;
    border-color: #E4003A !important;
    background: rgba(228, 0, 58, 0.05) !important;
  }
`;
const Header = styled(Title)`
  text-align: center;
  margin-bottom: 32px !important;
  margin-top: 20px;
  background: linear-gradient(to right, #e4003a, #ff9c73);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;
const SelectWrapper = styled(Select)`
  width: 200px;
  &:hover .ant-select-selector,
  &:focus .ant-select-selector {
    color: #E4003A !important;
    border-color: #E4003A !important;
    background: rgba(228, 0, 58, 0.05) !important;
  }
`;
const StyledSearch = styled(Search)`
  .ant-input {
    border-color: #d9d9d9;
    &:hover,
    &:focus {
      border-color: #E4003A !important;
    }
  }
  .ant-btn {
    background: #fff;
    border-color: #d9d9d9;
    color: #333;
    &:hover,
    &:focus {
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
  padding: 3px 10px;
  height: auto;
  transition: all 0.3s ease;

  &:hover,
  &:focus {
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

  .ant-modal-close,
  .ant-modal-close:hover,
  .ant-modal-close:focus {
    color: #E4003A !important;
  }
`;

export default ListFoodPage;