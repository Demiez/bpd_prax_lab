module.exports = {
  xorWithKey(message, key) {
    key = key.toString();
    const keyLength = key.length;
    let resultantString = '';
    for (let charIdx = 0; charIdx < message.length; charIdx++) {
      const keyChar = key.charCodeAt(charIdx % keyLength).toString(10);
      const messageChar = message.charCodeAt(charIdx).toString(10);

      resultantString += String.fromCharCode(keyChar ^ messageChar);
    }
    return resultantString;
  },
  getSecretKey(caller) {
    const fs = require('fs');
    const path = require('path');
    const normalizePath = (pathString) => path.normalize(pathString);

    const pathToKey =
      caller === 'server'
        ? normalizePath(`./data/secret_key`)
        : normalizePath(`../data/secret_key`);

    return fs.readFileSync(pathToKey, 'utf8');
  }
};
