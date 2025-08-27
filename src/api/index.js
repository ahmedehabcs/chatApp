import axios from "axios";
import URL from "../components/URL";
const API = axios.create({
    baseURL: `${URL}/api`,
    withCredentials: true,
});

export default API;