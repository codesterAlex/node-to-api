require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
var {ObjectId} =  require('mongodb');

var {mongoose} = require('./db/mongoose');
mongoose.plugin(schema => { schema.options.usePushEach = true });
var {Todo} = require('./models/todo');
var {Users} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');





var app = express();
const Port= process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res)=>{
  var todo = new Todo({
    text:req.body.text,
    _creator:req.user._id
  });
  todo.save().then((doc)=>{
    res.send(doc);
  },(e)=>{
    res.status(400).send(e);
  });
});

app.get('/todos', authenticate, (req, res)=>{
  Todo.find({
    _creator: req.user._id
  }).then((todos) => {
    res.send({todos});
  },(e) => {
    res.status(400).send(e);
  })
});


app.get('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;

  if(!ObjectId.isValid(id)){
    return res.status(404).send();
  }

  Todo.findOne({
    _id:id,
    _creator:req.user.id
  }).then((todo) => {
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e)=>{
    res.status(404).send();
  });
});

app.get("/",(req,res)=>{
  res.send("<h1>Welcome to my rest api</h1>");
});

app.delete('/todos/:id', authenticate,(req, res) =>{
  var id  = req.params.id;
  if(!ObjectId.isValid(id)){
    return res.status(404).send();
  }
//5bc4ac0e5583411ec4eccfe3
Todo.findOneAndRemove({
  _id:id,
  _creator: req.user._id
}).then((removedTodo) =>{
  if(!removedTodo){
      return res.status(404).send();
  }
  res.send({removedTodo})
}).catch((e) => {
  res.status(404).send();
})
});


app.patch('/todos/:id', authenticate,(req,res) =>{
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
  Todo.findOneAndUpdate({
    _id:id,
    _creator: req.user._id},
    {$set: body}, {new: true}).then((todo) => {
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
  })
});

app.post('/users/login', (req, res) => {
   var body = _.pick(req.body,['email','password']);

   Users.findByCredentials(body.email, body.password).then((user) => {
     return user.generateAuthToken().then((token) =>{
       res.header('x-auth', token).send(user);
     });
   }).catch((e) => {
     res.status(400).send();
   });
});


app.delete('/users/me/token', authenticate, (req, res) =>{
  req.user.removeToken(req.token).then(() =>{
    res.status(200).send();
  },() =>{
    res.status(400).send();
  })
})


app.get('/users/me',authenticate,(req,res)=>{
  res.send(req.user);
})

app.listen(Port,()=>{
  console.log('Started on port 3000');
});

module.exports = {app};
