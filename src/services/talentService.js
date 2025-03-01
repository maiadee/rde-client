import axios from "axios";
import { getToken } from "../utils/auth";

const BASE_URL = import.meta.env.VITE_API_URL + "/talent";

// All talent
export const talentIndex = async () => {
  try {
    const res = await axios.get(BASE_URL);
    return res.data || null;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// One talent
export const talentShow = async (talentId) => {
  try {
    const res = await axios.get(`${BASE_URL}/${talentId}/`);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};