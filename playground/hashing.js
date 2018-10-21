const {SHA256} = require('crypto-js');
const  jwt  =  require('jsonwebtoken');
const mongoose = require('mongoose');

const validator = require('validator');
//const jwt = require('jsonwebtoken');
const _ = require('lodash');


var UserSchema = new mongoose.Schema({
  email:{
    type:String,
    required : true,
    trim: true,
    minlength: 1,
    unique:true,
    validate: {
      validator: validator.isEmail,
      message : '{VALUE} is not a valid email'
    }
  },
  password:{
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }],
},{
  usePushEach: true
});


UserSchema.tokens.push({access, token});
console.log(UserSchema);






















// var message1 = 'I am the user';
// var hash1 = SHA256(message1).toString();
//
//
// var message2 = "I am the user";
// var hash2 = SHA256(message2).toString();
//
// console.log(`Message1= ${message1}: hassing = ${hash1}`);
// console.log(`Message2= ${message2}: Hashing = ${hash2}`);
//
// var data = {
//   id:4
// };
//
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data)+'somesecret').toString()
// };
//
// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();
//
// var resultHash = SHA256(JSON.stringify(token.data)+'somesecret').toString();
//
// if(resultHash === token.hash)
// {
//   console.log('Data was not changed');
// }
// else{
//   console.log('Data was changed. Do not trust');
// }
