import { useState } from 'react';
import { Select, Input, Row, Col } from 'antd';
import FoodCard from '../../components/FoodCard/FoodCard';

const { Option } = Select;
const { Search } = Input;

const foodList = [
  { id: 1, name: 'Tên món ăn 1', rating: 4.4, tags: ['Vùng 1', 'Vùng 2'] },
  { id: 2, name: 'Tên món ăn 2', rating: 4.5, tags: ['Vùng 3', 'Vùng 4'] },
  { id: 3, name: 'Tên món ăn 3', rating: 4.3, tags: ['Vùng 1', 'Vùng 5'] },
];

const ListFoodPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState(foodList);

  const handleSearch = (value) => {
    setSearchTerm(value);
    setData(
      foodList.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  return (
    <div style={{ padding: "20px", flex: 1 }}>
      <h2 style={{ marginBottom: 20 }}>Danh sách món ăn</h2>
      <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Select defaultValue="Sort by" style={{ width: 120 }}>
          <Option value="asc">A-Z</Option>
          <Option value="desc">Z-A</Option>
        </Select>
        <Search
          placeholder="Tìm kiếm món ăn"
          onSearch={handleSearch}
          style={{ width: 300 }}
        />
      </div>
      <p>Searching for: <b>{searchTerm}</b></p> {/* Display the search term */}
      <Row gutter={[16, 16]}>
        {data.map((food, index) => (
          <Col key={index} xs={24} sm={12} md={8} lg={6}>
            <FoodCard name={food.name} tags={food.tags} rating={food.rating} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ListFoodPage;