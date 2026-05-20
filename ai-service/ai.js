const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const identify = async (base64, mimeType) => {
  return {};
};

const diagnose = async (base64, mimeType) => {
  return {};
};

const recommend = async (conditions) => {
  return {};
};

module.exports = { identify, diagnose, recommend };