const { BlockChain } = require('./structure/blockChain');

const blockChain = new BlockChain();
blockChain.addBlock({ user: 'Andrew', money: 100 });
blockChain.addBlock({ user: 'Dmytro', money: 200 });
console.dir(blockChain, { depth: null });
