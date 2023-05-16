const express = require('express')

const {
    createAccommodation,
    getAccommodations,
    getAccommodation,
    updateAccommodation,
    deleteAccommodation
} = require('../controllers/accommodationController')

const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

//get all accommodations
router.get('/', getAccommodations)

router.use(requireAuth)

//Create a new workout
router.post('/', createAccommodation)

//get one accommodation
router.get('/:id', getAccommodation)

//update an accommodation
router.patch('/:id', updateAccommodation)

//delete an accommodation
router.delete('/:id', deleteAccommodation)

module.exports = router