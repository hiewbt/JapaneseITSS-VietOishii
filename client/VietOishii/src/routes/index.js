import FoodDetail from "../pages/FoodDetail"
import Home from "../pages/Home"
import ListFoodPage from "../pages/ListFoodPage/ListFoodPage"

const publicRoutes = [
    { path: '/', component: Home },
    { path: '/food-detail', component: FoodDetail },
    {path: '/list-food', component: ListFoodPage}
]

export { publicRoutes }