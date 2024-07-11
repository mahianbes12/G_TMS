import "../css/chat.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import Chat from "./Chat";
import TopNavBarHome from "../components/NavigationBar/TopNavBarHome";
import axios from "axios";

const socket = io.connect("http://localhost:3001");
const userId  = localStorage.getItem("userId");

const JoinChat = () =>  {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };
  
  const getUser = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/user/${userId}`);
      setUsername(response.data.FirstName);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  
  useEffect(() => {
    getUser();
  },[username]);

  return (
    <><TopNavBarHome /> 
        <Chat socket={socket} username={username} />
     
    </>
  );
}

export default JoinChat;
