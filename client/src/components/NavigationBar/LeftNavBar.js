import React, { useContext, useState, useEffect } from "react";
import { NavLink, useHistory } from "react-router-dom";
import "../../css/Navbar.css";
import { AiOutlinePlus } from "react-icons/ai";
import { FaChevronDown } from "react-icons/fa";
import { Context as ProjectContext } from "../../context/store/ProjectStore";
import { RiMenuFoldLine, RiMenuFill } from "react-icons/ri";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { Context as TeamContext } from "../../context/store/TeamStore";
import { Modal } from "@material-ui/core";
import TeamForm from "../Forms/TeamForm";
import Home from "../../assets/Home";
import Tasks from "../../assets/tasks";
import Project from "../../assets/project";
import Team from "../../assets/team.svg";
import Board from "../../assets/board";
import GanttChart from "../../assets/ganttchart";
import Settings from "../../assets/settings";
import logo from "../../assets/logo2.png";
import TeamDetail from "./TeamDetail";
import { ToastProvider, useToasts } from "react-toast-notifications";
import axios from "axios";

const LeftNavBar = ({ showSidebar, sidebar }) => {
  const [teamState] = useContext(TeamContext);
  const [open, setOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjects, setShowProjects] = useState(false);
  const [showTeam, setShowTeam] = useState(false);
  const [projectState] = useContext(ProjectContext);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teams, setTeams] = useState([]);
  const history = useHistory();
  const [teamFormOpen, setTeamFormOpen] = useState(false);
  const [projectsAvailable, setProjectsAvailable] = useState(false);
  const { addToast } = useToasts();
  const userId = localStorage.getItem("userId");
  const projectLists = projectState.projects;
  const [showProjectsGantt, setShowProjectsGantt] = useState(false);
  const [selectedProjectGantt, setSelectedProjectGantt] = useState(null);


  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/project/user/${userId}`);
        setProjectsAvailable(response.data.length > 0);
      } catch (error) {
        console.error("Error fetching projects:", error);
        addToast("An error occurred while checking projects.", {
          appearance: "error",
          autoDismiss: true,
          autoDismissTimeout: 5000,
        });
      }
    };

    fetchProjects();
  }, [addToast, userId]);

  const handleOpenTeamForm = () => {
    if (projectsAvailable) {
      setTeamFormOpen(true);
    } else {
      addToast("Please create a project first before creating a team.", {
        appearance: "warning",
        autoDismiss: true,
        autoDismissTimeout: 5000,
      });
    }
  };

  const handleCloseTeamForm = () => {
    setTeamFormOpen(false);
  };

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/team/user/${userId}`);
        setTeams(response.data);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchTeams();
  }, [userId]);

  const orderedList = teamState.teams.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  const renderedList = orderedList.map((team, i) => (
    <NavLink
      className="left-nav-bar-team-link"
      style={{ textDecoration: "none", color: "white" }}
      to={`/team/${team.id}/${team.teamName}`}
      activeClassName="navlink--active"
      key={i}
    >
      {console.log(team)}
      <div>
        <p style={{ margin: "0px", paddingLeft: "30px" }}>{team.teamName}</p>
      </div>
    </NavLink>
  ));

  const renderedProjects = projectLists.map((project, i) => (
    <NavLink
      to={`/team/project/${project.id}/${project.ProjectName}`}
      className="left-nav-bar-main-link"
      activeClassName="navlink--active"
      onClick={() => {
        setSelectedProject(project);
        setShowProjects(false);
      }}
      key={i}
      style={{
        padding: "0 0 0 50px",
        fontSize: "14px",
      }}
    >
      <Project />
      {project.ProjectName}
    </NavLink>
  ));

  const renderedProjectsGantt = projectLists.map((project, i) => {
    return (
      <NavLink
        to={`/gantt/${project.id}`}
        className="left-nav-bar-main-link"
        activeClassName="navlink--active"
        onClick={() => {
          setSelectedProjectGantt(project);
          setShowProjectsGantt(false);
        }}
        key={i}
        style={{
          padding: "0 0 0 50px",
          fontSize: "14px",
        }}
      >
        <Project />
        {project.ProjectName}
      </NavLink>
    ); // Render a link for each project in the sidebar
  });

  return (
    <div>
      <div className="left-nav-bar-container">
        <div className={sidebar ? "nav-menu active" : "nav-menu collapsed"}>
          <div className="left-nav-menu-container">
            <div className="left-nav-menu-top">
              <div className="landing-nav-logo">
                <img
                  src={logo}
                  alt="logo"
                  style={{
                    width: "80px",
                    height: "50px",
                    marginLeft: "20%",
                    marginRight: "50px",
                  }}
                />
              </div>
              <div className="collapse-menu-icon-container">
                <RiMenuFoldLine
                  style={{
                    color: "white",
                    fontSize: "24px",
                    cursor: "pointer",
                    marginTop: "25px",
                  }}
                  onClick={showSidebar}
                />
              </div>
            </div>

            <div className="main-menu-items-container" style={{ marginTop: "10px" }}>
              <NavLink
                exact
                to="/"
                className="left-nav-bar-main-link"
                activeClassName="navlink--active"
              >
                <div className="left-nav-bar-link">
                  <Home />
                  <div>
                    <p className="left-nav-bar-link-title">Home</p>
                  </div>
                </div>
              </NavLink>
              <NavLink
                to="/tasks"
                className="left-nav-bar-main-link"
                activeClassName="navlink--active"
              >
                <div className="left-nav-bar-link">
                  <Tasks />
                  <div>
                    <p className="left-nav-bar-link-title">My Tasks</p>
                  </div>
                </div>
              </NavLink>
              <div
                className="left-nav-bar-main-link"
                onClick={() => setShowProjects(!showProjects)}
              >
                <div className="left-nav-bar-link">
                  <Board />
                  <div>
                    <p className="left-nav-bar-link-title">Board</p>
                  </div>
                  <FaChevronDown
                    className={
                      showProjects ? "arrow-icon arrow-icon--up" : "arrow-icon"
                    }
                  />
                </div>
              </div>
              {showProjects && renderedProjects}
              <div
                className="left-nav-bar-main-link"
                onClick={() => setShowProjectsGantt(!showProjectsGantt)}
              >
                <div className="left-nav-bar-link">
                  <GanttChart />
                  <div>
                    <p className="left-nav-bar-link-title">GanttChart</p>
                  </div>
                  <FaChevronDown
                    className={
                      showProjectsGantt ? "arrow-icon arrow-icon--up" : "arrow-icon"
                    }
                  />
                </div>
              </div>
              {showProjectsGantt && renderedProjectsGantt}
              <NavLink
                to={`/settings/${userId}`}
                className="left-nav-bar-main-link"
                activeClassName="navlink--active"
              >
                <div className="left-nav-bar-link">
                  <Settings />
                  <div>
                    <p className="left-nav-bar-link-title">Settings</p>
                  </div>
                </div>
              </NavLink>
            </div>

            <div className="teams-items-container">
              <div className="teams-items-header" style={{ display: "flex" }}>
                <img src={Team} alt="team-icon" />
                <div>
                  <p className="left-nav-bar-link-title">Teams</p>
                </div>
                <button
                  className="add-icon"
                  style={{ marginLeft: '100px', color: 'white', fontSize: '15px', backgroundColor: 'inherit' }}
                  onClick={handleOpenTeamForm}
                >
                  <AiOutlinePlus />
                </button>
              </div>
            </div>
            <div
              className="left-nav-bar-main-link"
              onClick={() => setShowTeam(!showTeam)}
            >
              <div className="left-nav-bar-link">
                <TeamDetail team={selectedTeam} />
                <div>
                  <p className="left-nav-bar-link-title">My Team Lists</p>

                </div>
                <FaChevronDown
                  className={
                    showTeam ? "arrow-icon arrow-icon--up" : "arrow-icon"
                  }
                />
              </div>
            </div>
            {showTeam && renderedList}
          </div>
        </div>

        {sidebar ? null : (
          <div
            className="menu-icon"
            style={{
              paddingTop: "25px",
              paddingLeft: "20px",
              paddingBottom: "22px",
              backgroundColor: "white",
            }}
          >
            <RiMenuFill
              style={{
                fontSize: "24px",
                cursor: "pointer",
              }}
              onClick={showSidebar}
            />
          </div>
        )}
      </div>

      <Modal 
        contentLabel="Add a Team"
        className="reactModalPortal"
        title={
              <div className="title" style={{ color: "#011e53" }}>
                <AddCircleIcon className="modal-icon" />
                Add a Team
              </div>
            }
            open={teamFormOpen} onClose={handleCloseTeamForm}>
              
        <div className="modal-content">
        <TeamForm clickClose={handleCloseTeamForm} />
        </div>
      </Modal>
    </div>
  );
};

export default LeftNavBar;
