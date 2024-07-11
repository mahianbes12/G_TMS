import React, { useState } from 'react';
import axios from 'axios';

const ResetPasswordForm = () => {
  const [Email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/user/password/reset', { Email: Email });
      setMessage(response.data.message);
      localStorage.setItem('Email', Email);
      console.log(Email);
      console.log(localStorage.getItem('Email'));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <div className="forms-container">
        <div className="signin-signup">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
            <h2 className="title" style={{ alignSelf: 'flex-end', marginBottom: '2rem', marginRight: '5rem' }}>
              Reset Password
            </h2>
            <div className="input-field">
              <i className="fas fa-envelope"></i>
              <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            </div>
            <div>
              <button type="submit" className="btn solid" style={{ marginTop: '1rem' }}>
                Send Email
              </button>
            </div>
            {message && <p>{message}</p>}
          </form>
        </div>
        <div className="panels-container">
          <div className="panel left-panel">
            <div className="content" style={{ textAlign: 'bottom' }}>
              <h3 style={{ textAlign: 'center' }}> forgot password? </h3>
              <p>
                Don't worry! We've got you covered. Reset your password and regain access to your account
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;