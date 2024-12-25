<<<<<<< HEAD
=======
import PropTypes from 'prop-types';
>>>>>>> origin
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
<<<<<<< HEAD
=======
DefaultLayouts.propTypes = {
    children: PropTypes.node.isRequired,
  };
>>>>>>> origin

export default DefaultLayouts
  