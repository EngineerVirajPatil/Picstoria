const user = require('../models/user.js');
async function doesUserExist(email) {
    return await user.findOne({ where: { email } });
}

module.exports = doesUserExist;
