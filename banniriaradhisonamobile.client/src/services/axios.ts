import axios from "axios";

export const BASE_URL = import.meta.env.PROD
    ? "https://test.aradhisuva.com" // Production URL
    : "https://localhost:7086";

export const axiosPublic = axios.create({
    baseURL: BASE_URL
});

