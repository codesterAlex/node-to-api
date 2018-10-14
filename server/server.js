const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {user} = require('./models/user');
var {ObjectId} =  require('mongodb');
var app = express();

app.use(bodyParser.json());

app.post('/todos',(req, res)=>{
  var todo = new Todo({
    text:req.body.text
  });

app.get('/todos',(req, res)=>{

  Todo.find().then((todo) => {
    res.send(todo);
  },(e) => {
    res.status(400).send(e);
  })
});

  todo.save().then((doc)=>{
    res.send(doc);
  },(e)=>{
    res.status(400).send(e);
  });
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



app.listen(3000,()=>{
  console.log('Started on port 3000');
});

module.exports = {app};
