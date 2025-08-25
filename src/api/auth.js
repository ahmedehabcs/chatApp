import API from "./index.js";

export const signUp = async () => {
	const res = await API.post("/auth/signup");
	return res.data;
};

export const signIn = async (privateKey) => {
	const res = await API.post("/auth/signin", { privateKey });
	return res.data;
};

export const logout = async () => {
	const res = await API.post("/auth/logout");
	return res.data;
};

export const checkAuth = async () => {
	try {
		const res = await API.get("/auth/check");
		return res.data.exists;
	} catch {
		return false;
	}
}

export async function getCurrentUser() {
	const res = await API.get("/auth/me");
	return res.data;
}