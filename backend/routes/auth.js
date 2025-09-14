import express from "express";
import { signup, downloadKeys,createChallenge, verifySignin, logout } from "../controllers/authController.js";
import { getCurrentUser } from "../controllers/userController.js";
import verifyJWT from "../middlewares/verifyJWT.js";

const router = express.Router();

router.get("/signup", signup);
router.post("/download", downloadKeys);
router.post("/logout", verifyJWT, logout);
router.get("/me", verifyJWT, getCurrentUser);

// challenge flow
router.post("/challenge", createChallenge);
router.post("/verify", verifySignin);

router.get("/check", verifyJWT, (req, res) => {
    res.json({ exists: true });
});

export default router;