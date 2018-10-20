//IMport
//const MongoClient =  require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

//Connecting to database
// var user = {name:'lalit', age :20};
// var {name} = user;
// console.log(name);


MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, db) =>{
    if(err){
      return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server.');

    db.collection('todos').insertOne({
        text: 'This is how it supposed to be',
        completed: true
    },(err, result)=>{
      if(err){
        return  console.log("unable to insert todo", err);
      }
      console.log(JSON.stringify(result.ops,undefined, 2));
});

    //
    // db.collection('Users').insertOne({
    //   name:'Tekendra',
    //   age: 20,
    //   location:'Jumla Nepal'
    // },(err, result) => {
    //   if(err)
    //   {
    //     return console.log('Unable to insert due to error ',err);
    //   }
    //   console.log(result.ops[0]._id.getTimestamp());
    // });

  db.close();
});
