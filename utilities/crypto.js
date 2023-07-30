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
const generatePBKDF = (password, salt) => {
  let salt_buffer;

  if (!salt) {
    salt_buffer = crypto.randomBytes(16); // Generate a random salt (16 bytes)
  } else {
    salt_buffer = Buffer.from(salt, "hex");
  }

  const iterations = 100000; // Recommended number of iterations

  crypto.pbkdf2(
    password,
    salt_buffer,
    iterations,
    32,
    "sha256",
    (err, derivedKey) => {
      if (err) throw err;
      // Now, 'derivedKey' can be used as the encryption key for AES-256-CTR
      // The derivedKey is a 32-byte buffer, suitable for AES-256
      return {
        salt: salt_buffer.toString("hex"),
        derived_key: derivedKey.toString("hex"),
      };
    }
  );
};

const createSecretKey = (size) => {
  if (!size) {
    size = 32;
  }

  const buffer = crypto.randomBytes(size);

  return buffer.toString("hex");
};

module.exports = {
  createSecretKey,
  generatePBKDF,
  encrypt,
  decrypt,
};
