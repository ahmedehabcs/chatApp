import express from "express";
import { signup, signin, logout } from "../controllers/authController.js";
import { getCurrentUser } from "../controllers/userController.js";
import verifyJWT from "../middlewares/verifyJWT.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/logout", verifyJWT, logout);
router.get("/me", verifyJWT, getCurrentUser);

// /api/auth/check
router.get("/check", verifyJWT, (req, res) => {
    res.json({ exists: true });
});

export default router;