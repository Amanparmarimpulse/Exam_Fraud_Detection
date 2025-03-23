const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

// Zoom OAuth credentials
const accountId = "CpzBeocTT9O-f7v3WrGV-g";
const clientID = "1N00SyH4Ra2kcElCOKgQpw";
const clientSecret = "w7drOnplQ52k4coqz4d7hbMmshNcw6ms";

// OAuth token storage
let accessToken = null;
let tokenExpiry = null;

/**
 * Gets an OAuth access token from Zoom
 * @returns {Promise<string>} - Promise resolving to the access token
 */
async function getZoomAccessToken() {
    try {
        // If we have a valid token that hasn't expired, return it
        if (accessToken && tokenExpiry && new Date() < tokenExpiry) {
            return accessToken;
        }

        // Otherwise, get a new token
        const response = await axios.post(
            `https://zoom.us/oauth/token`,
            new URLSearchParams({
                grant_type: 'account_credentials',
                account_id: accountId
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                auth: {
                    username: clientID,
                    password: clientSecret
                }
            }
        );

        // Save the token and calculate expiry time
        accessToken = response.data.access_token;
        // Set expiry time (typically 1 hour = 3600 seconds)
        tokenExpiry = new Date(Date.now() + (response.data.expires_in * 1000));

        return accessToken;
    } catch (error) {
        console.error('Error getting Zoom access token:', error.message);
        throw error;
    }
}

/**
 * Gets the authorization header for Zoom API requests
 * @returns {Promise<Object>} - Promise resolving to the headers object
 */
async function getAuthHeaders() {
    const token = await getZoomAccessToken();
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
}

/**
 * Gets meetings for a specific Zoom user
 * @param {string} userId - The Zoom user ID
 * @param {string} startDate - Start date in yyyy-mm-dd format (optional)
 * @param {string} endDate - End date in yyyy-mm-dd format (optional)
 * @returns {Promise<Object>} - Promise resolving to meetings data
 */
async function getUserMeetings(userId, startDate, endDate) {
    try {
        // Base URL for fetching user meetings
        let url = `https://api.zoom.us/v2/users/me/meetings`;
        
        // Add date parameters if provided
        if (startDate && endDate) {
            url += `?from=${startDate}&to=${endDate}`;
        }
        
        const headers = await getAuthHeaders();
        const response = await axios.get(url, { headers });
        return response.data;
    } catch (error) {
        console.error('Error fetching user meetings:', error.message);
        throw error; // Propagate error to caller
    }
}

/**
 * Creates a new Zoom meeting for a specific user
 * @param {string} userId - The Zoom user ID
 * @param {Object} data - Meeting data (topic, start_time, duration, etc.)
 * @returns {Promise<Object>} - Promise resolving to created meeting data
 */
async function createZoomMeeting(userId, data) {
    try {
        const url = `https://api.zoom.us/v2/users/me/meetings`;
        const headers = await getAuthHeaders();
        const response = await axios.post(url, data, { headers });
        return response.data;
    } catch (error) {
        console.error('Error creating Zoom meeting:', error.message);
        throw error; // Propagate error to caller
    }
}

// Export both functions
module.exports = {
    getUserMeetings,
    createZoomMeeting
}
