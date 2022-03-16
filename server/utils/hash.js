const crypto = require("crypto");
const encrypt = (password) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .createHmac("sha512", salt)
    .update(password)
    .digest("base64");
  return `${salt}$${hash}`;
};

exports.encrypt = encrypt;
