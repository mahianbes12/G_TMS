import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Modal, responsiveFontSizes } from "@material-ui/core";
import Loader from "../Loader";
import TopNavBar from "../NavigationBar/TopNavBar";
import TaskListForm from "../Forms/TaskListForm";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import PopOutTaskDetails from "../PopOutMenu/PopOutTaskDetails";
import AddTasklistPopOut from "../PopOutMenu/AddTasklistPopOut";
import AddTaskPopOutProjectPage from "../PopOutMenu/AddTaskPopOutProjectPage";
import TaskDetailsForm from "../tasks/TaskDetailsForm";
import { Context as TaskContext } from "../../context/store/TaskStore";
import "../../css/TaskList.css";
import ColumnTasklist from "../tasks/ColumnTasklist";
import Add from "../../assets/Add";
import axios from "axios";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";

const ProjectPage = ({ sidebar }) => {
  const { projectId, projectName, teamId } = useParams();
  const [taskState, taskdispatch] = useContext(TaskContext);
  const [openTasklistForm, setOpenTasklistForm] = useState(false);
  const [project, setProject] = useState();
  const [tasklists, setTasklists] = useState([]);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  const location = useLocation(); // Assuming the project ID is the 5th segment in the URL

  //Side Menus
  const [sideTaskForm, setSideTaskForm] = useState(false);
  const [sideTasklistForm, setSideTasklistForm] = useState(false);
  const [sideTaskDetails, setSideTaskDetails] = useState(false);

  const [task, setTask] = useState([]);
  const [showModal, setShowModal] = useState(false); // Modal state
  const [selectedTask, setSelectedTask] = useState(null); // Selected task state
  const [selectedColumnName, setSelectedColumnName] = useState('');

  const showSideTaskForm = (columnName) => {
    setSelectedColumnName(columnName);
    setSideTaskDetails(false);
    setSideTasklistForm(false);
    setSideTaskForm(!sideTaskForm);
  };
  

  const showSideTasklistForm = () => {
    setSideTaskDetails(false);
    setSideTaskForm(false);
    setSideTasklistForm(!sideTasklistForm);
  };

  const showSideTaskDetails = () => {
    setSideTasklistForm(false);
    setSideTaskForm(false);
    setSideTaskDetails(!sideTaskDetails);
  };

  const [loading, setLoading] = useState(true);

  const openTasklistFormModal = () => {
    setOpenTasklistForm(true);
  };

  const closeTasklistFormModal = () => {
    setOpenTasklistForm(false);
  };

  const onDragEnd = async (result) => {
    console.log(result, "result");
    const { destination, source, draggableId, type } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === "column") {
      const redorderedLists = reorderTasklists(
        tasklists,
        source.index,
        destination.index
      );

      setTasklists(redorderedLists);
      console.log(redorderedLists, "reordedLists");
      redorderedLists.map((list, index) => {
        return updateTasklist(index, list.id, list.column_index);
      });
    }

    if (type === "task") {
      updateTasks(source, destination, draggableId);
      const destinationTasklistId = destination.droppableId.split("-")[0];
      const destinationIndexId = destination.droppableId.split("-")[1];
      const sourceTasklistId = source.droppableId.split("-")[0];
      const sourceIndexId = source.droppableId.split("-")[1];
      const destinationTaskIndex = destination.index;
      const sourceTaskIndex = source.index;

      //sets source tasklist
      let sourceTasklist = tasklists[sourceIndexId].Tasks;
      //sets destination tasklist
      let destinationTasklist = tasklists[destinationIndexId].Tasks;

      reorderTasks(sourceTasklist, destinationTasklist, source, destination);
    }
  };

  const reorderTasklists = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const reorderTasks = (
    sourceTasklist,
    destinationTasklist,
    source,
    destination
  ) => {
    let sourceTask = sourceTasklist.splice(source.index, 1);
    destinationTasklist.splice(destination.index, 0, sourceTask[0]);
  };

  const updateTasklist = async (newIndex, tasklistId, columnIndex) => {
    await axios.put(
      `http://localhost:3000/project/${tasklistId}/columnindex/`,
      { newIndex }
    );
  };

  const updateTasks = async (source, destination, draggableId) => {
    const sourceColumnId = source.droppableId;
    const destinationTasklistId = destination.droppableId.split("-")[0];
    const destinationIndexId = destination.droppableId.split("-")[1];
    const sourceTasklistId = source.droppableId.split("-")[0];
    const sourceIndexId = source.droppableId.split("-")[1];
    const taskId = draggableId;
    const updatedTasklist = await axios.put(
      `http://localhost:3000/task/${taskId}/tasklist`,
      {
        destinationTasklistId,
      }
    );

    const destinationIndex = destination.index; //index of task in tasklist
    const updatedTaskIndex = await axios.put(
      `http://localhost:3000/task/${taskId}/taskindex`,
      {
        destinationIndex,
      }
    );
  };
  const getTask = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/project/${projectId}`,
        { id: projectId }
      );
      setTask(res.data.Tasks);
      console.log(res.data.Tasks);
      calculateProgress(res.data.Tasks); // Call the function with the fetched tasks
    } catch (err) {
      console.log(err);
    }
  };

  const calculateProgress = (tasks) => {
    let totalWeight = 0;
    let completedWeight = 0;

    for (const task of tasks) {
      totalWeight += task.weight || 0;
      if (task.status === "Completed") {
        completedWeight += task.weight || 0;
      }
    }

    const progressPercentage = totalWeight
      ? (completedWeight / totalWeight) * 100
      : 0;
    const formattedProgress = progressPercentage.toFixed(1);
    setProgress(parseFloat(formattedProgress));
  };

  const getProject = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/project/${projectId}`);
      // await getTasklists();
      console.log(projectId);
      const resp = await axios.get(
        `http://localhost:3000/project/${projectId}/tasklists`,
        { id: projectId }
      );
      setProject(res.data);
      const resptl = resp.data.TaskList;
      console.log(resptl);
      setTasklists(resptl || []);
      console.log(tasklists);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
    taskdispatch({ type: "get_selected_task", payload: null }); // Reset selected task
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  useEffect(() => {
    getTask();
    getProject();
    taskdispatch({ type: "get_selected_task", payload: null });
  }, []);

  if (loading) {
    return <Loader />;
  }

  //Task list creation
  const tasklistFormModal = (
    <div className="modal-container">
      <TaskListForm
        setTasklists={setTasklists}
        projectId={projectId}
        clickClose={closeTasklistFormModal}
        open={openTasklistForm}
      ></TaskListForm>
    </div>
  );

  console.log(tasklists);
  const renderedTasklists = Array.isArray(tasklists)
    ? tasklists.map((task, index) => (
        <ColumnTasklist
          key={index}
          tasklist={task.name}
          index={task.column_index}
          setTasklists={setTasklists}
          showSideTaskDetails={showSideTaskDetails}
          sideTaskDetails={sideTaskDetails}
          showSideTaskForm={showSideTaskForm}
          setShowModal={setShowModal} // Pass setShowModal to ColumnTasklist
        />
      ))
    : null;

  //----------------------------------------------Project
  return (
    <>
      <TopNavBar
        name={project.ProjectName}
        setTasklists={setTasklists}
        sidebar={sidebar}
      />
      <div
        style={{
          width: "1000px",
          backgroundColor: "#e0e0de",
          borderRadius: "50px",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "24px",
            backgroundColor: progress === 100 ? "#4caf50" : "#fbc02d",
            borderRadius: "inherit",
            textAlign: "right",
            padding: "5px",
            color: "white",
            border: "black",
          }}
        >
          {progress}%
        </div>
      </div>
      <div className="project-page-container">
        <div className="project-page-main-content">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable
              droppableId="all-columns"
              direction="horizontal"
              type="column"
            >
              {(provided) => (
                <div
                  className="project-container"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {renderedTasklists}

                  {provided.placeholder}
                  <div
                    className="tasklist-new-tasklist--button"
                    // onClick={openTasklistFormModal}
                    onClick={showSideTasklistForm}
                  >
                    <div
                      style={{
                        display: "flex",
                        transform: "rotate(90deg)",
                        alignItems: "center",
                        whiteSpace: "nowrap",
                        marginTop: "50px",
                      }}
                    >
                      <Add /> Add Column
                    </div>
                  </div>
                  <div className="progress-bar-container"></div>
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {/* {sideTaskDetails && taskState.selectedTask ? (
            <PopOutTaskDetails
              showSideTaskDetails={showSideTaskDetails}
              sideTaskDetails={sideTaskDetails}
            />
          ) : null} */}
          {sideTasklistForm ? (
            <AddTasklistPopOut
              showSideTasklistForm={showSideTasklistForm}
              title={"Add Tasklist"}
              setTasklists={setTasklists}
            />
          ) : null}

          {sideTaskForm ? (
            <Modal
              open={sideTaskForm}
              onRequestClose={() => setIsTaskFormOpen(false)}
              contentLabel="Add Task"
              className="reactModalPortal"
            >
              <div className="modal-content">
                <AddTaskPopOutProjectPage
                  showSideTaskForm={showSideTaskForm}
                  title={
                    <div className="title" style={{ color: "#011e53" }}>
                      <AddCircleIcon className="modal-icon" />
                      Add Task
                    </div>
                  }
                  setTasklists={setTasklists}
                  selectedColumnName={selectedColumnName} // Pass the selected column name
                />
              </div>
            </Modal>
          ) : null}

          {/* Modal for task details */}
          <Modal
            open={showModal}
            onClose={handleCloseModal}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
          >
            <div>
              <TaskDetailsForm
                task={selectedTask}
                onClose={handleCloseModal}
                projectId={projectId}
              />
            </div>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default ProjectPage;
