const yargs = require('yargs');
const keys = require('../modules/keys.module');
const DH = require('../modules/diffie.hellman.module');

// Аргументи командної стрічки
const options = yargs
  .usage('Usage: -p <server-port>')
  .option('p', {
    alias: 'port',
    describe: 'Порт для підключення до сервера Діффі-Хеллмана',
    type: 'int',
    demandOption: true,
  }).argv;

console.log('Слухаю порт: ', options.port);

const app = require('http').createServer(handler);
const io = require('socket.io')(app);
let gEaHIdx = 0;

// Отримаємо варіанти відповіді сервера
const serverResponseVariants = getServerResponseVariants().split('\n');
const getGEaHLine = () => {
  const line = serverResponseVariants[gEaHIdx];
  gEaHIdx += 1;
  if (gEaHIdx === serverResponseVariants.length) gEaHIdx = 0;
  if (!line) return getGEaHLine();
  return line;
}

io.on('connection', socket => {
  console.log(
    `Підключився новий клієнт: ${socket.id}\nОчикую ініціалізацію Діффі-Хеллмана`,
  );

  // Процесимо рандомізований примітив
  const prime = DH.getPrime();
  const primRootModP = DH.getPrimitiveRoot(prime);
  const secretInt = DH.getSecretInt(prime);

  // Створимо частковий ключ для відправлення клієнту
  const partialKey = DH.computeKey(prime, primRootModP, secretInt);

  // Відправлення потрібної інформації клієнту
  socket.emit('init-shared-key', {
    P: prime,
    G: primRootModP,
    A: partialKey,
  });

  // Чекаємо на відповідь від клієнта, створимо свій ключ, канали комунікації
  socket.on('partial-key', data => {
    const clientPartial = data.B;
    const computedDHKey = DH.computeKey(prime, clientPartial, secretInt);
    console.log(`Інініціалізовано ключ: ${computedDHKey}, включаю канали`);
    enableChannels(socket, computedDHKey);
  });
});

app.listen(options.port);

// для відображення в браузері
function handler(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('<h1>Алгоритм Діффі-Хеллмана</h1>');
  res.end();
}

// Включити канали комунікації
function enableChannels(socket, clientDHKey) {
  // Без шифрування
  socket.on('plain-text', data => {
    console.log(`Повідомлення клієнта без шифрування: ${data.message}`);
    socket.emit('plain-text', {
      text: getGEaHLine(),
    });
  });

  // Шифрування-розшифрування Діффі-Хеллман
  socket.on('diffie-hellman', data => {
    const encryptedMessage = data.message;
    const decryptedMessage = keys.xorWithKey(
      encryptedMessage,
      clientDHKey,
    );
    console.log(`Зашифроване повідомлення (Діффі-Хеллман): ${encryptedMessage}`);
    console.log(`Розшифроване повідомлення (Діффі-Хеллман): ${decryptedMessage}`);
    socket.emit('diffie-hellman', { text: keys.xorWithKey(getGEaHLine(), clientDHKey) });
  });
}

function getServerResponseVariants() {
  return require('fs').readFileSync('data/server_response_variants', 'utf8');
}
