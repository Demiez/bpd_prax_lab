const keys = require('../modules/keys.module');
const DH = require('../modules/diffie.hellman.module');
const yargs = require('yargs');
const io = require('socket.io-client');
const prompts = require('prompts');
require('colors');

// Аргументи командної строки
const options = yargs
  .usage('Usage: -i <ip-address> -p <server-port>')
  .option('p', {
    alias: 'port',
    describe: 'Порт для конекту із сервером',
    type: 'int',
    demandOption: true,
  })
  .option('i', {
    alias: 'ipAddress',
    describe: 'IP адреса сервера (default: localhost)',
    type: 'string',
    demandOption: true,
  }).argv;

let server = options.ipAddress + ':' + options.port.toString();

if (server.substring(0, 7) !== 'http://') {
  server = 'http://' + server;
}

console.log('Підключаюсь до: ' + server);
const socket = io(server);
let currentChannel = 'plain-text';
let userInputEnabled = false;
let programStarted = false;

let encryptionMethods = {
  'plain-text': input => input,
  'diffie-hellman': undefined,
};

socket.on('connect', () => {
  console.log('\nІніціалізую загальний ключ із сервером');
  if (programStarted) return;

  socket.on('init-shared-key', data => {
    const serverPrime = data.P;
    const serverPRMP = data.G;
    const serverPartialKey = data.A;

    // Приватне число, яке використовуємо
    const secretInt = DH.getSecretInt(serverPRMP);

    // Створити та поділитися частковим ключем із сервером
    const selfPartialKey = DH.computeKey(serverPrime, serverPRMP, secretInt);
    socket.emit('partial-key', { B: selfPartialKey });

    // Створити повний ключ
    const diffieHellmanKey = DH.computeKey(
      serverPrime,
      serverPartialKey,
      secretInt,
    );

    console.log(`Обчислений ключ ДХ: ${diffieHellmanKey}`);

    // Встановити метод шифрування
    encryptionMethods['diffie-hellman'] = input =>
      keys.xorWithKey(input, diffieHellmanKey);

    setUpSocketChannels(socket);
    console.log('Для списку доступних команд наберіть ":help"');
    userInputEnabled = true;
    programStarted = true;
    allowUserInput(socket);
  });
});

function allowUserInput(socket) {
  (async () => {
    if (!userInputEnabled) {
      setTimeout(() => allowUserInput(socket), 200);
      return;
    }
    const input = await prompts({
      type: 'text',
      name: 'message',
      message: 'Введіть повідомлення:',
    });
    userInputEnabled = false;
    handleUserInput(socket, input.message);
    allowUserInput(socket);
  })();
}

const messagePrint = (message, switchInput, colour) => {
  if (colour === undefined) colour = 'green';
  if (userInputEnabled) {
    setTimeout(() => messagePrint(message, switchInput), 200);
    return;
  }
  console.log(message[colour]);
  if (switchInput) {
    userInputEnabled = true;
  }
};

function handleUserInput(socket, input) {
  if (checkForCommands(input)) {
    return;
  }
  const encryptionMethod = encryptionMethods[currentChannel];
  if (encryptionMethod === undefined) {
    console.log('Вибачте, Діффі-Хеллман не встановлений');
    currentChannel = 'plain-text';
    handleUserInput(socket, input);
  }
  // Зашифруємо та передамо повідомлення
  const encryptedInput = encryptionMethod(input);

  // якщо включено щифрування - відображаємо зашифроване повідомлення
  if (currentChannel === 'diffie-hellman') {
    messagePrint(`${currentChannel} зашифроване повідомлення: ${encryptedInput}`, false, 'yellow');
  }
  socket.emit(currentChannel, { message: encryptedInput });
}

const changeChannel = newChannel => {
  if (newChannel === currentChannel) {
    messagePrint(`Вже використовую ${currentChannel}`, true, 'red');
    return;
  }
  messagePrint(`Включено режим ${newChannel}`, true, 'cyan');
  currentChannel = newChannel;
};

// Список доступних команд
function checkForCommands(input) {
  const flagMap = {
    ':dh': 'diffie-hellman',
    ':pt': 'plain-text',
  };

  const helpMessage =
    'Доступні команди:' +
    '\n\t:dh - режим шифрування Діффі-Хеллман - diffie-hellman' +
    '\n\t:pt - режим простий текст без шифрування - plain-text' +
    '\n\t:help - список команд' +
    '\n\t:exit - вийти з програми';

  if (input in flagMap) {
    changeChannel(flagMap[input]);
    return true;
  }
  const commandMap = {
    ':help': () => {
      messagePrint(helpMessage, true, 'yellow');
    },
    ':exit': () => {
      console.log('Виходжу із програми...'.red);
      process.exit(0);
    },
  };
  if (!(input in commandMap)) {
    return false;
  }
  commandMap[input]();
  userInputEnabled = true;
  return true;
}

// Встановлення сокет-каналів для шифрування та без шифрування
function setUpSocketChannels(socket) {
  // Без шифруванння
  socket.on('plain-text', data => {
    messagePrint(`Сервер (простий текст): ${data.text}`, true);
  });

  // Шифрування Діффі-Хеллман
  socket.on('diffie-hellman', data => {
    const response = data.text;
    messagePrint(
      `Отримано зашифроване повідомлення із сервера:\n${response}`,
      false,
      'yellow'
    );
    const decrypted = encryptionMethods['diffie-hellman'](response);
    messagePrint(`Сервер (розшифровано): ${decrypted}`, true);
  });
}
