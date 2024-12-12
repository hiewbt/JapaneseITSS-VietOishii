import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { Select, Input, Row, Col, Spin, Alert, Modal, Button, Typography } from 'antd';
import { SearchOutlined } from "@ant-design/icons";
import FoodCard from '../../components/FoodCard/FoodCard';
import styled from "@emotion/styled";
import DishService from '../../services/DishService';
import FilterComponent from "../../components/Filter/FilterComponent ";

const { Option } = Select;
const { Search } = Input;
const { Title } = Typography;

const ListFoodPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const initialSearchTerm = location.state?.searchTerm || '';
  const initialFilters = location.state?.filters || {};
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [filters, setFilters] = useState(initialFilters);
  const [searchResults, setSearchResults] = useState(location.state?.searchResults || []);
  const [filterResults, setFilterResults] = useState([]);
  const [loading, setLoading] = useState(!location.state?.searchResults);
  const [error, setError] = useState(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  useEffect(() => {
    if (!location.state?.searchResults) {
      const fetchDishes = async () => {
        try {
          const dishes = await DishService.getDishes();
          setSearchResults(dishes);
        } catch (error) {
          setError(error);
        } finally {
          setLoading(false);
        }
      };

      fetchDishes();
    } else {
      setLoading(false);
    }
  }, [location.state]);

  const handleSearch = async (value) => {
    setSearchTerm(value);
    setFilters({});
    setFilterResults([]);
    setLoading(true);
    try {
      const results = await DishService.searchDishes(value);
      setSearchResults(results);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async (filters) => {
    setFilters(filters);
    setSearchTerm('');
    setSearchResults([]);
    setLoading(true);
    try {
      const results = await DishService.filterDishes(filters);
      setFilterResults(results);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
      setIsFilterVisible(false);
    }
  };

  const renderFilterCriteria = () => {
    const filterKeys = Object.keys(filters);
    if (filterKeys.length === 0) return null;

    return (
      <div>
        {filterKeys.map((key) => (
          <span key={key}>
            {t(key)}: <b>{filters[key].join(', ')}</b>,{' '}
          </span>
        ))}
      </div>
    );
  };

  const dataToDisplay = searchTerm ? searchResults : filterResults.length > 0 ? filterResults : searchResults;

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
    <div style={{ padding: "20px", flex: 1 }}>
      <Header level={2}>{t('list_food')}</Header>
      <div style={{ 
        marginBottom: 20, 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        gap: "16px", 
        flexWrap: "wrap" 
      }}>
        <SelectWrapper defaultValue={t("sort_by")}>
          <Option value="asc">A-Z</Option>
          <Option value="desc">Z-A</Option>
        </SelectWrapper>
        <FilterButton
          icon={<SearchOutlined />}
          size="large"
          onClick={() => setIsFilterVisible(true)}
        >
          {t('filter')}
        </FilterButton>
        <StyledSearch
          placeholder={t("search_placeholder")}
          onSearch={handleSearch}
          style={{ width: 350 }}
        />
        {(searchTerm || Object.keys(filters).length > 0) && (
          <p style={{ textAlign: "center", margin: "0 16px" }}>
            {searchTerm && (
              <>
                {t('searching_for')}: <b>{searchTerm}</b>
              </>
            )}
            {Object.keys(filters).length > 0 && (
              <>
                {renderFilterCriteria()}
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
      
      <Row gutter={[16, 16]} style ={{margin: "20 20px", marginLeft: "150px"}}>
        {dataToDisplay.map((food, index) => (
          <Col key={index} xs={24} sm={12} md={8} lg={6}>
            <FoodCard
              id={food.id}
              name={food.name}
              description={food.description}
              img_path={food.img_path}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`;
const Header = styled(Title)`
  text-align: center;
  margin-bottom: 32px !important;
  color: #E4003A !important;
  margin-top: 20px;
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