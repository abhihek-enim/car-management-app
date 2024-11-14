import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { postData } from "../../utils/apiService";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../../features/loaderSlice";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    // Clear any necessary authentication tokens or user data here
    dispatch(showLoader());
    try {
      await postData("/users/logout").then((res) => {
        localStorage.removeItem("token");
        console.log(res);
      });
      dispatch(hideLoader());
      navigate("/login");
    } catch (error) {
      toast.error(error.message);
    } finally {
      dispatch(hideLoader());
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h2>Car Management</h2>
      </div>
      <div className="navbar-links">
        <NavLink to="/productsList" activeClassName="active-link">
          Products
        </NavLink>
        <NavLink to="/addproducts" activeClassName="active-link">
          Add Product
        </NavLink>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
