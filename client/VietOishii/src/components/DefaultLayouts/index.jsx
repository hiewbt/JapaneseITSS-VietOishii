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

export default DefaultLayouts
  