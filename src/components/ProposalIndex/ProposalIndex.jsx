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
import Spinner from "../Spinner/Spinner";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "500px",
  maxWidth: "90vw",
  bgcolor: "white",
  border: "none",
  borderRadius: "2px",
  boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
  p: 5,
  color: "#3e3d3d",
  fontFamily: "Switzer, sans-serif",
};

export default function AllProposals() {
  const [proposal, setProposal] = useState([]);
  const [modalProposal, setModalProposal] = useState(null);
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const { proposalId } = useParams();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "accepted", label: "Accepted" },
    { value: "rejected", label: "Rejected" },
    { value: "under_review", label: "Under Review" },
  ];

  useEffect(() => {
    const fetchProposals = async () => {
      setIsLoading(true);
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
      } finally {
        setIsLoading(false);
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
      setOpen(true);
      const data = await proposalShow(proposalId);
      console.log("Fetched Proposal Data:", data);
      setModalProposal(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClose = async () => {
    setOpen(false);
    setModalProposal(null);
  };

  if (isLoading) return <Spinner />;

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
                  <div className={styles.cardButtonsAdmin}>
                    <button onClick={() => handleRemove(prop.id)}>
                      Delete Proposal
                    </button>
                  </div>
                </div>
              ))
            : proposal.map((prop) => (
                <div
                  key={prop.id}
                  className={styles.proposalCard}
                  onClick={() => handleView(prop.id)}
                >
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
              variant="h2"
              component="h2"
              sx={{
                fontSize: "24px",
                fontWeight: 500,
                letterSpacing: "1px",
                textTransform: "uppercase",
                textAlign: "center",
                marginBottom: "25px",
                position: "relative",
                color: "#3e3d3d",
              }}
            >
              {modalProposal.project_title}
            </Typography>

            {/* Info Wrapper */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "15px",
              }}
            >
              <Typography
                sx={{
                  fontSize: "18px",
                  color: "#3e3d3d",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  fontWeight: 400,
                  borderBottom: "1px solid #e0e0e0",
                  paddingBottom: "10px",
                  marginBottom: "10px",
                }}
              ></Typography>

              <Typography
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "14px",
                  color: "#666",
                }}
              >
                <strong>Submitted by:</strong>
                <span>
                  {modalProposal.user ? modalProposal.user.username : "Unknown"}
                </span>
              </Typography>

              <Typography
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "14px",
                  color: "#666",
                }}
              >
                <strong>Talent:</strong>
                <span>
                  {modalProposal.talent ? modalProposal.talent.name : "Unknown"}
                </span>
              </Typography>

              <Typography
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "14px",
                  color: "#666",
                }}
              >
                <strong>Brand:</strong>
                <span>{modalProposal.brand}</span>
              </Typography>

              <Typography
                sx={{
                  fontSize: "14px",
                  color: "#666",
                }}
              >
                <strong>Project Proposal:</strong>
                <p>{modalProposal.project_proposal}</p>
              </Typography>

              <Typography
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "14px",
                  color: "#666",
                }}
              >
                <strong>Budget:</strong>
                <span>{modalProposal.budget}</span>
              </Typography>

              <Typography
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "14px",
                  color: "#666",
                }}
              >
                <strong>Deadline:</strong>
                <span>{modalProposal.deadline}</span>
              </Typography>

              <Box
                sx={{
                  borderTop: "1px solid #e0e0e0",
                  paddingTop: "20px",
                  marginTop: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    color:
                      modalProposal.status === "accepted"
                        ? "#00C851"
                        : modalProposal.status === "rejected"
                        ? "#ff4444"
                        : modalProposal.status === "under_review"
                        ? "#ffbb33"
                        : "#3e3d3d",
                  }}
                >
                  Status: {modalProposal.status}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Modal>
      )}
    </>
  );
}
