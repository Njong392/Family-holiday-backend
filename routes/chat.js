const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const { accessChat, fetchChats } = require("../controllers/chatController");

const router = express.Router();

//controller fxns

//middleware
router.use(requireAuth);

//access a chat or create a new chat
router.post("/", accessChat);

//get all chats
router.get("/", fetchChats);

module.exports = router;
