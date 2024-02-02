import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Articles from "./containers/article/Articles";
import CreateArticle from "./containers/article/CreateArticle";
import EditArticle from "./containers/article/EditArticle";
import Article from "./containers/article/Article";
import Layout from "./containers/Layout";
import AuthLayout from "./containers/auth/AuthLayout";
import SignUp from "./containers/auth/SignUp";
import Login from "./containers/auth/Login";
import LogOut from "./containers/auth/LogOut";
import Profile from "./containers/auth/Profile";
import Home from "./containers/Home";

const router = [
  {
    path: "",
    // loader: onEnterDashboard(),
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/articles",
        children: [
          {
            path: "",
            element: <Articles />
          },
          {
            path: ":id",
            element: <Article />
          },
          {
            path: "create",
            element: <CreateArticle />
          },
          {
            path: "edit/:id",
            element: <EditArticle />
          }
        ],
      },
    ]
  },
  {
    path: "",
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/logout",
        element: <LogOut />,
      },
    ]
  }
];

const Routes = () => {
  return <RouterProvider router={createBrowserRouter(router)} />;
}

export default Routes;