import axios from "axios";

const API = axios.create({
    baseURL: "https://h1zslq1r-3000.euw.devtunnels.ms/api",
    withCredentials: true,
});

export default API;