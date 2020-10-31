const { BlockChain } = require('./modules/module.blockchain/blockChain');
const { saveData } = require('./modules/module.fs/fs_service');

const blockChain = new BlockChain();
blockChain.addBlock({ user: 'Andrew', money: 100 });
blockChain.addBlock({ user: 'Dmytro', money: 200 });
console.dir(blockChain, { depth: null });
