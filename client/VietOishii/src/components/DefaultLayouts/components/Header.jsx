import { useState } from 'react';
import { Dropdown, Space } from 'antd';
import { DownOutlined, GlobalOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import banner from '../../../assets/banner.png';

const Header = () => {
    const [language, setLanguage] = useState('vi');

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

    const languageItems = [
        { key: 'vi', label: 'Tiếng Việt' },
        { key: 'jp', label: '日本語' },
    ];

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
                            onClick: ({ key }) => setLanguage(key)
                        }}
                    >
                        <LanguageSelector>
                            <Space>
                                <GlobalOutlined />
                                {language === 'vi' ? 'Tiếng Việt' : '日本語'}
                                <DownOutlined />
                            </Space>
                        </LanguageSelector>
                    </Dropdown>
                    <LoginButton>Đăng nhập</LoginButton>
                </NavItems>
            </TopNav>

            <BannerContainer>
                <BannerImage src={banner} alt="Banner" />
            </BannerContainer>

            <SubMenuContainer>
                <SubMenuWrapper>
                    {submenuItems.map((item, index) => (
                        <SubMenuItem key={index}>
                            {item}
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
    font-size: 30px;
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
    color: #333;
    font-weight: 500;

    &:hover {
        color: #E4003A;
        background: rgba(228, 0, 58, 0.05);
    }
`;

export default Header;