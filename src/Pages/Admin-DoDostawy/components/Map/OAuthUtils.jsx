import OAuth from 'oauth-1.0a';
import crypto from 'crypto-js';
import axios from 'axios';

// Initialize the OAuth 1.0a library
const oauth = new OAuth({
  consumer: {
    key: 'ktBxXwW7swXzspdh687sGoQTeOuwOxH67U4pSgZ4',
    secret: 'fbTpyz4oyqTGAq1mpNqAobG1Iw9obIY2njtJ5xJK'
  },
  signature_method: 'HMAC-SHA1',
  hash_function(base_string, key) {
    return crypto.enc.Base64.stringify(crypto.HmacSHA1(base_string, key));
  }
});

export const getRequestToken = async () => {
  const requestData = {
    url: 'https://www.openstreetmap.org/oauth/request_token',
    method: 'POST',
  };

  const token = {
    key: '',
    secret: ''
  };

  const headers = oauth.toHeader(oauth.authorize(requestData, token));

  try {
    const response = await axios.post(requestData.url, {}, { headers });
    const data = new URLSearchParams(response.data);
    return {
      key: data.get('oauth_token'),
      secret: data.get('oauth_token_secret')
    };
  } catch (error) {
    console.error('Error fetching request token:', error);
    throw error;
  }
};

export const getAccessToken = async (requestToken, verifier) => {
  const requestData = {
    url: 'https://www.openstreetmap.org/oauth/access_token',
    method: 'POST',
    data: {
      oauth_token: requestToken.key,
      oauth_verifier: verifier,
    }
  };

  const headers = oauth.toHeader(oauth.authorize(requestData, requestToken));

  try {
    const response = await axios.post(requestData.url, {}, { headers });
    const data = new URLSearchParams(response.data);
    return {
      key: data.get('oauth_token'),
      secret: data.get('oauth_token_secret')
    };
  } catch (error) {
    console.error('Error fetching access token:', error);
    throw error;
  }
};

export const getOAuthHeader = (request) => {
  // Ensure you're passing the method and URL properly
  const requestData = {
    url: request.url,
    method: request.method,
  };

  // You would typically use the access token here, not the consumer key/secret directly
  const token = {
    key: 'accessTokenKey', // Replace with your real access token key
    secret: 'accessTokenSecret' // Replace with your real access token secret
  };

  return oauth.toHeader(oauth.authorize(requestData, token));
};