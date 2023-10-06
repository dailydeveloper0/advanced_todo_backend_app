const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require('jsonwebtoken');
const config = require('config')
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.methods.generateAuthToken = function(){
  const token = jwt.sign({_id:this._id}, config.get("jwtPrivateKey"));
  return token;
}
const User = mongoose.model("User", userSchema);

const userJoiSchema = Joi.object({
  firstName: Joi.string().required().min(3).max(50),
  lastName: Joi.string().required().min(3).max(50),
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  password: Joi.string().required().min(6).max(20),
});



function validateNewUser(user) {
  const newUserJoiSchema = userJoiSchema.append({
    password: Joi.string().required().min(6).max(20),
  });

  return newUserJoiSchema.validate(user);
}

function validatePassword(password) {
  const passowrdJoiSchema = Joi.object({
    password: Joi.string().min(6).max(20).required(),
  });
  return passowrdJoiSchema.validate(password);
}

function validateUpdateUser(user){
    return userJoiSchema.validate(user);
}


module.exports = {
    User,
    validateNewUser,
    validateUpdateUser,
    validatePassword
}
