const bcrypt = require('bcrypt');
const saltRounds = 10;

const bcryptFunction = {
  hashPassword: async (password) => {
    return bcrypt.hash(password, saltRounds);
  },
  comparePassword: async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
  },
};

module.exports = bcryptFunction;
