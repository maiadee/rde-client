import axios from "axios";
import { getToken } from "../utils/auth";

const BASE_URL = import.meta.env.VITE_API_URL + "/auth";

// Signup
export const signup = async (formData) => {
  try {
    const res = await axios.post(`${BASE_URL}/signup/`, formData);
    return res.data;
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
};

// Login
export const login = async (formData) => {
  try {
    const res = await axios.post(`${BASE_URL}/login/`, formData);
    return res.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
