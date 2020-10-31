const chalk = require('chalk');
const { Block } = require('./block');
const { saveData, loadData } = require('../module.fs/fs_service');

class BlockChain {
  constructor() {
    this.chain = loadData() || [];
  }

  addBlock(userData) {
    const isChainIntegral = this.checkChainIntegrity();

    if (!isChainIntegral) {
      throw new Error(chalk.red('Цілісніть порушена'));
    }

    const index = this.chain.length;
    const previousBlockHash =
      this.chain.length !== 0 ? this.chain[this.chain.length - 1].hash : 0;
    const block = new Block(index, userData, previousBlockHash);
    this.chain.push(block);
    saveData(this.chain);
  }

  checkChainIntegrity() {
    if (this.chain.length === 0) {
      return true;
    }

    this.chain.forEach((block, i) => {
      if (block.hash !== block.getHash) {
        return false;
      }
      if (block.previousBlockHash !== this.chain[i - 1].hash) {
        return false;
      }
    });

    return true;
  }

  readBlock() {
    const isChainIntegral = this.checkChainIntegrity();

    if (!isChainIntegral) {
      throw new Error(chalk.red('Цілісніть порушена'));
    }
  }
}

module.exports = { BlockChain };
