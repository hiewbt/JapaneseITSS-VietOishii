import styled from '@emotion/styled';

const Footer = () => {
  return (
    <footer>
      <Logo>VietOishii</Logo>
      <p>Kênh thông tin uy tín số 1 Đại Cồ Việt</p>
      <p>© Copyright</p>
    </footer>
  );
};

const Logo = styled.div`
    font-size: 25px;
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
export default Footer;
