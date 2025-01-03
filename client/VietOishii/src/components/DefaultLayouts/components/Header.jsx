import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Dropdown, Space, message, Menu, Avatar } from 'antd';
import { DownOutlined, GlobalOutlined, HeartOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import axios from 'axios'; 
import banner from '../../../assets/banner.png';
const API_URL = `${import.meta.env.VITE_API_URL}`;

const Header = () => {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState('vi');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSubmenu, setActiveSubmenu] = useState('');

  const menuItems = [
    { label: t('home'), key: 'home', path: '/' },
    { label: t('list_food'), key: 'list_food', path: '/list-food' },
  ];

  const submenuItems = [
    { key: 'khai vi', label: t('appetizer') },
    { key: 'món chính', label: t('main_course') },
    { key: 'hải sản', label: t('seafood') },
    { key: 'món chay', label: t('vegetarian') },
    { key: 'tráng miệng', label: t('dessert') },
    { key: 'ăn vặt', label: t('snack') },
    { key: 'đồ uống', label: t('drink') },
  ];

  const languageItems = [
    { key: 'vi', label: 'Tiếng Việt' },
    { key: 'jp', label: '日本語' },
  ];

  const changeLanguage = (key) => {
    setLanguage(key);
    i18n.changeLanguage(key);
  };

  const handleSigninClick = () => {
    navigate('/signin');
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
      setUser(null);
      navigate('/signin');
    } catch (error) {
      console.error('Failed to logout:', error);
      message.error('Không thể đăng xuất. Vui lòng thử lại sau.');
    }
  };

  const handleCategoricalClick = (key) => {
    navigate(`/list-food?categorical=${encodeURIComponent(key)}`);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categorical = params.get('categorical');
    if (categorical) {
      setActiveSubmenu(categorical);
    } else {
      setActiveSubmenu('');
    }
  }, [location]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${API_URL}/profile`, {
          withCredentials: true,
        });
        console.log('User profile fetched:', response.data);
        setUser(response.data.user);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" onClick={() => navigate('/profile')}>
        <UserOutlined style={{ marginRight: 8, fontSize: '20px' }} />
        {t('profile')}
      </Menu.Item>
      <Menu.Item key="like" onClick={() => navigate('/like')}>
        <HeartOutlined style={{ marginRight: 8, fontSize: '20px' }} />
        {t('like')}
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout}>
        <LogoutOutlined style={{ marginRight: 8, fontSize: '20px' }} />
        {t('logout')}
      </Menu.Item>
    </Menu>
  );

  return (
    <HeaderContainer>
      <TopNav>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Logo>VietOishii</Logo>
        </Link>
        <NavItems>
          {menuItems.map((item) => (
            <NavLink key={item.key} to={item.path}>
              {item.label}
            </NavLink>
          ))}
          <Dropdown 
            menu={{ 
              items: languageItems,
              onClick: ({ key }) => changeLanguage(key),
            }}
          >
            <LanguageSelector style={{fontSize: '20px'}}>
              <Space>
                <GlobalOutlined />
                {language === 'vi' ? 'Tiếng Việt' : '日本語'}
                <DownOutlined />
              </Space>
            </LanguageSelector>
          </Dropdown>
          {user ? (
            <Dropdown overlay={userMenu}>
              <UserName>
                <Space>
                  {user.username}
                  <Avatar style={{ backgroundColor: '#E4003A' }}>
                    {user.username.charAt(0).toUpperCase()}
                  </Avatar>
                </Space>
              </UserName>
            </Dropdown>
          ) : (
            <LoginButton onClick={handleSigninClick}>{t('login')}</LoginButton>
          )}
        </NavItems>
      </TopNav>

      <BannerContainer>
        <BannerImage src={banner} alt="Banner" />
      </BannerContainer>

      <SubMenuContainer>
        <SubMenuWrapper>
          {submenuItems.map((item) => (
            <SubMenuItem
              key={item.key}
              onClick={() => handleCategoricalClick(item.key)}
              active={activeSubmenu === item.key}
            >
              {item.label}
            </SubMenuItem>
          ))}
        </SubMenuWrapper>
      </SubMenuContainer>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header`
  width: 100%;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

const TopNav = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 40px;
  width: 90%; 
  margin: 0 auto;
  border-bottom: 1px solid #f0f0f0;
`;

const Logo = styled.div`
  font-size: 35px;
  font-weight: bold;
  background: linear-gradient(to right, #E4003A, #FF9C73);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: opacity 0.3s ease;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

const NavItems = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  font-size: 20px;
`;

const NavLink = styled(Link)`
  color: #333;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 4px;
  transition: all 0.3s ease;

  &:hover {
    color: #E4003A;
    background: rgba(228, 0, 58, 0.05);
  }
`;

const LanguageSelector = styled.div`
  cursor: pointer;
  color: #333;
  padding: 8px 12px;
  border-radius: 4px;
  transition: all 0.3s ease;

  &:hover {
    color: #E4003A;
    background: rgba(228, 0, 58, 0.05);
  }
`;

const LoginButton = styled.button`
  cursor: pointer;
  color: #333;
  background: none;
  border: none;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 4px;
  transition: all 0.3s ease;

  &:hover {
    color: #E4003A;
    background: rgba(228, 0, 58, 0.05);
  }
`;

const UserName = styled.span`
  color: #333;
  font-size: 20px;
  font-weight: 500;
  cursor: pointer;
`;

const BannerContainer = styled.div`
  margin: 20px auto;
  width: 95%;      
  height: 350px; 
  border-radius: 8px;
  position: relative;
  overflow: hidden;
`;

const BannerImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
`;

const SubMenuContainer = styled.div`
  background-color: #f5f5f5;
  padding: 12px 20px;
  background: #fff;
`;

const SubMenuWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  max-width: 1200px;
  margin: 0 auto;
`;

const SubMenuItem = styled.div`
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 4px;
  transition: all 0.3s ease;
  color: ${({ active }) => (active ? '#E4003A' : '#333')};
  font-weight: 500;
  font-size: 20px;
  background: ${({ active }) => (active ? 'rgba(228, 0, 58, 0.05)' : 'transparent')};

  &:hover {
    color: #E4003A;
    background: rgba(228, 0, 58, 0.05);
  }
`;

export default Header;