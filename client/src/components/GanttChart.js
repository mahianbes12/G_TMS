// GanttChart.js
import React, { useState, useEffect } from 'react';
import { Chart } from 'react-google-charts'; 
import axios from 'axios';
import TopNavBar from './NavigationBar/TopNavBar';
import { useParams } from 'react-router-dom';

const GanttChart = () => {
  
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 
  const projectId = useParams()// Get projectId from URL params
  



  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/project/${projectId.id}`); 
        console.log(response.data);
        const formattedTasks = response.data.Tasks.map((task) => {
          if (task.startDate !== undefined && task.endDate !== undefined) {
            let start = new Date(task.startDate);
            let end = new Date(task.endDate);
           

            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
              console.error(`Invalid date format for task: ${task.taskName}`);
              return null; 
            } 

            return {
              id: task.taskID, 
              name: task.taskName, 
              start: start, 
              end: end, 
            };
          } else {
            console.error(`Missing start or end date for task: ${task.taskName}`);
            return null; 
          }
        });
        const validTasks = formattedTasks.filter(task => task !== null); 
        setTasks(validTasks);
        console.log(validTasks);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setIsLoading(false);
      }
    };
    fetchTasks();
   
   // Use a ref to store the interval
   
  }, []);
  //window.location.reload();

  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  const handleSaveTask = async (updatedTask) => {
    try {
      const taskID = updatedTask.id; 
      const updatedStartDate = updatedTask.start.toISOString().slice(0, 10); 
      const updatedEndDate = updatedTask.end.toISOString().slice(0, 10);
      await axios.put(`http://localhost:3000/task/${taskID}`, { 
        taskName: updatedTask.name,
        startDate: updatedStartDate,
        endDate: updatedEndDate,       
      });
      
      
      const updatedTasks = tasks.map((task) =>
        task.id === taskID ? updatedTask : task
      );
      setTasks(updatedTasks);
      setEditingTask(null);
    } catch (error) {
     
      console.error("Error saving task:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  // Data format for Google Charts Timeline (using Date objects)
  const chartData = [
    ['Task Name', 'Start Date', 'End Date'], // Correct column structure
    ...tasks.map((task) => [
      task.name,  
      task.start,  // Directly use Date objects
      task.end,  // Directly use Date objects
    ]),
  ];

  // EditTaskForm component 
  const EditTaskForm = ({ task, onSave, onCancel }) => {
    const [name, setName] = useState(task.name);
    // Store start and end as Date objects directly
    const [start, setStart] = useState(new Date(task.start)); 
    const [end, setEnd] = useState(new Date(task.end));

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave({
        id: task.id,
        name,
        start: start, // Send Date objects directly
        end: end, // Send Date objects directly
      });
    };

    return (
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Task Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor="start">Start Date:</label>
        <input
          type="date"
          id="start"
          value={start.toISOString().slice(0, 10)} 
          onChange={(e) => setStart(new Date(e.target.value))}
        />

        <label htmlFor="end">End Date:</label>
        <input
          type="date"
          id="end"
          value={end.toISOString().slice(0, 10)} 
          onChange={(e) => setEnd(new Date(e.target.value))}
        />

        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    );
  };
        
  return (
    <div>
      <TopNavBar />
      <h1>Timeline Chart</h1> {/* Updated title */}
      {isLoading && <p>Loading tasks...</p>}
      {!isLoading && (
        <Chart
          chartType="Timeline" // Use Timeline instead of Gantt
          data={chartData}
          options={{
            height: 400,
            // Options for Timeline chart
            timeline: {
              groupByRowLabel: true,
              // ... other Timeline options
            },
          }}
        />
      )}
      {editingTask && (
        <EditTaskForm
          task={editingTask}
          onSave={handleSaveTask}
          onCancel={handleCancelEdit}
        />
      )}
    </div>
  );
};

export default GanttChart;



// // GanttChart.js
// import React, { useState, useEffect } from 'react';
// import { Chart } from 'react-google-charts'; 
// import axios from 'axios';
// import TopNavBar from './NavigationBar/TopNavBar';
// import { useParams } from 'react-router-dom';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'; // Import D&D library

// const GanttChart = () => {
//   const [tasks, setTasks] = useState([]);
//   const [editingTask, setEditingTask] = useState(null);
//   const [isLoading, setIsLoading] = useState(true); 
//   const projectId = useParams()// Get projectId from URL params

//   useEffect(() => {
//     const fetchTasks = async () => {
//       try {
//         const response = await axios.get(`http://localhost:3000/project/${projectId.id}`); 
//         console.log(response.data);
//         const formattedTasks = response.data.Tasks.map((task) => {
//           if (task.startDate !== undefined && task.endDate !== undefined) {
//             let start = new Date(task.startDate);
//             let end = new Date(task.endDate);

