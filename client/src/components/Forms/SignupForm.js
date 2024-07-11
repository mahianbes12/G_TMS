import React, { useContext, useState, useEffect} from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
import * as yup from "yup";

const schema = yup.object().shape({
  FirstName: yup.string().required("Please enter your first name"),
  LastName: yup.string().required("Please enter your last name"),
  Email: yup.string().email("Please enter a valid email").required("Please enter an email address"),
  Password: yup
    .string()
    .required("Please enter a password")
    .min(8, "Password should be at least 8 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password should contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
    ),
});

const SignupForm = ({isSignUpMode}) => {
  const { register, handleSubmit, errors } = useForm();
  const { setAuth, setEmail, setUserId, setUser } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    let isMounted = true;

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSignUpSubmit = async (data) => {
    setLoading(true);
    const { Email, Password, FirstName, LastName } = data;

    try {
      await schema.validate(data);
      const res = await axios.post("http://localhost:3000/user", {
        FirstName: FirstName,
        LastName: LastName,
        Email: Email,
        Password: Password,
      });

      console.log("Sign-up successful:", res.data);
      localStorage.setItem("Email", res.data.user.Email);
      localStorage.setItem("userId", res.data.user.id);
      localStorage.setItem("onboard", res.data.token);
      setErrorMessage("");
      setUser(res.data.user);
      setAuth(res.data.token);
      setEmail(res.data.user.Email);
      setUserId(res.data.user.id); 
      
    } catch (error) {
      console.error("Sign-up failed:", error);
      setErrorMessage("Sign-up failed");
    }

    setLoading(false);
  };



  return (
      <div className="forms-container">
        <div className="signin-signup">
        {isSignUpMode && (
        <form onSubmit={handleSubmit(handleSignUpSubmit)} className="sign-up-form">
            <h2 className="title">Sign up</h2>
            <div className="input-field">
              <i className="fas fa-user"></i>
              <input
                name="FirstName"
                type="text"
                placeholder="First Name"
                ref={register({ required: true })}
              />
            </div>
            {errors.FirstName?.type === "required" && (
              <p style={{ color: "red", margin: "1px" }}>Please enter your First Name</p>
            )}
            <div className="input-field">
              <i className="fas fa-user"></i>
              <input
                name="LastName"
                type="text"
                placeholder="Last Name"
                ref={register({ required: true })}
              />
            </div>
            {errors.LastName?.type === "required" && (
              <p style={{ color: "red", margin: "1px" }}>Please enter your Last Name</p>
            )}
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
              value={loading ? "Signing up.." : "Sign up"}
              className="btn solid"
            />
          </form>
        )}
        </div>
      </div>
  );
};


export default SignupForm;