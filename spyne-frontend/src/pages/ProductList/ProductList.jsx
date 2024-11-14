import { useEffect, useState } from "react";
import "./ProductList.css";
import { getData } from "../../utils/apiService";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { hideLoader, showLoader } from "../../features/loaderSlice";

const ProductList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  // const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  async function fetchUserCars() {
    try {
      dispatch(showLoader());
      await getData("/cars/getCarsByUserId").then((res) => {
        console.log(res.data);
        setProducts(res.data);
        setFilteredProducts(res.data);
        dispatch(hideLoader());
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      dispatch(hideLoader());
    }
  }
  function handleSearch(value) {
    const searchResults = products.filter(
      (product) =>
        product.title.toLowerCase().includes(value.toLowerCase()) ||
        product.description.toLowerCase().includes(value.toLowerCase()) ||
        product.tags.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProducts(searchResults);
  }
  function getTags(tagsString) {
    return tagsString.split(",").map((tag) => tag.trim());
  }
  useEffect(() => {
    fetchUserCars();
  }, []);
  return (
    <>
      <Navbar />
      <div className="search-bar-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Enter search term..."
            onChange={(e) => handleSearch(e.target.value)}
          />
          {/* <button onClick={handleSearch}>Search</button> */}
        </div>
      </div>
      <div className="product-list">
        {filteredProducts.map((product) => (
          <div className="product-card" key={product.id}>
            <img
              className="product-image"
              src={product.images[0]}
              alt={product.title}
            />
            <div className="product-info">
              <h3 className="product-title">{product.title}</h3>
              <p className="product-description">
                {product.description.length > 20
                  ? product.description.substring(0, 20) + "..."
                  : product.description}
              </p>
              <div className="product-tags">
                {getTags(product.tags).map((tag, index) => (
                  <span className="product-tag" key={index}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="view-product">
              <button
                onClick={() =>
                  navigate("/viewProduct", {
                    state: product,
                  })
                }
              >
                View
              </button>
              <button
                onClick={() =>
                  navigate("/editProduct", {
                    state: product,
                  })
                }
              >
                Edit
              </button>
              <img className="delete-product" src="./delete.png" alt="" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProductList;
