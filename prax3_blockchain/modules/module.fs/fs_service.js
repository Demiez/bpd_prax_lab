const fs = require('fs');
const chalk = require('chalk');
const dataTypes = require('./constants');

const saveData = (data) => {
  console.log(chalk.green.inverse('Іде збереження даних...\n'));

  const dataJSON = JSON.stringify(data);
  fs.writeFileSync('data/data.json', dataJSON);
};

const saveKeys = (keys) => {
  const { publicKey, privateKey } = keys[keys.length - 1];
  console.log(
    chalk.magenta(
      `Ваші ключі:
    публічний: ${publicKey}
    приватний: ${privateKey}
    `
    )
  );
  const keysJSON = JSON.stringify(keys);
  fs.writeFileSync('data/keys.json', keysJSON);
};

const loadData = (dataType) => {
  console.log(chalk.green.inverse('Іде завантаження даних...\n'));
  try {
    if (dataType === dataTypes.DATA) {
      const dataBuffer = fs.readFileSync('data/data.json');
      const dataJSON = dataBuffer.toString();
      return JSON.parse(dataJSON);
    }
    if (dataType === dataTypes.KEYS) {
      const dataBuffer = fs.readFileSync('data/keys.json');
      const keysJSON = dataBuffer.toString();
      return JSON.parse(keysJSON);
    }
  } catch (e) {
    return [];
  }
};

module.exports = {
  saveData,
  saveKeys,
  loadData,
};
