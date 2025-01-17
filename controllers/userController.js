const user=require('../models/user.js');
const doesUserExist=require('../services/userService.js');
const axiosInstance = require('../lib/axios.js');
require('dotenv').config();
const axios=require('axios');


function validateUser(username,email){
    const errors=[];
if(!username){
errors.push("Username is required");
}
if(!email){
errors.push("Email is required");
}
return errors;
}

const createNewUser=async(req, res)=>{
    try{
        const {username, email } =req.body;
        const errorsForValidation=validateUser(username,email);
        if(errorsForValidation && errorsForValidation.length>0){
         res.status(400).json({errors:errorsForValidation});
        }


        let existUser = false;
        if (email) {
          existUser = await doesUserExist(email); 
        }

        if(existUser===false){
          await user.create({
            'username': username,
            'email': email
          }
          );
        }
res.status(201).json({message:'User created successfully',user:{
    'username': username,
    'email': email
  }})
    }
    catch(errors){
      console.log(errors);
      res.status(500).json({ error: "Error in creating User", details: errors.message });
    }

}



module.exports=createNewUser;