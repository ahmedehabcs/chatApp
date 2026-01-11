import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";
import compression from "compression";

import logger from "./middlewares/logger.js";
import errorHandler from "./middlewares/errorHandler.js";
import connectDB from "./config/db.js";
import authRouter from "./routes/auth.js";
import friends from "./routes/friends.js";
import { initSocket } from "./socket/index.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
await connectDB();
// Middleware
app.use(logger);
app.use(express.json());
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve("../dist")));
app.use(cookieParser());
app.use(cors({ origin: process.env.WEBSITE_DOMAIN, credentials: true }));


app.use("/api/auth", authRouter);
app.use("/api/friends", friends);



// Serve frontend
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../dist/index.html"));
})
app.use(errorHandler);

// Create HTTP server
const server = http.createServer(app);

// Initialize sockets
initSocket(server);
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));