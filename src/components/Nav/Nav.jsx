import { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import { removeToken } from "../../utils/auth";
import styles from "./nav.module.css";

export default function NavBar() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const signOut = () => {
    removeToken();
    setUser(null);
    navigate("/auth/login");
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <div className={styles.links}>
          <NavLink to="/" className={styles.link}>
            Home
          </NavLink>

          <NavLink to="/talent" className={styles.link}>
            Talent
          </NavLink>

          {user && (
            <>
              {user.is_admin ? (
                <NavLink to="/proposal/admin" className={styles.link}>
                  All Proposals
                </NavLink>
              ) : (
                <NavLink to="/proposal/user" className={styles.link}>
                  My Proposals
                </NavLink>
              )}

              <NavLink to="/" className={styles.link} onClick={signOut}>
                Sign Out
              </NavLink>
            </>
          )}

          {!user && (
            <>
              <NavLink to="/auth/signup" className={styles.link}>
                Sign Up
              </NavLink>
              <NavLink to="/auth/login" className={styles.link}>
                Log In
              </NavLink>
            </>
          )}
        </div>
        <div className={styles.logo}></div>
      </div>
    </nav>
  );
}
