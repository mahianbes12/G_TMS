import React, { useState, useEffect, useRef } from "react";
import LoginForm from "../Forms/LoginForm";
import SignupForm from "../Forms/SignupForm";
import "../../css/LoginPage.css";
import logo from "../../assets/logo1.png";

const LoginSignupPage = () => {
  const [isSignUpMode, setIsSignUpMode] = useState(false); // State to manage sign-up mode
  const [showAlarm, setShowAlarm] = useState(true); // State to control showing the alarm animation
  const [isAnimating, setIsAnimating] = useState(false); // State to track animation status
  const clockRef = useRef(null); // Reference to the clock element

  useEffect(() => {
    // Timer to hide the alarm and start the animation after 2 seconds
    const timeout = setTimeout(() => {
      setShowAlarm(false);
      setIsAnimating(true);
    }, 2000);

    return () => {
      clearTimeout(timeout); // Clean up the timeout when the component unmounts
    };
  }, []);

  useEffect(() => {
    // Start or stop the vibration animation based on the showAlarm state
    if (showAlarm) {
      startVibration();
    } else {
      stopVibration();
    }
  }, [showAlarm]);

  const startVibration = () => {
    clockRef.current.style.animation = "vibrationAnimation 0.1s infinite"; // Start the vibration animation
  };

  const stopVibration = () => {
    if (clockRef.current) {
      clockRef.current.style.animation = "none"; // Stop the vibration animation
    }
  };

  const handleSignInClick = () => {
    setIsSignUpMode(false); // Switch to sign-in mode
  };

  const handleSignUpClick = () => {
    setIsSignUpMode(true); // Switch to sign-up mode
  };

  return (
    <div>
      {showAlarm ? (
        // Alarm animation while the alarm is being shown
        <div className="alarm-animation">
          <div className="alarm-clock-container">
            <div className="alarmClock" ref={clockRef}>
              <div className="ring-cap left"></div>
              <div className="head"></div>
              <div className="ring-cap right"></div>
              <div className="hour"></div>
              <div className="minute"></div>
              <div className="second"></div>
              <div className="bell"></div>
            </div>
          </div>
        </div>
      ) : (
        // Login/Signup form and panels after the alarm is hidden
        <div className={`container ${isSignUpMode ? "sign-up-mode" : ""}`}>
          <LoginForm isSignUpMode={isSignUpMode} />
          <SignupForm isSignUpMode={isSignUpMode} />

          <div className="panels-container">
            <div className="panel left-panel">
              <div className="content">
                <h3>New here?</h3>
                <p>
                  Join us and Effortlessly Achieve Success with Our Powerful
                  Task Management System!
                </p>
                <button
                  className="btn transparent"
                  id="sign-up-btn"
                  onClick={handleSignUpClick}
                >
                  Sign up
                </button>
              </div>
            </div>
            <div className="panel right-panel">
              <div className="content">
                <h3>One of us?</h3>
                <p>
                  Streamline. Organize. Succeed with Our Powerful Task
                  Management System
                </p>
                <button
                  className="btn transparent"
                  id="sign-in-btn"
                  onClick={handleSignInClick}
                >
                  Sign in
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginSignupPage;