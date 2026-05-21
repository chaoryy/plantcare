const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

const identify = async (base64, mimeType) => {
  const result = await model.generateContent([
    {
      inlineData: { data: base64, mimeType: mimeType }
    },
    `Ты эксперт по растениям. Определи растение на фото.
Ответь ТОЛЬКО валидным JSON без markdown:
{
  "name": "название на русском",
  "latin": "латинское название",
  "confidence": число от 0 до 100,
  "description": "2-3 предложения на русском",
  "care": {
    "water": "как поливать",
    "light": "какой свет",
    "temperature": "температура"
  }
}`
  ]);

  const text = result.response.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    const match = text.match(/\{[\s\S]*\}/);
    return JSON.parse(match[0]);
  }
};

const diagnose = async (base64, mimeType) => {
  const result = await model.generateContent([
    {
      inlineData: { data: base64, mimeType: mimeType }
    },
    `Ты эксперт по болезням растений. Осмотри растение на фото.
Ответь ТОЛЬКО валидным JSON без markdown:
{
  "problem": "название проблемы или 'Растение здорово'",
  "severity": "низкая / средняя / высокая",
  "symptoms": ["симптом 1", "симптом 2"],
  "treatment": ["шаг 1", "шаг 2"],
  "urgent": true или false
}`
  ]);

  const text = result.response.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    const match = text.match(/\{[\s\S]*\}/);
    return JSON.parse(match[0]);
  }
};

const recommend = async (conditions) => {
  const result = await model.generateContent(
    `Ты эксперт по комнатным растениям. Порекомендуй 3 растения.
Условия: ${JSON.stringify(conditions)}
Ответь ТОЛЬКО валидным JSON без markdown:
{
  "recommendations": [
    {
      "name": "название на русском",
      "why": "почему подходит",
      "difficulty": "лёгкое / среднее / сложное",
      "safe_for_pets": true или false
    }
  ]
}`
  );

  const text = result.response.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    const match = text.match(/\{[\s\S]*\}/);
    return JSON.parse(match[0]);
  }
};

module.exports = { identify, diagnose, recommend };