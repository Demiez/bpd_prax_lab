const { hashFunction } = require('./utils/utils');

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
