import Login from "../pages/Login/Login";
import Home from "../pages/Home/Home";
import AddProduct from "../pages/AddProduct/AddProduct";
import ProductList from "../pages/ProductList/ProductList";
import ViewProduct from "../pages/ViewProduct/ViewProduct";
import EditProduct from "../pages/EditProduct/EditProduct";

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
  {
    path: "/productsList",
    element: (
      <>
        <ProductList />
      </>
    ),
  },
  {
    path: "/viewProduct",
    element: (
      <>
        <ViewProduct />
      </>
    ),
  },
  {
    path: "/editProduct",
    element: (
      <>
        <EditProduct />
      </>
    ),
  },
];
