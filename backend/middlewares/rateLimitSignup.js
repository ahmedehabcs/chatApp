import SignupLimit from "../models/SignupLimit.js";
import handleSendErrors from "../utils/handleSendErrors.js";

export const rateLimitSignup = async (req, res, next) => {
    try {
        const ip = req.ip || req.connection.remoteAddress;

        const record = await SignupLimit.findOne({ ip });
        if (record) {
            const oneHourAgo = new Date();
            oneHourAgo.setHours(oneHourAgo.getHours() - 1);

            // If last signup is within the last 1 hour → block
            if (record.lastSignupAt > oneHourAgo) {
                const nextAllowed = new Date(record.lastSignupAt);
                nextAllowed.setHours(nextAllowed.getHours() + 1);

                const diffMs = nextAllowed - new Date();
                const diffMinutes = Math.ceil(diffMs / (1000 * 60));

                let timeLeftMsg;
                if (diffMinutes >= 60) {
                    const diffHours = Math.floor(diffMinutes / 60);
                    timeLeftMsg = `~${diffHours} hour(s)`;
                } else {
                    timeLeftMsg = `~${diffMinutes} minute(s)`;
                }

                return handleSendErrors(
                    `You can only create 1 account per hour. Try again in ${timeLeftMsg}.`,
                    false,
                    429,
                    next
                );
            }

            record.lastSignupAt = new Date();
            await record.save();
        } else {
            // First signup from this IP
            await SignupLimit.create({ ip, lastSignupAt: new Date() });
        }

        next();
    } catch (error) {
        console.error(error);
        handleSendErrors("Internal server error", false, 500, next);
    }
};
