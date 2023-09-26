const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const { createNotification } = require("../controllers/notificationController");

const router = express.Router();

//controller functions

//middleware
router.use(requireAuth);

//create a notification
router.post("/", createNotification);

module.exports = router;