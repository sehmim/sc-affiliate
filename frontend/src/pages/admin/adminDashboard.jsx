import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import EditableTable from './EditableTable';
import CampaignsTable from './CampaignsTable';

const AdminDashboard = () => {

  return (
    <div className="admin-dashboard">
      <header className="admin-dashboard-header">
        <h1>Admin Dashboard</h1>
      </header>
        <EditableTable />

      <div>
        <h1>Impact Campaigns/Brands</h1>
        <CampaignsTable />
      </div>
    </div>
  );
};

export default AdminDashboard;
