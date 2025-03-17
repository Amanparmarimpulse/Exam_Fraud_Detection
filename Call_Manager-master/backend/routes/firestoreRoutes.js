const express = require('express')
const { addUser, getUserList } = require('../controllers/firestoreController')
const router = express.Router()


router.post('/add-user' , addUser)
router.get('/getuserlist' , getUserList)

module.exports = router