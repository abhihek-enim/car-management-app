import { useState } from "react";
import "./EditProduct.css";
// import { useSelector } from "react-redux";
import { postData } from "../../utils/apiService";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../../features/loaderSlice";
import { toast } from "react-toastify";
const EditProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(location.state);
  // object title, descri, tags, images[urls] carId
  const [imagePreviews, setImagePreviews] = useState(location.state.images);
  function extractPublicId(imageUrl) {
    const match = imageUrl.match(/\/upload\/(?:v\d+\/)?([^/.]+)\./);
    return match ? match[1] : null;
  }
  const [imagePublicIds, setImagePublicIds] = useState([]);
  const [editImages, setEditImages] = useState([]);
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
  const handleEditImageClick = (index) => {
    document.getElementById(`file-input-${index}`).click();
  };
  const handleFileChange = (e, index, url) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedPreviews = [...imagePreviews];
        updatedPreviews[index] = reader.result;
        setImagePreviews(updatedPreviews);
      };
      reader.readAsDataURL(file);

      setImagePublicIds((prev) => [...prev, extractPublicId(url)]);
      setEditImages((prev) => [...prev, file]);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(showLoader());
    const form = new FormData();
    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("tags", formData.tags);
    form.append("imagePublicIds", imagePublicIds);
    form.append("carId", formData._id);
    if (editImages.length > 0) {
      editImages.forEach((image) => {
        form.append(`car`, image);
      });
    }
    try {
      await postData("/cars/updateCar", form).then((res) => {
        console.log(res);
        dispatch(hideLoader());
        navigate("/productsList");
      });
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      dispatch(hideLoader());
    }
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
                <button
                  type="button"
                  className="edit-button"
                  onClick={() => handleEditImageClick(index)}
                >
                  Edit
                </button>
                <input
                  id={`file-input-${index}`}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => handleFileChange(e, index, url)}
                />
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
