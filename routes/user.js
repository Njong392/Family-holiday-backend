const express = require("express");

//controller functions
const {
  signupUser,
  loginUser,
  updateUser,
  getUser,
  getHosts,
  verifyEmail,
  deactivateUser,
  editProfile
} = require("../controllers/userController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

//signup router
router.post("/signup", signupUser);

//login route
router.post("/login", loginUser);

//get specific user
router.get("/:id", getUser);

//verify email
router.post("/verify-email", verifyEmail);

//get hosts/discovery page
router.get("/", getHosts);

router.use(requireAuth);

//update user info
router.patch("/:id", updateUser);

//deactivate user
router.post("/deactivate", deactivateUser);

//edit profile
router.patch("/", editProfile);

module.exports = router;
