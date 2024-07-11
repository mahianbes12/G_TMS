import React, { useContext, useState } from "react";
import { Modal } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { useForm } from "react-hook-form";
import { ToastProvider } from "react-toast-notifications";
import { useToasts } from "react-toast-notifications";
import { Context as TeamContext } from "../../context/store/TeamStore";
import { Context as ProjectContext } from "../../context/store/ProjectStore";
import "../../css/Forms.css";
import axios from "axios";
import {
  Title,
  Description,
  Event,
  Today,
  AssignmentTurnedIn,
} from "@material-ui/icons";

const ProjectForm = ({
  handleNewClose,
  clickClose,
  open,
  setTeamProjects,
  showSideProjectForm,
}) => {
  const { register, handleSubmit, errors, clearErrors } = useForm();
  const [projectName, setProjectName] = useState();
  const [projectState, projectdispatch] = useContext(ProjectContext);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const { addToast } = useToasts();
  const userId = localStorage.getItem("userId");

  const handleNameChange = (e) => {
    setProjectName(e.target.value);
  };
  const handleUserKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {

      handleSubmit(onSubmit)();
    }
  };
  const onSubmit = async (data) => {
    const { ProjectName, Description, StartDate, EndDate, Status } = data;
    console.log(data);
    if (!ProjectName) {
      addToast("Please fill out the project name", {
        appearance: "error",
        autoDismiss: true,
        autoDismissTimeout: 5000,
      });
      return;
    }

    if (!StartDate) {
      addToast("Please select a start date", {
        appearance: "error",
        autoDismiss: true,
        autoDismissTimeout: 5000,
      });
      return;
    }

    if (EndDate && StartDate && new Date(EndDate) < new Date(StartDate)) {
      setErrorMessage("End date cannot be before start date");
      addToast(errorMessage, {
        appearance: "error",
        autoDismiss: true,
        autoDismissTimeout: 5000,
      });
      setShowErrorModal(true);
      return;
    }
const postData = {
    userId: Number(userId),
  };

  if (ProjectName) {
    postData.ProjectName = ProjectName;
  }

  if (Description) {
    postData.Description = Description;
  }

  if (StartDate) {
    postData.StartDate = StartDate;
  }

  if (EndDate) {
    postData.EndDate = EndDate;
  }

  if (Status) {
    postData.Status = Status;
  }
console.log(postData);
  try {
    await axios.post("http://localhost:3000/project", postData);


      const res = await axios.get(
        `http://localhost:3000/project/user/${userId}`,
        { userId: userId }
      );
      await projectdispatch({ type: "get_user_projects", payload: res.data });

      addToast("Project created successfully", {
        appearance: "success",
        autoDismiss: true,
        autoDismissTimeout: 5000,
      });
      setShowSuccessModal(true);
      showSideProjectForm();
    } catch (error) {
      
  console.error(error);
      setErrorMessage("there is an error with creating the project");
      addToast(errorMessage, {
        appearance: "error",
        autoDismiss: true,
        autoDismissTimeout: 5000,
      });
    }
  };

  return (
    <ToastProvider>
      <form className="form-container" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-top-container">
          <div className="form-section">
            <div className="input-container">
              <input
                name="ProjectName"
                type="text"
                placeholder={"Project Name"}
                className="form-input"
                onChange={handleNameChange}
                onKeyPress={handleUserKeyPress}
                ref={register({ required: true })}
              />
              <Title className="form-icon" />
              {errors.name?.type === "required" && (
                <p className="error-message">{errorMessage.message}</p>
              )}
            </div>
            <div className="input-container">
              <textarea
                name="Description"
                placeholder="Description"
                className="form-input"
                ref={register}
                rows={10}
                cols={60}
              />
              <Description className="form-icon" style={{ top: "10%" }} />
            </div>
            <div className="input-container">
              <input
                name="StartDate"
                type="date"
                className="form-input"
                ref={register}
              />
              <Event className="form-icon" />
            </div>
            <div className="input-container">
              <input
                name="EndDate"
                type="date"
                className="form-input"
                ref={register}
              />
              <Event className="form-icon" />
            </div>
            <div className="input-container">
              <select name="Status" className="form-input" ref={register}>
                <option value="Open">Select Status</option>
                <option value="Open">Open</option>
                {/* <option value="Resolved">Resolved</option> */}
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
              <AssignmentTurnedIn className="form-icon" />
            </div>
          </div>
        </div>

        <div className="form-button-container">
          <button
            className="cancel-button"
            onClick={showSideProjectForm}
            color="primary"
          >
            Cancel
          </button>
          <button
            className={
              projectName ? "submit-button enabled" : "submit-button disabled"
            }
            disabled={projectName ? false : true}
            type="submit"
          >
            Create Project
          </button>
        </div>
      </form>
    </ToastProvider>
  );
};

export default ProjectForm;
