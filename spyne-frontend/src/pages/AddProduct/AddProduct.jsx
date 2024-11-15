import { useState } from "react";
import "./AddProduct.css";
import { useDispatch, useSelector } from "react-redux";
import { postData } from "../../utils/apiService";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { hideLoader, showLoader } from "../../features/loaderSlice";
import { toast } from "react-toastify";

const AddProduct = () => {
  const navigate = useNavigate();
  const userName = useSelector((state) => state.user.user.username);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    car: [],
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const dispatch = useDispatch();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 10);
    setFormData({ ...formData, car: files });

    // Create preview URLs
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(showLoader());
    const form = new FormData();
    if (
      !formData.title ||
      !formData.description ||
      !formData.tags ||
      formData.car.length === 0
    ) {
      toast.error("All fields are required.");
      return;
    }
    console.log(formData.car[0]);
    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("tags", formData.tags);
    if (formData.car && formData.car.length > 0) {
      formData.car.forEach((image) => {
        // console.log(image);
        form.append(`car`, image);
      });
    }
    console.log("FormData content:");
    for (let [key, value] of form.entries()) {
      console.log(key, value);
    }
    try {
      await postData("/cars/addCar", form).then((res) => {
        console.log(res);
        dispatch(hideLoader());
        navigate("/productsList");
      });
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(hideLoader());
    }
  };

  return (
    <>
      <Navbar />
      <div className="add-product-container">
        <h1>Add New Product</h1>
        <p>Welcome,{userName} !</p>

        <form onSubmit={handleSubmit} className="product-form">
          <label>
            Title:
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            Description:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            Tags:
            <input
              type="text"
              name="tags"
              placeholder="Comma-separated tags"
              value={formData.tags}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Images (max 10):
            <input
              type="file"
              name="car"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
          </label>

          <div className="image-preview-grid">
            {imagePreviews.map((url, index) => (
              <div key={index} className="image-preview">
                <img src={url} alt={`Preview ${index}`} />
              </div>
            ))}
          </div>

          <button type="submit">Save Product</button>
        </form>
      </div>
    </>
  );
};

export default AddProduct;
