const crypto = require("crypto");
const algorithm = "aes-256-ctr";

/**
 * This function encrypts text by using an encryption algorithm and key.
 * It returns an object of its iv and content in hex string
 * @param {string} text
 * @returns {string}
 */
const encrypt = (text, secretKey) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  const content = iv.toString("hex") + ":" + encrypted.toString("hex");

  return content;
};

/**
 * This function decrypts a secret key from an encrypted object that contains an iv and content in hex string.
 * Returns decrypted string
 * @param {iv: string, content: string} hash
 * @returns {string}
 */
const decrypt = (hash, secretKey) => {
  const textParts = hash.split(":");
  const decipher = crypto.createDecipheriv(
    algorithm,
    secretKey,
    Buffer.from(textParts[0], "hex")
  );
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(textParts[1], "hex")),
    decipher.final(),
  ]);

  return decrypted.toString();
};

module.exports = {
  encrypt,
  decrypt,
};
