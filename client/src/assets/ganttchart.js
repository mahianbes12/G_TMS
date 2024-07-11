import React from "react";

const GanttChart = () => (
  <svg
    width="24px"
    height="24px"
    viewBox="0 0 24 24"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>Gantt Chart Icon</title>
    <g stroke="#6C6C6C" strokeWidth="2" fill="none" fillRule="evenodd">
      <path d="M5,21 L5,3 L19,3 L19,21 L5,21 Z M7,5 L7,19 L17,19 L17,5 L7,5 Z M9,7 L9,17 L11,17 L11,7 L9,7 Z M13,7 L13,17 L15,17 L15,7 L13,7 Z" />
      <line x1="7" y1="9" x2="17" y2="9" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="7" y1="13" x2="17" y2="13" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="7" y1="17" x2="17" y2="17" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

export default GanttChart;