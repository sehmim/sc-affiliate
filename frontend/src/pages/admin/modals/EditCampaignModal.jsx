import React from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";

const EditCampaignModal = ({
   showModal,
   setShowModal,
   newCharity,
   handleModalChange,
   handleModalSave,
   isActionLoading,
   isEdit,
}) => {
   return (
      <Modal show={showModal} onHide={() => setShowModal(false)}>
         <Modal.Header closeButton>
            <Modal.Title>{isEdit ? `Edit Charaty` : `Add Charity`}</Modal.Title>
         </Modal.Header>
         <Modal.Body>

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

export { EditCampaignModal };
