import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { talentShow } from "../../services/talentService";
import styles from "./talentshow.module.css";
import Spinner from "../Spinner/Spinner"
import * as React from "react";
import { Box, Modal } from "@mui/material";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  maxWidth: "600px",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.25)",
  p: 2,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "2px",
};

export default function TalentProfile() {
  const { talentId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [talent, setTalent] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    console.log("Fetching talent with ID:", talentId);
    const fetchTalent = async () => {
      setIsLoading(true)
      setError("");
      try {
        const data = await talentShow(talentId);
        if (data) {
          setTalent(data);
        } else {
          setTalent(null);
        }
      } catch (error) {
        console.error(error);
        setError("Failed to load talent. Please try again.");
      } finally {
        setIsLoading(false)
      }
    };

    fetchTalent();
  }, [talentId]);

 const handleOpen = (image) => {
   setSelectedImage(image);
   setOpen(true);
 };

 const handleClose = () => {
   setOpen(false);
   setSelectedImage(null);
 };


  if (error) return <p className="error-message">{error}</p>;

  if (!talent) return <Spinner />;

  if (isLoading) return <Spinner />;

  const handleButtonClick = () => {
    navigate("/proposal")
  }

  return (
    <div className={styles.talentProfilePage}>
      <div className={styles.talentName}>
        <h2>{talent.name}</h2>
      </div>
      <div className={styles.profileContainer}>
        <div className={styles.profileLeft}>
          <div className={styles.talentProfileImage}>
            {talent.profile_image ? (
              <img
                src={talent.profile_image}
                alt={`Profile of ${talent.name}`}
                onClick={() =>
                  handleOpen(
                    talent.profile_image
                  )
                }
                style={{ cursor: "pointer", transition: "transform 0.2s" }}
                onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
                onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
              />
            ) : (
              <p>No profile picture available</p>
            )}
          </div>
          <div className={styles.talentInfo}>
            <p>{talent.description}</p>
          </div>
          <div className={styles.talentProposalButton}>
            <button onClick={handleButtonClick}>Send Proposal</button>
          </div>
        </div>
        <div className={styles.profileRight}>
          <div className={styles.talentGallery}>
            {talent.images && talent.images.length > 0 ? (
              talent.images.map((img) => (
                <img
                  key={img.id}
                  src={`${import.meta.env.VITE_API_URL}${img.image}`}
                  alt={`Work by ${talent.name}`}
                  onClick={() =>
                    handleOpen(`${import.meta.env.VITE_API_URL}${img.image}`)
                  }
                  style={{ cursor: "pointer", transition: "transform 0.2s" }}
                  onMouseOver={(e) =>
                    (e.target.style.transform = "scale(1.05)")
                  }
                  onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
                  width="100px"
                />
              ))
            ) : (
              <p>No gallery images available</p>
            )}
          </div>
          <Modal open={open} onClose={handleClose}>
            <Box sx={modalStyle}>
              {selectedImage && (
                <img
                  src={selectedImage}
                  alt="Enlarged view"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "90vh",
                    borderRadius: "2px",
                  }}
                />
              )}
            </Box>
          </Modal>
        </div>
      </div>
    </div>
  );
}
