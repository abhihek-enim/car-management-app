import Login from "../pages/Login/Login";
import Home from "../pages/Home/Home";
import AddProduct from "../pages/AddProduct/AddProduct";

export const routes = [
  {
    path: "/",
    element: (
      <>
        <Home />
      </>
    ),
  },
  {
    path: "/login",
    element: (
      <>
        <Login />
      </>
    ),
  },
  {
    path: "/addProduct",
    element: (
      <>
        <AddProduct />
      </>
    ),
  },
];
