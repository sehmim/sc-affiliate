import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import EditableTable from './EditableTable';

const AdminDashboard = () => {

  return (
    <div className="admin-dashboard">
      <header className="admin-dashboard-header">
        <h1>Admin Dashboard</h1>
      </header>
        <EditableTable />
    </div>
  );
};

export default AdminDashboard;
