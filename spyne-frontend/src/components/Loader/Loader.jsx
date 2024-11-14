import { useSelector } from "react-redux";
import "./Loader.css";

const Loader = () => {
  const isLoading = useSelector((state) => state.loader.isLoading);

  if (!isLoading) return null;
  return (
    <div className="loader">
      <div className="spinner"></div>
    </div>
  );
};

export default Loader;
