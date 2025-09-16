import mongoose from "mongoose";

const SignupLimitSchema = new mongoose.Schema({
    ip: {
        type: String,
        require: true,
        unique: true,
    },
    lastSignupAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
})

export default mongoose.model("SignupAttempt", SignupLimitSchema);