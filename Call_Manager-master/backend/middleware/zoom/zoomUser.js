const axios = require('axios');
const dotenv = require('dotenv')
dotenv.config();

// Zoom OAuth credentials
const accountId = "CpzBeocTT9O-f7v3WrGV-g";
const clientID = "1N00SyH4Ra2kcElCOKgQpw";
const clientSecret = "w7drOnplQ52k4coqz4d7hbMmshNcw6ms";

// OAuth token storage
let accessToken = null;
let tokenExpiry = null;



async function getAuthHeaders() {
    const token = await getZoomAccessToken();
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
}


async function getUserIdByEmail(email) {
    try {
        const url = `https://api.zoom.us/v2/users/${encodeURIComponent(email)}`;
        const headers = await getAuthHeaders();
        const response = await axios.get(url, { headers });
        return response.data.id;
    } catch (error) {
        console.error('Error fetching user ID by email:', error.message);
        throw error; 
    }
}


module.exports = {
    getUserIdByEmail,
}
