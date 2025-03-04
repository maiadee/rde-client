import { useState, useEffect, useContext } from "react";
import styles from "./proposalindex.module.css";
import { useNavigate, Link, useParams } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import {
  userProposalIndex,
  adminProposalIndex,
  proposalDelete,
  proposalUpdate,
} from "../../services/proposalService";

export default function AllProposals() {
  const [proposal, setProposal] = useState([]);
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const { proposalId } = useParams();

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "accepted", label: "Accepted" },
    { value: "rejected", label: "Rejected" },
    { value: "under_offer", label: "Under Offer" },
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

  return (
    <div className={styles.proposalsContainer}>
      <h2>{user.is_admin ? "Received Proposals" : "My Proposals"}</h2>
      <div className={styles.proposalsGrid}>
        {/* ✅ Admin UI Placeholder */}
        {user.is_admin
          ? proposal.map((prop) => (
              <div key={prop.id} className={styles.proposalCard}>
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
                    <strong>Project Proposal:</strong> {prop.project_proposal}
                  </p>
                  <p>
                    <strong>Budget:</strong> {prop.budget}
                  </p>
                  <p>
                    <strong>Deadline:</strong> {prop.deadline}
                  </p>
                </div>
                <div className={styles.statusUpdate}>
                  <label>Status: </label>
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
              <div key={prop.id} className={styles.proposalCard}>
                {/* Clicking the name or image takes the user to the proposal page */}
                <Link
                  to={`/proposal/${prop.id}`}
                  className={styles.proposalLink}
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
                </Link>
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
  );
}
