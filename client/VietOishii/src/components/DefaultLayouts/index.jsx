import PropTypes from 'prop-types';
import Header from "./components/Header"
import Footer from "./components/Footer"

function DefaultLayouts({ children }) {
    return (
        <div>
            <Header></Header>
            <div className="main-content">{children}</div>
            <Footer></Footer>
        </div>
    )
}
DefaultLayouts.propTypes = {
    children: PropTypes.node.isRequired,
  };

export default DefaultLayouts
  