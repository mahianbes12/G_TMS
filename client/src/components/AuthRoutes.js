import React, { useState, useContext, useEffect } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import HomePage from "./Pages/Home";
import TasksPage from "./Pages/Tasks";
import ProjectPage from "./Pages/Project";
import ProjectsPage from "./Pages/Projects";
import NewProjectPage from "./Pages/NewProject";
import TeamPage from "./Pages/Team";
import NewTasksPage from "./Pages/NewTasks";
import "../css/Navbar.css";
import LeftNavBar from "./NavigationBar/LeftNavBar";
import GanttChart from "../components/GanttChart.js";

import { Context as UserContext } from "../context/store/UserStore";
import { Context as TaskContext } from "../context/store/TaskStore";
import { Context as ProjectContext } from "../context/store/ProjectStore";
import { Context as TeamContext } from "../context/store/TeamStore";

import axios from "axios";
import Settings from "../components/Pages/Settings";
import JoinChat from "../message/JoinChat";

const AuthRoutes = () => {
  const [sidebar, setSidebar] = useState(true);
  const showSidebar = () => setSidebar(!sidebar);
  const [taskState, taskdispatch] = useContext(TaskContext);
  const [userState, userdispatch] = useContext(UserContext);
  const [projectState, projectdispatch] = useContext(ProjectContext);
  const [teamState, teamdispatch] = useContext(TeamContext); 
  const [showLoginPage, setShowLoginPage] = useState(false);

  useEffect(() => {
    // Add a delay before showing the login page
    setTimeout(() => {
      setShowLoginPage(true);
    }, 1000); // Adjust the delay duration as needed
  }, []);

  const id = localStorage.getItem("userId");
  console.log(id);

  //Maybe grab all information here and state goes down to child components?
  const getUserInfo = async () => {
    const res = await axios.get(`http://localhost:3000/user/${id}`);
    await userdispatch({ type: "get_user_info", payload: res.data });
  };

  const getUserTasks = async () => {
    const res = await axios.get(`http://localhost:3000/task/user/${id}`);
    await taskdispatch({ type: "get_user_tasks", payload: res.data });
  };

  const getUserTeams = async (id) => {
    try {
      const res = await axios.get(`http://localhost:3000/team/user/${id}`);
      await teamdispatch({ type: "get_user_teams", payload: res.data });
    } catch (error) {
      console.error('Error retrieving user teams:', error);
      // Handle the error appropriately
    }
  };

  const getUserProjects = async () => {
    const res = await axios.get(`http://localhost:3000/project/user/${id}`, {userId:id});
    await projectdispatch({
      type: "get_user_projects",
      payload: res.data,
    });
  };

  useEffect(() => {
    getUserInfo();
    getUserTasks(); 
    const id = localStorage.getItem("userId");
    console.log(id); 
    if (id) {
      getUserTeams(id);
    } else {
      console.error('User ID is undefined');
    }
    getUserProjects();
    console.log(teamState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="overlay">
      <BrowserRouter>
        <LeftNavBar showSidebar={showSidebar} sidebar={sidebar} />
        <div
          className={
            sidebar
              ? "overlay-right-container"
              : "overlay-right-container__short"
          }
        >
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/tasks" component={NewTasksPage} />
            <Route exact path="/projects" component={ProjectsPage} />
            <Route path="/gantt/:id" component={GanttChart} />
            <Route exact path="/settings/:id" component={Settings} />
            <Route exact path="/chat" component={JoinChat} />
            <Route exact path="/gantt/:id" component={JoinChat} />

            {/* <Route
              path="/team/:teamId/project/:projectId/:projectName"
              component={ProjectPage}
            /> */}
            <Route
              path="/team/project/:projectId/:projectName"
              render={() => <ProjectPage sidebar={sidebar} />}
            />
            <Route path="/team/:teamId/:teamName" component={TeamPage} />
            <Route
              path="/*"
              render={() => {
                return <Redirect to="/" />;
              }}
            />
          </Switch>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default AuthRoutes;