import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; 
import styles from "./talentindex.module.css";
import { talentIndex } from "../../services/talentService";

export default function AllTalent() {
  const [talent, setTalent] = useState([]);

  useEffect(() => {
    talentIndex()
      .then((data) => setTalent(data))
      .catch((err) => console.log(err));
  }, []);

  return (
     <div className={styles.gridContainer}>
     <div className={styles.talentGrid}>
       {talent.map((tal) => (
         <div key={tal.id} className={styles.talentCard}>
           {/* Clicking the name or image takes the user to the talent profile page */}
           <Link to={`/talent/${tal.id}`} className={styles.talentLink}>
             <div className={styles.talentName}>
               <h4>{tal.name}</h4>
             </div>
             <div className={styles.talentCardImage}>
               {tal.profile_image ? (
                 <img
                   src={tal.profile_image}
                   alt={`Profile of ${tal.name}`}
                   width="200px"
                 />
               ) : (
                 <p>No profile picture available</p>
               )}
             </div>
           </Link>
         </div>
       ))}
      </div>
      </div>
   );
}
