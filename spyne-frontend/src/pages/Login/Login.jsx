import { useState } from "react";
import "./Login.css";
import { postData } from "../../utils/apiService";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser } from "../../features/user/userSlice";
import { hideLoader, showLoader } from "../../features/loaderSlice";
import { toast } from "react-toastify";
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currState, setCurrState] = useState("Sign Up");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const submitHandler = async (event) => {
    event.preventDefault();
    dispatch(showLoader()); // Show loader at the start

    try {
      if (currState === "Sign Up") {
        // Registration flow
        const registerData = {
          username: userName,
          email: email,
          password: password,
        };

        const registerResponse = await postData(
          "/users/register",
          registerData
        );

        if (registerResponse?.success) {
          // Attempt login right after successful registration
          const loginResponse = await postData("/users/login", {
            email: email,
            password: password,
          });

          if (loginResponse?.data?.user && loginResponse?.data?.accessToken) {
            dispatch(addUser(loginResponse.data.user));
            localStorage.setItem("token", loginResponse.data.accessToken);
            navigate("/addProducts");
          } else {
            console.error("Login after registration failed:", loginResponse);
          }
        } else {
          console.error("Registration failed:", registerResponse);
        }
      } else {
        // Login flow
        const loginResponse = await postData("/users/login", {
          email: email,
          password: password,
        });

        if (loginResponse?.data?.user && loginResponse?.data?.accessToken) {
          dispatch(addUser(loginResponse.data.user));
          localStorage.setItem("token", loginResponse.data.accessToken);
          navigate("/addProducts");
        } else {
          console.error("Login failed:", loginResponse);
        }
      }
    } catch (error) {
      console.error("Error in submitHandler:", error);
      toast.error(error.message);
    } finally {
      // Ensure loader is hidden after the entire process
      dispatch(hideLoader());
    }
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    if (currState === "Sign Up") {
      if (newPassword.length < 8) {
        setPasswordError("Password must be at least 8 characters long.");
      } else if (!/[A-Z]/.test(newPassword)) {
        setPasswordError(
          "Password must contain at least one uppercase letter."
        );
      } else if (!/[a-z]/.test(newPassword)) {
        setPasswordError(
          "Password must contain at least one lowercase letter."
        );
      } else if (!/[0-9]/.test(newPassword)) {
        setPasswordError("Password must contain at least one digit.");
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
        setPasswordError(
          "Password must contain at least one special character."
        );
      } else {
        setPasswordError(""); // Clear error if password meets all criteria // Update the password state only if it's valid
      }
    }
  };

  return (
    <div className="login">
      <form onSubmit={submitHandler} className="login-form">
        <h2>{currState}</h2>
        {currState === "Sign Up" && (
          <input
            value={userName}
            onChange={(e) => setUserName(e?.target?.value)}
            className="form-input"
            type="text"
            placeholder="Username"
            required
          />
        )}

        <input
          value={email}
          onChange={(e) => setEmail(e?.target?.value)}
          className="form-input"
          type="email"
          placeholder="Email"
          required
        />
        <input
          value={password}
          onChange={handlePasswordChange}
          className="form-input"
          type="password"
          placeholder="Password"
          required
        />
        {passwordError && (
          <p style={{ color: "red", fontSize: "10px" }}>{passwordError}</p>
        )}
        <button type="submit">{currState}</button>
        <div className="login-term">
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy. </p>
        </div>
        <div className="login-forgot">
          {currState === "Sign Up" && (
            <p className="login-toggle">
              Already have an account{" "}
              <span onClick={() => setCurrState("Login")}>Click here</span>
            </p>
          )}
          {currState === "Login" && (
            <p className="login-toggle">
              Create Account{" "}
              <span onClick={() => setCurrState("Sign Up")}>Click here</span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;
