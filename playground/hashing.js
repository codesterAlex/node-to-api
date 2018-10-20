const {SHA256} = require('crypto-js');
const  jwt  =  require('jsonwebtoken');

var data = {
  id:10
}

var token = jwt.sign(data, '123abc');
console.log('New Hash with secret: '+token);

var decoded =  jwt.verify(token, '123abc=');
console.log('Decoded Data: ', decoded);


























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
