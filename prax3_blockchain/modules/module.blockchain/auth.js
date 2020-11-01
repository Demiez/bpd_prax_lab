class Auth {
  constructor(name, publicKey, privateKey) {
    this.name = name;
    this.publicKey = publicKey;
    this.privateKey = privateKey;
  }
}

module.exports = { Auth };
