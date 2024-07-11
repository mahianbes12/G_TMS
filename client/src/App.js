import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Routes from "./components/Routes";
import AdminRoutes from "./components/Pages/Admin/adminRoute";
import AuthContext from "./context/AuthContext";
import UserStore from "./context/store/UserStore";
import TeamStore from "./context/store/TeamStore";
import TaskStore from "./context/store/TaskStore";
import ProjectStore from "./context/store/ProjectStore";
import TasklistStore from "./context/store/TasklistStore";
import Progressbar from "./components/Pages/Progressbar";
import "./css/Home.css";
import Chat from "./message/Chat";
import io from "socket.io-client";
import JoinChat from "./message/JoinChat";
import TeamDetail from "./components/NavigationBar/TeamDetail";
import { ToastProvider } from "react-toast-notifications";

const socket = io.connect("http://localhost:3001");
const App = () => {
  const [auth, setAuth] = useState(localStorage.getItem("token") || "");
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);
  const [email, setEmail] = useState(localStorage.getItem("email") || null);
  const [user, setUser] = useState(localStorage.getItem("user") || null);
  const [progress, setProgress] = useState(0);
  const [sidebar, setSidebar] = useState(true);
  const showSidebar = () => setSidebar(!sidebar);
  const [room, setRoom] = useState("");
  const [username, setUsername] = useState("");
  const [showChat, setShowChat] = useState(false);
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("userId");
    setAuth(null);
    setEmail(null);
    setUserId(null);
  };
  const context = {
    auth,
    setAuth,
    userId,
    setUserId,
    email,
    setEmail,
    user,
    setUser,
    sidebar,
    setSidebar,
    showSidebar,
    logout,
  };

  return (
    <ToastProvider>
      <AuthContext.Provider value={context}>
        <UserStore>
          <ProjectStore>
            <TeamStore>
              <TasklistStore>
                <TaskStore>
                  <Router>
                    <Switch>
                      <Route component={Routes} />
                    </Switch>
                  </Router>
                </TaskStore>
              </TasklistStore>
            </TeamStore>
          </ProjectStore>
        </UserStore>
        </AuthContext.Provider>
    </ToastProvider>
  );
};

export default App;
