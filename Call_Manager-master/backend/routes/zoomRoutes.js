const express = require('express')
const router = express.Router()
const {getCallLogsByUserId, getUserIdByEmail, createUser, getUsers, createMeeting} = require('../controllers/zoomController')
const jwt = require('jsonwebtoken')

router.get("/get-call-log-by-user-id" , getCallLogsByUserId)
router.get("/get-userid-by-email" , getUserIdByEmail)
router.post("/create-user" , createUser)
router.get("/get-users", getUsers)
router.post("/create-meeting" , createMeeting)

// Generate signature for joining Zoom meetings
router.post("/signature", (req, res) => {
    try {
        const { meetingNumber, role } = req.body
        const sdkKey = process.env.ZOOM_SDK_KEY
        const sdkSecret = process.env.ZOOM_SDK_SECRET
        
        if (!meetingNumber || role === undefined) {
            return res.status(400).json({
                error: 'Meeting number and role are required'
            })
        }

        if (!sdkKey || !sdkSecret) {
            return res.status(500).json({
                error: 'Zoom SDK credentials are not configured'
            })
        }

        // Create payload for JWT
        const iat = Math.round(new Date().getTime() / 1000) - 30
        const exp = iat + 60 * 60 * 2 // 2 hours
        const payload = {
            sdkKey: sdkKey,
            mn: parseInt(meetingNumber),
            role: role,
            iat: iat,
            exp: exp,
            appKey: sdkKey,
            tokenExp: iat + 60 * 60 * 2
        }

        // Generate signature using JWT
        const signature = jwt.sign(payload, sdkSecret)

        res.json({
            signature: signature
        })
    } catch (error) {
        console.error('Error generating signature:', error)
        res.status(500).json({
            error: 'Failed to generate signature',
            details: error.message
        })
    }
})

module.exports = router