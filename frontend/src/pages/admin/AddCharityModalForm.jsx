import React from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

const AddCharityModalForm = ({ showModal, setShowModal, newCharity, handleModalChange, handleModalSave, isActionLoading, isEdit }) => {  
  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{isEdit ? `Edit Charaty` : `Add Charity`}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formOrganizationName">
            <Form.Label>Organization Name</Form.Label>
            <Form.Control
              type="text"
              name="organizationName"
              value={newCharity?.organizationName || ''}
              onChange={handleModalChange}
            />
          </Form.Group>
          <Form.Group controlId="formCountry">
            <Form.Label>Country</Form.Label>
            <Form.Control
              type="text"
              name="country"
              value={newCharity?.country || ''}
              onChange={handleModalChange}
            />
          </Form.Group>
          <Form.Group controlId="formProvinceTerritoryOutsideOfCanada">
            <Form.Label>Province/Territory</Form.Label>
            <Form.Control
              type="text"
              name="provinceTerritoryOutsideOfCanada"
              value={newCharity?.provinceTerritoryOutsideOfCanada || ''}
              onChange={handleModalChange}
            />
          </Form.Group>
          <Form.Group controlId="formCity">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              name="city"
              value={newCharity?.city || ''}
              onChange={handleModalChange}
            />
          </Form.Group>
          <Form.Group controlId="formAddress">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={newCharity?.address || ''}
              onChange={handleModalChange}
            />
          </Form.Group>
          <Form.Group controlId="formPostalCode">
            <Form.Label>Postal Code</Form.Label>
            <Form.Control
              type="text"
              name="postalCode"
              value={newCharity?.postalCode || ''}
              onChange={handleModalChange}
            />
          </Form.Group>
          <Form.Group controlId="formRegistrationNumber">
            <Form.Label>Registration Number</Form.Label>
            <Form.Control
              type="text"
              name="registrationNumber"
              value={newCharity?.registrationNumber || ''}
              onChange={handleModalChange}
            />
          </Form.Group>
          <Form.Group controlId="formCategory">
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="text"
              name="category"
              value={newCharity?.category || ''}
              onChange={handleModalChange}
            />
          </Form.Group>
          <Form.Group controlId="formCharityType">
            <Form.Label>Charity Type</Form.Label>
            <Form.Control
              type="text"
              name="charityType"
              value={newCharity?.charityType || ''}
              onChange={handleModalChange}
            />
          </Form.Group>
          <Form.Group controlId="formSanctionDesignation">
            <Form.Label>Sanction Designation</Form.Label>
            <Form.Control
              type="text"
              name="sanctionDesignation"
              value={newCharity?.sanctionDesignation || ''}
              onChange={handleModalChange}
            />
          </Form.Group>
          <Form.Group controlId="formTypeOfQualifiedDone">
            <Form.Label>Type of Qualified Done</Form.Label>
            <Form.Control
              type="text"
              name="typeOfQualifiedDone"
              value={newCharity?.typeOfQualifiedDone || ''}
              onChange={handleModalChange}
            />
          </Form.Group>
          <Form.Group controlId="formEffectiveDateOfStatus">
            <Form.Label>Effective Date of Status</Form.Label>
            <Form.Control
              type="date"
              name="effectiveDateOfStatus"
              value={newCharity?.effectiveDateOfStatus || ''}
              onChange={handleModalChange}
            />
          </Form.Group>
          <Form.Group controlId="formStatus">
            <Form.Label>Status</Form.Label>
            <Form.Control
              type="text"
              name="status"
              value={newCharity?.status || ''}
              onChange={handleModalChange}
            />
          </Form.Group>
          <Form.Group controlId="formLogo">
            <Form.Label>Logo URL</Form.Label>
            <Form.Control
              type="text"
              name="logo"
              value={newCharity?.logo || ''}
              onChange={handleModalChange}
            />
          </Form.Group>
          <Form.Group controlId="formIsActive">
            <Form.Label>Is Active</Form.Label>
            <Form.Check
              type="checkbox"
              name="isActive"
              checked={newCharity?.isActive || false}
              onChange={(e) => handleModalChange({ target: { name: 'isActive', value: e.target.checked } })}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Close
        </Button>
        <Button disabled={isActionLoading} variant="primary" onClick={handleModalSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export { AddCharityModalForm };
