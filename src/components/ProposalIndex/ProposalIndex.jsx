import { useState, useEffect, useContext } from "react";
import styles from "./proposalindex.module.css";
import { useNavigate, Link, useParams } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import {
  userProposalIndex,
  adminProposalIndex,
  proposalDelete,
  proposalUpdate,
  proposalShow,
} from "../../services/proposalService";
import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "500px",
  maxWidth: "90vw",
  height: "auto",
  bgcolor: "#2a2929",
  borderRadius: "5px",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.35)",
  p: 5,
  color: "#bcb4b3",
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  fontFamily: "Switzer, sans-serif",
};

export default function AllProposals() {
  const [proposal, setProposal] = useState([]);
  const [modalProposal, setModalProposal] = useState(null)
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const { proposalId } = useParams();
  const [open, setOpen] = useState(false);

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "accepted", label: "Accepted" },
    { value: "rejected", label: "Rejected" },
    { value: "under_review", label: "Under Review" },
  ];

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        let data;
        if (user.is_admin) {
          // Fetch all proposals if the user is an admin
          data = await adminProposalIndex();
        } else {
          // Fetch only proposals belonging to the logged-in user
          data = await userProposalIndex();
        }
        setProposal(data);
      } catch (error) {
        console.error("Error fetching proposals:", error);
      }
    };

    fetchProposals();
  }, [user, navigate]); // Runs when `user` or `navigate` changes

    const handleUpdate = (proposalId) => {
      navigate(`/proposal/${proposalId}/update`);
    };
    
  const handleRemove = async (proposalId) => {
    try {
      await proposalDelete(proposalId);
      //  Remove the proposal from the state (to update UI immediately)
      setProposal((prevProposals) =>
        prevProposals.filter((prop) => prop.id !== proposalId)
      );
    } catch (error) {
      console.error("Error deleting proposal:", error);
    }
  };

  const handleStatusChange = async (proposalId, newStatus) => {
    try {
      const updatedProposal = await proposalUpdate(proposalId, {
        status: newStatus, // Sending correct value to the API
      });

      // Update UI with the new status
      setProposal((prevProposal) =>
        prevProposal.map((prop) =>
          prop.id === proposalId
            ? { ...prop, status: updatedProposal.status }
            : prop
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleView = async (proposalId) => {
    try {
      setOpen(true)
      const data = await proposalShow(proposalId)
      console.log("Fetched Proposal Data:", data);
      setModalProposal(data)
    } catch (error) {
      console.error(error);
    }
  }

  const handleClose = async () => {
    setOpen(false)
    setModalProposal(null)
  }

  return (
    <>
      <div className={styles.proposalsContainer}>
        <h2>{user.is_admin ? "Received Proposals" : "My Proposals"}</h2>
        <div className={styles.proposalsGrid}>
          {/* ✅ Admin UI Placeholder */}
          {user.is_admin
            ? proposal.map((prop) => (
                <div key={prop.id}>
                  <div
                    className={styles.proposalCard}
                    onClick={() => handleView(prop.id)}
                  >
                    <div className={styles.proposalInfo}>
                      <h4>{prop.project_title}</h4>
                      <p>
                        <strong>Submitted by:</strong> {prop.user.username}
                      </p>
                      <p>
                        <strong>Talent:</strong> {prop.talent.name}
                      </p>
                      <p>
                        <strong>Brand:</strong> {prop.brand}
                      </p>

                      <p>
                        <strong>Deadline:</strong> {prop.deadline}
                      </p>
                    </div>
                  </div>
                  <div className={styles.statusUpdate}>
                    <label>Update status: </label>
                    <select
                      value={prop.status} // Ensure correct value is selected
                      onChange={(e) =>
                        handleStatusChange(prop.id, e.target.value)
                      }
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))
            : proposal.map((prop) => (
                <div
                  key={prop.id}
                  className={styles.proposalCard}
                  onClick={() => handleView(prop.id)}
                >
                  {/* Clicking the name or image takes the user to the proposal page */}
                  {/* <Link
                  to={`/proposal/${prop.id}`}
                  className={styles.proposalLink}
                > */}
                  <div className={styles.proposalInfo}>
                    <h4>{prop.project_title}</h4>
                    <p>
                      <strong>Talent:</strong> {prop.talent.name}
                    </p>
                    <p>
                      <strong>Brand:</strong> {prop.brand}
                    </p>
                    <p>
                      <strong>Deadline:</strong> {prop.deadline}
                    </p>
                    <p>
                      <strong>Status:</strong> {prop.status}
                    </p>
                  </div>
                  {/* </Link> */}
                  <div className={styles.cardButtons}>
                    <button onClick={() => handleUpdate(prop.id)}>
                      Update Proposal
                    </button>
                    <button onClick={() => handleRemove(prop.id)}>
                      Delete Proposal
                    </button>
                  </div>
                </div>
              ))}
        </div>
      </div>

      {modalProposal && (
        <Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
          <Box sx={modalStyle}>
            {/* Title */}
            <Typography
              id="modal-title"
              variant="h6"
              component="h2"
              sx={{
                fontWeight: "bold",
                fontSize: "24px",
                textAlign: "center",
                paddingBottom: "10px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
                color: "light gray", // Subtle underline
              }}
            >
              {modalProposal.project_title}
            </Typography>

            {/* Info Wrapper for better layout */}
            <Box
              sx={{
                textAlign: "left",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <Typography
                sx={{ fontSize: "16px", padding: "8px 0", lineHeight: "1.5" }}
              >
                <strong>Submitted by:</strong>{" "}
                {modalProposal.user ? modalProposal.user.username : "Unknown"}
              </Typography>

              <Typography
                sx={{ fontSize: "16px", padding: "8px 0", lineHeight: "1.5" }}
              >
                <strong>Talent:</strong>{" "}
                {modalProposal.talent ? modalProposal.talent.name : "Unknown"}{" "}
                <br />
                <strong>Brand:</strong> {modalProposal.brand}
              </Typography>

              <Typography
                sx={{ fontSize: "16px", padding: "8px 0", lineHeight: "1.5" }}
              >
                <strong>Project Proposal:</strong>{" "}
                {modalProposal.project_proposal}
              </Typography>

              <Typography
                sx={{ fontSize: "16px", padding: "8px 0", lineHeight: "1.5" }}
              >
                <strong>Budget:</strong> {modalProposal.budget} <br />
                <strong>Deadline:</strong> {modalProposal.deadline}
              </Typography>

              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  padding: "8px 0",
                  color:
                    modalProposal.status === "accepted"
                      ? "#00C851"
                      : modalProposal.status === "rejected"
                      ? "#ff4444"
                      : modalProposal.status === "under_review"
                      ? "#ffbb33"
                      : "#ffffff",
                }}
              >
                <strong>Status:</strong> {modalProposal.status}
              </Typography>
            </Box>
          </Box>
        </Modal>
      )}
    </>
  );
}
