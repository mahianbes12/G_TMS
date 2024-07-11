import React, { useEffect, useState } from 'react';
import axios from 'axios';
import companyLogo from '../../../assets/logo1.png';
import { Layout, Menu, Button, Form, Input, Modal, message, Spin } from 'antd';
import {
  UserOutlined,
  BankOutlined,
  SolutionOutlined,
  TransactionOutlined,
  LogoutOutlined,
  HomeOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
import { Link, useHistory, useParams } from 'react-router-dom';
import '../../../css/Admin.css'; // Import the CSS file

const { Header, Content, Footer, Sider } = Layout;

const Dashboard = ({ content }) => {

  // State variables
  const [adminDa, setAdminDa] = useState(JSON.parse(localStorage.getItem('adminDa')));
  const [form] = Form.useForm();
  const [editMode, setEditMode] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState(adminDa?.user?.ProfilePicture ? `http://localhost:3000/${adminDa.user.ProfilePicture}` : '');
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSiderCollapsed, setIsSiderCollapsed] = useState(true);
  const { adminId } = useParams();
  const [formData, setFormData] = useState({
    UserID: '',
    FirstName: '',
    LastName: '',
    Email: '',
    ProfilePicture: null,
  });
  const [selectedMenu, setSelectedMenu] = useState(localStorage.getItem("selectedMenu") || "1");
  const navigate = useHistory();

  const handleMenuSelect = ({ key }) => {
    setSelectedMenu([key]);
  };

  useEffect(() => {
    setSelectedMenu(localStorage.getItem("selectedMenu"));
    try {
      const loggedInAdmin = localStorage.getItem('adminDa');
      const parsedAdminDa = JSON.parse(loggedInAdmin);
      setFormData(parsedAdminDa.user);
      setAdminDa(parsedAdminDa);
      console.log(profilePictureUrl);
    } catch (error) {
      console.error('Error parsing admin data:', error);
      message.error('Error parsing admin data');
      // Handle error while parsing the data from localStorage
    }
  }, [selectedMenu]);

  useEffect(() => {
    // Check if adminDa exists
    if (!adminDa) {
      setTimeout(() => {
        navigate.push('/admin/login');
      }, 5000);

    } else {
      setIsLoading(false);
    }
    localStorage.setItem('selectedMenu', selectedMenu);

  }, [adminDa, navigate]);

  if (isLoading) {
    return (
      // Show loading spinner while checking login status
      <div className="admin-admin-loading-container">
        <Spin size="large" />
        <p>Please wait while we check your login status...</p>
      </div>
    );
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    setProfilePictureUrl(url);
    setFormData((prevData) => ({
      ...prevData,
      ProfilePicture: file,
    }));
  };

  const handleEdit = (admin) => {
    form.setFieldsValue(admin);
    setEditMode(true);
    setAdmin(admin);
  };

  const handleSiderHover = (isHovered) => {
    setIsSiderCollapsed(!isHovered);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    Modal.confirm({
      title: 'Confirm Edit',
      content: 'Are you sure you want to edit this admin?',
      okText: 'Edit',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          // Get form values
          const values = await form.validateFields(); // Validate the form fields and get the values

          // Update the formData state with the form values
          setFormData((prevData) => ({
            ...prevData,
            ...values,
          }));

          // Create a new FormData object
          const updatedAdminDa = new FormData();
          Object.entries(values).forEach(([key, value]) => {
            if (key === 'ProfilePicture') {
              // Skip the ProfilePicture field if it's not updated
              if (formData.ProfilePicture) {
                updatedAdminDa.append(key, formData.ProfilePicture);
              }
            } else {
              updatedAdminDa.append(key, value);
            }
          });

          // Send the updated admin profile to the server
          const response = await axios.put(
            `http://localhost:3000/Users/${adminId}`,
            updatedAdminDa,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          );

          const abcd = await axios.get(
            `http://localhost:3000/user/${adminId}`)
          console.log(abcd);
          // Update the admin data in local storage and state
          const updatedAdmin = response.data;
          localStorage.setItem('adminDa', JSON.stringify(updatedAdmin));
          setAdminDa(updatedAdmin);
          console.log(formData);
          console.log(formData.ProfilePicture);
          console.log(updatedAdmin);

          message.success('Admin data updated successfully.');

        } catch (error) {
          console.error('Error updating admin profile:', error);
          message.error('Error updating admin profile');
        }

        setEditMode(false);
      },
    });
  };

  const handleLogout = () => {
    setEditMode(false);
    Modal.confirm({
      title: 'Confirm Logout',
      content: 'Are you sure you want to Logout ?',
      okText: 'LOGOUT',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {

        // Clear local storage and navigate to the login page
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminDa');
        localStorage.removeItem('isLoggedInAdmin');
        setAdminDa(null);
        navigate.push('/admin/login');
      },
    });
  };

  return (
    <Layout className="admin-layout">
      <Sider
        width={isSiderCollapsed ? 190 : 350}
        onMouseEnter={() => handleSiderHover(true)}
        onMouseLeave={() => handleSiderHover(false)}
        className="admin-sider-dark"
      >
        {isSiderCollapsed ? (
          <div className='admin-logo' style={{paddingLeft: '0', marginLeft: '-80px'}}>
            <img src={companyLogo} alt='company logo' />
          </div>
        ) : (
          <div className='admin-logo' style={{paddingLeft: '0', marginLeft: '-230px'}}>
            <img src={companyLogo} alt='company logo' />
            <div className='admin-company-name'>
              <div className='slogan'>
                {/* Ignite  */}
              </div>
            </div>
          </div>
        )}

        <Menu
          theme="dark"
          defaultSelectedKeys={['1']}
          mode="inline"
          selectedKeys={[selectedMenu]}
          onSelect={handleMenuSelect}
          className="admin-menu-dark"
        >

          <Menu.SubMenu
            key="submenu"
            icon={<HomeOutlined />}
            title="Gize TMS"
            style={{ position: 'fixed', marginTop: '-5px', minWidth: '190px', width: isSiderCollapsed ? '190px' : '350px', }}
          >
                        <Menu.Item key="6" icon={<UserOutlined />}>
              <Link to={`/admin/user/registration/${formData.id}`} style={{ color: '#ffffff' }}>
                Admin Registration
              </Link>
            </Menu.Item>
            <Menu.Item key="7" icon={<UserOutlined />}>
              <Link to={`/admin/adminsList/${formData.id}`} style={{ color: '#ffffff' }}>
                Admin List
              </Link>
            </Menu.Item>
            <Menu.Item key="8" icon={<UserOutlined />}>
              <Link to={`/admin/usersList/${formData.id}`} style={{ color: '#ffffff' }}>
                Users List
              </Link>
            </Menu.Item>
            <Menu.Item key="12" icon={<AppstoreOutlined />}>
              <Link to={`/admin/activities/${formData.id}`} style={{ color: '#ffffff' }}>
                Activities
              </Link>
            </Menu.Item>
          </Menu.SubMenu>
        </Menu>
      </Sider>
      <Layout>
        <Header className="admin-site-layout-background">
          <div className="admin-user-profile">
            <Link type="primary" onClick={() => handleEdit(adminDa)}>
              <div className="admin-profile-picture">
                {adminDa.user.ProfilePicture !== null ? (
                  <img
                    src={profilePictureUrl}
                    alt="Profile"
                    className="admin-logo-image"
                  />
                ) : (
                  <div className="admin-profile-placeholder">
                    <span>
                      {JSON.parse(localStorage.adminDa) && JSON.parse(localStorage.adminDa).user.FirstName ? JSON.parse(localStorage.adminDa).user.FirstName.charAt(0) : null}
                    </span>
                  </div>
                )}
                <span className="admin-user-name">{formData.FirstName} {formData.LastName}</span>
              </div>
            </Link>
          </div>
          <Link onClick={handleLogout} style={{ paddingRight: 20, color:'#151b26',     fontSize: 'large',  fontWeight: 'bold'}}>
            <LogoutOutlined />
            Logout
          </Link>
        </Header>
        <Content className="admin-content">
          {content}
        </Content>
        <Modal
          title={editMode ? 'Edit Admin' : 'Create Admin'}
          visible={editMode}
          onCancel={() => {
            setEditMode(false);
            form.resetFields();
          }}
          onOk={handleSave}
        >
          <Form form={form} onSubmit={handleSave} initialValues={formData}>
            <Form.Item name="FirstName" label="First Name">
              <Input onChange={handleFormChange} name="FirstName" />
            </Form.Item>
            <Form.Item name="LastName" label="Last Name">
              <Input onChange={handleFormChange} name="LastName" />
            </Form.Item>
            <Form.Item name="Email" label="Email">
              <Input type="email" onChange={handleFormChange} name="Email" />
            </Form.Item>
            <Form.Item name="ProfilePicture">
              <label htmlFor="profilePicture">Profile Picture:</label>
              <input
                type="file"
                id="profilePicture"
                accept=".jpeg, .jpg, .png, .gif"
                onChange={handleProfilePictureChange}
              />
              {profilePictureUrl && (
                <img src={profilePictureUrl} alt="Profile" className="admin-modal" />
              )}
            </Form.Item>
            <Button type="primary" onClick={handleSave}>
              Save
            </Button>
          </Form>
        </Modal>
        <Footer className="admin-footer" style={{alignItems: "right", display: "flex", flexDirection: "row" ,alignItems: "baseline"}} >
          Task management system © {new Date().getFullYear()} Created by  
          <div className='admin-logo'>
          <img src={companyLogo} alt="Company logo"/>
          </div>
          Team
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Dashboard;

