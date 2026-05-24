const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const identify = async (base64, mimeType) => {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-5',
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
  const response = await client.messages.create({
    model: 'claude-sonnet-4-5',
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
            text: `Ты эксперт по болезням растений. Осмотри растение на фото.
Ответь ТОЛЬКО валидным JSON без markdown:
{
  "plant_name": "название растения на русском",
  "latin": "латинское название",
  "problem": "название проблемы или 'Растение здорово'",
  "severity": "низкая / средняя / высокая",
  "symptoms": ["симптом 1", "симптом 2"],
  "treatment": ["шаг 1", "шаг 2"],
  "urgent": true или false
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

const recommend = async (conditions) => {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `Ты эксперт по комнатным растениям. Порекомендуй 3 растения исходя из условий.
Условия: ${JSON.stringify(conditions)}
Ответь ТОЛЬКО валидным JSON без markdown и без лишнего текста:
{
  "recommendations": [
    {
      "name": "название на русском",
      "why": "почему подходит под эти условия",
      "difficulty": "одно из: лёгкое / среднее / сложное",
      "safe_for_pets": true или false
    }
  ]
}`,
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

module.exports = { identify, diagnose, recommend };