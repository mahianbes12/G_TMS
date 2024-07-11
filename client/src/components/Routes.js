import React, { useContext } from "react";
import { Route, Switch } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import LandingRoutes from "./LandingPage/LandingRoutes";
import AuthRoutes from "./AuthRoutes";
import AdminRoutes from "./Pages/Admin/adminRoute";

const Routes = () => {
  const { auth } = useContext(AuthContext);

  return (
    <Switch>
      {/* Check if the route path includes "/admin/" */}
      <Route
        path="/admin/*"
        render={() => <AdminRoutes />}
      />
      {/* If there is Auth, load separate auth component that includes Login, signup, landing.
      OR have auth ternary statement render in each route */}
      <Route
        path="*"
        render={() => (auth ? <AuthRoutes /> : <LandingRoutes />)}
      />
    </Switch>
  );
};

export default Routes;
