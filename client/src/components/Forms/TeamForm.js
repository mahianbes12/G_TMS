import React, { useContext, useEffect, useState } from "react";
import { Modal, Tooltip } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { useForm } from "react-hook-form";
import TextField from "@material-ui/core/TextField";
import { Context as TeamContext } from "../../context/store/TeamStore";
import { ToastProvider, useToasts } from "react-toast-notifications";
import { AssignmentTurnedIn, Description, Title, PersonAdd } from "@material-ui/icons";
import { RiCloseLine } from "react-icons/ri";
import axios from "axios";
import "../../css/Forms.css";

const TeamForm = ({ title, clickClose, open }) => {
  const { register, handleSubmit, errors } = useForm();
  const [teamState, teamdispatch] = useContext(TeamContext);
  const userId = localStorage.getItem("userId");
  const [modalOpen, setModalOpen] = useState(false);
  const [userEmails, setUserEmails] = useState([]);
  const [addedEmails, setAddedEmails] = useState([]);
  const [emailError, setEmailError] = useState("");
  const [selectedProject, setSelectedProject] = useState([]);
  const [userPermissions, setUserPermissions] = useState([]);

  const { addToast } = useToasts();

  useEffect(async() => {
      try {
        const projectsResponse = await axios.get(`http://localhost:3000/project/user/${userId}`);
        setSelectedProject(projectsResponse.data);

        const userResponse = await axios.get(`http://localhost:3000/user/${userId}`);
        setUserPermissions(userResponse.data.CanChangeProjects || []);
        console.log(userPermissions);
      } catch (error) {
        console.error("Error fetching data:", error);
        addToast("An error occurred while getting your projects or permissions.", {
          appearance: "error",
          autoDismiss: true,
          autoDismissTimeout: 5000,
        });
      }
  }, [userId]);

  useEffect(() => {
    // if (selectedProject.length === 0) {
    //   addToast("Please create a project first before creating a team.", {
    //     appearance: "warning",
    //     autoDismiss: true,
    //     autoDismissTimeout: 5000,
    //   });
    // }
  }, [selectedProject.length, addToast]);

  const isEmailValid = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleDeleteEmail = (email) => {
    const updatedEmails = addedEmails.filter((addedEmail) => addedEmail !== email);
    setAddedEmails(updatedEmails);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const EmailInputModal = ({ open, onClose, onAddEmail }) => {
    const [email, setEmail] = useState("");

    const handleEmailChange = (event) => {
      setEmail(event.target.value);
      setEmailError("");
    };

    const handleAddEmail = () => {
      if (email.trim() !== "") {
        if (isEmailValid(email.trim())) {
          onAddEmail(email.trim());
          setEmail("");
          setAddedEmails([...addedEmails, email.trim()]);
        } else {
          setEmailError("Invalid email format");
        }
      }
    };

    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        handleAddEmail();
      }
    };

    return (
      <Modal open={open} onClose={onClose} className="reactModalPortal">
        <div className="modal-container">
          <div className="email-input-modal">
            <TextField
              value={email}
              onChange={handleEmailChange}
              onKeyPress={handleKeyPress}
              label="Enter Email"
              variant="outlined"
              error={Boolean(emailError)}
              helperText={emailError}
            />
            <Button onClick={handleAddEmail} variant="contained" color="primary">
              Add
            </Button>
          </div>
        </div>
      </Modal>
    );
  };

  const onSubmit = async (data) => {
    const { teamName, description, projectId } = data;

    try {
      const response = await axios.post(`http://localhost:3000/team`, {
        teamName,
        description,
        userId,
        userEmails: addedEmails,
        projectId,
      });


      clickClose();
      addToast("Team Created successfully!", {
        appearance: "success",
        autoDismiss: true,
        autoDismissTimeout: 5000,
      });
    } catch (error) {
      clickClose();
      console.error("Error submitting team:", error);
      const errorMessage = error.response?.data.error || "An error occurred while submitting the team.";
      addToast(errorMessage, {
        appearance: "error",
        autoDismiss: true,
        autoDismissTimeout: 5000,
      });
    }
  };

  if (selectedProject.length === 0) {
    return null;
  }

  return (
    <div className="popout-form-container">
      <div className="popout-form-top">
        <div className="popout-form-header">
          <h2 className="form-header">{title}</h2>
        </div>
        <div className="popout-form-close-icon">
          <RiCloseLine
            style={{ color: "black", fontSize: "24px", cursor: "pointer" }}
            onClick={clickClose}
          />
        </div>
      </div>
      <form className="form-container" style={{ backgroundColor: "white" }} onSubmit={handleSubmit(onSubmit)}>
        <div className="form-top-container">
          <div className="form-section">
            <div className="input-container">
              <input
                name="teamName"
                type="text"
                placeholder="Team Name"
                className="form-input"
                ref={register({ required: true })}
              />
              <Title className="form-icon" />
              {errors.teamName && <p className="error-message">Please enter a team name</p>}
            </div>
            <div className="input-container">
              <select
                id="project-select"
                name="projectId"
                className="form-input"
                ref={register({ required: true })}
              >
                <option value="">Choose Project</option>
                {selectedProject.map((project) => (
                  userPermissions.includes(project.ProjectID) ? (
                    <option key={project.id} value={project.id}>
                      {project.ProjectName}
                    </option>
                  ) : (
                    <Tooltip key={project.id} title="You cannot select this project. Create or select your own project." arrow>
                      <option value={project.id} disabled>
                        {project.ProjectName}
                      </option>
                    </Tooltip>
                  )
                ))}
              </select>
              <AssignmentTurnedIn className="form-icon" />
              {errors.projectId && <p className="error-message">Please choose a project</p>}
            </div>
            <div className="input-container">
              <textarea
                name="description"
                placeholder="Team Description"
                className="form-input"
                ref={register}
                rows={10}
                cols={30}
              ></textarea>
              <Description className="form-icon" style={{ top: "10%" }} />
            </div>
            <div className="form-top-middle">
              <Button
                variant="outlined"
                color="primary"
                onClick={openModal}
                className="form-input"
              >
                <PersonAdd style={{ marginRight: "15px", color: "#011e53" }} />
                Add members
              </Button>
              <EmailInputModal
                open={modalOpen}
                onClose={closeModal}
                onAddEmail={(email) => {
                  setUserEmails([...userEmails, email]);
                  setAddedEmails([...addedEmails, email]);
                }}
              />
            </div>
          </div>
        </div>
        <div>
          {addedEmails.map((email, index) => (
            <Button
              key={`${email}-${index}`}
              variant="outlined"
              color="primary"
              style={{ marginRight: "8px", marginBottom: "8px" }}
            >
              {email}
              <span
                style={{ margin: "10px", color: "red", border: "1px red" }}
                onClick={() => handleDeleteEmail(email)}
              >
                x
              </span>
            </Button>
          ))}
        </div>
        <div className="form-buttons">
          <Button onClick={clickClose} color="primary" className="cancel-button">
            Cancel
          </Button>
          <Button
            style={{ margin: "20px" }}
            type="submit"
            variant="contained"
            color="primary"
            className="submit-button"
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TeamForm;
