import { Menu, Dropdown } from 'antd';
import { DownOutlined, GlobalOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const Header = () => {
  const menuItems = [
    { label: 'Trang chủ', key: 'home', path: '/' },
    { label: 'Menu', key: 'menu', path: '/menu' },
    { label: 'Về khẩu vị', key: 'taste', path: '/taste' },
  ];

  const submenuItems = [
    'Khai vị',
    'Món chính',
    'Hải sản',
    'Món chay',
    'Tráng miệng',
    'Ăn vặt',
    'Đồ uống',
  ];

  const languageMenu = (
    <Menu
      items={[
        { key: 'vi', label: 'Tiếng Việt' },
        { key: 'en', label: 'English' },
      ]}
    />
  );

  return (
    <div>
      {/* Top navigation bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', borderBottom: '1px solid #ddd' }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>VietOishii</div>
        <div style={{ display: 'flex', gap: '20px' }}>
          {menuItems.map((item) => (
            <Link key={item.key} to={item.path} style={{ cursor: 'pointer' }}>
              {item.label}
            </Link>
          ))}
          <Dropdown overlay={languageMenu} trigger={['click']}>
            <div style={{ cursor: 'pointer' }}>
              <GlobalOutlined /> Tiếng Việt <DownOutlined />
            </div>
          </Dropdown>
          <div style={{ cursor: 'pointer' }}>Đăng nhập</div>
        </div>
      </div>

      {/* Submenu */}
      <div style={{ backgroundColor: '#f0f0f0', padding: '10px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          {submenuItems.map((item, index) => (
            <div key={index} style={{ cursor: 'pointer' }}>
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Header;