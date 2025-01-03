import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { publicRoutes } from './routes'
import { Fragment } from 'react'
import DefaultLayouts from './components/DefaultLayouts'
import './App.css'
import "antd/dist/reset.css";

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          {publicRoutes.map((route, index) => {
            const Page = route.component
            let Layout = DefaultLayouts

            if (route.layout) {
              Layout = route.layout
            } else if (route.layout === null || route.path === '/signin' || route.path === '/signup') {
              Layout = Fragment
            }

            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            )
          })}
        </Routes>
      </div>
    </Router>
  )
}

export default App