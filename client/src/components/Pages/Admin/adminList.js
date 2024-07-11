import React, { useState, useEffect } from 'react';
import { Table, Button, message, Input, Spin } from 'antd';
import axios from 'axios';
import Dashboard from './dashboard';
import { useHistory } from 'react-router-dom';
import { Modal } from 'antd';

const AdminsList = ({ isLoggedIn, setIsLoggedIn }) => {
  // State variables
  const [adminDa, setAdminDa] = useState(JSON.parse(localStorage.getItem('adminDa')));
  const [userDa, setUserDa] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useHistory();
  const [deleteUserId, setDeleteUserId] = useState(null); // Track the user ID to delete
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Track the visibility of the delete confirmation modal
  const [deleteUser, setDeleteUser] = useState(null); // Track the user to delete

  //fetch users from database
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/user');
      setUserDa(response.data);
    } catch (error) {
      message.error('Failed to fetch users.');
    }
  };


  useEffect(() => {
    // Check if adminDa exists
    if (!adminDa) {
      setTimeout(() => {
        message.error('Please login to access the dashboard');
      }, 5000);
    } else {
      setIsLoading(false);
    }
    localStorage.setItem('selectedMenu', 7);
    fetchUsers();
  }, [adminDa, navigate]);



  if (isLoading) {
    return (
      // Show loading spinner while checking login status
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
        <p>Please wait while we check your login status...</p>
      </div>
    );
  }

  //search for Admin
  const handleSearch = async (value) => {
    setSearchInput(value);
    const activity = {
      adminName: `Admin ${adminDa.user.FirstName}`,
      action: 'Searched for',
      targetAdminName: `${value} in Admin List`,
      timestamp: new Date().getTime(),

    };
  
    try {
      // Save the admin activity to the database
      await axios.post('http://localhost:3000/admin-activity', activity, {
        headers: {
          Authorization: adminDa.token,
        },
      });
  
    } catch (error) {
      console.error('Error saving admin search activity:', error);
    }
  };

  const filteredUsers = userDa.filter((user) =>
  user.Role === 'Admin' &&
  (user.UserName?.toLowerCase().includes(searchInput.toLowerCase()) ||
    user.FirstName?.toLowerCase().includes(searchInput.toLowerCase()) ||
    user.LastName?.toLowerCase().includes(searchInput.toLowerCase()) ||
    user.Email?.toLowerCase().includes(searchInput.toLowerCase()))
);

const handleDelete = (userId) => {
  const userToDelete = userDa.find((user) => user.id === userId); // Find the user to delete
  setDeleteUserId(userId); // Set the user ID to delete
  setDeleteUser(userToDelete); // Set the user to delete
  setShowDeleteModal(true); // Show the delete confirmation modal
};

const handleConfirmDelete = async () => {
  try {
    await axios.delete(`http://localhost:3000/user/${deleteUserId}`);
    message.success('User deleted successfully');
    const activity = {
      adminName: `Admin ${adminDa.user.FirstName}`,
      action: 'deleted',
      targetAdminName:`Admin ${deleteUser.FirstName}`,
      timestamp: new Date().getTime(),
      deletedData: deleteUser,
        };

        try {
          const activityResponse = await axios.post('http://localhost:3000/admin-activity', activity, {
            headers: {
              Authorization: adminDa.token,
            },
          });

          if (activityResponse.status === 200) {
            console.log('Admin activity deleted successfully!');
          } else {
            console.error('Error registering admin activity:', activityResponse);
          }
        } catch (error){
          console.error('Error registering admin activity:', error);
        }
    fetchUsers(); // Fetch updated user list after deletion
  } catch (error) {
    message.error('Failed to delete user');
  } finally {
    setShowDeleteModal(false); // Hide the delete confirmation modal
    setDeleteUserId(null); // Reset the user ID
  }
};

const handleCancelDelete = () => {
  setShowDeleteModal(false); // Hide the delete confirmation modal
  setDeleteUserId(null); // Reset the user ID
};


  const columns = [
    {
      title: 'First Name',
      dataIndex: 'FirstName',
      key: 'FirstName',
    },
    {
      title: 'Last Name',
      dataIndex: 'LastName',
      key: 'LastName',
    },
    {
      title: 'Email',
      dataIndex: 'Email',
      key: 'Email',
    },
    {
      title: 'Role',
      dataIndex: 'Role',
      key: 'Role',
    },
    {
      title: 'Profile Image',
      dataIndex: 'ProfilePicture',
      key: 'ProfilePicture',
      render: (_, user) => (
        <div>
          {user.ProfilePicture && (
            <div>
              <a href={`http://localhost:3000/${user.ProfilePicture}`} download>
                Profile picture
              </a>
              <Button
                type="primary"
                onClick={() => {
                  const downloadLink = document.createElement('a');
                  downloadLink.href = `http://localhost:3000/${user.ProfilePicture}`;
                  downloadLink.download = 'Profile picture';
                  downloadLink.target = '_blank';
                  downloadLink.click();
                }}
              >
                Download
              </Button>
              
            </div>
          )}
        </div>
      ),
    },
      {
        title: 'Actions',
        key: 'actions',
        render: (_, user) =>
          adminDa && adminDa.user.Role === 'SuperAdmin' ? (
            <Button
            type="primary"
            onClick={() => handleDelete(user.id)}
            danger 
          >
              Delete
            </Button>
          ) : null,
      
    },
  ];

  return (
    <Dashboard content={
      <div>
        <h1>Admin List</h1>
        <Input.Search
          placeholder="Search Admin"
          value={searchInput}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ marginBottom: '16px' }}
        />
        <Table
          dataSource={filteredUsers}
          columns={columns}
          rowKey="id"
          scroll={{ x: true }}
        />
        <Modal
          title="Confirm Delete"
          visible={showDeleteModal}
          onOk={handleConfirmDelete}
          onCancel={handleCancelDelete}
          okText="Delete"
          cancelText="Cancel"
          okButtonProps={{ danger: true }} 
          cancelButtonProps={{ type: 'default' }}
        >
        <p>Are you sure you want to delete "{deleteUser?.FirstName}"?</p>
        </Modal>
      </div>
    } />
  );
};

export default AdminsList;