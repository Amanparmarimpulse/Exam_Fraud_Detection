const axios = require('axios');
const dotenv = require('dotenv')
dotenv.config();
// Set your Zoom API key and secret

const apiKey = process.env.ZOOM_MEETING_SDK_KEY;
const apiSecret = process.env.ZOOM_MEETING_SDK_SECRET;
const jwt = process.env.JWT

// Set the user ID for which you want to retrieve the call logs
// const userId = 'USER_ID';

// Set the start and end dates for which you want to retrieve the call logs (in yyyy-mm-dd format)
// const startDate = '2022-01-01';
// const endDate = '2023-06-31';

// Set the URL for the call log API endpoint
// const url = `https://api.zoom.us/v2/users/${userId}/report/call_logs?from=${startDate}&to=${endDate}`;

// Set the authorization header with your Zoom API key and secret
// const authHeader = {
//   'Authorization': `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`
// };
const authHeader = {
    'Authorization': `Bearer ${jwt}`
};



async function getCallLogsForAUser(userId , startDate , endDate){
    // Send the HTTP GET request to the Zoom API to retrieve the call logs
    // const url = `https://api.zoom.us/v2/users/${userId}/report/call_logs?from=${startDate}&to=${endDate}`;
    const url = `https://api.zoom.us/v2/users/${userId}/meetings`
    // console.log(url)
    await axios.get(url, { headers: authHeader })
    .then(response => {
    // Handle the response from the Zoom API here
    console.log(response.data);
    return response.data
    })
    .catch(error => {
    // Handle any errors that occur during the API call here
    console.error(error);
    });
}

async function createZoomMeeting(userId, data){
    const url = `https://api.zoom.us/v2/users/${userId}/meetings`
    // console.log(url)
    await axios.get(url, data , { headers: authHeader })
    .then(response => {
    // Handle the response from the Zoom API here
    console.log(response.data);
    return response.data
    })
    .catch(error => {
    // Handle any errors that occur during the API call here
    console.error(error);
    });
}

module.exports = {getCallLogsForAUser , createZoomMeeting}
