import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import { proposalCreate } from "../../services/proposalService";
import { talentIndex } from "../../services/talentService";
import styles from "./createproposal.module.css";

export default function CreateProposal() {
  const [talent, setTalent] = useState([]);
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

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
    if (!user) {
      navigate("/auth/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchTalent = async () => {
      try {
        const data = await talentIndex();
        setTalent(data);
      } catch (error) {
        console.error("Error fetching talent:", error);
      }
    };

    fetchTalent();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await proposalCreate(formData);
      console.log("Proposal created:", response);
      navigate("/proposal/user");
    } catch (error) {
      setErrors(
        error.response?.data?.errors || {
          general: "Failed to create proposal.",
        }
      );
    }
  };

  return (
    <div className={styles.proposalContainer}>
      <h2>Proposal</h2>
      <div className={styles.proposalForm}>
        <form className={styles.form} onSubmit={handleSubmit}>
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
              Submit Proposal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
