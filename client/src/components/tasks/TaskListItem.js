import React, { useEffect, useState } from "react";
import TaskItemProject from "./TaskItemProject";
import "../../css/TaskList.css";
import Loader from "../Loader";
import { Modal } from "@material-ui/core";
import { Draggable, Droppable } from "react-beautiful-dnd";
import AddTaskProjectForm from "../Forms/AddTaskProjectForm";
import axios from "axios";

//Project page task list
const TaskListItem = ({ index, task, tasks, setTasks }) => {
  const [tasklistTasks, setTasklistTasks] = useState();
  const [loading, setLoading] = useState(true);
  const [openTaskProjectForm, setOpenTaskProjectForm] = useState(false);

  // const getTasks = async () => {
  //   try {
  //     const res = await axios.get(`/tasklist/${tasklist.id}/tasks`);
  //     setTasks(res.data);
  //     setLoading(false);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const openTaskProjectFormModal = () => {
    setOpenTaskProjectForm(true);
  };

  const closeTaskProjectFormModal = () => {
    setOpenTaskProjectForm(false);
  };

  const updateTasks = async () => {
    //returns individual tasklist tasks
    const res = await axios.get(`http://localhost:3000/task/${task.taskID}`);
    setTasklistTasks(res.data);
    setLoading(false);
  };
  useEffect(() => {
    updateTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setTasklistTasks]);

  if (loading) {
    return <Loader />;
  }

  const renderedTasks = tasklistTasks.map((task, i) => {
    return (
      <TaskItemProject
        // setTasks={setTasks}
        setTasklistTasks={setTasklistTasks}
        task={task}
        key={task.id}
        index={i}
      />
    );
  });

  const taskProjectFormModal = (
    <div className="modal-container">
      <AddTaskProjectForm
        // setTasks={setTasks}
        setTasklistTasks={setTasklistTasks}
        tasklistId={task.taskID}
        projectId={task.projectID}
        clickClose={closeTaskProjectFormModal}
        open={openTaskProjectForm}
      ></AddTaskProjectForm>
    </div>
  );

  return (
    <div>
      <Draggable
        type="tasklist"
        draggableId={`Column-${task.column_index.toString()}`}
        index={index}
        key={`Column-${task.taskID.toString()}`}
      >
        {(provided) => (
          <div
            className="tasklist-container"
            {...provided.draggableProps}
            ref={provided.innerRef}
            {...provided.dragHandleProps}
          >
            <div className="tasklist-header">{task.taskName}</div>
            <div className="tasklist-add-task--button"></div>
            <Droppable type="task" droppableId={`${task.taskID.toString()}`}>
              {(provided) => (
                <div
                  className="tasklist-task--list"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {renderedTasks}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            <div
              className="tasklist-new-task--button"
              onClick={openTaskProjectFormModal}
            >
              + Add task
            </div>
          </div>
        )}
      </Draggable>
      <div>
        <Modal open={openTaskProjectForm} onClose={closeTaskProjectFormModal}>
          {taskProjectFormModal}
        </Modal>
      </div>
    </div>
  );
};

export default TaskListItem;
