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


module.exports = {
    getUserMeetings,
}
