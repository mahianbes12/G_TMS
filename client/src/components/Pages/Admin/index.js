import React, { useEffect, useState } from 'react';
import Dashboard from './dashboard';
import { Layout, Spin, message } from 'antd';
import { useHistory } from 'react-router-dom';
import '../../../css/Admin.css';

const Home = ({ content }) => {
  const [adminDa, setAdminDa] = useState(JSON.parse(localStorage.getItem('adminDa')));
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useHistory();

  useEffect(() => {
    // Check if adminDa exists
    if (!adminDa) {
      setTimeout(() => {
        navigate.push('/admin/login');
        message.error('Please login to access the dashboard');
      }, 5000);
    } else {
      setIsLoading(false);
    }
  }, [adminDa, navigate]);

  if (isLoading) {
    return (
      <div className="admin-loading-container">
        <Spin size="large" />
        <p>Please wait while we check your login status...</p>
      </div>
    );
  }

  return (
    <Dashboard
      content={
        <Layout>
          <div className="admin-content-container site-layout-background">
            <h1 className="admin-welcome-heading">
              Welcome to Gize TMS, {adminDa.user.FirstName}!
            </h1>
            <h2 className="admin-subheading">
              Gize<span>TMS</span> 
            </h2>
            <div className="admin-note-container note2">
              <h1 className="admin-note-heading">
                Make Your Life <br /> Easier With <span>....</span>
              </h1>
            </div>
            <hr className="admin-horizontal-line" />
            <div className="alarmClock">
              <div className="ring-cap left"></div>
              <div className="head"></div>
              <div className="ring-cap right"></div>
              <div className="hour"></div>
              <div className="minute"></div>
              <div className="second"></div>
              <div className="bell"></div>
            </div>
          </div>
        </Layout>
      }
    />
  );
};

export default Home;
