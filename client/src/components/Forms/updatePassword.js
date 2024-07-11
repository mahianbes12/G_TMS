import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const UpdatePasswordForm = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const { token } = useParams();

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleChangeConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/user/password/reset/:token', {
        Email: localStorage.getItem('Email'),
        Password: password,
        token: token,
      });

      if (response.status === 200) {
        setMessage('Password updated successfully');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      console.error(error);
      setMessage('Failed to update password');
    }
  };

  return (
    <div className="container">
      <div className="forms-container">
        <div className="signin-signup">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
            <h2 className="title" style={{ alignSelf: 'flex-end', marginBottom: '2rem', marginRight: '5rem' }}>
              Update Password
            </h2>
            <div className="input-field">
              <i className="fas fa-envelope"></i>
              <input
                type="password"
                name="password"
                placeholder="Enter New Password"
                value={password}
                onChange={handleChangePassword}
                required
              />
            </div>
            <div className="input-field">
              <i className="fas fa-envelope"></i>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={handleChangeConfirmPassword}
                required
              />
            </div>
            <div>
              <button type="submit" className="btn solid" style={{ marginTop: '1rem' }}>
                Reset Password
              </button>
            </div>
          </form>
          {message && <p>{message}</p>}
        </div>
      </div>
      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content" style={{ textAlign: 'bottom' }}>
            <h3 style={{ textAlign: 'center' }}>received email?</h3>
            <p>Don't worry! Click the link in the email to reset your password and regain access to your account.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePasswordForm;