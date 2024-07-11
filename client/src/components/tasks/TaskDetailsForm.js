import React, { useState, useEffect, useContext } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import "../../css/Task.css";
import "../../css/editTask.css";
import axios from "axios";
import Button from "@material-ui/core/Button";
import { Context as TaskContext } from "../../context/store/TaskStore";
import { Context as ProjectContext } from "../../context/store/ProjectStore";
import moment from "moment";
import { EmailOutlined, PersonAdd, RemoveCircle } from "@material-ui/icons";
import { useParams } from "react-router-dom";


const TaskDetailsForm = ({ task, closeModal, open, setTasks, setTasklistTasks }) => {
  const  projectId  = task.ProjectID;

  const { register, handleSubmit, control, clearErrors } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "assignedUsers",
  });
  const [taskState, taskdispatch] = useContext(TaskContext);
  const [projectState, projectdispatch] = useContext(ProjectContext);
  const [projects, setProjects] = useState([]);

  const [teamDescription, setTeamDescription] = useState(task.description || "");
  const [projectUsers, setProjectUsers] = useState([]);
  const [taskComments, setTaskComments] = useState(task.Comments || []);
  const [dueDate, setDueDate] = useState(new Date(task.due_date) || []);
  const [commentBox, setCommentBox] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [statusOptions, setStatusOptions] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [status, setStatus] = useState(task.status || "");
  const userId = localStorage.getItem('userId')


  const date = moment(task.endDate, "YYYYMMDD");

  console.log(task);
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/project/${projectId}`);
        const project = response.data;

        const usersResponse = await axios.get(`http://localhost:3000/project/${projectId}/users`);
        const taskListResponse = await axios.get(`http://localhost:3000/project/${projectId}/tasklists`);

        setAssignedUsers(usersResponse.data);
        setStatusOptions(taskListResponse.data);
        setProjectName(project.ProjectName);
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };

    fetchProjectData();
  }, [projectId]);


  const fetchProjectDetails = async (projectId) => {
    try {
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

  useEffect(() => {
    if (projectId) {
      fetchProjectDetails(projectId)
        
        .catch((error) => {
          console.error("Error fetching project details:", error);
        });
    }
  }, [projectId]);
  // useEffect(() => {
  //   fetchProjectUsers();
  //   fetchProjectName();
  // }, [task]);

 

  // const fetchProjectUsers = async () => {
  //   try {
  //     const res = await axios.get(`http://localhost:3000/project/${task.ProjectID}/team`);
  //     setProjectUsers(res.data.Users);
  //   } catch (error) {
  //     console.error("Error fetching project users:", error);
  //   }
  // };

  const fetchProjectName = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/project/${task.ProjectID}`);
      setProjectName(res.data.ProjectName);
    } catch (error) {
      console.error("Error fetching project name:", error);
    }
  };

  const updateProject = async (e) => {
    var projectId = document.getElementById("project-select").value;
    const userId = localStorage.getItem("userId");
    console.log("project id",projectId);
    await axios.put(
      `http://localhost:3000/task/${task.taskID}/project/${projectId}`
    );
    const res = await axios.get(`http://localhost:3000/task/user/${userId}`);
    await taskdispatch({ type: "get_user_tasks", payload: res.data });
  };

  const getProjectUsers = async () => {
    var projectSelect = document.getElementById("project-select");
    clearErrors(projectSelect.name);
    const res = await axios.get(
      `http://localhost:3000/project/${projectSelect.value}/team`
    );
    const userList = res.data.Users.filter((user) => {
      return user.id !== task.Users.id;
    });
    console.log(userList, "userList");
    setProjectUsers(userList);
    updateProject();
  };

  const updateAssignee = async (formData) => {
    try {
      const updatedUserIds = formData.assignedUsers.map((user) => parseInt(user));
      await axios.put(`http://localhost:3000/${task.taskID}/assignee/${userId}`, { assignedUser: updatedUserIds });
      closeModal();
    } catch (error) {
      console.error("Error updating assignee:", error);
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      await axios.put(`http://localhost:3000/task/${task.taskID}/tasklist`, { destinationTasklistId: newStatus });
      setStatus(newStatus); // Update the client-side state after successful server update
      // Optionally, you can fetch updated task data here and update the tasks state
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleRemoveUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:3000/task/${task.taskID}/user/${userId}`);
      setAssignedUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error removing user:", error);
    }
  };

  const updateDueDate = async (e) => {
    const newDueDate = e.target.value;
    setDueDate(newDueDate);
    await axios.put(`http://localhost:3000/task/${task.taskID}/dueDate`, { date: newDueDate });
  };

  const updateDescription = async (e) => {
    const description = e.target.value;
    setTeamDescription(description);
    await axios.put(`http://localhost:3000/task/${task.taskID}/description`, { description });
  };

  const handleCommentSubmit = async ({ text }) => {
    const user_id = localStorage.getItem("userId");
    const today = new Date().toISOString().slice(0, 10);
    await axios.post(`http://localhost:3000/task/${task.taskID}/comment`, {
      content: text,
      created_at: today,
      userId: user_id,
      taskID: task.taskID,
    });
    const comments = await axios.get(`http://localhost:3000/task/${task.taskID}/comment`);
    setTaskComments(comments.data.Comments);
    updateScroll();
  };

  function updateScroll() {
    var element = document.getElementById("scrollable");
    element.scrollTop = element.scrollHeight;
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`/task/${task.taskID}`);
      const res = await axios.get(`/task/user/${localStorage.getItem("userId")}`);
      await taskdispatch({ type: "update_task", payload: res.data });
      closeModal();
    } catch (err) {
      console.log(err);
    }
  };

  // const renderedProjects = projectState.projects
  //   .filter((project) => project.id !== task.ProjectID)
  //   .map((project, i) => (
  //     <option key={i} value={project.id}>
  //       {project.ProjectName}
  //     </option>
  //   ));

  // const renderedUsers = projectUsers.map((user, i) => (
  //   <option key={i} value={user.id}>
  //     {user.Email}
  //   </option>
  // ));

  const renderedComments = taskComments.map((comment, i) => {
    const commentDate = moment(comment.createdAt, "YYYYMMDD").format("MMM D");
    return (
      <div className="comment-container" key={i}>
        <div className="comment-header">
          <div className="user-avatar" style={{ width: "25px", height: "25px", marginRight: "10px" }}>
            {(comment.User.FirstName[0] + comment.User.FirstName[1]).toUpperCase()}
          </div>
          <div>
            <p style={{ fontWeight: 500, marginRight: "10px", fontSize: "15px" }}>{comment.User.FirstName}</p>
          </div>
          <div>
            <p style={{ color: "gray", fontSize: "12px" }}>{commentDate}</p>
          </div>
        </div>
        <div className="comment-text">
          <p style={{ fontSize: "15px", margin: "0px" }}>{comment.text}</p>
        </div>
      </div>
    );
  });

  return (
    <div>
      <form className="form-container" onSubmit={handleSubmit(updateAssignee)}>
        <div className="form-top-container">
          <div className="form-section">
            <div className="input-container">
              <textarea
                name="name"
                type="text"
                placeholder="Task Name"
                defaultValue={task.taskName}
                ref={register}
                className="edit-task-title textarea"
              ></textarea>
            </div>
            <div className="input-container">
              <div
                className="edit-task-info-left"
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div>{task.Users.map((user) => user.FirstName).join(", ")}</div>
                <div className="input-container">
                  {fields.map((field, index) => (
                    <div key={field.id} className="assigned-user-field">
                      <select
                        name={`assignedUser[${index}]`}
                        className="form-input"
                        ref={register}
                        defaultValue={field.value || ""}
                      >
                        <EmailOutlined style={{ marginTop: "10px" }} />
                        <option value="">Choose Assigned User</option>
                        {assignedUsers.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.Email}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => handleRemoveUser(index)}
                      >
                        <RemoveCircle
                          style={{ marginRight: "5px", color: "#011e53" }}
                        />
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="form-input"
                    onClick={() => append({})}
                  >
                    <PersonAdd
                      style={{ marginRight: "15px", color: "#011e53" }}
                    />
                    Assign Task To Someone
                  </button>
                </div>
                <div
                  className="input-container"
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <div style={{ display: "flex" }}>
                    <div style={{ fontWeight: "500", marginRight: "5px" }}>
                      Created:{" "}
                    </div>
                    <div>{moment(task.created_at).format("MMM DD YYYY")}</div>
                  </div>
                  <div style={{ display: "flex", marginTop: "5px" }}>
                    <div style={{ fontWeight: "500", marginRight: "5px" }}>
                      Last Updated:{" "}
                    </div>
                    <div>{moment(task.updated_at).format("MMM DD YYYY")}</div>
                  </div>
                  <div style={{ marginTop: "5px", display: "flex" }}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <div style={{ fontWeight: "500" }}>Due Date:</div>
                      <input
                        name="due_date"
                        type="date"
                        defaultValue={date.format("YYYY-MM-DD")}
                        ref={register}
                        onChange={updateDueDate}
                      ></input>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div style={{ fontWeight: "500" }}>Description</div>
                <textarea
                  name="description"
                  placeholder="Add description..."
                  defaultValue={task.description}
                  ref={register}
                  className="textarea"
                  onChange={updateDescription}
                ></textarea>
              </div>
            </div>
          </div>
          <div className="input-container">
            <div className="form-section" style={{ marginBottom: "30px" }}>
              <div className="label-container">
                <label className="form-label">Status</label>
              </div>
              <div className="input-container">
                <select
                  name="status"
                  className="form-select"
                  value={status} // Bind value to the status state
                  onChange={(e) => updateStatus(e)} // Call updateStatus function on change
                >
                  {statusOptions.map((status) => (
                    <option key={status.column_index} value={status.name}>
                      {status.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="button-group">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ backgroundColor: "#011e53", marginBottom: "10px" }}
            >
              Save Changes
            </Button>
            <Button
              onClick={() => closeModal()}
              variant="contained"
              color="primary"
              style={{ backgroundColor: "#C0C0C0", color: "#011e53" }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              variant="contained"
              color="secondary"
              style={{ marginBottom: "10px", backgroundColor: "#cc0000" }}
            >
              Delete Task
            </Button>
          </div>
        </div>
      </form>
      <div className="form-bottom-container">
        <div className="form-section">
          <div className="task-comments-container">
            <div className="form-section-title">
              <h2>Comments</h2>
            </div>
            <div id="scrollable" className="comments-container">
              {renderedComments}
            </div>
            {commentBox ? (
              <div className="comment-box-container">
                <textarea
                  className="comment-box"
                  ref={register({ required: true })}
                  placeholder="Add a comment..."
                  name="comment"
                ></textarea>
                <div className="comment-box-button-group">
                  <button
                    className="comment-box-button"
                    onClick={handleSubmit(handleCommentSubmit)}
                  >
                    Submit
                  </button>
                  <button
                    className="comment-box-button"
                    onClick={() => setCommentBox(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="add-comment-button"
                onClick={() => setCommentBox(true)}
              >
                Add Comment
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsForm;
 