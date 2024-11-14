import { useLocation } from "react-router-dom";
import "./ViewProduct.css";
import useEmblaCarousel from "embla-carousel-react";

const ViewProduct = () => {
  const [emblaRef] = useEmblaCarousel();
  const location = useLocation();
  function getTags(tagsString) {
    return tagsString.split(",").map((tag) => tag.trim());
  }
  //   console.log(location);
  const product = {
    title: location.state.title,
    description: location.state.description,
    tags: getTags(location.state.tags),
    images: location.state.images, // Replace with your product image URL
  };

  return (
    <div className="view-product-container">
      <div className="image-section embla" ref={emblaRef}>
        <div className="embla__container">
          {product.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={product.title}
              className="product-image embla__slide "
            />
          ))}
        </div>
      </div>
      <div className="details-section">
        <h2 className="product-title">{product.title}</h2>
        <p className="product-description">{product.description}</p>
        <div className="tags-section">
          {product.tags.map((tag, index) => (
            <span key={index} className="product-tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewProduct;
