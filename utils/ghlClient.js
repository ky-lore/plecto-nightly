const axios = require('axios');
require('dotenv').config();

let accessToken = process.env.GHL_ACCESS_TOKEN || null;
let refreshToken = process.env.GHL_REFRESH_TOKEN || null;

const GHL_CLIENT_ID = process.env.GHL_CLIENT_ID;
const GHL_CLIENT_SECRET = process.env.GHL_CLIENT_SECRET;
const GHL_REDIRECT_URI = process.env.GHL_REDIRECT_URI;


// Optional: paste the auth code the first time you run it
const AUTH_CODE = process.env.GHL_AUTH_CODE || null;

const tokenURL = 'https://services.leadconnectorhq.com/oauth/token';

async function exchangeAuthCode(code) {
  const params = {
    grant_type: 'authorization_code',
    code,
    client_id: GHL_CLIENT_ID,
    client_secret: GHL_CLIENT_SECRET,
    redirect_uri: GHL_REDIRECT_URI,
    user_type: 'Location'
  };
  const res = await axios.post(tokenURL, new URLSearchParams(params));
  return res.data;
}

async function refreshAccessToken() {
  const params = {
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: GHL_CLIENT_ID,
    client_secret: GHL_CLIENT_SECRET,
    redirect_uri: GHL_REDIRECT_URI,
    user_type: 'Location'
  };
  const res = await axios.post(tokenURL, new URLSearchParams(params));
  return res.data;
}

async function makeAuthorizedRequest(method, endpoint, data = {}) {
  try {
    const res = await axios({
      method,
      url: `https://services.leadconnectorhq.com/${endpoint}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      data
    });
    return res.data;
  } catch (err) {
    if (err.response?.status === 401) {
      console.warn('🔁 Token expired. Refreshing...');
      const refreshed = await refreshAccessToken();
      accessToken = refreshed.access_token;
      refreshToken = refreshed.refresh_token;
      return makeAuthorizedRequest(method, endpoint, data); // retry
    } else {
      throw err;
    }
  }
}

(async () => {
  if (!accessToken && AUTH_CODE) {
    console.log('🎟️ Exchanging auth code...');
    const tokenData = await exchangeAuthCode(AUTH_CODE);
    accessToken = tokenData.access_token;
    refreshToken = tokenData.refresh_token;
    console.log('✅ Tokens retrieved. You may want to save them.');
  }

  // 🔧 Sample request – get locations
})();

module.exports = { makeAuthorizedRequest }