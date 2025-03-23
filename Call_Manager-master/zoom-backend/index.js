require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const cors = require('cors')
const URLSearchParams = require('url').URLSearchParams

const app = express()
const port = process.env.PORT || 4000

// Zoom OAuth credentials
const accountId = process.env.ZOOM_ACCOUNT_ID || "CpzBeocTT9O-f7v3WrGV-g"
const clientId = process.env.ZOOM_CLIENT_ID || "1N00SyH4Ra2kcElCOKgQpw"
const clientSecret = process.env.ZOOM_CLIENT_SECRET || "w7drOnplQ52k4coqz4d7hbMmshNcw6ms"

// OAuth token storage
let accessToken = null
let tokenExpiry = null

app.use(bodyParser.json(), cors())
app.options('*', cors())

/**
 * Gets an OAuth access token from Zoom
 * @returns {Promise<string>} - Promise resolving to the access token
 */
async function getZoomAccessToken() {
    try {
        // If we have a valid token that hasn't expired, return it
        if (accessToken && tokenExpiry && new Date() < tokenExpiry) {
            return accessToken
        }

        // Otherwise, get a new token
        const response = await axios.post(
            `https://zoom.us/oauth/token`,
            new URLSearchParams({
                grant_type: 'account_credentials',
                account_id: accountId
            }).toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                auth: {
                    username: clientId,
                    password: clientSecret
                }
            }
        )

        // Save the token and calculate expiry time
        accessToken = response.data.access_token
        // Set expiry time (typically 1 hour = 3600 seconds)
        tokenExpiry = new Date(Date.now() + (response.data.expires_in * 1000))
        console.log("Zoom access token",accessToken);
        return accessToken
    } catch (error) {
        console.error('Error getting Zoom access token:', error.message)
        throw error
    }
}

app.post('/', async (req, res) => {
    try {
        const { meetingNumber, role } = req.body

        if (!meetingNumber || role === undefined) {
            return res.status(400).json({
                error: 'Meeting number and role are required'
            })
        }

        // Get OAuth token
        const token = await getZoomAccessToken()

        // Generate meeting signature using Zoom API
        const response = await axios.post(
            `https://api.zoom.us/v2/meetings/${meetingNumber}/signature`,
            {
                role: role
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        )

        // Return the signature to the client
        res.json({
            signature: response.data.signature
        })

    } catch (error) {
        console.error('Error generating signature:', error.message)
        res.status(500).json({
            error: 'Failed to generate signature',
            details: error.message
        })
    }
})

app.listen(port, () => console.log(`Zoom Meeting Auth Service listening on port ${port}!`))
