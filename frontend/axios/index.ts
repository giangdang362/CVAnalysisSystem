import axios from "axios";

export default axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/",
  headers: {
    "Content-Type": "application/json",
  },
});
