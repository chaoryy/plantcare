require('dotenv').config();
const { identify, diagnose, recommend } = require('./ai');
const fs = require('fs');

const imageBuffer = fs.readFileSync('test-plant.jpg');
const base64 = imageBuffer.toString('base64');

async function test() {
  console.log('Тестируем identify...');
  const plant = await identify(base64, 'image/jpeg');
  console.log('IDENTIFY:', JSON.stringify(plant, null, 2));

  console.log('\nТестируем diagnose...');
  const diagnosis = await diagnose(base64, 'image/jpeg');
  console.log('DIAGNOSE:', JSON.stringify(diagnosis, null, 2));

  console.log('\nТестируем recommend...');
  const recs = await recommend({ light: 'мало света', pets: true });
  console.log('RECOMMEND:', JSON.stringify(recs, null, 2));
}

test();