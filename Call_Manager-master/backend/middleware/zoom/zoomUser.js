const axios = require('axios');
const dotenv = require('dotenv')
dotenv.config();
// Set your Zoom API key and secret
const apiKey = process.env.ZOOM_MEETING_SDK_KEY;
const apiSecret = process.env.ZOOM_MEETING_SDK_SECRET;
const jwt = process.env.JWT
// console.log('apiKey:' , apiKey)
// console.log('apiSecret:' , apiSecret)
// Set the email address of the user for whom you want to retrieve the user ID
// const email = 'user@example.com';

// Set the URL for the user API endpoint
// const url = `https://api.zoom.us/v2/users/${encodeURIComponent(email)}`;

// Set the authorization header with your Zoom API key and secret
const authHeader = {
    'Authorization': `Bearer ${jwt}`
};

async function getUserIdByEmailMiddleWare(email) {
    // Send the HTTP GET request to the Zoom API to retrieve the user information
    const url = `https://api.zoom.us/v2/users/${encodeURIComponent(email)}`;
    await axios.get(url, { headers: authHeader })
        .then(response => {
            // Handle the response from the Zoom API here
            console.log(response.data.id);
        })
        .catch(error => {
            // Handle any errors that occur during the API call here
            console.error(error);
        });
}

async function createZoomUser(email , firstName , lastName , password){
    const url =' https://api.zoom.us/v2/users'
    const data = {
        action:'create',
        user_info:{
            email:email,
            type:1,
            first_name:firstName,
            last_name:lastName,
            password:password
        }
    }

    const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      };

      try {
        const response = await axios.post(url, data, config);
        console.log(response.data);
      } catch (error) {
        console.error(error.response.data);
      }
}

async function getUserList(){
    const url =' https://api.zoom.us/v2/users'
    const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      };

      try {
        const response = await axios.get(url,  config);
        console.log(response.data);
      } catch (error) {
        console.error(error.response.data);
      }
}

module.exports= {getUserIdByEmailMiddleWare , createZoomUser , getUserList}
