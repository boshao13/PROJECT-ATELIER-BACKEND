const fs = require('fs');
const readline = require('readline');

const input = fs.createReadStream('/Users/boshao/HACK/PROJECT-ATELIER-REVIEWS-BACKEND/data/characteristic_reviews.csv');
const output = fs.createWriteStream('/Users/boshao/HACK/PROJECT-ATELIER-REVIEWS-BACKEND/data/newCharacteristic_reviews.csv');

const rl = readline.createInterface({
  input: input
});

rl.on('line', (line) => {
  const fields = line.split(',');
  fields.shift();
  const modifiedLine = fields.join(',');
  output.write(modifiedLine + '\n');
});

rl.on('close', () => {
  input.close();
  output.close();
});