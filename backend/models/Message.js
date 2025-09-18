import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
	{
		chatId: { type: String, required: true },
		sender: { type: String, required: true },
		ciphertexts: {
			sender: { type: String },
			recipient: { type: String },
		},
		signature: { type: String },
		deleted: { type: Boolean, default: false },
	},
	{ timestamps: true }
);
messageSchema.index({ chatId: 1, createdAt: 1 });
export default mongoose.model("Message", messageSchema);