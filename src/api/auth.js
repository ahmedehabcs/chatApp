import API from "./index.js";

export const signUp = async () => {
	const res = await API.get("/auth/signup");
	return res.data;
};

export const downloadKeys = async (publicKey, privateKey) => {
	const res = await API.post("/auth/download", { publicKey, privateKey }, { responseType: "blob" });
	return res.data;
}

export const createChallenge = async(publicKey) => {
	const res = await API.post("/auth/challenge", { publicKey });
	return res.data;
}

export const verifyChallenge = async(publicKey, signature) => {
	const res = await API.post("/auth/verify", { publicKey, signature });
	return res.data;
}

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