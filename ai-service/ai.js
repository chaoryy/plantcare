const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const identify = async (base64, mimeType) => {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: mimeType, data: base64 },
          },
          {
            type: 'text',
            text: `Ты эксперт по растениям. Внимательно посмотри на фото и определи растение.
Ответь ТОЛЬКО валидным JSON без markdown и без лишнего текста:
{
  "name": "название растения на русском",
  "latin": "латинское название",
  "confidence": число от 0 до 100 насколько ты уверен,
  "description": "2-3 предложения об этом растении на русском",
  "care": {
    "water": "как часто поливать",
    "light": "какое освещение нужно",
    "temperature": "оптимальная температура"
  }
}`,
          },
        ],
      },
    ],
  });

  const text = response.content[0].text;
  try {
    return JSON.parse(text);
  } catch (e) {
    const match = text.match(/\{[\s\S]*\}/);
    return JSON.parse(match[0]);
  }
};

const diagnose = async (base64, mimeType) => {
  return {};
};

const recommend = async (conditions) => {
  return {};
};

module.exports = { identify, diagnose, recommend };