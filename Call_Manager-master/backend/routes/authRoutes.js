const { signIn , signOutFunction , signUp, getCurrentUser, googleSignIn } = require('../controllers/authController')

const express = require('express')
const router = express.Router()

router.post('/signin' , signIn)
router.post('/signup' , signUp)
router.post('/google-signin', googleSignIn)
router.post('/signout' , signOutFunction)
router.post('/currentuser' , getCurrentUser)

module.exports = router