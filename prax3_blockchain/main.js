const { BlockChain } = require('./modules/module.blockchain/blockChain');
const { Transaction } = require('./modules/module.blockchain/transaction');
const { saveData } = require('./modules/module.fs/fs_service');

const blockChain = new BlockChain();
// blockChain.addBlock(new Transaction('Andrew', 100));
// blockChain.addBlock(new Transaction('Dmytro', 200));
// console.dir(blockChain, { depth: null });

blockChain.readBlock(0, '7bdfc045-c642-4305-a710-7898299a3b5e');
