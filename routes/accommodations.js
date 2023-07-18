const express = require("express");

const {
  createAccommodation,
  getAccommodations,
  getAccommodation,
  updateAccommodation,
  deleteAccommodation,
  getAccommodationsByFilter,
} = require("../controllers/accommodationController");

const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

//filter an accommodation
router.get("/filter/accommodations", getAccommodationsByFilter);

//get all accommodations
router.get("/", getAccommodations);

//get one accommodation
router.get("/:id", getAccommodation);

router.use(requireAuth);

//Create a new workout
router.post("/", createAccommodation);

//update an accommodation
router.patch("/:id", updateAccommodation);

//delete an accommodation
router.delete("/:id", deleteAccommodation);

module.exports = router;
