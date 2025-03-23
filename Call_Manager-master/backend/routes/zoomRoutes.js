const express = require('express')
const router = express.Router()
const {getCallLogsByUserId, getUserIdByEmail, createUser, getUsers, createMeeting} = require('../controllers/zoomController')
const jwt = require('jsonwebtoken')
const axios = require('axios')
const { 
    getUserIdByEmail: zoomUserGetUserIdByEmail, 
    createZoomUser, 
    getUserList 
} = require('../middleware/zoom/zoomUser')

const { 
    getUserMeetings, 
    createZoomMeeting 
} = require('../middleware/zoom/calls')

// Add request logging middleware
router.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    if (req.method !== 'GET') {
        console.log('Request body:', req.body);
    }
    next();
});

// OAuth token storage - in production this should be in a more persistent storage
let oauthToken = null;
let tokenExpiry = null;

// Function to get OAuth token using Server-to-Server credentials
async function getZoomAccessToken() {
    try {
        // Check if we have a valid token
        if (oauthToken && tokenExpiry && tokenExpiry > Date.now()) {
            console.log('Using cached OAuth token, expires in:', Math.round((tokenExpiry - Date.now()) / 1000), 'seconds');
            return oauthToken;
        }

        console.log('Getting new OAuth token from Zoom API...');
        
        // Get client credentials from environment variables
        const clientId = process.env.ZOOM_CLIENT_ID;
        const clientSecret = process.env.ZOOM_CLIENT_SECRET;
        const accountId = process.env.ZOOM_ACCOUNT_ID;
        
        if (!clientId || !clientSecret || !accountId) {
            throw new Error('Zoom OAuth credentials are not configured (CLIENT_ID, CLIENT_SECRET, ACCOUNT_ID)');
        }
        
        // Prepare the request to get an access token
        const tokenUrl = 'https://zoom.us/oauth/token';
        const params = new URLSearchParams();
        params.append('grant_type', 'account_credentials');
        params.append('account_id', accountId);
        
        const response = await axios.post(tokenUrl, params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            auth: {
                username: clientId,
                password: clientSecret
            }
        });
        
        console.log('OAuth token received successfully');
        
        // Set the token and expiry (subtract 5 minutes for safety)
        oauthToken = response.data.access_token;
        tokenExpiry = Date.now() + (response.data.expires_in * 1000) - (5 * 60 * 1000);
        
        return oauthToken;
    } catch (error) {
        console.error('Error getting OAuth token:', error.response?.data || error.message);
        throw new Error('Failed to authenticate with Zoom API: ' + (error.response?.data?.error || error.message));
    }
}

router.get("/get-call-log-by-user-id", getCallLogsByUserId)
router.get("/get-userid-by-email", getUserIdByEmail)
router.post("/create-user", createUser)
router.get("/get-users", getUsers)
router.post("/create-meeting", createMeeting)

// GET all Zoom users in account
router.get('/users', async (req, res) => {
    try {
        const users = await getUserList()
        res.status(200).json(users)
    } catch (error) {
        console.error('Error in GET /zoom/users:', error)
        res.status(500).json({ 
            error: 'Failed to retrieve Zoom users',
            details: error.message
        })
    }
})

// GET user ID by email
router.get('/users/email/:email', async (req, res) => {
    try {
        const userId = await zoomUserGetUserIdByEmail(req.params.email)
        res.status(200).json({ userId })
    } catch (error) {
        console.error(`Error in GET /zoom/users/email/${req.params.email}:`, error)
        res.status(500).json({ 
            error: 'Failed to retrieve user ID by email',
            details: error.message
        })
    }
})

