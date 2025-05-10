const bcrypt = require("bcrypt");
const saltRounds = 10;

async function hashPassword(pw) {
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPw = await bcrypt.hash(pw, salt);
  return hashedPw;
}

async function checkPw(userPw, hash) {
  bcrypt.compare(userPw, hash, (err, result) => {
    if (err) console.log(err);
  });
}

(module.exports = hashPassword), checkPw;
