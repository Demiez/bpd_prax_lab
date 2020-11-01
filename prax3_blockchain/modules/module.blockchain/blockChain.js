const chalk = require('chalk');
const { v4: uuidv4 } = require('uuid');
const { Block } = require('./block');
const { Auth } = require('./auth');
const { saveData, loadData, saveKeys } = require('../module.fs/fs_service');
const datatypes = require('../module.fs/constants');

class BlockChain {
  constructor() {
    this.chain = loadData(datatypes.DATA) || [];
    this.keys = loadData(datatypes.KEYS) || [];
  }

  addBlock(userData) {
    const isChainIntegral = this.checkChainIntegrity();

    if (!isChainIntegral) {
      throw new Error(chalk.red('Цілісніть даних порушена'));
    }

    const index = this.chain.length;
    const previousBlockHash =
      this.chain.length !== 0 ? this.chain[this.chain.length - 1].hash : 0;
    const privateKey = uuidv4();
    const block = new Block(index, userData, previousBlockHash);
    const authData = new Auth(userData.user, index, privateKey);
    this.chain.push(block);
    this.keys.push(authData);
    saveData(this.chain);
    saveKeys(this.keys);
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

  authenticate(publicKey, privateKey) {
    const isUserValid = this.keys[publicKey].privateKey === privateKey;

    if (!isUserValid) {
      throw new Error(chalk.red('Такого користувача немає'));
    }

    const isChainIntegral = this.checkChainIntegrity();

    if (!isChainIntegral) {
      throw new Error(chalk.red('Цілісніть даних порушена'));
    }
  }

  readBlock(publicKey, privateKey) {
    this.authenticate(publicKey, privateKey);

    console.log(chalk.yellow.inverse('Доступ до блоку надано:'));
    return this.chain[publicKey].userData;
  }

  addTransaction() {}
}

module.exports = { BlockChain };
