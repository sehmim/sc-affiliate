import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import EditableTable from './EditableTable';
import CampaignsTable from './CampaignsTable';

const AdminDashboard = () => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    if (savedUsername === 'sponsor') {
      setIsAdminLoggedIn(true);
    }
  }, []);

  const handleLogin = (event) => {
    event.preventDefault();
    if (username === 'sponsor' && password === 'circle') {
      localStorage.setItem('username', username);
      setIsAdminLoggedIn(true);
    }
  };

  if (!isAdminLoggedIn) {
    return (
      <AdminLoginForm
        handleLogin={handleLogin}
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
      />
    );
  }


  const handleLogout =() => {
    localStorage.setItem('username', null);
    window.location.reload();
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-dashboard-header">
        <h1 className="m-5 text-center">Admin Dashboard</h1>
        <div>
          <button onClick={()=> handleLogout()}>Logout</button>
        </div>
        <hr />
      </header>
      <h4 className="m-4">Charities</h4>
      <EditableTable />
      <hr />
      <div>
        <h4 className="m-4">Impact Campaigns/Brands</h4>
        <CampaignsTable />
      </div>
    </div>
  );
};

const AdminLoginForm = ({ handleLogin, username, setUsername, password, setPassword }) => {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Login</h2>
              <form onSubmit={handleLogin}>
                <div className="form-group mb-3">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    placeholder="Enter Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-block">
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
