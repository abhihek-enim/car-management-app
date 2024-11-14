import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Login from "./pages/Login/Login";
import AddProduct from "./pages/AddProduct/AddProduct";
import ViewProduct from "./pages/ViewProduct/ViewProduct";
import ProductList from "./pages/ProductList/ProductList";
import EditProduct from "./pages/EditProduct/EditProduct";

const ProtectedRoute = () => {
  const isTokenPresent = localStorage.getItem("token");
  return isTokenPresent ? <Outlet /> : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}

      <Route element={<ProtectedRoute />}>
        <Route path="/addProducts" element={<AddProduct />} />
        <Route path="/productsList" element={<ProductList />} />
        <Route path="/viewProduct" element={<ViewProduct />} />
        <Route path="/editProduct" element={<EditProduct />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
export default AppRoutes;
