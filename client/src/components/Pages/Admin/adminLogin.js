// AdminLogin.js

import React, { useState } from 'react';
import { Form, Button, message, Input } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import companyLogo from '../../../assets/logo2.png';
import '../../../css/Admin.css';

const AdminLogin = () => {
  // State variables
  const [AdminEmail, setAdminEmail] = useState('');
  const [AdminPassword, setAdminPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleEmailChange = (e) => {
    setAdminEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setAdminPassword(e.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Email: AdminEmail, Password: AdminPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data && data.token) {
          if (data.user.Role === "Admin" || data.user.Role === "SuperAdmin") {
            localStorage.setItem('adminToken', data.token);
            localStorage.setItem('adminDa', JSON.stringify(data)); // Store adminDa as JSON
            console.log('Admin logged in successfully');
            message.success('Admin logged in successfully');
            localStorage.setItem('isLoggedInAdmin', true);
            history.push(`/admin/dashboard/${data.user.id}`);
          } else {
            message.error('You are not authorized to access the admin panel');
            console.error('Unauthorized access');
          }
        } else {
          message.error('Server error');
          console.error('Invalid server response:', data);
        }
      } else {
        message.error('Admin login failed');
        message.error('Insert valid Username and Password');
        console.error('Admin login failed:', data.error);
      }
    } catch (error) {
      message.error('An error occurred during admin login');
      console.error('An error occurred during admin login:', error);
    }

    setLoading(false);
    setAdminEmail('');
    setAdminPassword('');
  };

  return (
    <div className="admin-login-container">
      

      <div className="admin-login-form">
        <div className='admin-logo'>
        <img src={companyLogo} alt='company logo' />
        <div className='admin-company-name'>
          {/* Add your company name */}
        </div>
      </div>
        <h1 className="admin-form-header">Admin Login</h1>
        <Form className="admin-form-container" onFinish={handleSubmit}>
          <label className="admin-form-label" htmlFor="Email">
            <UserOutlined className="admin-icon" />
          </label>
          <input
            type="text"
            name="Email"
            placeholder="Email"
            id="Email"
            required
            value={AdminEmail}
            onChange={handleEmailChange}
            className="admin-input-field"
          />
          <label className="admin-form-label" htmlFor="password">
            <LockOutlined className="admin-icon" />
          </label>
          <Input.Password
            type="password"
            name="password"
            placeholder="Password"
            id="password"
            required
            value={AdminPassword}
            onChange={handlePasswordChange}
            className="admin-input-field"
          />
          <Button
            className="admin-login-button"
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default AdminLogin;
