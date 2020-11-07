function chars_from_hex(inputstr) {
  let outputstr = '';
  inputstr = inputstr.replace(/^(0x)?/g, '');
  inputstr = inputstr.replace(/[^A-Fa-f0-9]/g, '');
  inputstr = inputstr.split('');
  for (let i = 0; i < inputstr.length; i += 2) {
    outputstr += String.fromCharCode(
      parseInt(inputstr[i] + '' + inputstr[i + 1], 16)
    );
  }
  return outputstr;
}

function hex_from_chars(inputstr) {
  const delimiter = '';
  let outputstr = '';
  let hex = '0123456789abcdef';
  hex = hex.split('');
  let n;
  const inputarr = inputstr.split('');
  for (let i = 0; i < inputarr.length; i++) {
    if (i > 0) outputstr += delimiter;
    if (!delimiter && i % 32 == 0 && i > 0) outputstr += '\n';
    n = inputstr.charCodeAt(i);
    outputstr += hex[(n >> 4) & 0xf] + hex[n & 0xf];
  }
  return outputstr;
}

function encrypt_string() {
  const input = document.getElementById('input').value;
  let key = document.getElementById('key').value;
  let vector = document.getElementById('vector').value;

  key = chars_from_hex(key);
  vector = chars_from_hex(vector);
  vector = vector.length > 7 ? vector : null;

  const output = des(key, input, 1, vector ? 1 : 0, vector);
  document.getElementById('output').value = hex_from_chars(output);
}

function decrypt_string() {
  let input = document.getElementById('input').value;
  let key = document.getElementById('key').value;
  let vector = document.getElementById('vector').value;

  key = chars_from_hex(key);
  vector = chars_from_hex(vector);
  vector = vector.length > 7 ? vector : null;

  input = chars_from_hex(input);
  document.getElementById('output').value = des(
    key,
    input,
    0,
    vector ? 1 : 0,
    vector
  );
}
