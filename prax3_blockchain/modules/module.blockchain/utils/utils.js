const crypto = require('crypto');

const hashFunction = (index, timestamp, userData, previousBlockHash) => {
  const blockString = `${index}-${timestamp}-${JSON.stringify(
    userData
  )}-${previousBlockHash}`;
  return crypto.createHash('sha256').update(blockString).digest('hex');
};

module.exports = { hashFunction };
