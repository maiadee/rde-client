import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { setToken } from "../../utils/auth";
import { getUserFromToken } from "../../utils/auth";
import { UserContext } from "../../contexts/UserContext";
import { signup } from "../../services/userService";
import styles from "./signup.module.css";

export default function Signup() {
  const { setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData);
      const data = await signup(formData);
      navigate("/auth/login");
    } catch (error) {
      console.log("Signup error response:", error.response?.data);
      setErrors(error.response?.data?.errors || {});
    }
  };

  const handleChange = (e) => {
    setErrors({ ...errors, [e.target.name]: "" });
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section className={styles.signUpContainer}>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles["form-group"]}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter an email address"
            required
            onChange={handleChange}
          />
          {errors?.email && <p className="error-message">{errors.email}</p>}
        </div>
        <div className={styles["form-group"]}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Enter a username"
            required
            onChange={handleChange}
          />
          {errors?.username && (
            <p className="error-message">{errors.username}</p>
          )}
        </div>
        <div className={styles["form-group"]}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter a password"
            required
            onChange={handleChange}
          />
          {errors.password && (
            <p className="error-message">{errors.password}</p>
          )}
        </div>
        <div className={styles["form-group"]}>
          <label htmlFor="password_confirmation">Confirm password</label>
          <input
            type="password"
            name="password_confirmation"
            id="password_confirmation"
            placeholder="Re-type the password"
            required
            onChange={handleChange}
          />
          {formData.password.length > 0 &&
            formData.password_confirmation.length > 0 &&
            formData.password !== formData.password_confirmation && (
              <p className="error-message">Passwords do not match</p>
            )}
        </div>
        <button
          className={styles.button}
          disabled={
            formData.password === "" ||
            formData.password !== formData.password_confirmation
          }
          type="submit"
        >
          Sign Up
        </button>
      </form>
    </section>
  );
}
