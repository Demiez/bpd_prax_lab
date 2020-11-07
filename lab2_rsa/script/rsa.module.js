(function () {
  // створимо клас для RSA через протитипне наслідування
  const RSA = (function () {
    function RSA() {
      this.data = { p: 7, q: 11, n: 77, e: 17, d: 53 };
    }

    RSA.prototype.getN = function () {
      return this.data.n;
    };
    RSA.prototype.getE = function () {
      return this.data.e;
    };
    RSA.prototype.getD = function () {
      return this.data.d;
    };

    return RSA;
  })();

  // декларуємо обробники подій
  function onEncryptButtonClick() {
    const plaintext = $('#message').val();
    const encodedPaintext = encode(plaintext);
    const encryptedText = encryptString(encodedPaintext);
    $('#cipher').html(encryptedText.join(' '));
  }

  function onDecryptButtonClick() {
    const cipher = $('#cipher-text').val().split(' ');
    const decryptedText = decrypt(cipher);
    $('#plaintext').html(decode(decryptedText));
  }
  // новий екземпляр класу
  const rsa = new RSA();
  // створимо строку із необхідними символами, працюємо з індексами символів 
  const lookup = ' abcdefghijklmnopqrstuvwxyz,.!?1234567890абвгдеєжзиіїклмнопрстуфхцчшщьюя';

  function IntToChar(i) {
    return lookup.charAt(i);
  }
  function CharToInt(c) {
    return lookup.indexOf(c);
  }

  // використаємо новий екземпляр об'єкту бібліотеки для оптимізації роботи з арифметичними операціями
  function encrypt(data, e, n) {
    return new BigNumber(data).toPower(e).modulo(n);
  }

  function encryptString(plainTextArray) {
    const encryptionArray = [];
    const n = rsa.getN();
    const e = rsa.getE();
    for (let i = 0, len = plainTextArray.length; i < len; i++) {
      const data = plainTextArray[i];
      encryptionArray.push(encrypt(data, e, n));
    }
    return encryptionArray;
  }

  function decrypt(encryptedArray) {
    const decryptedArray = [];
    let number;
    const n = rsa.getN();
    const d = rsa.getD();
    for (let i = 0, len = encryptedArray.length; i < len; i++) {
      number = new BigNumber(encryptedArray[i]);
      number = number.toPower(d).modulo(n);

      decryptedArray.push(number);
    }
    return decryptedArray;
  }

  function decode(encodedResult) {
    let result = '';
    for (let i = 0, len = encodedResult.length; i < len; i++) {
      result += IntToChar(encodedResult[i]);
    }
    return result;
  }

  function encode(plaintext) {
    const encodedArray = [];
    const plaincharsArray = plaintext.split('');
    for (let i = 0, len = plaincharsArray.length; i < len; i++) {
      encodedArray.push(CharToInt(plaincharsArray[i]));
    }
    return encodedArray;
  }

  $('#encrypt-button').click(onEncryptButtonClick);
  $('#decrypt-button').click(onDecryptButtonClick);
})();
