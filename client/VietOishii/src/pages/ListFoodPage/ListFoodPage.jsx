import { useState, useEffect } from 'react';
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
  const [searchTerm, setSearchTerm] = useState(localStorage.getItem('searchTerm') || '');
  const [filters, setFilters] = useState(JSON.parse(localStorage.getItem('filters')) || {});
  const [data, setData] = useState([]); // Chứa dữ liệu hiển thị
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (searchTerm) {
          const results = await DishService.searchDishes(searchTerm);
          setData(results);
        } else if (Object.keys(filters).length > 0) {
          const results = await DishService.filterDishes(filters);
          setData(results);
        } else {
          const dishes = await DishService.getDishes(); // Lấy danh sách mặc định
          setData(dishes);
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchTerm, filters]);

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

  const resetFilters = () => {
    setSearchTerm('');
    setFilters({});
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
          <Option value="asc">A-Z</Option>
          <Option value="desc">Z-A</Option>
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
      
      <Row gutter={[16, 16]} style={{ justifyContent: "centercenter", marginTop: 50 }}>
        {data.map((food, index) => (
          <Col key={index} xs={24} sm={12} md={8} lg={6} style={{ display: 'flex', justifyContent: 'center' , marginTop: 25 }}>
            <FoodCard
              id={food.id}
              name={food.name}
              description={food.description}
              img_path={food.img_path}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

const Container = styled.div`
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
