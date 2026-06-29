import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import AdminLayout from "../pages/admin/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import Items from "../pages/admin/Items";
import ItemForm from "../pages/admin/ItemForm";
import Logs from "../pages/admin/Logs";

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
      { path: "logs", element: <Logs /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
