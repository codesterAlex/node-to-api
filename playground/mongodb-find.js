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


    // db.collection('Todos').find({
    //   _id:new ObjectID("5badee43ab5bf7b508a01bef")
    // }).toArray().then((docs)=>{
    // console.log('Todos');
    // console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) =>{
    //   console.log('Unable to fetch todos',err);
    // });

    // db.collection('Todos').find().count() .then((count)=>{
    // console.log(`Todos count: ${count}`);
    // }, (err) =>{
    //   console.log('Unable to fetch todos',err);
    // });

    db.collection('Users').find({name:'Lalit'}).count().then((count)=>{
      console.log(`Number of user named lalit: ${count}`);
    },(err)=>{
      console.log('Unable to fect userdata',err);
    })

    db.collection('Users').find({name:'Lalit'}).toArray().then((docs) =>{
      console.log(`User Record`);
      console.log(JSON.stringify(docs, undefined, 2));
    }, (err)=>{
      console.log('Unable to fetch data');
    })



  // db.close();
});
