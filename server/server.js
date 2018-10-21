var env = process.env.NODE_ENV || 'development';

console.log('env *** ', env);

if(env === 'development')
{
process.env.PORT = 3000;
process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
}
else if(env=== "test")
{
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
}

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
var {ObjectId} =  require('mongodb');

var {mongoose} = require('./db/mongoose');
mongoose.plugin(schema => { schema.options.usePushEach = true });
var {Todo} = require('./models/todo');
var {Users} = require('./models/user');

var app = express();
const Port= process.env.PORT;

app.use(bodyParser.json());

app.post('/todos',(req, res)=>{
  var todo = new Todo({
    text:req.body.text
  });
  todo.save().then((doc)=>{
    res.send(doc);
  },(e)=>{
    res.status(400).send(e);
  });
});

app.get('/todos',(req, res)=>{
  Todo.find().then((data) => {
    res.send({data});
  },(e) => {
    res.status(400).send(e);
  })
});


app.get('/todos/:id', (req, res) => {
  var id = req.params.id;

  if(!ObjectId.isValid(id)){
    return res.status(404).send();
  }

  Todo.findById(id).then((todo) => {
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e)=>{
    res.status(404).send();
  });
});


app.delete('/todos/:id', (req, res) =>{
  var id  = req.params.id;
  if(!ObjectId.isValid(id)){
    return res.status(404).send();
  }
//5bc4ac0e5583411ec4eccfe3
Todo.findByIdAndRemove(id).then((removedTodo) =>{
  if(!removedTodo){
      return res.status(404).send();
  }
  res.send({removedTodo})
}).catch((e) => {
  res.status(404).send();
})
});


app.patch('/todos/:id',(req,res) =>{
  var id = req.params.id;
  var body = _.pick(req.body,['text','completed']);

  if(!ObjectId.isValid(id)){
    return res.status(404).send();
  }

  if(_.isBoolean(body.completed) && body.completed)
  {
    body.completedAt = new Date().getTime();
  }
  else
  {
    body.completed = false;
    body.completedAt = null;
  }
  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo});

  }).catch((e)=>{
    res.status(400).send();
  })
})


app.post('/users',(req, res)=>{
  var body = _.pick(req.body,['email','password']);
  var user = new Users(body);

  user.save().then(function() {
    return user.generateAuthToken();
  }).then((token)=>{
    res.header('x-auth',token).send(user);
  }).catch((e) =>{
    res.status(400).send(e);
    console.log(e);
  })
});

app.listen(Port,()=>{
  console.log('Started on port 3000');
});

module.exports = {app};
