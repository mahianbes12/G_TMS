import React, { useState, useContext, useEffect } from "react";
import moment from "moment";
import { Modal } from "@material-ui/core";
import "../../css/Modal.css";
import TaskDetailsForm from "./TaskDetailsForm";
import { Context as TaskContext } from "../../context/store/TaskStore";
import axios from "axios";

//Task item list for home and task page

const TaskItemTask = ({
  task,
  showSideTaskDetails,
  sideTaskDetails,
  setInitialLoad,
}) => {
  const [taskState, taskdispatch] = useContext(TaskContext);
  const [open, setOpen] = useState(false);
  const [ProjectName, setProjectName] = useState("");

  const endDate = moment(task.endDate, "YYYY-MM-DD"); // Assuming endDate is in "YYYY-MM-DD" format

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const fetchProjectName = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/project/${task.ProjectID}`);
      setProjectName(res.data.ProjectName); // Assuming the response has a field 'projectName'
    } catch (error) {
      console.error("Error fetching project name:", error);
    }
  };

  useEffect(() => {
    fetchProjectName();
  }, []);

  const setTaskPopOut = async () => {
    if (sideTaskDetails === false) {
      showSideTaskDetails();
      //---
      
      console.log(task.taskID);
      taskdispatch({ type: "get_selected_task", payload: null });
      const res = await axios.get(`http://localhost:3000/task/${task.taskID}`);
      await taskdispatch({ type: "get_selected_task", payload: res.data });
      setInitialLoad(false);
      openModal();
      console.log("if popout" + task);
    } 
   
  };

  //import component as body such as forms, details, etc
  const body = (
    <div className="modal-container">
      <TaskDetailsForm task={task} closeModal={closeModal} />
    </div>
  );
  return (
    <>
      <li className="task-task-item" onClick={setTaskPopOut}>
        <div style={{ display: "flex", alignItems: "center" }}>
          
          <p
            style={{
              paddingLeft: "5px",
              color: "gray",
              WebkitUserSelect: "none",
              MozUserSelect: "none",
              msUserSelect: "none",
            }}
          >
            {task.taskName}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            className={`task-project-home-name-container task-project-${task.ProjectID}`}
          >
            <p
              style={{
                margin: "0px",
                padding: "5px",
                fontSize: "12px",
                fontWeight: "500",
                WebkitUserSelect: "none",
                MozUserSelect: "none",
                msUserSelect: "none",
              }}
            >
              {ProjectName}
            </p>
          </div>
          <div
            style={{
              width: "73px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <p
              style={{
                color: "gray",
                WebkitUserSelect: "none",
                MozUserSelect: "none",
                msUserSelect: "none",
              }}
            >
              {endDate.format("MMM D YYYY")}
            </p>
          </div>
        </div>
      </li>
      <Modal open={open} onClose={closeModal}>
        {body}
      </Modal>
    </>
  );
};

export default TaskItemTask;
 