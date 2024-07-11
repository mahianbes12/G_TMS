import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip, faPaperPlane, faEdit, faTrash, faCopy } from '@fortawesome/free-solid-svg-icons';
import { Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';
import '../css/chat.css';
import axios from 'axios';
import Avatar from 'react-avatar';

function Chat({ socket, username }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [users, setUsers] = useState([]);
  const [recipient, setRecipient] = useState("");
  const [chatMode, setChatMode] = useState("group");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [contextMenuPosition, setContextMenuPosition] = useState(null);
  const [selectedMessageIndex, setSelectedMessageIndex] = useState(null);
  const userId = localStorage.getItem("userId");
  const Email = localStorage.getItem("Email");
  const [teams, setTeams] = useState([]);
  const [room, setRoom] = useState("");

  const determineRoom = () => {
    if (chatMode === "group" && selectedTeam) {
      console.log("Group chat mode selected");
      setRoom(selectedTeam);
    } else if (chatMode === "private" && selectedUser) {
      console.log("Private chat mode selected");
      const sortedUserIds = [userId, selectedUser].sort((a, b) => a.localeCompare(b));
      const room = sortedUserIds.join('_');
      setRoom(room);
    }
  };

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/team/user/${userId}`);
        setTeams(response.data);

        let allUsers = [];

        for (const team of response.data) {
          const teamUsers = await fetchTeamUsers(team.id);
          allUsers = [...allUsers, ...teamUsers];
        }

        // Filter out the current user and remove duplicates
        const uniqueUsers = Array.from(new Set(allUsers.map(user => user.id)))
          .map(id => allUsers.find(user => user.id === id))
          .filter(user => user.id !== userId);

        setUsers(uniqueUsers);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    const fetchTeamUsers = async (teamId) => {
      try {
        const response = await axios.get(`http://localhost:3000/team/${teamId}/users`);
        console.log(response.data);
        return response.data[0].Users || [];
      } catch (error) {
        console.error(`Error fetching users for team ${teamId}:`, error);
        return [];
      }
    };

    fetchTeams();
  }, [userId]);

  useEffect(() => {
    if (room) {
      console.log("Joining room:", room);
      socket.emit("join_room", { room, username });

      const fetchPreviousMessages = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/api/messages/${room}`);
          setMessageList(response.data);
        } catch (error) {
          console.error("Error fetching previous messages:", error);
        }
      };

      fetchPreviousMessages();

      socket.on("receive_message", (data) => {
        console.log("Received new message:", data);
        setMessageList((list) => [...list, data]);
      });

      return () => {
        console.log("Leaving room:", room);
        socket.emit("leave_room", { room, username });
        socket.off("receive_message");
      };
    }
  }, [socket, room, username]);

  useEffect(() => {
    determineRoom();
  }, [chatMode, selectedTeam, selectedUser]);

  const sendMessage = async () => {
    if (currentMessage.trim() !== "" || uploadedFile) {
      let fileData = null;
      if (uploadedFile) {
        fileData = await renderFileContent(uploadedFile);
      }
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        file: uploadedFile ? {
          name: uploadedFile.name,
          type: uploadedFile.type,
          content: fileData,
        } : null,
        recipient: chatMode === "private" ? selectedUser : null,
      };

      try {
        const response = await axios.post('http://localhost:3000/api/messages', messageData);
        console.log('Message sent:', response.data);
        socket.emit("send_message", messageData);
        setMessageList((list) => [...list, messageData]);
        setCurrentMessage("");
        setUploadedFile(null);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const renderFileContent = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleEmojiSelect = (emoji) => {
    setCurrentMessage(currentMessage + emoji.native);
    setShowEmojiPicker(false);
  };

  const handleEditMessage = () => {
    const message = messageList[selectedMessageIndex];
    setCurrentMessage(message.message);
    setEditingMessage(selectedMessageIndex);
    setContextMenuPosition(null);
  };

  const handleCopyMessage = () => {
    const message = messageList[selectedMessageIndex].message;
    navigator.clipboard.writeText(message);
    setContextMenuPosition(null);
  };

  const handleDeleteMessage = () => {
    setMessageList((list) => list.filter((_, index) => index !== selectedMessageIndex));
    setContextMenuPosition(null);
  };

  const handleContextMenu = (event, index) => {
    event.preventDefault();
    setSelectedMessageIndex(index);
    setContextMenuPosition({ x: event.pageX, y: event.pageY });
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !showEmojiPicker) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Messaging</p>
        <div className="chat-mode-switch">
          <button onClick={() => setChatMode("group")} className={chatMode === "group" ? "active" : ""}>Group Chat</button>
          <button onClick={() => setChatMode("private")} className={chatMode === "private" ? "active" : ""}>Private Chat</button>
        </div>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent, index) => (
            <div
              className={`message ${username === messageContent.author ? "sender" : "receiver"}`}
              key={index}
              id={username === messageContent.author ? "you" : "other"}
              onContextMenu={(event) => handleContextMenu(event, index)}
            >
              <div>
                <div className="message-content">
                  <p>{messageContent.message}</p>
                  {messageContent.file && (
                    <div className="uploaded-file">
                      {messageContent.file.type &&
                        messageContent.file.type.startsWith("image/") ? (
                        <img
                          className="uploaded-image"
                          src={messageContent.file.content}
                          alt={messageContent.file.name}
                        />
                      ) : (
                        <div className="file-download">
                          <a
                            href={messageContent.file.content}
                            download={messageContent.file.name}
                          >
                            {messageContent.file.name}
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="message-meta">
                  <p id="time">{messageContent.time}</p>
                  <p id="author">{messageContent.author}</p>
                  {selectedMessageIndex === index && contextMenuPosition && (
                    <div className="message-actions" style={{ top: contextMenuPosition.y, left: contextMenuPosition.x }}>
                      {username === messageContent.author ? (
                        <>
                          <FontAwesomeIcon icon={faEdit} onClick={handleEditMessage} />
                          <FontAwesomeIcon icon={faTrash} onClick={handleDeleteMessage} />
                          <FontAwesomeIcon icon={faCopy} onClick={handleCopyMessage} />
                        </>
                      ) : (
                        <FontAwesomeIcon icon={faCopy} onClick={handleCopyMessage} />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        {chatMode === "private" && (
          <select onChange={(e) => {
            setRecipient(e.target.value);
            setSelectedUser(e.target.value);
          }} value={selectedUser || ""}>
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                
                {user.FirstName}
              </option>
            ))}
          </select>
        )}
        {chatMode === "group" && (
          <select onChange={(e) => {
            setRecipient(e.target.value);
            setSelectedTeam(e.target.value);
          }} value={selectedTeam || ""}>
            <option value="">Select Team</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.teamName}
              </option>
            ))}
          </select>
        )}
        <input
          type="text"
          value={currentMessage}
          placeholder="Message..."
          onChange={(event) => setCurrentMessage(event.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
          <span role="img" aria-label="emoji">😀</span>
        </button>
        <label htmlFor="file-input" className="file-label">
          <FontAwesomeIcon icon={faPaperclip} />
        </label>
        <input
          id="file-input"
          type="file"
          style={{ display: "none" }}
          onChange={(event) => setUploadedFile(event.target.files[0])}
        />
        <button onClick={sendMessage}>
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>
      {showEmojiPicker && (
        <Picker
          set="apple"
          onSelect={handleEmojiSelect}
          style={{ position: 'absolute', bottom: '60px', right: '10px', zIndex: '1' }}
        />
      )}
    </div>
  );
}

export default Chat;
