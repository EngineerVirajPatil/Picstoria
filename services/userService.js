const Users = require('../models/user.js');
async function doesUserExist(email) {
    const result= await Users.findOne({ where: { email } });
    if (typeof result==='boolean'){
        return null;
    }
    return result;
}

module.exports = doesUserExist;


//Added Comment on test the git push
//Deleted A File