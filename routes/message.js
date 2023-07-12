const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const {sendMessage, fetchMessages} = require('../controllers/messageController')

const router = express.Router()

//middleware
router.use(requireAuth)

//send a message
router.post('/', sendMessage)

//fetch all messages in a chat
router.get('/:chat_id', fetchMessages)

module.exports = router