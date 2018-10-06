var mongoose  =  require('mongoose');

var Users = mongoose.model('Users',{
  email:{
    type:String,
    required : true,
    trim: true,
    minlength: 1
  },
  password:{
    type: String
  }
})

module.exports = {Users};
