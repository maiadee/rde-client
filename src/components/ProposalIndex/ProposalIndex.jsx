import { useState, useEffect, useContext } from "react";
import styles from "./proposalindex.module.css";
import { useNavigate, Link, useParams } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import {
  userProposalIndex,
  adminProposalIndex,
  proposalDelete,
} from "../../services/proposalService";

export default function AllProposals() {
  const [proposal, setProposal] = useState([]);
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const { proposalId } = useParams();

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

  return (
    <div className={styles.proposalsContainer}>
      <h2>{user.is_admin ? "All Submitted Proposals" : "My Proposals"}</h2>
      <div className={styles.proposalsGrid}>
        {/* ✅ Admin UI Placeholder */}
        {user.is_admin ? (
          <div>
            <p>Admin view coming soon...</p>
            {/* 🛠️ Add Admin UI here later */}
          </div>
        ) : (
          proposal.map((prop) => (
            <div key={prop.id} className={styles.proposalCard}>
              {/* Clicking the name or image takes the user to the proposal page */}
              <Link to={`/proposal/${prop.id}`} className={styles.proposalLink}>
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
                <button>Update Proposal</button>
                <button onClick={() => handleRemove(prop.id)}>
                  Delete Proposal
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
