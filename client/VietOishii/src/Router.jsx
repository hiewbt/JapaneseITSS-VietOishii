import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './page/HomePage';
import Layout from './components/Layout';

const AppRouter = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default AppRouter;