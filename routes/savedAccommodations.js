const express = require("express");

const {
  createSavedAccommodation,
  deleteSavedAccommodation,
  getSavedAccommodations
} = require("../controllers/savedAccommodationsController");

const requireAuth = require("../middleware/requireAuth");
const router = express.Router();

router.use(requireAuth);

//get saved accommodations
router.get("/", getSavedAccommodations);

//add an accommodation to the saved accommodations
router.post("/", createSavedAccommodation);

//delete a saved accommodation
router.delete("/:id", deleteSavedAccommodation);

module.exports = router;
