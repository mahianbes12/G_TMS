import { TextField, Button } from '@material-ui/core';
import { AccountCircle, Email, Photo } from '@material-ui/icons';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SettingsPage = () => {
  const [user, setUser] = useState({
    FirstName: '',
    LocationastName: '',
    Email: '',
    ProfilePicture: '',
  });

  useEffect(() => {
    // Fetch user data from the backend and populate the form fields
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('/api/user'); // Replace with your backend API endpoint to fetch user data
      const userData = response.data;
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.put('/api/user', user); // Replace with your backend API endpoint to update user data
      console.log('User data updated successfully:', response.data);
      // Optionally display a success message or perform additional actions
    } catch (error) {
      console.error('Error updating user data:', error);
      // Optionally display an error message or handle the error
    }
  };

  return (
    <div>
      <h1>Settings</h1>
      <form onSubmit={handleSubmit}>
  <TextField
    label="First Name"
    name="firstName"
    value={user.FirstName}
    onChange={handleInputChange}
    InputProps={{
      startAdornment: <AccountCircle />,
    }}
    fullWidth
    margin="normal"
  />
  <TextField
    label="Last Name"
    name="lastName"
    value={user.LastName}
    onChange={handleInputChange}
    InputProps={{
      startAdornment: <AccountCircle />,
    }}
    fullWidth
    margin="normal"
  />
  <TextField
    label="Email"
    name="email"
    value={user.Email}
    onChange={handleInputChange}
    InputProps={{
      startAdornment: <Email />,
    }}
    fullWidth
    margin="normal"
  />
  <TextField
    label="Profile Picture"
    name="profilePicture"
    value={user.ProfilePicture}
    onChange={handleInputChange}
    InputProps={{
      startAdornment: <Photo />,
    }}
    fullWidth
    margin="normal"
  />
  <Button type="submit" variant="contained" color="primary">
    Save Changes
  </Button>
</form>
    </div>
  );
};

export default SettingsPage;