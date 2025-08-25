import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
	{
		chatId: { type: String, require: true },
		sender: { type: String, require: true },
		text: { type: String, require: true },
	},
	{ timestamps: true }
);
messageSchema.index({ chatId: 1, createdAt: 1 });

export default mongoose.model("Message", messageSchema);