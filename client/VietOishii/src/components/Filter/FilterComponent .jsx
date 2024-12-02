import { Form, Checkbox, Input, Button, Divider } from 'antd';
import styled from '@emotion/styled';

const FilterComponent = () => {
  const [form] = Form.useForm();

  const handleFilter = (values) => {
    console.log('Filter values:', values);
  };

  const filterCategories = {
    flavors: [
      { label: "Chua", value: "sour" },
      { label: "Cay", value: "spicy" },
      { label: "Mặn", value: "salty" },
      { label: "Ngọt", value: "sweet" },
      { label: "Đắng", value: "bitter" }
    ],
    mainIngredients: [
      { label: "Thịt gà", value: "chicken" },
      { label: "Thịt heo", value: "pork" },
      { label: "Thịt bò", value: "beef" },
      { label: "Hải sản", value: "seafood" },
      { label: "Gạo", value: "rice" },
      { label: "Bột mỳ", value: "flour" },
      { label: "Ngô" , value: "corn" },
      { label: "Đậu đỏ", value: "redBeans" },
      { label: "Ngũ cóc", value: "cereal" },
      { label: "Tảo biển", value: "seaweed" },
      { label: "Miso", value: "miso" },
      { label: "Wasabi", value: "wasabi" },
      { label: "Trái cây", value: "fruits" },
    ],
    allergens: [
      { label: "Cá thu", value: "tuna" },
      { label: "Cá ngừ", value: "salmon" },
      { label: "Cá hồi", value: "mackerel" },
      { label: "Đậu nành", value: "soy" },
      { label: "Lúa mì", value: "wheat" },
      { label: "Sữa", value: "milk" },
      { label: "Bột mỳ", value: "flour" },
      { label: "Hạt điều", value: "cashew" },
      { label: "Ngũ cóc", value: "cereal" },
    ],
    regions: [
      { label: "Hokkaidō", value: "hokkaido" },
      { label: "Tōhoku", value: "tohoku" },
      { label: "Kantō", value: "kanto" },
      { label: "Chūbu", value: "chubu" },
      { label: "Kansai", value: "kansai" },
      { label: "Chūgoku", value: "chugoku" },
      { label: "Shikoku", value: "shikoku" },
      { label: "Kyūshū", value: "kyushu" },
    ]
  };

  return (
    <FilterContainer>
      <FilterHeader>Lọc theo danh mục</FilterHeader>
      <Form form={form} onFinish={handleFilter} layout="vertical">
        <FilterSection name="flavors" label="Hương vị">
          <Checkbox.Group>
            {filterCategories.flavors.map(item => (
              <StyledCheckbox key={item.value} value={item.value}>
                {item.label}
              </StyledCheckbox>
            ))}
          </Checkbox.Group>
        </FilterSection>

        <StyledDivider />

        <FilterSection name="mainIngredients" label="Nguyên liệu chính">
          <Checkbox.Group>
            {filterCategories.mainIngredients.map(item => (
              <StyledCheckbox key={item.value} value={item.value}>
                {item.label}
              </StyledCheckbox>
            ))}
            <OtherOption>
              <StyledCheckbox value="other">Khác:</StyledCheckbox>
              <CustomInput />
            </OtherOption>
          </Checkbox.Group>
        </FilterSection>

        <StyledDivider />

        <FilterSection name="allergens" label="Thành phần dị ứng">
          <Checkbox.Group>
            {filterCategories.allergens.map(item => (
              <StyledCheckbox key={item.value} value={item.value}>
                {item.label}
              </StyledCheckbox>
            ))}
            <OtherOption>
              <StyledCheckbox value="other">Khác:</StyledCheckbox>
              <CustomInput />
            </OtherOption>
          </Checkbox.Group>
        </FilterSection>

        <StyledDivider />

        <FilterSection name="regions" label="Khu vực">
          <Checkbox.Group>
            {filterCategories.regions.map(item => (
              <StyledCheckbox key={item.value} value={item.value}>
                {item.label}
              </StyledCheckbox>
            ))}
          </Checkbox.Group>
        </FilterSection>

        <SubmitButton type="primary" htmlType="submit">
          Xác nhận
        </SubmitButton>
      </Form>
    </FilterContainer>
  );
};

const FilterContainer = styled.div`
  padding: 20px;
  background: #fff;
`;

const FilterHeader = styled.h2`
    text-align: center;
    margin-bottom: 24px;
    color: #333;
    font-size: 20px;
    font-weight: 700;
`;

const FilterSection = styled(Form.Item)`
  margin-bottom: 16px;

  .ant-form-item-label > label {
    font-weight: 500;
    color: #333;
  }

  .ant-checkbox-group {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 12px;
    padding: 12px;
  }
`;

const StyledCheckbox = styled(Checkbox)`
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 6px 12px;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  width: 100%;

  &:hover {
    border-color: #E4003A;
  }

  .ant-checkbox {
    border-radius: 50%;
  }
  
  .ant-checkbox-inner {
    border-radius: 50%;
    
    &:after {
      left: 4px;
    }
  }
`;

const OtherOption = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  width: 100%;
`;

const CustomInput = styled(Input)`
  width: 200px;
  
  &:hover, &:focus {
    border-color: #E4003A;
  }
`;

const StyledDivider = styled(Divider)`
  margin: 16px 0;
`;

const SubmitButton = styled(Button)`
    width: 20%;
    margin: 24px auto 0;
    display: block;
    background: #E4003A;
    border-color: #E4003A;
    height: 40px;
    font-size: 16px;

    &:hover {
        background: #ff1a1a !important;
        border-color: #ff1a1a !important;
    }
`;

export default FilterComponent;