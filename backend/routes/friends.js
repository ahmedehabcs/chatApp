import express from "express";
import verifyJWT from "../middlewares/verifyJWT.js";
import { outgoingRequest, getFriendRequest, incomingRequests, approveRequest, rejectRequest, listFriends, removeFriend, nickname } from "../controllers/friendController.js";
const router = express.Router();

router.post("/request", verifyJWT, outgoingRequest);
router.get("/request/:publicKey", verifyJWT, getFriendRequest); 
router.get("/receive", verifyJWT, incomingRequests);
router.post("/approve", verifyJWT, approveRequest);
router.post("/reject", verifyJWT, rejectRequest);
router.get("/list", verifyJWT, listFriends);
router.post("/unfriend", verifyJWT, removeFriend);
router.post("/nickname", verifyJWT, nickname);

export default router;