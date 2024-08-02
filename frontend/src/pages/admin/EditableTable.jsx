import React, { useState } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAdminDashboard } from './useAdminDashboard';
import { AddCharityModalForm } from './AddCharityModalForm';
import { createCharity, deleteCharity } from '../../api/charityApi';

const EditableTable = () => {
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [newCharity, setNewCharity] = useState({});
  const [charityToEdit, setCharityToEdit] = useState();

  const { data, loading, setData } = useAdminDashboard();

  const [ isActionLoading, setIsActionLoading ] = useState();

  if(loading){
    return (<div>Loading...</div>)
  }


  const handleEditClick = ({ data }) => {
    setCharityToEdit(data)
    setShowModalEdit(true);
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
  
  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setNewCharity((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditModalChange = (e) => {
    const { name, value } = e.target;
    setCharityToEdit((prev) => ({ ...prev, [name]: value }));
  }

  const handleDelete = async (item) => {
    try {
      console.log("DELETING ->", item.id);
      const dataWithoutDeletedItem = data.filter(old => old.id !== item.id);
      setData(dataWithoutDeletedItem);
      
      await deleteCharity(item.id);
    } catch (error) {
      console.log('error ->', error)
    }
  }

  const handleUploadNewCharity = async () => {
    setData((prev) => [...prev, { id: Date.now(), data: newCharity }]);

    try {
      setIsActionLoading(true);
      console.log("newCharity -->", newCharity);
      const response = await createCharity(newCharity);
      console.log('Charity created:', response);
    } catch (error) {
      console.error('Error creating charity:', error);
    } finally {
      setShowModal(false);
      setNewCharity({});
      setIsActionLoading(false)
    }
  };

  const handleUpdateCharity = async () => {

    const id = charityToEdit.id;

    console.log("id -->", id);

    setData((prev) =>
      prev.map((item) => (item.id === id ? { id, data: charityToEdit } : item))
    );

    setEditId(null);
    setShowModalEdit(false);
    setCharityToEdit({});
    setIsActionLoading(false)
  }

  return (
    <div className="m-4">
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
            <th></th>
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
                <Button variant="warning" onClick={() => handleEditClick(item)}>
                  Edit
                </Button>
              </td>
              <td>
                  <>
                    <Button variant="danger" onClick={() => handleDelete(item)}>
                      Delete
                    </Button>
                  </>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button onClick={() => setShowModal(true)}>Add Charity</Button>
      
      {/* // EDIT VIEW  */}
      <AddCharityModalForm
        showModal={showModalEdit}
        newCharity={charityToEdit}
        isActionLoading={isActionLoading}
        handleModalChange={handleEditModalChange}
        handleModalSave={handleUpdateCharity}
        setShowModal={setShowModalEdit}
        isEdit={true}
      />

      {/* // ADD VIEW  */}
      <AddCharityModalForm
        showModal={showModal}
        newCharity={newCharity}
        isActionLoading={isActionLoading}
        handleModalChange={handleModalChange}
        handleModalSave={handleUploadNewCharity}
        setShowModal={setShowModal}
      />
    </div>
  );
};

export default EditableTable;
