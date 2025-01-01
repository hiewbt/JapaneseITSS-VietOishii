import { Form, Checkbox, Button, Divider } from 'antd';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
const FilterComponent = ({ onFilter }) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const handleFilter = (values) => {
    console.log('Filter values:', values);

    const mappedValues = {
      flavors: values.flavors || [],
      ingredients: values.mainIngredients || [],
      allergy: values.allergens || [],
      region: values.region || [],
    };

    console.log('Mapped Filter values:', mappedValues);

    onFilter(mappedValues);
  };

  const filterCategories = {
    flavors: [
      { label: t('Chua'), value: 'Chua' },
      { label: t('Cay'), value: 'Cay' },
      { label: t('Mặn'), value: 'Mặn' },
      { label: t('Ngọt'), value: 'Ngọt' },
      { label: t('Đắng'), value: 'Đắng' },
      { label: t('Đậm đà'), value: 'Đậm đà' },
    ],
    mainIngredients: [
      { label: t('Thịt gà'), value: 'Gà' },
      { label: t('Thịt heo'), value: 'Heo' },
      { label: t('Tôm'), value: 'Tôm' },
      { label: t('Hải sản'), value: 'Hải sản' },
      { label: t('Gạo'), value: 'Gạo' },
      { label: t('Ngô'), value: 'Ngô' },
    ],
    allergens: [
      { label: t('Sữa'), value: 'Sữa' },
      { label: t('Đậu nành'), value: 'Đậu nành' },
      { label: t('Hạt điều'), value: 'Hạt điều' },
      { label: t('Ngũ cốc'), value: 'Ngũ cốc' },
      { label: t('Tôm'), value: 'Tôm' },
    ],
    region: [
      { label: t('Hokkaido'), value: 'Hokkaido' },
      { label: t('Kanto'), value: 'Kanto' },
      { label: t('Chubu'), value: 'Chubu' },
      { label: t('Kansai'), value: 'Kansai' },
      { label: t('Shikoku'), value: 'Shikoku' },
      { label: t('Kyushu'), value: 'Kyushu' },
    ],
  };

  return (
    <FilterContainer>
      <FilterHeader>{t('Lọc theo danh mục')}</FilterHeader>
      <Form form={form} onFinish={handleFilter} layout="vertical">
        {/* Flavors */}
        <FilterSection name="flavors" label="Hương vị">
          <Checkbox.Group>
            {filterCategories.flavors.map((item) => (
              <StyledCheckbox key={item.value} value={item.value}>
                {item.label}
              </StyledCheckbox>
            ))}
          </Checkbox.Group>
        </FilterSection>

        <StyledDivider />

        {/* Main Ingredients */}
        <FilterSection name="mainIngredients" label="Nguyên liệu chính">
          <Checkbox.Group>
            {filterCategories.mainIngredients.map((item) => (
              <StyledCheckbox key={item.value} value={item.value}>
                {item.label}
              </StyledCheckbox>
            ))}
          </Checkbox.Group>
        </FilterSection>

        <StyledDivider />

        {/* Allergens */}
        <FilterSection name="allergens" label="Thành phần dị ứng">
          <Checkbox.Group>
            {filterCategories.allergens.map((item) => (
              <StyledCheckbox key={item.value} value={item.value}>
                {item.label}
              </StyledCheckbox>
            ))}
          </Checkbox.Group>
        </FilterSection>

        <StyledDivider />

        {/* Regions */}
        <FilterSection name="region" label="Khu vực">
          <Checkbox.Group>
            {filterCategories.region.map((item) => (
              <StyledCheckbox key={item.value} value={item.value}>
                {item.label}
              </StyledCheckbox>
            ))}
          </Checkbox.Group>
        </FilterSection>

        <SubmitButton type="primary" htmlType="submit">
          {t('Xác nhận')}
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
    grid-template-columns: repeat(3, 1fr);
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

  &:hover {
    border-color: #e4003a;
    background-color: #f5f5f5;
  }

  .ant-checkbox {
    border-radius: 50%;
  }

  .ant-checkbox-inner {
    border-radius: 50%;
  }

  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #e4003a !important;
    border-color: #e4003a !important;
  }
  .ant-checkbox-wrapper:hover .ant-checkbox-inner,
  .ant-checkbox:hover .ant-checkbox-inner,
  .ant-checkbox-input:focus + .ant-checkbox-inner {
    border-color: #e4003a !important;
  }

  .ant-checkbox-checked::after {
    border-color: #e4003a !important;
  }
`;

const StyledDivider = styled(Divider)`
  margin: 16px 0;
`;

const SubmitButton = styled(Button)`
  width: 20%;
  margin: 24px auto 0;
  display: block;
  background: #e4003a;
  border-color: #e4003a;
  height: 40px;
  font-size: 16px;

  &:hover {
    background: #ff1a1a !important;
    border-color: #ff1a1a !important;
  }
`;
FilterComponent.propTypes = {
  onFilter: PropTypes.func.isRequired,
};

export default FilterComponent;
