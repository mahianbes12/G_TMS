import React, { useState, useContext, useEffect } from "react";
import { Modal } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { useForm } from "react-hook-form";
import TextField from "@material-ui/core/TextField";
import { message } from 'antd';
import axios from "axios";
import { Context as TeamContext } from "../../context/store/TeamStore";
import "../../css/Forms.css";

const TeamDetails = ({ team, open, handleClose, fetchTeams }) => {
  const { register, handleSubmit, errors, setValue } = useForm();
  const [modalOpen, setModalOpen] = useState(false);
  const [userEmails, setUserEmails] = useState([]);
  const [addedEmails, setAddedEmails] = useState([]);
  const [emailError, setEmailError] = useState("");
  const [selectedProject, setSelectedProject] = useState([]);
  const [projectError, setProjectError] = useState("");
  //const { teamId } = useParams();
  //const [team, setTeam] = useState(null);
  useEffect(() => {
    // Prefill the form with existing team details
    // setValue('teamName', team.teamName);
    // setValue('description', team.description);
    // setUserEmails(team.userEmails || []);
    // setAddedEmails(team.userEmails || []);

    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://localhost:3000/project");
        setSelectedProject(response.data); // Assuming the API returns an array of projects
      } catch (error) {
        console.error("Error fetching projects:", error);
        // Handle error or set a default value for projects
        message.error('An error occurred while getting your projects.');
      }
    };

    fetchProjects();
  }, [team, setValue]);

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
      <Modal open={open} onClose={onClose}>
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
    const { teamName, description } = data;
    // const selectedProjectId = data.projectId; // Get the selected project ID from the form data

    console.log("Updating Team:", {
      teamName,
      description,
      userEmails,
      // selectedProjectId
    });

    try {
      // Make the API call using axios
      await axios.put(`http://localhost:3000/teams/${team.id}`, {
        teamName,
        description,
        userEmails: addedEmails,
        // projectId: selectedProjectId // Use the selected project ID
      });

      // Fetch the updated teams list
      fetchTeams();

      // Close the modal if the form submission was successful
      handleClose();

      // Display a success message notification
      message.success('Team updated successfully!');
    } catch (error) {
      console.error("Error updating team:", error);

      // Handle the error, e.g., display an error message to the user
      if (error.response && error.response.data) {
        console.error("Error message from backend:", error.response.data);
        message.error(error.response.data);
      } else {
        message.error('An error occurred while updating the team.');
      }
    }
  };

  if (selectedProject.length === 0) {
    return (
      <Modal open={open} onClose={handleClose}>
        <div className="modal-container">
          <div className="form-container">
            <h2 className="form-header">Update Team</h2>
            <p className="error-message">Please create a project first before updating a team.</p>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <div>
      <Modal open={open} onClose={handleClose}>
        <div className="modal-container">
          <form className="form-container" onSubmit={handleSubmit(onSubmit)}>
            <h2 className="form-header">Update Team</h2>

            <div className="form-top-container">
              <div className="form-top-left">
                <label className="form-label">
                  Team Name
                  <input
                    name="teamName"
                    type="text"
                    placeholder={"Team Name"}
                    className="form-input"
                    ref={register({ required: true })}
                  ></input>
                  {errors.teamName && (
                    <p className="error-message">Please enter a team name</p>
                  )}
                </label>
              </div>
            </div>

            <div className="form-section" style={{ marginBottom: "10px" }}>
              <div className="label-container">
                <label className="form-label">Project</label>
              </div>
              <div className="input-container">
                <select
                  id="project-select"
                  name="projectId"
                  className="form-input"
                  ref={register({ required: true })}
                  // defaultValue={team.projectId}
                >
                  <option value={0}>{"Choose Project"}</option>
                  {selectedProject.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.ProjectName} {/* Assuming 'ProjectName' is the property containing the project name */}
                    </option>
                  ))}
                </select>
                <p className="error-message">{projectError}</p>
                {errors.projectId && (
                  <p className="error-message">Please choose a project</p>
                )}
              </div>
            </div>

            <div>
              <textarea
                name="description"
                type="text"
                placeholder={"Team Description"}
                className="edit-task-description textarea"
                ref={register}
              ></textarea>
            </div>

            <div className="form-top-middle">
              <Button
                variant="outlined"
                color="primary"
                onClick={openModal}
              >
                + Add members
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

            <div>
              {addedEmails.map((email, index) => (
                <Button
                  key={index}
                  variant="outlined"
                  color="primary"
                  style={{ marginRight: "8px", marginBottom: "8px" }}
                >
                  {email}
                  <span
                    className="delete-button"
                    style={{ margin: "10px", color:"red", border:"1px red" }}
                    onClick={() => handleDeleteEmail(email)}
                  >
                    x
                  </span>
                </Button>
              ))}
            </div>

            <div style={{ display: "flex", marginLeft: "400px" }}>
              <Button
                style={{ color: "#0093ff" }}
                onClick={handleClose}
                color="primary"
              >
                Cancel
              </Button>
              <Button
                style={{ color: "#0093ff" }}
                type="submit"
                color="primary"
              >
                Update
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default TeamDetails;
