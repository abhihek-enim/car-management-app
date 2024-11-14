import { useState } from "react";
import "./AddProduct.css";
import { useSelector } from "react-redux";
import { postData } from "../../utils/apiService";
const AddProduct = () => {
  const userName = useSelector((state) => state.user.user.username);
  //   console.log(userName);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    car: [],
  });
  const [imagePreviews, setImagePreviews] = useState([]);

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
    const form = new FormData();
    console.log(formData.car[0]);
    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("tags", JSON.stringify(formData.tags));
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
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
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
  );
};

export default AddProduct;
