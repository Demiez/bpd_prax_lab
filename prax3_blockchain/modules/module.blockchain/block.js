const crypto = require('crypto');

const hashFunction = (index, timestamp, userData, previousBlockHash) => {
  const blockString = `${index}-${timestamp}-${JSON.stringify(
    userData
  )}-${previousBlockHash}`;
  return crypto.createHash('sha256').update(blockString).digest('hex');
};

class Block {
  constructor(index, userData, previousBlockHash) {
    this.index = index;
    this.timestamp = Date.now();
    this.userData = userData;
    this.previousBlockHash = previousBlockHash;
    this.hash = this.getHash();
  }

  getHash() {
    const { index, timestamp, userData, previousBlockHash } = this;
    const hash = hashFunction(index, timestamp, userData, previousBlockHash);
    return hash;
  }
}

module.exports = { Block, hashFunction };
