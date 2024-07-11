import React from "react";
import "../../css/LandingPage.css";
import logo from "../../assets/logo1.png";
import circles from "../../assets/Gize_lp-circles-bg.png";
import { BsCardChecklist } from "react-icons/bs";
import { AiOutlineTeam } from "react-icons/ai";
import { MdAssignment } from "react-icons/md";
import { Button } from "@material-ui/core";

const LandingPage = () => {
  return (
    <div className="landing-container">
      <div className="landing-bg-container">
        <div className="landing-bg-gradient"></div>
        <div class="landing-bg-circles">
          <div class="circle circle--1"></div>
          <div class="circle circle--2"></div>
          <div class="circle circle--3"></div>
          <div class="circle circle--4"></div>
          <div class="circle circle--5"></div>
        </div>
        <div class="clock">
          <div class="clock-face">
            <div class="hour-hand"></div>
            <div class="minute-hand"></div>
            <div class="second-hand"></div>
          </div>
        </div>
      </div>
      <div className="landing-nav-container">
        <div className="landing-nav-logo">
          <img src={logo} alt="logo" className="landing-nav-logo-img" />
        </div>
        <div className="landing-nav-sessions">
          <div className="landing-nav-button-container">
            <a href="/login">
              <button className="landing-nav-login--button">Login</button>
            </a>
          </div>
        </div>
      </div>
      <div className="landing-main">
        <div className="landing-message">
          <h2 className="landing-message-title">
            <span className="landing-message-title-1">The easiest way to</span>
            <span className="landing-message-title-2">
              manage team, projects,
            </span>
            <span className="landing-message-title-3">and tasks</span>
          </h2>
          <h3 className="landing-message-subtitle">
            <span className="landing-message-subtitle-1">Why use Gize?</span>
            <span className="landing-message-subtitle-2">
              Gize gives you everything you need
            </span>
            <span className="landing-message-subtitle-3">
              to stay in sync, hit deadlines,
            </span>
            <span className="landing-message-subtitle-4">
              and reach your goals
            </span>
          </h3>
        </div>
        <div className="landing-main-bottom-icons-container">
          <div className="icon-container">
            <AiOutlineTeam className="icon" />
            <p className="icon-text">
              Establish Teams with other colleagues and work together to
              accomplish tasks.
            </p>
          </div>
          <div className="icon-container">
            <MdAssignment className="icon" />
            <p className="icon-text">
              Create multiple projects within a team categorize tasks based on
              different types of projects.
            </p>
          </div>
          <div className="icon-container">
            <BsCardChecklist className="icon" />
            <p className="icon-text">
              Keep track of tasks via task lists in individual projects and
              check them off when they are completed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
