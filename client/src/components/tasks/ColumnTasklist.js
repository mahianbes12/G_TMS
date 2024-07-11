import React, { useEffect, useState, useContext } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Modal, responsiveFontSizes } from "@material-ui/core";
import { useParams } from "react-router-dom";
import AddTaskProjectForm from "../Forms/AddTaskProjectForm";
import ColumnTaskItem from "./ColumnTaskItem";
import { Context as TasklistContext } from "../../context/store/TasklistStore";
import { Context as TaskContext } from "../../context/store/TaskStore";
import { AiOutlineEllipsis } from "react-icons/ai";
import { Menu, MenuItem } from "@material-ui/core";
import axios from "axios";

const ColumnTasklist = ({
  tasklist,
  index,
  setTasklists,
  showSideTaskDetails,
  sideTaskDetails,
  showSideTaskForm,
  setShowModal
}) => {
  const { projectId } = useParams();
  const [openTaskProjectForm, setOpenTaskProjectForm] = useState(false);
  // const [tasklistTasks, setTasklistTasks] = useState();
  const [columnTitle, setColumnTitle] = useState(tasklist);
  const [titleSelect, setTitleSelect] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [taskState, taskdispatch] = useContext(TaskContext);
  const [tasklistState, tasklistdispatch] = useContext(TasklistContext);
  const [task, setTask] = useState(taskState.tasks);

  const openTaskProjectFormModal = () => {
    setOpenTaskProjectForm(true);
  };

  const closeTaskProjectFormModal = () => {
    setOpenTaskProjectForm(false);
  };

  const handleAddTaskClick = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/project/${projectId}/tasklists`
      );
      const tasklist = response.data.TaskList;
      console.log(tasklist);
      console.log(columnTitle);

      // Dispatch action to update selected tasklist
      tasklistdispatch({
        type: "get_selected_tasklist",
        payload: tasklist,
      });

      showSideTaskForm();
    } catch (error) {
      console.error("Error:", error);
      // Handle the error appropriately (e.g., show an error message)
    }
  };
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleTitleChange = (e) => {
    setTitleSelect(true);
  };

  const handleTitleUpdate = (e) => {
    setColumnTitle(e.target.value);
  };

  const handleTasklistDelete = async (e) => {
    // console.log(tasklist.id);
    handleMenuClose();
    await axios.delete(
      `http://localhost:3000/project/tasklist/${tasklist.id}`,
      { projectId }
    );
    const resp = await axios.get(
      `http://localhost:3000/project/${projectId}/tasklists`
    );
    setTasklists(resp.data.TaskList);
  };

  const updateAndCloseTitle = async (e) => {
    await axios.put(`http//localhost/3000/tasklist/${tasklist.id}/title`, {
      columnTitle,
    });
    const resp = await axios.get(
      `http://localhost:3000/project/${projectId}/tasklists`
    );
    setTasklists(resp.data.TaskList);
    setTitleSelect(false);
  };

  const getTasklists = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/project/${projectId}/tasklists`
      );
      setTasklists(res.data.TaskList);
      console.log();
    } catch (err) {
      console.log(err);
    }
  };

  const getTask = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/project/${projectId}`,
        { id: projectId }
      );
      setTask(res.data.Tasks);
      console.log(task);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getTasklists();
    getTask();
  }, []);
//setColumnTitle, tasklist, task


  return (
    <div key={tasklist.name}>
      <Draggable
        type="tasklist"
        draggableId={`Column-${tasklist}`}
        index={index}
        key={`Column-${tasklist}`}
      >
        {(provided) => (
          <div
            className="tasklist-container"
            {...provided.draggableProps}
            ref={provided.innerRef}
            {...provided.dragHandleProps}
          >
            <div className="tasklist-header">
              <div className="tasklist-title" onClick={handleTitleChange}>
                {titleSelect ? (
                  <form>
                    <textarea
                      className="tasklist-title__textarea"
                      placeholder="Enter column name here.."
                      value={columnTitle}
                      onChange={handleTitleUpdate}
                      onBlur={updateAndCloseTitle}
                      autoFocus
                    ></textarea>
                  </form>
                ) : (
                  tasklist
                )}
              </div>

              <div className="tasklist-more-menu" onClick={handleMenuClick}>
                <AiOutlineEllipsis style={{ fontSize: "24px" }} />
              </div>
              <Menu
                style={{}}
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleTasklistDelete}>Delete</MenuItem>
              </Menu>
            </div>
            <Droppable type="task" droppableId={`${tasklist}-${index}`}>
              {(provided) => (
                <div
                  className="tasklist-task--list"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {Array.isArray(task) &&
                    task.map((eachtask, index) => {
                      if (eachtask.status === tasklist) {
                        return (
                          <ColumnTaskItem
                          key={index}
                          task={eachtask}
                          index={index}
                          taskListStatus={tasklist.name}
                          showSideTaskDetails={showSideTaskDetails}
                          sideTaskDetails={sideTaskDetails}
                          setShowModal={setShowModal} 
                          projectId={tasklist.projectId} // Ensure projectId is being passed
                          taskId={eachtask.taskID} // Ensure taskId is being passed
                          />
                        );
                      }
                    })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

              <div
              className="tasklist-new-task--button"
              onClick={() => showSideTaskForm(tasklist)}
            >
              + Add task
            </div>
          </div>
        )}
      </Draggable>
      <div>
        {/* <Modal
          className="modal"
          style={{ backgroundColor: "white" }}
          open={openTaskProjectForm}
          onClose={closeTaskProjectFormModal}
        >
          <div className="modal-container">
            <AddTaskProjectForm
              setTasklists={setTasklists}
              // setTasklistTasks={setTasklistTasks}
              tasklistId={tasklist.id}
              projectId={tasklist.project_id}
              clickClose={closeTaskProjectFormModal}
              open={openTaskProjectForm}
            ></AddTaskProjectForm>
          </div>
        </Modal> */}
      </div>
    </div>
  );
};

export default ColumnTasklist;
