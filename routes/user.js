const express = require('express')

//controller functions
const { signupUser, loginUser, updateUser, getUser, getHosts} = require('../controllers/userController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

//signup router
router.post('/signup', signupUser)

//login route
router.post('/login', loginUser)

//get specific user
router.get('/:id', getUser)

router.use(requireAuth)

//get hosts/discovery page
router.get('/', getHosts)

//update user info
router.patch('/:id', updateUser)



module.exports = router
