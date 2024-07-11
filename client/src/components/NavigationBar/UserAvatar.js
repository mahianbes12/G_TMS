import React, { useEffect, useState } from "react";
import "../../css/Navbar.css";
import axios from "axios";

const UserAvatar = ({ id }) => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  const getUser = async () => {
    const res = await axios.get(`http://localhost:3000/user/${id}`);
    setUser(res.data);
    setLoading(false);
  };

  useEffect(() => {
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <div>Loading..</div>;
  }
  return (
    <div className="user-avatar">
      {(user.FirstName[0]+ user.LastName[0]).toUpperCase()}
    </div>
  );
};

export default UserAvatar;
