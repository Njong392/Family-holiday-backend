const express = require('express');

//controller functions
const {
  signupUser,
  loginUser,
  updateHost,
  getUser,
} = require('../controllers/userController');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

//signup router
router.post('/signup', signupUser);

//login route
router.post('/login', loginUser);

//get hosts/discovery page
router.get('/', () => {});

router.use(requireAuth);

//update user info
router.patch('/:id', updateHost);

//get specific user
router.get('/:id', getUser);

module.exports = router;
