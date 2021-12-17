const User = require('../models/User');
const bcryptFunction = require('../helpers/bcrypt');

class UserService {
  async createNewUser(email, password) {
    const data = await User.findOne({ email: email});
    const hashPassword = await bcryptFunction.comparePassword(password, "$2b$10$eT.TtHR1E8KWBbK6Q4/vmumcOh1WdaDOnmMGtnTYdlpOBZFaydycS" );
    console.log(hashPassword);
    if(data) return ({ success: false, message: 'Email is exist'});
    const user = await User.create({ email: email, password: password });
    return ({ success: true, message: 'Create new user successful', user});
  }
}

module.exports = new UserService();