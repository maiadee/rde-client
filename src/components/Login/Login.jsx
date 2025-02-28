import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { setToken, getUserFromToken } from "../../utils/auth";
import { UserContext } from "../../contexts/UserContext";
import { login } from "../../services/userService";
import styles from "./login.module.css";

export default function Login() {
  // update the logged-in user state globally
  const { setUser } = useContext(UserContext);
  // store login inputs
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  //   store form validation errors
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // fetch data
      const data = await login(formData);
      //   save jwt token
      setToken(data.token);
      // update global user state
      setUser(getUserFromToken());
      navigate("/talent/");
    } catch (error) {
      setErrors(
        error.response?.data?.errors || { general: "Invalid login credentials" }
      );
      console.log(error.response.data);
    }
  };

  //   clears errors for current input field
  // updates formdata with new value
  const handleChange = (e) => {
    setErrors({ ...errors, [e.target.name]: "" });
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section className={styles.container}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles["form-group"]}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Enter your username"
            required
            onChange={handleChange}
          />
          {errors.username && (
            <p className="error-message">{errors.username}</p>
          )}
        </div>

        <div className={styles["form-group"]}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter your password"
            required
            onChange={handleChange}
          />
          {errors.password && (
            <p className="error-message">{errors.password}</p>
          )}
        </div>

        {errors.general && <p className="error-message">{errors.general}</p>}

        <button
          className={styles.button}
          disabled={formData.identifier === "" || formData.password === ""}
          type="submit"
        >
          Log In
        </button>
      </form>
    </section>
  );
}