// POST create a new Zoom user
router.post('/users', async (req, res) => {
    try {
        const { email, firstName, lastName, password } = req.body
        
        // Validate required fields
        if (!email || !firstName || !lastName || !password) {
            return res.status(400).json({ 
                error: 'Missing required fields',
                requiredFields: ['email', 'firstName', 'lastName', 'password']
            })
        }
        
        const newUser = await createZoomUser(email, firstName, lastName, password)
        res.status(201).json(newUser)
    } catch (error) {
        console.error('Error in POST /zoom/users:', error)
        res.status(500).json({ 
            error: 'Failed to create Zoom user',
            details: error.message
        })
    }
})

// GET meetings for a specific user
router.get('/users/:userId/meetings', async (req, res) => {
    try {
        const { startDate, endDate } = req.query
        const meetings = await getUserMeetings(req.params.userId, startDate, endDate)
        res.status(200).json(meetings)
    } catch (error) {
        console.error(`Error in GET /zoom/users/${req.params.userId}/meetings:`, error)
        res.status(500).json({ 
            error: 'Failed to retrieve user meetings',
            details: error.message
        })
    }
})

// POST create a meeting for a specific user
router.post('/users/:userId/meetings', async (req, res) => {
    try {
        const userId = req.params.userId
        const meetingData = req.body
        
        // Validate required fields
        if (!meetingData.topic) {
            return res.status(400).json({ 
                error: 'Missing required fields',
                requiredFields: ['topic']
            })
        }
        
        const newMeeting = await createZoomMeeting(userId, meetingData)
        res.status(201).json(newMeeting)
    } catch (error) {
        console.error(`Error in POST /zoom/users/${req.params.userId}/meetings:`, error)
        res.status(500).json({ 
            error: 'Failed to create meeting',
            details: error.message
        })
    }
})

// GET meetings by email (convenience endpoint)
router.get('/meetings/by-email/:email', async (req, res) => {
    try {
        const { startDate, endDate } = req.query
        
        // First get the user ID
        const userId = await zoomUserGetUserIdByEmail(req.params.email)
        
        // Then get the meetings for that user
        const meetings = await getUserMeetings(userId, startDate, endDate)
        
        res.status(200).json(meetings)
    } catch (error) {
        console.error(`Error in GET /zoom/meetings/by-email/${req.params.email}:`, error)
        res.status(500).json({ 
            error: 'Failed to retrieve meetings by email',
            details: error.message
        })
    }
})

// Generate signature for joining Zoom meetings
router.post("/signature", async (req, res) => {
    try {
        const { meetingNumber, role } = req.body
        
        if (!meetingNumber || role === undefined) {
            return res.status(400).json({
                error: 'Meeting number and role are required'
            });
        }

        console.log(`Generating signature for meeting: ${meetingNumber}, role: ${role}`);
        
        try {
            // Get OAuth token
            const token = await getZoomAccessToken();
            
            // Get the client ID for use in the signature
            const clientId = process.env.ZOOM_CLIENT_ID;
            
            if (!clientId) {
                throw new Error('Zoom Client ID is required');
            }
            
            // Create payload for JWT
            const iat = Math.round(new Date().getTime() / 1000) - 30;
            const exp = iat + 60 * 60 * 2; // 2 hours
            
            const payload = {
                sdkKey: clientId, // Using clientId in place of sdkKey
                mn: parseInt(meetingNumber),
                role: role,
                iat: iat,
                exp: exp,
                appKey: clientId, // Using clientId in place of appKey
                tokenExp: iat + 60 * 60 * 2
            };
            
            // Generate signature using JWT and OAuth token as secret
            const signature = jwt.sign(payload, token);
            
            console.log('Generated signature using OAuth token');
            
            return res.json({
                signature: signature,
                sdkKey: clientId  // Include the SDK key (client ID) in the response
            });
        } catch (oauthError) {
            console.error('OAuth token generation failed:', oauthError);
            return res.status(500).json({
                error: 'Failed to generate OAuth signature',
                details: oauthError.message
            });
        }
    } catch (error) {
        console.error('Error generating signature:', error);
        res.status(500).json({
            error: 'Failed to generate signature',
            details: error.message
        });
    }
});

module.exports = router