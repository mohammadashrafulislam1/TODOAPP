import { createBrowserRouter } from "react-router-dom";
import Main from "../pages/Main";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import AddToDo from "../pages/todo/AddToDo";
import Error from "../components/Error";
import PrivateRoute from '../router/privateRoute'
import RequestPasswordReset from "../components/RequestPasswordReset";
import ResetPassword from "../components/ResetPassword";
import UserAccount from "../pages/UserAccount";

export const router = createBrowserRouter([
    {
        path:'/',
        element:<PrivateRoute><Main></Main></PrivateRoute>,
        errorElement:<Error></Error>
    },
    {
        path:'/login',
        element:<Login></Login>
    },
    {
        path:"/signup",
        element:<Signup></Signup>
    },
    {
        path:"/addtodo",
        element:<PrivateRoute><AddToDo></AddToDo></PrivateRoute>
    },
    {
        path:'/request-password',
        element:<RequestPasswordReset></RequestPasswordReset>
    },
    {
        path:"/reset-password/:token",
        element:<ResetPassword></ResetPassword>
    },
    {
        path:"/account",
        element:<PrivateRoute><UserAccount></UserAccount></PrivateRoute>
    }
])
