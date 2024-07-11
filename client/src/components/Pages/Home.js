import React, { useContext, useState } from "react";
import Modal from "react-modal";
import { Context as UserContext } from "../../context/store/UserStore";
import { Context as TaskContext } from "../../context/store/TaskStore";
import { Context as ProjectContext } from "../../context/store/ProjectStore";
import { ToastProvider } from "react-toast-notifications";
import TaskItemHome from "../tasks/TaskItemHome";
import TopNavBarHome from "../NavigationBar/TopNavBarHome";
import ProjectTile from "../projects/ProjectTile";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import NewProjectTile from "../projects/NewProjectTile";
import Add from "../../assets/Add";
import { Link } from "react-router-dom";
import AddProjectPopOut from "../PopOutMenu/AddProjectPopOut";
import AddTaskPopOutTaskPage from "../PopOutMenu/AddTaskPopOutTaskPage";
import PopOutTaskDetailsHome from "../PopOutMenu/PopOutTaskDetailsHome";

const HomePage = () => {
  const [userState] = useContext(UserContext);
  const [taskState] = useContext(TaskContext);
  const [projectState] = useContext(ProjectContext);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [isTaskDetailsOpen, setIsTaskDetailsOpen] = useState(false);

  const openTaskForm = () => {
    setIsTaskDetailsOpen(false);
    setIsProjectFormOpen(false);
    setIsTaskFormOpen(true);
  };

  const openProjectForm = () => {
    setIsTaskDetailsOpen(false);
    setIsTaskFormOpen(false);
    setIsProjectFormOpen(true);
  };

  const openTaskDetails = () => {
    setIsTaskFormOpen(false);
    setIsProjectFormOpen(false);
    setIsTaskDetailsOpen(true);
  };

  const uncompletedTasklist = taskState.tasks.filter((task) => task);

  const sortedTaskList = uncompletedTasklist.sort(function (a, b) {
    return new Date(b.due_date) - new Date(a.due_date);
  });

  const upcomingTasklist = sortedTaskList.slice(0, 9);

  const taskList = upcomingTasklist.map((task, i) => {
    return (
      task && (
        <TaskItemHome
          task={task}
          key={i}
          showSideTaskDetails={openTaskDetails}
          sideTaskDetails={isTaskDetailsOpen}
        />
      )
    );
  });

  const projectLists = projectState.projects.slice(0, 5);

  const projectTiles = projectLists.map((project, i) => {
    return <ProjectTile project={project} key={i} id={project.id} />;
  });

  return (
    <ToastProvider>
      <TopNavBarHome />
      <div className="home-container">
        <div className="home-main-container">
          <div
            className="home-main-content-container"
            style={{ display: "flex" }}
          >
            <div
              className="home-inner-container"
              style={{
                background: "transparent",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                width: "100%",
              }}
            >
              <div className="home-welcome-header">
                <p className="home-welcome-message">
                  Hi, {userState.user.FirstName}!
                </p>
                <p
                  style={{ display: "flex", margin: "0", alignSelf: "center" }}
                >
                  Welcome to your dashboard.
                </p>
              </div>
              <div
                className="home-task-project-container"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <div
                  className={
                    upcomingTasklist.length < 5
                      ? "home-tasks-container--smaller"
                      : isTaskFormOpen || isProjectFormOpen || isTaskDetailsOpen
                      ? "home-tasks-container--small"
                      : "home-tasks-container"
                  }
                >
                  <div className="home-tasks-header">
                    <div>
                      <h2
                        style={{
                          color: "#151b26",
                          fontWeight: 500,
                          fontSize: "20px",
                        }}
                      >
                        Tasks Due Soon
                      </h2>
                    </div>
                    <div>
                      <Link
                        to="/tasks"
                        style={{ textDecoration: "none", color: "blue" }}
                      >
                        <p style={{ fontSize: "14px" }}>See all my tasks</p>
                      </Link>
                    </div>
                  </div>
                  <div className="home-tasks--list">
                    {taskList}
                    <div
                      className="new-home-item-container"
                      onClick={openTaskForm}
                    >
                      <div className="new-home-item">
                        <Add />
                      </div>
                      <p className="new-home-item-text">Add Task</p>
                    </div>
                  </div>
                </div>
                <div
                  className={
                    isTaskFormOpen || isProjectFormOpen || isTaskDetailsOpen
                      ? "home-projects-container--small"
                      : "home-projects-container"
                  }
                >
                  <div className="home-projects-header">
                    <div>
                      <h2
                        style={{
                          color: "#151b26",
                          fontWeight: 500,
                          fontSize: "20px",
                          paddingLeft: "30px",
                        }}
                      >
                        Projects
                      </h2>
                    </div>
                  </div>
                  <div
                    className="home-projects--list"
                    onClick={openProjectForm}
                  >
                    {projectTiles}
                    <NewProjectTile />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isTaskFormOpen}
        onRequestClose={() => setIsTaskFormOpen(false)}
        contentLabel="Add a Task"
        className="reactModalPortal"
      >
        <div className="modal-content">
          <AddTaskPopOutTaskPage
            showSideTaskForm={() => setIsTaskFormOpen(false)}
            title={
              <div className="title" style={{ color: "#011e53" }}>
                <AddCircleIcon className="modal-icon" />
                Add a Task
              </div>
            }
          />
        </div>
      </Modal>

      <Modal
        isOpen={isProjectFormOpen}
        onRequestClose={() => setIsProjectFormOpen(false)}
        contentLabel="Add Project"
        className="reactModalPortal"
      >
        <div className="modal-content">
          <AddProjectPopOut
            showSideProjectForm={() => setIsProjectFormOpen(false)}
            title={
              <div className="title" style={{ color: "#011e53" }}>
                <AddCircleIcon className="modal-icon" />
                Add Project
              </div>
            }
          />
        </div>
      </Modal>

    </ToastProvider>
  );
};

export default HomePage;
