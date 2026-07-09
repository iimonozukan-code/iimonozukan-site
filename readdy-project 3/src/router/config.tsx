import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import AdminLayout from "../pages/admin/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import Items from "../pages/admin/Items";
import ItemForm from "../pages/admin/ItemForm";
import Banners from "../pages/admin/Banners";
import Logs from "../pages/admin/Logs";
import OwnProducts from "../pages/admin/OwnProducts";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "items", element: <Items /> },
      { path: "items/new", element: <ItemForm /> },
      { path: "items/:id", element: <ItemForm /> },
      { path: "banners", element: <Banners /> },
      { path: "logs", element: <Logs /> },
      { path: "own", element: <OwnProducts /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
