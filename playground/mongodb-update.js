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


    //Update
    // db.collection('Todos').findOneAndUpdate({
    //   _id: new ObjectID('5bb0d2ea58fedb1378b4b793')
    // },{
    //     $set :{
    //       completed:true
    //     }
    //   },{
    //     returnOrginal: false
    //   }).then((result)=>{
    //     console.log(result);
    //   })


    db.collection('Users').findOneAndUpdate({
      _id: new ObjectID('5bb0d1c341269f35a09e8ae0')
    },{
      $set:{
        name:'Krsna'
      },
      $inc:{
        age:1
      }
    },{
      returnOrginal:false
    }).then((result)=>{
      console.log(result);
    })







  // db.close();
});
