import { useTranslation } from 'react-i18next';
import { Layout, Typography } from 'antd';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const ProfilePage = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <Content style={{ padding: '20px' }}>
        <Title level={2}>{t('new_page_title')}</Title>
        <Paragraph>{t('new_page_content')}</Paragraph>
      </Content>
    </Layout>
  );
};

export default ProfilePage;