import React, { useState } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAdminDashboard } from './useAdminDashboard';


const EditableTable = () => {
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({});
  const { data, loading, setData } = useAdminDashboard();

  if(loading){
    return (<div>Loading...</div>)
  }


  const handleEditClick = (item) => {
    setEditId(item.id);
    setFormData(item.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (id) => {
    setData((prev) =>
      prev.map((item) => (item.id === id ? { id, data: formData } : item))
    );
    setEditId(null);
  };

  const handleCancel = () => {
    setEditId(null);
  };

  return (
    <div className="container mt-5">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Organization Name</th>
            <th>City</th>
            <th>Province/Territory</th>
            <th>Country</th>
            <th>Sanction Designation</th>
            <th>Type of Qualified Done</th>
            <th>Charity Type</th>
            <th>Status</th>
            <th>Effective Date of Status</th>
            <th>Registration Number</th>
            <th>Address</th>
            <th>Postal Code</th>
            <th>Category</th>
            <th>Logo</th>
            <th>Is Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>
                {editId === item.id ? (
                  <Form.Control
                    type="text"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleChange}
                  />
                ) : (
                  item.data.organizationName
                )}
              </td>
              <td>
                {editId === item.id ? (
                  <Form.Control
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                ) : (
                  item.data.city
                )}
              </td>
              <td>
                {editId === item.id ? (
                  <Form.Control
                    type="text"
                    name="provinceTerritoryOutsideOfCanada"
                    value={formData.provinceTerritoryOutsideOfCanada}
                    onChange={handleChange}
                  />
                ) : (
                  item.data.provinceTerritoryOutsideOfCanada
                )}
              </td>
              <td>
                {editId === item.id ? (
                  <Form.Control
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                  />
                ) : (
                  item.data.country
                )}
              </td>
              <td>
                {editId === item.id ? (
                  <Form.Control
                    type="text"
                    name="sanctionDesignation"
                    value={formData.sanctionDesignation}
                    onChange={handleChange}
                  />
                ) : (
                  item.data.sanctionDesignation
                )}
              </td>
              <td>
                {editId === item.id ? (
                  <Form.Control
                    type="text"
                    name="typeOfQualifiedDone"
                    value={formData.typeOfQualifiedDone}
                    onChange={handleChange}
                  />
                ) : (
                  item.data.typeOfQualifiedDone
                )}
              </td>
              <td>
                {editId === item.id ? (
                  <Form.Control
                    type="text"
                    name="charityType"
                    value={formData.charityType}
                    onChange={handleChange}
                  />
                ) : (
                  item.data.charityType
                )}
              </td>
              <td>
                {editId === item.id ? (
                  <Form.Control
                    type="text"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  />
                ) : (
                  item.data.status
                )}
              </td>
              <td>
                {editId === item.id ? (
                  <Form.Control
                    type="date"
                    name="effectiveDateOfStatus"
                    value={formData.effectiveDateOfStatus}
                    onChange={handleChange}
                  />
                ) : (
                  item.data.effectiveDateOfStatus
                )}
              </td>
              <td>
                {editId === item.id ? (
                  <Form.Control
                    type="text"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                  />
                ) : (
                  item.data.registrationNumber
                )}
              </td>
              <td>
                {editId === item.id ? (
                  <Form.Control
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                ) : (
                  item.data.address
                )}
              </td>
              <td>
                {editId === item.id ? (
                  <Form.Control
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                  />
                ) : (
                  item.data.postalCode
                )}
              </td>
              <td>
                {editId === item.id ? (
                  <Form.Control
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  />
                ) : (
                  item.data.category
                )}
              </td>
              <td>
                {editId === item.id ? (
                  <Form.Control
                    type="text"
                    name="logo"
                    value={formData.logo}
                    onChange={handleChange}
                  />
                ) : (
                  <img src={item.data.logo} alt="Logo" style={{ width: '50px' }} />
                )}
              </td>
              <td>
                {editId === item.id ? (
                  <Form.Check
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                  />
                ) : (
                  (item.data.isActive ? 'Yes' : 'No')
                )}
              </td>
              <td>
                {editId === item.id ? (
                  <>
                    <Button
                      variant="success"
                      onClick={() => handleSave(item.id)}
                      className="me-2"
                    >
                      Save
                    </Button>
                    <Button variant="secondary" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button variant="warning" onClick={() => handleEditClick(item)}>
                    Edit
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default EditableTable;
