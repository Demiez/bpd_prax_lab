const { Block } = require('./block');

class BlockChain {
  constructor() {
    this.chain = [];
  }

  addBlock(userData) {
    const index = this.chain.length;
    const previousBlockHash =
      this.chain.length !== 0 ? this.chain[this.chain.length - 1].hash : 0;
    const block = new Block(index, userData, previousBlockHash);
    this.chain.push(block);
  }
}

module.exports = { BlockChain };
