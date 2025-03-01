import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { talentShow } from "../../services/talentService";
import styles from "./talentshow.module.css";

export default function TalentProfile() {
  const { id } = useParams();
  const [talent, setTalent] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("Fetching talent with ID:", id);
    const fetchTalent = async () => {
      setError("");
      try {
        const data = await talentShow(id);
        if (data) {
          setTalent(data);
        } else {
          setTalent(null);
        }
      } catch (error) {
        console.error(error);
        setError("Failed to load talent. Please try again.");
      }
    };

    fetchTalent();
  }, [id]);

  if (error) return <p className="error-message">{error}</p>;

  if (!talent) return <p>Talent not found.</p>;

  return (
    <div className={styles.talentProfileContainer}>
      <div className={styles.talentName}>
        <h2>{talent.name}</h2>
      </div>
      <div className={styles.talentProfileImage}>
        {talent.profile_image ? (
          <img
            src={`${import.meta.env.VITE_API_URL}${talent.profile_image}`}
            alt={`Profile of ${talent.name}`}
            width="200px"
          />
        ) : (
          <p>No profile picture available</p>
        )}
      </div>
      <div className={styles.talentGallery}>
        {talent.images && talent.images.length > 0 ? (
          talent.images.map((img) => (
            <img
              key={img.id}
              src={`${import.meta.env.VITE_API_URL}${img.image}`}
              alt={`Work by ${talent.name}`}
              width="100px"
            />
          ))
        ) : (
          <p>No gallery images available</p>
        )}
      </div>
      <div className={styles.talentProposalButton}>
        <button>Send Proposal</button>
      </div>
      <div className={styles.talentInfo}>
        <p>{talent.description}</p>
      </div>
    </div>
  );
}
