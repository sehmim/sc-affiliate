import React, { useState } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAdminDashboard } from './useAdminDashboard';
import { AddCharityModalForm } from './AddCharityModalForm';
import { createCharity, deleteCharity, updateCharity } from '../../api/charityApi';

const EditableTable = () => {
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [newCharity, setNewCharity] = useState({});
  const [charityToEdit, setCharityToEdit] = useState();

  const { data, loading, setData } = useAdminDashboard();

  const [ isActionLoading, setIsActionLoading ] = useState();

  if(loading){
    return (<div>Loading...</div>)
  }


  const handleEditClick = (charity) => {
    setEditId(charity.id);
    setCharityToEdit(charity.data)
    setShowModalEdit(true);
  };

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({ ...prev, [name]: value }));
  // };

  // const handleSave = (id) => {
  //   setData((prev) =>
  //     prev.map((item) => (item.id === id ? { id, data: formData } : item))
  //   );
  //   setEditId(null);
  // };

  // const handleCancel = () => {
  //   setEditId(null);
  // };
  
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

    setData((prev) =>
      prev.map((item) => (item.id === editId ? { id: editId, data: charityToEdit } : item))
    );

    try {
      await updateCharity(editId, charityToEdit);
    } catch (error) {
      console.log(error)
    } finally {
      setEditId(null);
      setShowModalEdit(false);
      setCharityToEdit({});
      setIsActionLoading(false)
    }
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
              <td>{item.data.organizationName}</td>
              <td>{item.data.city}</td>
              <td>{item.data.provinceTerritoryOutsideOfCanada}</td>
              <td>{item.data.country}</td>
              <td>{item.data.sanctionDesignation}</td>
              <td>{item.data.typeOfQualifiedDone}</td>
              <td>{item.data.charityType}</td>
              <td>{item.data.status}</td>
              <td>{item.data.effectiveDateOfStatus}</td>
              <td>{item.data.registrationNumber}</td>
              <td>{item.data.address}</td>
              <td>{item.data.postalCode}</td>
              <td>{item.data.category}</td>
              <td>
                <img src={item.data.logo} alt="Logo" style={{ width: '50px' }} />
              </td>
              <td>{(item.data.isActive ? 'Yes' : 'No')}</td>
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
