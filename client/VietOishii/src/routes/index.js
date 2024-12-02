import Home from "../pages/Home"
import ListFoodPage from "../pages/ListFoodPage/ListFoodPage"

const publicRoutes = [
    { path: '/', component: Home },
    {path: '/list-food', component: ListFoodPage}
]

export { publicRoutes }