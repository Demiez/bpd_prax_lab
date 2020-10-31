const crypto = require('crypto');

class Block {
  constructor(index, userData, previousBlockHash) {
    this.index = index;
    this.timestamp = Date.now();
    this.userData = userData;
    this.previousBlockHash = previousBlockHash;
    this.hash = this.createHash();
  }

  createHash() {
    const { index, timestamp, userData, previousBlockHash } = this;
    const blockString = `${index}-${timestamp}-${userData}-${previousBlockHash}`;
    const hash = crypto.createHash('sha256').update(blockString).digest('hex');
    return hash;
  }
}

module.exports = { Block };
