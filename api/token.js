// Serverless function: issues Ably auth tokens so the API key stays secret
const Ably = require('ably');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const client = new Ably.Rest(process.env.ABLY_API_KEY);
  const tokenRequest = await client.auth.createTokenRequest({
    capability: { '*': ['publish', 'subscribe', 'presence', 'history'] },
  });
  res.json(tokenRequest);
};
