const identify = async (base64, mimeType) => {
  return {
    name: 'Тест растение',
    latin: 'Testus plantus',
    confidence: 99,
    description: 'Тестовый ответ — AI не подключён',
    care: {
      water: 'раз в неделю',
      light: 'рассеянный',
      temperature: '18-25°C',
    },
  };
};

const diagnose = async (base64, mimeType) => {
  return {
    problem: 'Тест диагноз',
    severity: 'низкая',
    symptoms: ['тест симптом'],
    treatment: ['тест лечение'],
    urgent: false,
  };
};

const recommend = async (conditions) => {
  return {
    recommendations: [
      {
        name: 'Сансевиерия',
        why: 'тест — AI не подключён',
        difficulty: 'лёгкое',
        safe_for_pets: true,
      },
    ],
  };
};

module.exports = { identify, diagnose, recommend };