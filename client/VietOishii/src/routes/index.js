import FoodDetail from "../pages/FoodDetail"
import Home from "../pages/Home"

const publicRoutes = [
    { path: '/', component: Home },
    { path: '/food-detail', component: FoodDetail },
]

export { publicRoutes }