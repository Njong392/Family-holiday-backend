const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const { createReservation } = require("../controllers/reservationController");

const router = express.Router();

//controller functions

//middleware
router.use(requireAuth);

//create a reservation
router.post("/", createReservation);

module.exports = router;