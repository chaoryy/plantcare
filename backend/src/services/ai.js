const Anthropic = require("@anthropic-ai/sdk");

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL_NAME = "claude-3-5-sonnet-20241022";

const cleanBase64 = (base64Str) => {
  if (!base64Str) return "";
  if (base64Str.includes("base64,")) {
    return base64Str.split("base64,")[1];
  }
  return base64Str;
};

const identify = async (base64, mimeType) => {
  const cleanData = cleanBase64(base64);
  const cleanMimeType = mimeType || "image/jpeg";

  const response = await client.messages.create({
    model: MODEL_NAME,
    max_tokens: 1024,
    system:
      "Ты — эксперт по комнатным растениям. Твоя задача — анализировать изображения и возвращать ответ СТРОГО в формате JSON, соответствующем схеме пользователя. Не пиши никакого текста, кроме самого JSON-объекта. Не используй markdown-разметку ```json.",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: cleanMimeType,
              data: cleanData,
            },
          },
          {
            type: "text",
            text: `Определи растение на фото и верни структуру:
{
  "name": "название растения на русском",
  "latin": "латинское название",
  "confidence": 95,
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
    if (!match)
      throw new Error("ИИ вернул некорректный текстовый формат: " + text);
    return JSON.parse(match[0]);
  }
};

const diagnose = async (base64, mimeType) => {
  const cleanData = cleanBase64(base64);
  const cleanMimeType = mimeType || "image/jpeg";

  const response = await client.messages.create({
    model: MODEL_NAME,
    max_tokens: 1024,
    system:
      "Ты — эксперт по болезням растений. Твоя задача — выявлять проблемы по фото и возвращать ответ СТРОГО в формате JSON. Без markdown и лишнего текста.",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: cleanMimeType,
              data: cleanData,
            },
          },
          {
            type: "text",
            text: `Осмотри растение на фото и верни структуру:
{
  "plant_name": "название растения на русском",
  "latin": "латинское название",
  "problem": "название проблемы или 'Растение здорово'",
  "severity": "низкая / средняя / высокая",
  "symptoms": ["симптом 1"],
  "treatment": ["шаг 1"],
  "urgent": false
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
    if (!match)
      throw new Error("ИИ вернул некорректный формат диагностики: " + text);
    return JSON.parse(match[0]);
  }
};

const recommend = async (conditions) => {
  const conditionsText =
    typeof conditions === "object" ? JSON.stringify(conditions) : conditions;

  const response = await client.messages.create({
    model: MODEL_NAME,
    max_tokens: 1024,
    system:
      "Ты — эксперт по подбору комнатных растений. Твоя задача — рекомендовать растения строго по условиям и возвращать ответ исключительно в формате JSON. Без markdown.",
    messages: [
      {
        role: "user",
        content: `Порекомендуй ровно 3 комнатных растения исходя из условий: ${conditionsText}.
Верни структуру:
{
  "recommendations": [
    {
      "name": "название на русском",
      "why": "почему подходит под эти условия",
      "difficulty": "лёгкое / среднее / сложное",
      "safe_for_pets": true
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
    if (!match)
      throw new Error("ИИ вернул некорректный формат рекомендаций: " + text);
    return JSON.parse(match[0]);
  }
};

module.exports = { identify, diagnose, recommend };
