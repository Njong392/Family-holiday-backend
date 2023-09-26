const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const { createReservation, acceptReservation } = require("../controllers/reservationController");

const router = express.Router();

//controller functions

//middleware
router.use(requireAuth);

//create a reservation
router.post("/", createReservation);

//accept a reservation
router.post("/accept", createReservation);

module.exports = router;