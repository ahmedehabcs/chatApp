import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
	publicKey: { type: String, unique: true, required: true },

	// accepted
	friends: [
		{	
			nickname: String,
			publicKey: String,
		},
	],

	// requests received from others
	incomingRequests: [
		{
			publicKey: String,
			timeStamp: {type: Date, default: Date.now}
		},
	],

	// requests sent to others
	outgoingRequests: [
		{
			publicKey: String,
		},
	],
});
export default mongoose.model("User", userSchema);