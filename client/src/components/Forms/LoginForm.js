import React, { useContext, useState, useEffect} from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
import apiServer from "../../config/apiServer";

const LoginForm = ({isSignUpMode}) => {
  const { register, handleSubmit, errors } = useForm();
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { setAuth } = useContext(AuthContext);
  const history = useHistory();

  useEffect(() => {
    let isMounted = true;

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSignInSubmit = async (data) => {
    setLoading(true);
    const { Email, Password } = data;

    try {
      const response = await axios.post("http://localhost:3000/user/login", {
        Email: Email,
        Password: Password,
      });

      console.log(response.data);
      localStorage.setItem("Email", response.data.user.Email);
      localStorage.setItem("userId", response.data.user.id);
      localStorage.setItem("token", response.data.token);
      setAuth(response.data.token);

      console.log("Authentication successful:", response.data);
    } catch (error) {
      console.error("Authentication failed:", error);
      setErrorMessage("Authentication failed");
    }

    setLoading(false);
  };


  return (
     
  <div className="forms-container">
  <div className="signin-signup">
    {!isSignUpMode && (
      <form onSubmit={handleSubmit(handleSignInSubmit)} className="sign-in-form">
            <h2 className="title">Sign in</h2>
            <div className="input-field">
              <i className="fas fa-envelope"></i>
              <input
                name="Email"
                type="email"
                placeholder="Email"
                ref={register({ required: true })}
              />
            </div>
            {errors.Email?.type === "required" && (
              <p style={{ color: "red", margin: "1px" }}>Please enter an Email address</p>
            )}
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input
                name="Password"
                type="password"
                placeholder="Password"
                ref={register({ required: true })}
              />
            </div>
            {errors.Password?.type === "required" && (
              <p style={{ color: "red", margin: "1px" }}>Please enter a Password</p>
            )}
            <input
              type="submit"
              value={loading ? "Logging in.." : "Login"}
              className="btn solid"
            />
            <p className="forget-password">
              <a href="/resetPassword">Forgot your password?</a>
            </p>
            <p className="social-text"></p>
            <div className="social-media">{/* Add social media icons here */}</div>
          </form>
        )}
        </div>
        </div>
  );
};

export default LoginForm;