const fs = require('fs');
const path = require('path');

async function test() {
  // 1. Логин
  const loginRes = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test@test.com', password: '123456' }),
  });
  const { token } = await loginRes.json();
  console.log('✅ Токен получен');

  // 2. Анализ фото
  const formData = new FormData();
  const filePath = 'C:\\Users\\Victus\\Downloads\\closeup-shot-beautiful-pink-tulips-white-surface.jpg';
  const fileBuffer = fs.readFileSync(filePath);
  const blob = new Blob([fileBuffer], { type: 'image/jpeg' });
  formData.append('image', blob, 'plant.jpg');

  const analyzeRes = await fetch('http://localhost:3000/api/plants/analyze', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const result = await analyzeRes.json();
  console.log('✅ Результат анализа:');
  console.log(JSON.stringify(result, null, 2));
}

test().catch(console.error);