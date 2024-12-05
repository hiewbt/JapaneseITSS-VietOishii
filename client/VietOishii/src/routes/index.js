import FoodDetail from "../pages/FoodDetail";
import Home from "../pages/Home";
import ListFoodPage from "../pages/ListFoodPage/ListFoodPage";
import SigninPage from "../pages/Signin";
import SignupPage from "../pages/Signup";
import ProfilePage from "../pages/Profile";

const publicRoutes = [
  { path: "/", component: Home },
  { path: "/food-detail", component: FoodDetail },
  { path: "/list-food", component: ListFoodPage },
  { path: "/signin", component: SigninPage },
  { path: "/signup", component: SignupPage },
  { path: "/profile", component: ProfilePage },
];

export { publicRoutes };
