import React, { useState, useContext, useEffect } from "react";
import "../../css/Task.css";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { Modal } from "@material-ui/core";
import { useForm, useFieldArray } from "react-hook-form";
import { Context as ProjectContext } from "../../context/store/ProjectStore";
import { Context as TasklistContext } from "../../context/store/TasklistStore";
import { Context as TaskContext } from "../../context/store/TaskStore";
import { format } from "date-fns";
import axios from "axios";
import { ToastProvider } from "react-toast-notifications";
import { useParams } from "react-router-dom";
import { FitnessCenterIcon, AssignmentTurnedIn, DateRange, Description, PersonAdd, Title, AddCircleOutline, RemoveCircle, Email, EmailOutlined, LinearScale, LinearScaleOutlined } from "@material-ui/icons";

const TaskForm = ({
  handleNewClose,
  clickClose,
  open,
  setTasklists,
  showSideTaskForm,
  selectedTask,
}) => {
    const { projectId } = useParams();
    const { register, handleSubmit, control, errors } = useForm({
        defaultValues: selectedTask || {} // Set default values if selectedTask is provided
      });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "assignedUsers",
  });
  const [weightError, setWeightError] = useState("");
  const [assigneeError, setAssigneeError] = useState();
  const [taskName, setTaskName] = useState();
  const [projects, setProjects] = useState([]);
  const [projectError, setProjectError] = useState("");
  const [projectState, projectdispatch] = useContext(ProjectContext);
  const [taskState, taskdispatch] = useContext(TaskContext);
  const [statusOptions, setStatusOptions] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
//   const [selectedProjectId, setSelectedProjectId] = useState(null);


  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleStartDateChange = (date) => {
    console.log("Start Date Changed:", date);
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    console.log("End Date Changed:", date);
    setEndDate(date);
  };

  const handleNameChange = (e) => {
    setTaskName(e.target.value);
  };

  const isValidWeight = (value) => {
  
    const weight = parseFloat(value);
    return !isNaN(weight) && weight >= 0 && weight <= 100;
  };
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://localhost:3000/project");
        setProjects(response.data);
        console.log(projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

//   useEffect(() => {
//     if (watch("projectId")) {
//       fetchProjectDetails(watch("projectId"))
//         .then((result) => {
//           setSelectedProjectId(result);
//         })
//         .catch((error) => {
//           console.error("Error fetching project details:", error);
//         });
//     }
//   }, [watch("projectId")]);

useEffect(() => {
    if (selectedTask?.projectId) {
      fetchProjectDetails(selectedTask.projectId)
        .then((result) => {
          setStatusOptions(result.TaskList);
          setAssignedUsers(result.Users);
        })
        .catch((error) => {
          console.error("Error fetching project details:", error);
        });
    }
  }, [selectedTask]);

  const fetchProjectDetails = async (projectId) => {
    try {
      console.log(projectId);
      const res = await axios.get(`http://localhost:3000/project/${projectId}`);
      console.log(res.data);
      setAssignedUsers(res.data.Users);
      setStatusOptions(res.data.TaskList);
      console.log(assignedUsers);
      console.log(statusOptions);
    } catch (error) {
      console.error("Error fetching project details:", error);
    }
  };
  const onSubmit = async (data) => {
    const {
      taskName,
      description,
      startDate,
      endDate,
      status,
      assignedUser,
      projectId,
      weight,
    } = data;

    const formattedStartDate = startDate;
    const formattedEndDate = endDate;

    console.log("Submitting Task Form:", {
      taskName,
      description,
      startDate,
      endDate,
      status,
      assignedUser,
      projectId,
      weight,
    });

    if (!weight) {
      setWeightError("Weight is required");
      return;
    }

    if (!isValidWeight(weight)) {
      setWeightError("Invalid weight value");
      return;
    }
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);

    try {
      const response = await axios.post(`http://localhost:3000/task`, {
        taskName,
        description,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        status,
        weight,
        assignedUser,
        projectId,
      });

      console.log("Assigned Users:", assignedUsers);
      console.log("Response from Backend:", response);

      if (setTasklists) {
        const taskResponse = await axios.get(`http://localhost:3000/task`);
        setTasklists(taskResponse.data);
      }

      showSideTaskForm();
    } catch (error) {
      console.error("Error submitting task:", error);
    }
  };

  return (
    <ToastProvider>
        <form className="form-container" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-top-container">
          <div className="form-section">
            <div className="input-container" >
                <input
                  name="taskName"
                  type="text"
                  className="form-input"
                  placeholder={"Task Name"}
                  ref={register({ required: true })}
                  onChange={handleNameChange}
                />
                <Title className="form-icon" />
                {errors.taskName && (
                  <p className="error-message">Task name is required</p>
                )}
            </div>
            <div className="input-container">
              <textarea
                name="description"
                placeholder={"Description"}
                className="form-input"
                rows={10}
                cols={60}
                ref={register}
              ></textarea>
              <Description className="form-icon" style={{ top: "10%" }}/>
            </div>
            
            <div className="input-container">
              <input
                type="date"
                name="startDate"
                selected={startDate}
                placeholder={"Start Date"}
                onChange={handleStartDateChange}
                className="form-input"
                ref={register}
              />
              <DateRange className="form-icon" />
            </div>
            <div className="input-container">
              <input
                type="date"
                name="endDate"
                selected={endDate}
                placeholder={"End Date"}
                onChange={handleEndDateChange}
                className="form-input"
                ref={register}
              />
              <DateRange className="form-icon" />
            </div>
            <div className="input-container">
              <select name="status" 
                placeholder={"Select Status"}
                className="form-input" ref={register}>
                {statusOptions.map((status) => (
                  <option key={status.column_index} value={status.name}>
                    {status.name}
                  </option>
                ))}
              </select>
            <AssignmentTurnedIn className="form-icon" />
            </div>
           <div className="input-container">
          <input
            name="weight"
            type="number"
            step="0.01"
            className="form-input"
            placeholder="Weight"
            ref={register({
              required: true,
              validate: {
                validWeight: (value) => isValidWeight(value),
              },
            })}
          />
          <LinearScaleOutlined className="form-icon" />

          {errors.weight && errors.weight.type === "required" && (
            <p className="error-message">Weight is required</p>
          )}
          {errors.weight && errors.weight.type === "validWeight" && (
            <p className="error-message">Invalid weight value</p>
          )}
          {weightError && <p className="error-message">{weightError}</p>}
        </div>
    </div>
            <div className="input-container">
            {fields.map((field, index) => (
      <div key={field.id} className="assigned-user-field">
        <select
          name={`assignedUser[${index}]`}
          className="form-input"
          ref={register}
          defaultValue={field.value || ''}
        >
          <EmailOutlined style={{marginTop:'10px'}}/>
          <option value="">Choose Assigned User</option>
          {assignedUsers.map((user) => (
            <option key={user.id} value={user.id}>
              {user.Email}
            </option>
          ))}
        </select>
        <button type="button" onClick={() => remove(index)}>
            <RemoveCircle style={{marginRight:'5px', color: '#011e53'}}/>
          Remove
        </button>
      </div>
    ))}
    <button type="button" className="form-input" onClick={() => append({})}>
      <PersonAdd style={{marginRight:'15px', color: '#011e53'}}/>
      Asign Task To Someone
    </button>
          </div>
          </div>

          <div className="form-buttons">
            <Button
              onClick={clickClose}
              className="cancel-button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="submit-button enabled"
              style={{ margin: "20px" }}
            >
              Create Task
            </Button>
          </div>
        </form>
    </ToastProvider>
  );
};
export default TaskForm;
