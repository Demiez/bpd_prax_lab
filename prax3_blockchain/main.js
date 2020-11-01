const { BlockChain } = require('./modules/module.blockchain/blockChain');
const { Transaction } = require('./modules/module.blockchain/transaction');
const { saveData } = require('./modules/module.fs/fs_service');

const blockChain = new BlockChain();
blockChain.addBlock(new Transaction('Andrew', 100));
blockChain.addBlock(new Transaction('Dmytro', 200));
console.dir(blockChain, { depth: null });
