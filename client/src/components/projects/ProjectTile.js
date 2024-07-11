import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AiOutlineProject, AiOutlineDelete } from "react-icons/ai";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@material-ui/core";
import Loader from "../Loader";

const ProjectTile = ({ project, teamId, id }) => {
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState();
  const [showDeleteIcon, setShowDeleteIcon] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await axios.get(`http://localhost:3000/team/`);
      setTeam(res.data);
      setLoading(false);
    })();
  }, []);

  const handleDeleteProject = async () => {
    try {
      await axios.delete(`http://localhost:3000/project/${project.id}`);
      setOpen(false);
      window.location.reload(); // Refresh the page
    } catch (error) {
      console.error("Failed to delete project", error);
    }
  };

  const handleRightClick = (event) => {
    event.preventDefault();
    setShowDeleteIcon(true);
  };

  const handleClose = () => {
    setOpen(false);
    window.location.reload(); // Refresh the page after closing the dialog
  };

  const handleOpenDialog = (event) => {
    event.stopPropagation();
    setOpen(true);
  };

  if (loading) {
    return <Loader />;
  }

  const team_id = teamId || team.id;
  return (
    <div
      className={`project-tile-container`}
      style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
      onContextMenu={handleRightClick}
    >
      <Link
        className="project-tile--link"
        to={`/team/project/${project.id}/${project.ProjectName}`}
        onClick={(e) => {
          if (showDeleteIcon) {
            e.preventDefault();
            setShowDeleteIcon(false);
          }
        }}
      >
        <div className="project-tile-box">
          <div className={`project-tile-icon project-tile-icon-${id}`}>
            <AiOutlineProject style={{ fontSize: "30px", color: "white" }} />
          </div>
        </div>
        <div className="project-tile-name">{project.ProjectName}</div>
      </Link>
      {showDeleteIcon && (
        <button 
          className="delete-project-btn" 
          onClick={(event) => {
             // Stop event propagation
            handleOpenDialog(event);
          }} 
          style={{ marginLeft: "0.5px", color: 'red' }}
        >
          <AiOutlineDelete />
        </button>
      )}
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>{"Delete Project"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this project?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteProject} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProjectTile;
