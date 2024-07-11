import React, { useState, useEffect, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import { Context as TeamContext } from "../../context/store/TeamStore";
import TopNavBarHome from "../NavigationBar/TopNavBarHome";
import {
  AddCircleOutline,
  PersonAdd,
  Title,
  RemoveCircleOutline,
  Description,
  Delete,
} from "@material-ui/icons";
import { useToasts } from "react-toast-notifications";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@material-ui/core";

const TeamPage = () => {
  const { teamId } = useParams();
  const history = useHistory();
  const [teamState, dispatch] = useContext(TeamContext);
  const [teamName, setTeamName] = useState("");
  const [team, setTeam] = useState({});
  const [description, setDescription] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [removeConfirmationOpen, setRemoveConfirmationOpen] = useState(false);
  const [emailToRemove, setEmailToRemove] = useState("");
  const [canEdit, setCanEdit] = useState(false);
  const [projectID, setProjectID] = useState();
  const loggedInUserEmail = localStorage.getItem("Email");
  const userId = localStorage.getItem("userId");
  const { addToast } = useToasts();

  // Fetch team data from the database using the API
  const getTeam = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/team/${teamId}`);
      const teamData = response.data.team;
      console.log(teamData.Projects[0].ProjectID);
      if (teamData) {
        setTeam(teamData);
        setTeamName(teamData.teamName);
        setDescription(teamData.description || "");
        setTeamMembers(teamData.Users || []);
        setProjectID(teamData.Projects[0].ProjectID);
      }
    } catch (error) {
      console.error("Error fetching team data:", error);
      addToast("Error fetching team data", {
        appearance: "error",
        autoDismiss: true,
        autoDismissTimeout: 5000,
      });
    }
  };

  // Fetch user data to check if they can edit the team
  const fetchUserData = async () => {
    if (!team.Projects || team.Projects.length === 0) {
      console.log("Team projects not available");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3000/user/${userId}`);
      const user = response.data;

      if (user && user.CanChangeProjects) {
        const userProject = user.CanChangeProjects;
        const canEditTeam = userProject.includes(projectID);
        setCanEdit(canEditTeam);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      addToast("Error fetching user data", {
        appearance: "error",
        autoDismiss: true,
        autoDismissTimeout: 5000,
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getTeam();
      fetchUserData();
    };

    fetchData();
  }, [teamId]);

  const handleNameChange = (e) => setTeamName(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);
  const handleMemberChange = (index, e) => {
    const updatedMembers = [...teamMembers];
    updatedMembers[index].Email = e.target.value;
    setTeamMembers(updatedMembers);
  };

  const isEmailValid = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleAddMember = () => {
    const email = newMemberEmail.trim();
    if (isEmailValid(email)) {
      if (email && !teamMembers.some((member) => member.Email === email)) {
        setTeamMembers([...teamMembers, { Email: email }]);
        setNewMemberEmail("");
        addToast("Member added successfully", {
          appearance: "success",
          autoDismiss: true,
          autoDismissTimeout: 5000,
        });
      }
    } else {
      addToast("Invalid or duplicate email", {
        appearance: "info",
        autoDismiss: true,
        autoDismissTimeout: 5000,
      });
    }
  };

  const ConfirmationDialog = ({
    open,
    onClose,
    onConfirm,
    title,
    message,
    confirmButtonText,
  }) => {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <p>{message}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={onConfirm} color="primary" autoFocus>
            {confirmButtonText}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const handleDeleteTeam = () => {
    setDeleteConfirmationOpen(true);
  };

  const handleRemoveMember = (email) => {
    setEmailToRemove(email);
    setRemoveConfirmationOpen(true);
  };

  const handleCloseDeleteConfirmation = () => {
    setDeleteConfirmationOpen(false);
  };

  const handleCloseRemoveConfirmation = () => {
    setRemoveConfirmationOpen(false);
  };

  const handleConfirmDeleteTeam = async () => {
    try {
      await axios.delete(`http://localhost:3000/team/${teamId}`);
      addToast("Team deleted successfully", {
        appearance: "success",
        autoDismiss: true,
        autoDismissTimeout: 5000,
      });
      history.push("/");
    } catch (error) {
      console.error("Error deleting team:", error);
      addToast("Error deleting team", {
        appearance: "error",
        autoDismiss: true,
        autoDismissTimeout: 5000,
      });
    }
    handleCloseDeleteConfirmation();
  };

  const handleConfirmRemoveMember = () => {
    setTeamMembers(teamMembers.filter((member) => member.Email !== emailToRemove));
    addToast(`Member ${emailToRemove} removed`, {
      appearance: "info",
      autoDismiss: true,
      autoDismissTimeout: 5000,
    });
    setRemoveConfirmationOpen(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!teamName) {
      addToast("Team name cannot be empty", {
        appearance: "error",
        autoDismiss: true,
        autoDismissTimeout: 5000,
      });
      return;
    }
    try {
      await axios.put(`http://localhost:3000/team/${teamId}`, {
        teamName,
        description,
        members: teamMembers,
      });
      dispatch({
        type: "UPDATE_TEAM",
        payload: { id: teamId, teamName, description, members: teamMembers },
      });
      addToast("Team updated successfully", {
        appearance: "success",
        autoDismiss: true,
        autoDismissTimeout: 5000,
      });
      history.push("/");
    } catch (error) {
      console.error("Error saving team data:", error);
      addToast("Error saving team data", {
        appearance: "error",
        autoDismiss: true,
        autoDismissTimeout: 5000,
      });
    }
  };

  return (
    <>
      <TopNavBarHome />
      <div className="popout-form-container">
        <div className="popout-form-top">
          <div className="popout-form-header">
            <h2 className="form-header">
              <AddCircleOutline /> Update Team
            </h2>
          </div>
          {canEdit && (
            <button className="delete-button" onClick={handleDeleteTeam}>
              <Delete /> Delete Team
            </button>
          )}
          <div className="popout-form-close-icon"></div>
        </div>
        <form className="form-container" onSubmit={handleSave}>
          <div className="form-top-container">
            <div className="form-section">
              <div className="input-container">
                <input
                  name="teamName"
                  type="text"
                  value={teamName}
                  className="form-input"
                  onChange={handleNameChange}
                  placeholder="Team Name"
                  required
                  disabled={!canEdit}
                />
                <Title className="form-icon" />
              </div>
              <div className="input-container">
                <textarea
                  name="description"
                  type="text"
                  value={description}
                  className="form-input"
                  onChange={handleDescriptionChange}
                  placeholder="Description"
                  rows={10}
                  cols={30}
                  disabled={!canEdit}
                />
                <Description className="form-icon" style={{ top: "10%" }} />
              </div>
              {teamMembers.map((member, index) => (
                <div className="input-container" key={index}>
                  <input
                    name={`teamMember${index}`}
                    type="text"
                    value={member.Email}
                    className="form-input"
                    onChange={(e) => handleMemberChange(index, e)}
                    disabled
                  />
                  {canEdit && member.Email !== loggedInUserEmail && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(member.Email)}
                      className="remove-member-btn"
                    >
                      <RemoveCircleOutline
                      className="form-icon"
                      onClick={() => handleRemoveMember(member.Email)}
                    />
                    </button>
                  )}
                </div>
              ))}
              {canEdit && (
                <div className="input-container">
                  <input
                    name="newMember"
                    type="text"
                    value={newMemberEmail}
                    className="form-input"
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    placeholder="New Member Email"
                  />
                  <button
                    type="button"
                    onClick={handleAddMember}
                    className="submit-button enabled"
                  >
                    <PersonAdd />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="form-bottom-container">
            {canEdit && (
              <button type="submit" className="submit-button enabled">
                Save
              </button>
            )}
          </div>
        </form>
      </div>
      <ConfirmationDialog
        open={deleteConfirmationOpen}
        onClose={handleCloseDeleteConfirmation}
        onConfirm={handleConfirmDeleteTeam}
        title="Confirm Delete"
        message="Are you sure you want to delete this team?"
        confirmButtonText="Delete"
      />
      <ConfirmationDialog
        open={removeConfirmationOpen}
        onClose={handleCloseRemoveConfirmation}
        onConfirm={handleConfirmRemoveMember}
        title="Confirm Remove"
        message="Are you sure you want to remove this member?"
        confirmButtonText="Remove"
      />
    </>
  );
};
export default TeamPage;
