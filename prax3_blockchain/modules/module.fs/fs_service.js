const fs = require('fs');
const chalk = require('chalk');

const saveData = (data) => {
  console.log(chalk.green.inverse('Іде збереження даних...\n'));

  const dataJSON = JSON.stringify(data);
  fs.writeFileSync('data/data.json', dataJSON);
};

const loadData = () => {
  console.log(chalk.green.inverse('Іде завантаження даних...\n'));
  try {
    const dataBuffer = fs.readFileSync('data/data.json');
    const dataJSON = dataBuffer.toString();
    return JSON.parse(dataJSON);
  } catch (e) {
    return [];
  }
};

module.exports = {
  saveData,
  loadData,
};
