const chalk = require('chalk');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const { Block, hashFunction } = require('./block');
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

    return this.chain.every((block, i) => {
      const { index, timestamp, userData, previousBlockHash } = block;
      const checkedBlockHash = hashFunction(
        index,
        timestamp,
        userData,
        previousBlockHash
      );

      if (block.hash !== checkedBlockHash) {
        return false;
      }
      if (i > 0 && block.previousBlockHash !== this.chain[i - 1].hash) {
        return false;
      }

      return true;
    });
  }

  authenticate(publicKey, privateKey) {
    const isUserValid = this.keys[publicKey].privateKey === privateKey;

    if (!isUserValid) {
      throw new Error('Такого користувача немає');
    }

    const isChainIntegral = this.checkChainIntegrity();

    if (!isChainIntegral) {
      throw new Error('Цілісніть даних порушена');
    }
  }

  readBlock(publicKey, privateKey) {
    try {
      this.authenticate(publicKey, privateKey);
      return this.chain[publicKey].userData;
    } catch (error) {
      console.log(chalk.red(error));
    }
  }

  addTransaction() {}
}

module.exports = { BlockChain };
