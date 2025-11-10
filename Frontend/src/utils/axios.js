import axios from "axios";

// Get token from localStorage (or wherever you stored it)
const token = localStorage.getItem("token");

const instance = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${token}`, // ✅ send token with every request
  },
});

export default instance;
