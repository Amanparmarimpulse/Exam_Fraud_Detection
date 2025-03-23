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
 * Retrieves a Zoom user's ID by their email address
 * @param {string} email - The email address of the Zoom user
 * @returns {Promise<string>} - Promise resolving to the user ID
 */
async function getUserIdByEmail(email) {
    try {
        const url = `https://api.zoom.us/v2/users/${encodeURIComponent(email)}`;
        const headers = await getAuthHeaders();
        const response = await axios.get(url, { headers });
        return response.data.id;
    } catch (error) {
        console.error('Error fetching user ID by email:', error.message);
        throw error; // Propagate error to caller
    }
}

/**
 * Creates a new Zoom user in your account
 * @param {string} email - The email address for the new user
 * @param {string} firstName - The user's first name
 * @param {string} lastName - The user's last name
 * @param {string} password - The user's password
 * @returns {Promise<Object>} - Promise resolving to the created user data
 */
async function createZoomUser(email, firstName, lastName, password) {
    try {
        const url = 'https://api.zoom.us/v2/users';
        const data = {
            action: 'create',
            user_info: {
                email: email,
                type: 1, // 1 = Basic user type
                first_name: firstName,
                last_name: lastName,
                password: password
            }
        };

        const headers = await getAuthHeaders();
        const response = await axios.post(url, data, { headers });
        return response.data;
    } catch (error) {
        console.error('Error creating Zoom user:', error.response?.data || error.message);
        throw error; // Propagate error to caller
    }
}

/**
 * Retrieves a list of all Zoom users in your account
 * @returns {Promise<Object>} - Promise resolving to the list of users
 */
async function getUserList() {
    try {
        
        const url = 'https://api.zoom.us/v2/users';
        const headers = await getAuthHeaders();
        const response = await axios.get(url, { headers });
        return response.data;
    } catch (error) {
        console.error('Error fetching user list:', error.response?.data || error.message);
        throw error; // Propagate error to caller
    }
}

module.exports = {
    getUserIdByEmail,
    createZoomUser,
    getUserList
}
