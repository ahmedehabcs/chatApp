import API from "./index.js";

export async function sendMessage(respk, message) {
    const res = await API.post("/message/send", { respk, message });
    return res.data;
}

export async function getMessage(respk) {
    const res = await API.post("/message/get", { respk });
    return res.data;
}