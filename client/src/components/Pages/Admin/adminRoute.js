import React from "react";
import { Route, Switch } from "react-router-dom";
import AdminLogin from "./adminLogin";
import AdminRegistrationForm from "./adminRegistration";
import Home from "./index";
import AdminActivityPage from "./adminActivityPage";
import UsersList from "./userList";
import AdminsList from "./adminList";

const AdminRoutes = () => {
  return (
    <Switch>
      <Route exact path="/admin/login" component={AdminLogin} />
      <Route exact path="/admin/user/registration/:adminId" component={AdminRegistrationForm} />
      <Route exact path="/admin/usersList/:adminId" component={UsersList} />
      <Route exact path="/admin/dashboard/:adminId" component={Home} />
      <Route exact path="/admin/adminsList/:adminId" component={AdminsList} />
      <Route exact path="/admin/activities/:adminId" component={AdminActivityPage} />
    </Switch>
  );
};

export default AdminRoutes;

