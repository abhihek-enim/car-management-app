import { useLocation } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import "./ViewProduct.css";
import Navbar from "../../components/Navbar/Navbar";
import { useCallback } from "react";

const ViewProduct = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);
  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);
  const location = useLocation();

  function getTags(tagsString) {
    return tagsString.split(",").map((tag) => tag.trim());
  }

  const product = {
    title: location.state.title,
    description: location.state.description,
    tags: getTags(location.state.tags),
    images: location.state.images,
  };

  return (
    <>
      <Navbar />
      <div className="view-product-container">
        <div className="embla image-section">
          <div className="embla__viewport" ref={emblaRef}>
            <div className="embla__container">
              {product.images.map((image, index) => (
                <div className="embla__slide" key={index}>
                  <img
                    src={image}
                    alt={`${product.title} ${index}`}
                    className="view-product-image"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="carousel-buttons">
            <button onClick={scrollPrev} className="embla__prev">
              {"<"}
            </button>
            <button onClick={scrollNext} className="embla__next">
              {">"}
            </button>
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
    </>
  );
};

export default ViewProduct;
