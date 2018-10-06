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

    //deleteMany
    // db.collection('Todos').deleteMany({text: 'Creat something'}).then((result)=>{
    //   console.log(result);
    // })

    //deleteOne
    // db.collection('Todos').deleteOne({text: 'Creat something'}).then((result)=>{
    //   console.log(result);
    // })

    //findOneAndDelete
    // db.collection('Todos').findOneAndDelete({completed: false}).then((result)=>{
    //   console.log(result);
    // })

    //Test for many and findAnd deleteOne
    // db.collection('Users').deleteMany({name:'Lalit'}).then((result)=>{
    //   console.log(result);
    // })

    db.collection('Users').findOneAndDelete({
      _id: new ObjectID('5baf2f434fc9f4d028cefc22')
    }).then((result)=>{
      console.log(result);
    })







  // db.close();
});
