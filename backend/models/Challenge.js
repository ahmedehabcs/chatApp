import mongoose from "mongoose";

const Challenge = mongoose.Schema({
    publicKey: { type: String, require: true},
    challenge: { type: String, require: true},
    expiresAt: { type: Date, default:() => Date.now() + 5 * 60 * 1000}
})

export default mongoose.model("challenge", Challenge);