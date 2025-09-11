import express from "express";
import verifyJWT from "../middlewares/verifyJWT.js";
import { outgoingRequest, approveRequest, rejectRequest, removeFriend, nickname } from "../controllers/friendController.js";
const router = express.Router();

router.post("/request", verifyJWT, outgoingRequest);
router.post("/approve", verifyJWT, approveRequest);
router.post("/reject", verifyJWT, rejectRequest);
router.post("/unfriend", verifyJWT, removeFriend);
router.post("/nickname", verifyJWT, nickname);

export default router;