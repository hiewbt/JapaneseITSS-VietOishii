import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Select,
  Input,
  Row,
  Col,
  Spin,
  Alert,
  Modal,
  Button,
  Typography,
} from "antd";
import { FilterOutlined } from "@ant-design/icons";
import FoodCard from "../../components/FoodCard/FoodCard";
import styled from "@emotion/styled";
import axios from "axios";
import DishService from "../../services/DishService";
import FilterComponent from "../../components/Filter/FilterComponent";

const API_URL = `${import.meta.env.VITE_API_URL}`;
const { Search } = Input;
const { Title } = Typography;
const { Option } = Select;

const ListFoodPage = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const getInitialSearchTerm = () => {
    return (
      location.state?.searchTerm || localStorage.getItem("searchTerm") || ""
    );
  };

  const getInitialFilters = () => {
    const savedFilters = localStorage.getItem("filters");
    return savedFilters ? JSON.parse(savedFilters) : {};
  };

  const [searchTerm, setSearchTerm] = useState(getInitialSearchTerm());
  const [filters, setFilters] = useState(getInitialFilters());
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [likedDishes, setLikedDishes] = useState([]);
  const [sortOrder, setSortOrder] = useState("default");

  const getLocalizedText = (text) => {
    const [viText, jpText] = text.split("|");
    return i18n.language === "vi" ? viText : jpText;
  };
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categorical = params.get("categorical");
    if (categorical) {
      setSearchTerm("");
      setFilters({});
      localStorage.removeItem('searchTerm'); 
      localStorage.removeItem('filters');
      setLoading(true);
    }
    else {
      setLoading(true);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchData = async () => {
      if (!loading) return;
      try {
        const params = new URLSearchParams(location.search);
        const categorical = params.get('categorical');
        let results = [];
        const categoricalResults = categorical ? (await axios.get(`${API_URL}/by_category/${encodeURIComponent(categorical)}`)).data : [];
        const searchResults = searchTerm ? await DishService.searchDishes(searchTerm) : [];
        const filterResults = Object.keys(filters).length > 0 ? await DishService.filterDishes(filters) : [];

        if (categoricalResults.length > 0) {
          results = categoricalResults;
        } else if (searchResults.length > 0) {
          results = searchResults;
        } else if (filterResults.length > 0) {
          results = filterResults;
        } else {
          const response = await DishService.getDishes();
          results = response || []; // Lấy danh sách mặc định
        }

        if (searchResults.length > 0) {
          results = results.filter(dish => searchResults.some(searchDish => searchDish.id === dish.id));
        }

        if (filterResults.length > 0) {
          results = results.filter(dish => filterResults.some(filterDish => filterDish.id === dish.id));
        }

        // Sắp xếp dữ liệu dựa trên lựa chọn của người dùng
        if (sortOrder === 'rating_desc') {
          results.sort((a, b) => b.rating - a.rating);
        } else if (sortOrder === 'rating_asc') {
          results.sort((a, b) => a.rating - b.rating);
        }

        setData(results);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchTerm, filters, location, sortOrder, loading]);

  useEffect(() => {
    const fetchLikedDishes = async () => {
      try {
        const response = await axios.get(`${API_URL}/liked_dishes`, {
          params: { language: i18n.language },
          withCredentials: true,
        });
        setLikedDishes(response.data);
      } catch (error) {
        console.error("Failed to fetch liked dishes:", error);
      }
    };

    fetchLikedDishes();
  }, [i18n.language]);
  

  useEffect(() => {
    localStorage.setItem("searchTerm", searchTerm);
    localStorage.setItem("filters", JSON.stringify(filters));
  }, [searchTerm, filters]);

  const handleSearch = async (value) => {
    setSearchTerm(value);
    setLoading(true);
  };

  const handleFilter = async (filters) => {
    setFilters(filters);
    setIsFilterVisible(false);
    setLoading(true);
  };

  const handleSortChange = (value) => {
    setSortOrder(value);
    setLoading(true);
  };

  const resetFilters = async () => {
    const params = new URLSearchParams(location.search);
    const categorical = params.get("categorical");
    setSearchTerm("");
    setFilters({});
    localStorage.removeItem('searchTerm'); 
    localStorage.removeItem('filters');
    setLoading(true);
    try {
      let results = [];
      if (categorical) {
        results = (
          await axios.get(
            `${API_URL}/by_category/${encodeURIComponent(categorical)}`
          )
        ).data;
      } else {
        const response = await DishService.getDishes();
        results = response || []; // Lấy danh sách mặc định
      }
      setData(results);
    } catch (error) {
      console.error("Failed to fetch dishes:", error);
      setError(t("failed_to_fetch_dishes"));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <Spin size="large" tip={t("loading")} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert
          message={t("error")}
          description={error.message}
          type="error"
          showIcon
        />
      </Container>
    );
  }

  return (
    <Container>
      <Header level={2}>{t("list_food")}</Header>
      <div
        style={{
          marginBottom: 20,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <ResetButton type="primary" onClick={resetFilters}>
          {t("reset")}
        </ResetButton>
        <SelectWrapper value={sortOrder} onChange={handleSortChange}>
          <Option value="default">{t("default")}</Option>
          <Option value="rating_desc">{t("rating_desc")}</Option>
          <Option value="rating_asc">{t("rating_asc")}</Option>
        </SelectWrapper>
        <StyledSearch
          placeholder={t("search_placeholder")}
          onSearch={handleSearch}
          style={{ width: 350 }}
        />
        <FilterButton
          icon={<FilterOutlined />}
          size="large"
          onClick={() => setIsFilterVisible(true)}
        >
          {t("filter")}
        </FilterButton>
      </div>
      {(searchTerm ||
        Object.keys(filters).some((key) => filters[key].length > 0)) && (
        <p style={{ textAlign: "center", margin: "0 16px" }}>
          {searchTerm && (
            <>
              {t("searching_for")}: <b>{searchTerm}</b> ,{" "}
            </>
          )}
          {Object.keys(filters).map(
            (key) =>
              filters[key].length > 0 && (
                <span key={key}>
                  {t(key)}: <b>{filters[key].join(", ")}</b>,{" "}
                </span>
              )
          )}
        </p>
      )}

      <StyledModal
        open={isFilterVisible}
        onCancel={() => setIsFilterVisible(false)}
        footer={null}
        width={1000}
      >
        <FilterComponent onFilter={handleFilter} />
      </StyledModal>

      <Row
        gutter={[16, 16]}
        style={{ padding: "0 100px", marginTop: 50, minWidth: 1600 }}
      >
        {data.length > 0 ? (
          data.map((food, index) => (
            <Col
              key={index}
              lg={6}
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: 25,
              }}
            >
              <FoodCard
                id={food.id}
                name={getLocalizedText(food.name)}
                description={getLocalizedText(food.description)}
                img_path={food.img_path}
                num_likes={food.num_likes + 105}
                region={getLocalizedText(food.region)}
                rating={food.rating ?? 5}
                isLike={likedDishes.some((dish) => dish.id === food.id) ? 1 : 0}
              />
            </Col>
          ))
        ) : (
          <Col span={24} style={{ textAlign: "center", marginTop: 50 }}>
            <Alert message={t("no_dishes_found")} type="info" />
          </Col>
        )}
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
  &:hover,
  &:focus .ant-select-selector {
    color: #e4003a !important;
    border-color: #e4003a !important;
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
    color: #e4003a !important;
    border-color: #e4003a !important;
    background: rgba(228, 0, 58, 0.05) !important;
  }
`;
const StyledSearch = styled(Search)`
  .ant-input {
    border-color: #d9d9d9;
    &:hover,
    &:focus {
      border-color: #e4003a !important;
    }
  }
  .ant-btn {
    background: #fff;
    border-color: #d9d9d9;
    color: #333;
    &:hover,
    &:focus {
      color: #e4003a !important;
      border-color: #e4003a !important;
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
    color: #e4003a !important;
    border-color: #e4003a !important;
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
    color: #e4003a !important;
  }
`;

export default ListFoodPage;
