const {ObjectId} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Users} = require('./../server/models/user');
const {Users} = require('./../server/models/todo');

var id = '5bb8eaf8917bfb4005f9b1bf555';
//
// if(!ObjectId.isValid(id))
// {
//   console.log('Error: Id not valid');
// }
// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log(JSON.stringify(todos, undefined, 2));
// });
//
// Todo.findOne({
//   _id: id
// }).then((todos) => {
//   console.log(JSON.stringify(todos, undefined, 2));
// })

// Todo.findById(id).then((todos) => {
//   if(!todos)
//   {
//     return console.log('ID not found!!!');
//   }
//   console.log(JSON.stringify(todos, undefined, 2));
// }).catch((e)=> console.log("Error: ",e.message));



Users.findById(id).then((user)=>{
  if(!user)
  {
    return console.log('Id not foud!!!');
  }
  console.log(JSON.stringify(user, undefined, 2));
}).catch((e)=> console.log(e.message));
