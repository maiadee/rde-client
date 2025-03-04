import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import { proposalShow, proposalUpdate } from "../../services/proposalService";
import { talentIndex } from "../../services/talentService";
import styles from "./updateproposal.module.css";

export default function UpdateProposal() {
  const { user } = useContext(UserContext);
  const [talent, setTalent] = useState([]);
  const navigate = useNavigate();
  const { proposalId } = useParams();

  const [formData, setFormData] = useState({
    talent: "",
    brand: "",
    project_title: "",
    project_proposal: "",
    budget: "",
    deadline: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    talentIndex()
      .then((data) => {
        setTalent(data); // Store the talent list in state
      })
      .catch((error) => {
        console.error("Error fetching talents:", error);
      });

    proposalShow(proposalId)
      .then((data) => {
        setFormData({
          talent: data.talent.id || "", // Ensure talent ID is stored
          brand: data.brand || "",
          project_title: data.project_title || "",
          project_proposal: data.project_proposal || "",
          budget: data.budget || "",
          deadline: data.deadline || "",
        });
      })
      .catch(() => {
        setErrors({ fetch: "Failed to load proposal data" });
      });
  }, [proposalId, user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await proposalUpdate(proposalId, formData)
            navigate(`/proposal/user`)
        } catch (error) {
            console.error("Error updating proposal:", error);
        }
    }

  return (
    <div className={styles.proposalContainer}>
      <h2>Update Proposal</h2>
      <div className={styles.proposalForm}>
        <form className={styles.form} onSubmit={handleUpdate}>
          <div className={styles.formGroup}>
            <label>Talent: </label>
            <select
              name="talent"
              value={formData.talent}
              onChange={handleChange}
              required
            >
              <option value="">Select a Talent</option>
              {talent.map((tal) => (
                <option key={tal.id} value={tal.id}>
                  {tal.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Brand: </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Project Title: </label>
            <input
              type="text"
              name="project_title"
              value={formData.project_title}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Project Proposal: </label>
            <textarea
              name="project_proposal"
              value={formData.project_proposal}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Budget: </label>
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Deadline: </label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formButtonContainer}>
            <button className={styles.button} type="submit">
              Update Proposal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
