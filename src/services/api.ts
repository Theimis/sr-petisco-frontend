import axios from "axios";

export const api = axios.create({
    baseURL: "https://sr-petisco-api.onrender.com",
});