//             if (isNaN(start.getTime()) || isNaN(end.getTime())) {
//               console.error(`Invalid date format for task: ${task.taskName}`);
//               return null; 
//             } 

//             return {
//               id: task.taskID, 
//               name: task.taskName, 
//               start: start, 
//               end: end, 
//             };
//           } else {
//             console.error(`Missing start or end date for task: ${task.taskName}`);
//             return null; 
//           }
//         });
//         const validTasks = formattedTasks.filter(task => task !== null); 
//         setTasks(validTasks);
//         console.log(validTasks);
//         setIsLoading(false);
//       } catch (error) {
//         console.error("Error fetching tasks:", error);
//         setIsLoading(false);
//       }
//     };
//     fetchTasks();
//     const interval = setInterval(fetchTasks, 5000); // Adjust the interval as needed
//     return () => clearInterval(interval);
//   }, []);

//   const handleEditTask = (task) => {
//     setEditingTask(task);
//   };

//   const handleSaveTask = async (updatedTask) => {
//     try {
//       const taskID = updatedTask.id; 
//       const updatedStartDate = updatedTask.start.toISOString().slice(0, 10); 
//       const updatedEndDate = updatedTask.end.toISOString().slice(0, 10);
//       await axios.put(`http://localhost:3000/task/${taskID}`, { 
//         taskName: updatedTask.name,
//         startDate: updatedStartDate,
//         endDate: updatedEndDate,       
//       });
      
//       const updatedTasks = tasks.map((task) =>
//         task.id === taskID ? updatedTask : task
//       );
//       setTasks(updatedTasks);
//       setEditingTask(null);
//     } catch (error) {
//       console.error("Error saving task:", error);
//     }
//   };

//   const handleCancelEdit = () => {
//     setEditingTask(null);
//   };

//   // Data format for Google Charts Timeline (using Date objects)
//   const chartData = [
//     ['Task Name', 'Start Date', 'End Date'], // Correct column structure
//     ...tasks.map((task) => [
//       task.name,  
//       task.start,  // Directly use Date objects
//       task.end,  // Directly use Date objects
//     ]),
//   ];

//   // EditTaskForm component 
//   const EditTaskForm = ({ task, onSave, onCancel }) => {
//     const [name, setName] = useState(task.name);
//     // Store start and end as Date objects directly
//     const [start, setStart] = useState(new Date(task.start)); 
//     const [end, setEnd] = useState(new Date(task.end));

//     const handleSubmit = (e) => {
//       e.preventDefault();
//       onSave({
//         id: task.id,
//         name,
//         start: start, // Send Date objects directly
//         end: end, // Send Date objects directly
//       });
//     };

//     return (
//       <form onSubmit={handleSubmit}>
//         <label htmlFor="name">Task Name:</label>
//         <input
//           type="text"
//           id="name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//         />

//         <label htmlFor="start">Start Date:</label>
//         <input
//           type="date"
//           id="start"
//           value={start.toISOString().slice(0, 10)} 
//           onChange={(e) => setStart(new Date(e.target.value))}
//         />

//         <label htmlFor="end">End Date:</label>
//         <input
//           type="date"
//           id="end"
//           value={end.toISOString().slice(0, 10)} 
//           onChange={(e) => setEnd(new Date(e.target.value))}
//         />

//         <button type="submit">Save</button>
//         <button type="button" onClick={onCancel}>Cancel</button>
//       </form>
//     );
//   };

//   // Handle drag and drop reordering of tasks
//   const handleOnDragEnd = (result) => {
//     if (!result.destination) return;

//     const items = Array.from(tasks); // Create a copy of the data
//     const [reorderedItem] = items.splice(result.source.index, 1);
//     items.splice(result.destination.index, 0, reorderedItem);

//     setTasks(items); // Update the tasks state
//   };
        
//   return (
//     <div>
//       <TopNavBar />
//       <h1>Timeline Chart</h1> {/* Updated title */}
//       {isLoading && <p>Loading tasks...</p>}
//       {!isLoading && (
//         <DragDropContext onDragEnd={handleOnDragEnd}> {/* Wrap the chart in DragDropContext */}
//           <Droppable droppableId="tasks"> 
//             {(provided) => (
//               <div {...provided.droppableProps} ref={provided.innerRef}>
//                 <Chart
//                   chartType="Timeline" // Use Timeline instead of Gantt
//                   data={chartData}
//                   options={{
//                     height: 400,
//                     // Options for Timeline chart
//                     timeline: {
//                       groupByRowLabel: true,
//                       // ... other Timeline options
//                     },
//                   }}
//                 />
//                 {provided.placeholder} 
//               </div>
//             )}
//           </Droppable>
//         </DragDropContext>
//       )}
//       {editingTask && (
//         <EditTaskForm
//           task={editingTask}
//           onSave={handleSaveTask}
//           onCancel={handleCancelEdit}
//         />
//       )}
//     </div>
//   );
// };

// export default GanttChart;