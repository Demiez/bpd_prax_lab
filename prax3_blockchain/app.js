const chalk = require('chalk');
const yargs = require('yargs');
const { BlockChain } = require('./modules/module.blockchain/blockChain');
const { Transaction } = require('./modules/module.blockchain/transaction');

const blockChain = new BlockChain();
// blockChain.addBlock(new Transaction('Andrew', 100));
// blockChain.addBlock(new Transaction('Dmytro', 200));
// console.dir(blockChain, { depth: null });

// blockChain.readBlock(0, '7bdfc045-c642-4305-a710-7898299a3b5e');
// console.log(yargs.version);
// //console.log(process.argv);
// console.log(yargs.argv);

yargs.command({
  command: 'add',
  describe: 'Додати блок до блокчейну',
  builder: {
    name: {
      describe: "Ім'я користувача",
      demandOption: true,
      type: 'string',
    },
    money: {
      description: 'Кількість грошей',
      demandOption: true,
      type: 'number',
    },
  },
  handler: (argv) =>
    blockChain.addBlock(new Transaction(argv.name, argv.money)),
});

yargs.command({
  command: 'read',
  describe: 'Прочитати блок в блокчейні',
  builder: {
    public: {
      describe: 'Публічний ключ',
      demandOption: true,
      type: 'number',
    },
    private: {
      description: 'Приватний ключ',
      demandOption: true,
      type: 'string',
    },
  },
  handler: (argv) => {
    const block = blockChain.readBlock(argv.public, argv.private);
    if (block) {
      console.log(chalk.yellow.inverse('Доступ до блоку надано:'));
      console.log(block);
    }
  },
});

yargs.parse();
