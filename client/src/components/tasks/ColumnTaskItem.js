import React, { useState, useContext, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import TaskDetailsForm from "../tasks/TaskDetailsForm";
// import AddTask from "../Forms/AddTask";
import { Modal, responsiveFontSizes } from "@material-ui/core";
import Pin from "../../assets/pin";
import Comments from "../../assets/comments";
import UserAvatar from "../NavigationBar/UserAvatar";
import moment from "moment";
import { Context as TaskContext } from "../../context/store/TaskStore";
import axios from "axios";

const ColumnTaskItem = ({
  task,
  index,
  showSideTaskDetails,
  sideTaskDetails,
  showSideTaskForm,
  setShowModal, // Received from ProjectPage
  
}) => {
  const [taskState, taskdispatch] = useContext(TaskContext);
  const [commentCount, setCommentCount] = useState(0);
  // const [showModal, setShowModal] = useState(false);
  const endDate = moment(task.endDate, "YYYY-MM-DD");



  const setTaskPopOut = async () => {
    if (sideTaskDetails === false) {
      showSideTaskDetails();
      //---
      taskdispatch({ type: "get_selected_task", payload: null });
      const res = await axios.get(`http://localhost:3000/task/${task.taskID}`);
      taskdispatch({ type: "get_selected_task", payload: res.data });
      setShowModal(true);
    } 
    else {
      taskdispatch({ type: "get_selected_task", payload: null });
      // const res = await axios.get(`http://localhost:3000/task/${task.taskID}`);
      // await taskdispatch({ type: "get_selected_task", payload: res.data });
    }
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/task/${task.taskID}/comment`);
      setCommentCount(res.data.length); // Assuming the response is an array of comments
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    console.log(task);
    fetchComments(); // Fetch comments when component mounts
  }, []);

  // const handleCloseModal = () => {
  //   setShowModal(false);
  //   taskdispatch({ type: "get_selected_task", payload: null });
  // };


  return (
    <div key={task.status}>
      <Draggable
        draggableId={`${task.taskID}`}
        type="task"
        key={`${task.taskID}`}
        index={index}
        taskListStatus={task.status}
      >
        {(provided, snapshot) => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            className="task-project-item"
            // onClick={openTaskDetailFormModal}
            onClick={setTaskPopOut}
          >
            <div className="task-project-container-left">
              <div className="task-project-name">{task.taskName}</div>
              <div className="task-project-icons">
                {/* <div style={{ display: "flex", alignItems: "center" }}>
                  <Pin />{" "}
                  <p style={{ color: "darkgray", marginLeft: "5px" }}>8</p>
                </div> */}
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Comments />{" "}
                  <p style={{ color: "darkgray", marginLeft: "5px" }}>{commentCount}</p>
                </div>
              </div>
            </div>
            <div className="task-project-container-right">
              <div className="task-project-assignee-avatar">
                <div className="user-avatar">
                  {task.Users && task.Users.length > 0
                    ? task.Users.map((user, index) => (
                        <div className="user-avatar" key={index}>
                          {user.FirstName && user.FirstName.length >= 2
                            ? (
                                user.FirstName[0]
                              ).toUpperCase()
                            : ""}
                        </div>
                      ))
                    : null}
                </div>
              </div>
              <div className="progress-bar">
            <div
              className="progress-indicator"
              style={{ width: `${task.progress}%` }}
            />
          </div>
              <div className="task-project-due_date">
                <p style={{ color: "darkgray" }}>{endDate.format("MMM D")}</p>
              </div>
            </div>
          </div>
        )}
      </Draggable>
      {/* Modal for task details */}
      {/* <Modal
        open={showModal}
        onClose={handleCloseModal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <TaskDetailsForm task={task} onClose={handleCloseModal} projectId={task.projectId} />
      </Modal> */}
    </div>
  );
};

export default ColumnTaskItem;
