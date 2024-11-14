import { useState } from "react";
import "./EditProduct.css";
// import { useSelector } from "react-redux";
import { postData } from "../../utils/apiService";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
const EditProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState(location.state);
  const [imagePreviews, setImagePreviews] = useState(location.state.images);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 10);
    setFormData({ ...formData, car: files });

    // Create preview URLs
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, previews]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    // const form = new FormData();
    // form.append("title", formData.title);
    // form.append("description", formData.description);
    // form.append("tags", formData.tags);
    // if (formData.car && formData.car.length > 0) {
    //   formData.car.forEach((image) => {
    //     form.append(`car`, image);
    //   });
    // }
    // try {
    //   await postData("/cars/addCar", form).then((res) => {
    //     console.log(res);

    //     navigate("/productsList");
    //   });
    // } catch (error) {
    //   console.log(error);
    // }
  };

  return (
    <>
      <Navbar />
      <div className="add-product-container">
        <h1>Edit New Product</h1>

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

          <button type="submit">Edit Product</button>
        </form>
      </div>
    </>
  );
};

export default EditProduct;
