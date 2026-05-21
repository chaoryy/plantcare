require('dotenv').config();
const { identify } = require('./ai');
const fs = require('fs');

const imageBuffer = fs.readFileSync('test-plant.jpg');
const base64 = imageBuffer.toString('base64');

identify(base64, 'image/jpeg').then(result => {
  console.log('IDENTIFY:', JSON.stringify(result, null, 2));
});