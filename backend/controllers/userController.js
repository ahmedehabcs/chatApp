import handleSendErrors from "../utils/handleSendErrors.js";
import User from "../models/User.js";

// GET /api/auth/me
export const getCurrentUser = async (req, res, next) => {
    try {
        const publicKey = req.user.publicKey;
        const user = await User.findOne({ publicKey });
        if (!user) return handleSendErrors("No user found!", false, 404, next);
    
        console.log(publicKey.substring(0, 10), "id:", user._id.toString());
        return res.json({ success: true, user: { publicKey: publicKey, id: user._id.toString()}});
    } catch (error) {
        handleSendErrors(error.message || "Internal server error", false, 500, next);
    }
};
