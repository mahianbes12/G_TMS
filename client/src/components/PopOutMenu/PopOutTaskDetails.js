import React, { useEffect, useState } from "react";
import axios from "axios";
import TaskDetailsForm from "../tasks/TaskDetailsForm";

const PopOutTaskDetails = ({ showSideTaskDetails, taskId }) => {
  const [task, setTask] = useState(null);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/tasks/${taskId}`);
        setTask(response.data);
        console.log(task);
      } catch (error) {
        console.error("Error fetching task details:", error);
      }
    };

    if (taskId) {
      fetchTaskDetails();
    }
  }, [taskId]);

  return (
    <div className="popout-task-details">
      {task && <TaskDetailsForm task={task} />}
      <button onClick={showSideTaskDetails}>Close</button>
    </div>
  );
};

export default PopOutTaskDetails;
