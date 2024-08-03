import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import EditableTable from './EditableTable';
import CampaignsTable from './CampaignsTable';

const AdminDashboard = () => {

  return (
    <div className="admin-dashboard ">
      <header className="admin-dashboard-header">
        <h1 className="m-5 text-center">Admin Dashboard</h1>
        <hr></hr>
      </header>
        <h4 className="m-4">Charities</h4>
        <EditableTable />

      <hr></hr>
      <div>
        <h4 className="m-4">Impact Campaigns/Brands</h4>
        <CampaignsTable />
      </div>
    </div>
  );
};

export default AdminDashboard;
