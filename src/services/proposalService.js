import axios from "axios";
import { getToken } from "../utils/auth";

const BASE_URL = import.meta.env.VITE_API_URL + "/proposal";

// Create proposal
export const proposalCreate = async (formData) => {
    try {
      const res = await axios.post(BASE_URL + `/user/`, formData, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
}

// Show all user's proposals
export const userProposalIndex = async () => {
    try {
      const res = await axios.get(BASE_URL + `/user/`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
}

// Show all admin proposals
export const adminProposalIndex = async () => {
  try {
    const res = await axios.get(BASE_URL + `/admin/`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Show single proposal
export const proposalShow = async (proposalId) => {
  try {
    const res = await axios.get(BASE_URL + `/${proposalId}/`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Update proposals
export const proposalUpdate = async (proposalId, formData) => {
  try {
    const res = await axios.put(BASE_URL + `/${proposalId}`, formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Delete proposal
export const proposalDelete = async (proposalId) => {
  try {
    const res = await axios.delete(BASE_URL + `/${proposalId}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    console.log("proposal deleted successfully:", res);
  } catch (error) {
    console.log(error);
    throw error;
  }
};