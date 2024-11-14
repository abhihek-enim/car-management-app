import { BrowserRouter as Router } from "react-router-dom";
// import { routes } from "./utils/router";
import AppRoutes from "./Router";
import "./App.css";
import Loader from "./components/Loader/Loader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// const router = createBrowserRouter(routes);

function App() {
  return (
    <>
      <ToastContainer />
      <Loader />
      <Router>
        <AppRoutes />
      </Router>
    </>
  );
}

export default App;
