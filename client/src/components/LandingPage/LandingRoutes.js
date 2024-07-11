import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import LoginSignupPage from "./LoginSignupPage";
import LandingPage from "./LandingPage";
import RegisterPage from "./RegisterPage";
import Onboard from "./Onboard";
import ResetPasswordForm from "../Forms/resetPassword";
import UpdatePasswordForm from "../Forms/updatePassword";

const LandingRoutes = () => {
  return (
    <BrowserRouter>
      {(() => {
        switch (window.location.pathname) {
          case "/login":
            return <Route path="/login" component={LoginSignupPage} />;
          case "/resetPassword":
            return <Route path="/resetPassword" component={ResetPasswordForm} />;
            case "/updatePassword":
            return <Route path="/updatePassword" component={UpdatePasswordForm} />;
          case "/register":
            return <Route exact path="/register" component={RegisterPage} />;
          case "/register/onboard":
            return <Route exact path="/register/onboard" component={Onboard} />;
          default:
            return <Route exact path="/" component={LandingPage} />;
        }
      })()}
    </BrowserRouter>
  );
};

export default LandingRoutes;