const {ObjectId} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Users} = require('./../server/models/user');
const {Todo} = require('./../server/models/todo');

// Todo.remove({}).then((result)=>{
//   console.log(result);
// })

// Todo.findByIdAndRemove('5bc4abcbcbef13073428a30d').then((result)=>{
//   console.log(result);
// });


Todo.findOneAndRemove({_id:'5bc4abdccd66ca04186fca7b'}).then((result)=>{
  console.log(result);
})
