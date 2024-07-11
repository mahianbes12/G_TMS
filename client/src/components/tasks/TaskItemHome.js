import React, { useState, useContext } from "react";
import moment from "moment";
import {
  Modal,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@material-ui/core";
import { AiOutlineEllipsis } from "react-icons/ai";
import { Context as TaskContext } from "../../context/store/TaskStore";
import axios from "axios";
import { useToasts } from "react-toast-notifications";
import TaskDetailsForm from "./TaskDetailsForm";

const TaskItemHome = ({ task, showSideTaskDetails, sideTaskDetails }) => {
  const date = moment(task.endDate, "YYYYMMDD");
  const [taskState, taskdispatch] = useContext(TaskContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { addToast } = useToasts();

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const setTaskPopOut = async () => {
    
    taskdispatch({ type: "get_selected_task", payload: null });
    const res = await axios.get(`http://localhost:3000/task/${task.taskID}`);
    taskdispatch({ type: "get_selected_task", payload: res.data });
    
    if (!sideTaskDetails) {
      showSideTaskDetails();
    }
  };

  const handleTaskDelete = async () => {
    const userId = localStorage.getItem("userId");
    let canDelete = false;

    for (const user of task.Users) {
      if (user.id === userId) {
        for (const projectId of user.CanChangeProjects) {
          const projectsResponse = await axios.get(
            `http://localhost:3000/project/${task.ProjectID}`
          );
          if (projectId === projectsResponse.data.ProjectID) {
            canDelete = true;
            break;
          }
        }
      }
      if (canDelete) {
        break;
      }
    }

    if (!canDelete) {
      addToast("You don't have permission to delete this task.", {
        appearance: "error",
        autoDismiss: true,
        autoDismissTimeout: 5000,
      });
      return;
    }

    handleMenuClose();
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    setConfirmOpen(false);
    await axios.delete(`http://localhost:3000/task/${task.taskID}`);
    const id = localStorage.getItem("userId");
    const res = await axios.get(`http://localhost:3000/task/user/${id}`);
    taskdispatch({ type: "get_user_tasks", payload: res.data });
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
  };

  const body = (
    <div className="modal-container">
      <TaskDetailsForm task={task} closeModal={closeModal} />
    </div>
  );

  return (
    <>
      <div className="task-home-item">
        <div className="task-home-item-inner-container">
          <div className="task-home-item-inner-left" onClick={showSideTaskDetails}>
            <div className="task-home-item-icon-container">
              <span className={`dot-task-${task.id}`}></span>
            </div>
            <div className="task-home-item-name-container">
              <p
                style={{
                  fontSize: "15px",
                  fontWeight: "500",
                  margin: "0px",
                }}
              >
                {task.taskName}
              </p>
              <p style={{ color: "grey", margin: "0" }}>
                {date.format("MMM D")}
              </p>
            </div>
          </div>
          <div
            className="task-home-item-more-menu"
            style={{ height: "100%" }}
            onClick={handleMenuClick}
          >
            <AiOutlineEllipsis style={{ fontSize: "24px" }} />
          </div>
          <Menu
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleTaskDelete}>Delete</MenuItem>
          </Menu>
        </div>
      </div>
      <Dialog open={confirmOpen} onClose={handleCancelDelete}>
        <DialogTitle>{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this task?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TaskItemHome;
