import { Server } from "socket.io";
import Message from "../models/Message.js";
import sanitizeHtml from "sanitize-html";
import Chat from "../models/Chat.js";

let io = null;

export const initSocket = (server) => {
	io = new Server(server, {
		cors: {
			origin: process.env.FRONTEND_URL || "http://localhost:3000",
			methods: ["GET", "POST"],
			credentials: true
		},
	});

	io.on("connection", (socket) => {
		console.log("🔌 New client connected:", socket.id);

		// Join personal room by publicKey
		socket.on("join", (publicKey) => {
			socket.join(publicKey);
			console.log(`${publicKey} joined room`);
		});

		// Handle sending messages via socket
		socket.on("send_message", async (data) => {
			try {
				const { sender, receiver, text } = data;

				// Find or create chat
				let chat = await Chat.findOne({
					participants: { $all: [sender, receiver] }
				});

				if (!chat) {
					// Create new chat if it doesn't exist
					chat = new Chat({
						participants: [sender, receiver]
					});
					await chat.save();
				}

				// Save message to database
				const newMessage = new Message({
					chatId: chat.chatId,
					sender: sender,
					text: sanitizeHtml(text.trim(), {
						allowedTags: [],
						allowedAttributes: {},
					}),
				});

				await newMessage.save();

				// FIX: Emit only to the specific users (not to all connected clients)
				// Send to sender in their room and receiver in their room
				io.to(sender).emit("receive_message", newMessage);
				io.to(receiver).emit("receive_message", newMessage);

			} catch (error) {
				console.error("Error sending message:", error);
				socket.emit("message_error", { error: "Failed to send message" });
			}
		});

		socket.on("disconnect", () => {
			console.log("❌ Client disconnected:", socket.id);
		});
	});
};

export const getIO = () => {
	if (!io) throw new Error("Socket.io not initialized!");
	return io;
};