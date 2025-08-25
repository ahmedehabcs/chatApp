import handleSendErrors from "../utils/handleSendErrors.js";

// GET /api/auth/me
export const getCurrentUser = async (req, res, next) => {
    try {
        return res.json({ success: true, user: { publicKey: req.user.publicKey }});
    } catch (error) {
        handleSendErrors(error.message || "Internal server error", false, 500, next);
    }
}