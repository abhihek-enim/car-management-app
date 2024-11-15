import { useEffect, useState } from "react";
import "./ProductList.css";
import { deleteData, getData } from "../../utils/apiService";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { hideLoader, showLoader } from "../../features/loaderSlice";
import DialogBox from "../../components/DialogBox/DialogBox";

const ProductList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [carId, setCarId] = useState("");
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
  const handleOpenDialog = (id) => {
    setCarId(id);
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  const handleConfirmAction = async () => {
    try {
      dispatch(showLoader());
      await deleteData(`/cars/deleteCar/${carId}`).then((res) => {
        console.log(res);
      });
      setShowDialog(false);
      fetchUserCars();
      dispatch(hideLoader());
    } catch (error) {
      toast.error("Error Occured, try again. ");
      console.log(error);
    } finally {
      dispatch(hideLoader());
      setShowDialog(false);
    }
  };
  useEffect(() => {
    fetchUserCars();
  }, []);
  return (
    <>
      <Navbar />
      <DialogBox
        showDialog={showDialog}
        handleClose={handleCloseDialog}
        handleConfirm={handleConfirmAction}
        message="Are you sure you want to delete this product?"
      />

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
              <img
                onClick={() => handleOpenDialog(product._id)}
                className="delete-product"
                src="./delete.png"
                alt=""
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProductList;
