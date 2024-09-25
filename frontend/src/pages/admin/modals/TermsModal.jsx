import React, { useState } from "react";
import { updateDoc, doc } from "firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Modal } from "react-bootstrap";
import { firestore } from "../../../utils/firebase";
import { fetchLatestEntry } from "../Tables/ImpactCampaigns";


export const TermsModal = ({ campaign, campaignsList, campaignsListId, showModal, setShowModal, setFeatureLoading, editableTerms, handleEditTerm }) => {
  const [newTerm, setNewTerm] = useState({ title: "", details: "" });

    const saveTerm = async (campaignID, termIndex) => {
    setFeatureLoading(true);
    try {
      const updatedCampaignsArray = campaignsList.map((campaign) => {
        if (campaign.campaignID === campaignID) {
          const updatedTerms = [...campaign.terms];
          const editedTerm = editableTerms[campaignID]?.[termIndex];

          if (editedTerm) {
            updatedTerms[termIndex] = {
              ...updatedTerms[termIndex],
              title: editedTerm.title || updatedTerms[termIndex].title,
              details: editedTerm.details || updatedTerms[termIndex].details,
            };
          }

          return { ...campaign, terms: updatedTerms };
        }
        return campaign;
      });

      const docRef = doc(firestore, "rakutenCampaigns", campaignsListId);
      await updateDoc(docRef, { campaigns: updatedCampaignsArray });

      setFeatureLoading(false);
      setShowModal(null)
      console.log(`Campaign ${campaignID} terms successfully updated.`);
    } catch (error) {
      setShowModal(null)
      setFeatureLoading(false);
      console.error("Error updating campaign terms in Firestore:", error);
    }
  };

  const handleAddNewTerm = async (campaignID) => {
    if (!newTerm.title || !newTerm.details) return;

    setFeatureLoading(true);
    try {
      const { data, id } = await fetchLatestEntry("rakutenCampaigns");
      const updatedCampaignsArray = campaignsList.map((c) => {
        if (c.campaignID === campaignID) {
          return {
            ...c,
            terms: [...c.terms, newTerm],
          };
        }
        return c;
      });

      const docRef = doc(firestore, "rakutenCampaigns", campaignsListId);
      await updateDoc(docRef, { campaigns: updatedCampaignsArray });

      setNewTerm({ title: "", details: "" });
      setFeatureLoading(false);
      setShowModal(false);
      console.log(`New term added to campaign ${campaignID}.`);
    } catch (error) {
      setShowModal(false);
      setFeatureLoading(false);
      console.error("Error adding new term to campaign:", error);
    }
  };

  const handleDeleteTerm = async (campaignID, termIndex) => {
    setFeatureLoading(true);
    try {
      const updatedCampaignsArray = campaignsList.map((c) => {
        if (c.campaignID === campaignID) {
          const updatedTerms = [...c.terms];
          updatedTerms.splice(termIndex, 1);

          return { ...c, terms: updatedTerms };
        }
        return c;
      });

      const docRef = doc(firestore, "rakutenCampaigns", campaignsListId);
      await updateDoc(docRef, { campaigns: updatedCampaignsArray });

      setFeatureLoading(false);
      setShowModal(false);
      console.log(`Term ${termIndex + 1} deleted from campaign ${campaignID}.`);
    } catch (error) {
      setShowModal(false);
      setFeatureLoading(false);
      console.error("Error deleting term from campaign:", error);
    }
  };

  return (
    <>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Manage Campaign Terms</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-column">
            {campaign.terms.length > 0 &&
              campaign.terms.map((term, termIndex) => (
                term.details && <p className="d-flex flex-column" key={termIndex}>
                  <div>
                    <b>Title:</b>
                    <input
                      className="container mb-2 p-1"
                      type="text"
                      value={
                        editableTerms[campaign.campaignID]?.[termIndex]?.title ||
                        term.title
                      }
                      onChange={(e) =>
                        handleEditTerm(
                          campaign.campaignID,
                          termIndex,
                          "title",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <b>Detail:</b>
                    <input
                      className="container mb-2 p-1"
                      type="text"
                      value={
                        editableTerms[campaign.campaignID]?.[termIndex]?.details ||
                        term.details
                      }
                      onChange={(e) =>
                        handleEditTerm(
                          campaign.campaignID,
                          termIndex,
                          "details",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <Button
                    className="mt-2"
                    onClick={() => saveTerm(campaign.campaignID, termIndex)}
                  >
                    Save
                  </Button>
                  <Button
                    variant="danger"
                    className="mt-2"
                    onClick={() => handleDeleteTerm(campaign.campaignID, termIndex)}
                  >
                    Delete
                  </Button>
                  <hr></hr>
                </p>
              ))}
          </div>

          {/* Add New Term */}
          <div className="d-flex flex-column">
            <h5>Add New Term</h5>
            <input
              type="text"
              placeholder="Title"
              className="container mb-2"
              value={newTerm.title}
              onChange={(e) => setNewTerm({ ...newTerm, title: e.target.value })}
            />
            <input
              className="container"
              type="text"
              placeholder="Details"
              value={newTerm.details}
              onChange={(e) =>
                setNewTerm({ ...newTerm, details: e.target.value })}
            />
            <Button
              className="mt-2"
              onClick={() => handleAddNewTerm(campaign.campaignID)}
            >
              Add Term
            </Button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};