const mongoose = require('mongoose');
const secrets = require("../secret"); 
mongoose.connect(secrets.DB_Link).then(function(db){
    console.log('db connected');
})
.catch(function(err){
    console.log(err);
})

let userSchema = new mongoose.Schema({
    name : {
        type:String,
        required: [true, "Please enter the name"]
    },
    email:{
        type:String,
        required: [true, "email is required"],
        unique:true
    },
    password:{
        type:"String",
        required:[true, "password is required"]
    },
    confirmPassword:{
        type:"String",
        required:[true, "confirmpassword is required"],
        validate:function(){
            return this.password == this.confirmPassword;
        },
        //error message
        message:"password miss match"
    },
    phonenumber:{
        type:"String",
        minlength:[10, "less than 10 numbers"],
        maxlength:[10, "more than 10 numbers"]
    },
    pic:{
        type:String,
        default:"dp.png"
    },
    otp:{
        type:String
    },
    address:{
        type:String
    } 
})
const userModel = mongoose.model('FooduserModel', userSchema);
module.exports = userModel;