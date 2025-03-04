import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import styles from "./homepage.module.css";
import hattieSketchbook from "../../assets/hattie-sketchbook2.png";
import annuFlower from "../../assets/annu-flower.jpg";

export default function Homepage() {
  const { user } = useContext(UserContext);

  return (
    <div className={styles.homepageImages}>
      <img
        className={styles.hattieSketchbook}
        src={hattieSketchbook}
        alt="Hattie's work"
      />
      <img className={styles.annuFlower} src={annuFlower} alt="Annu's work" />
    </div>
  );
}
