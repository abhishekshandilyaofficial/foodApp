
const jwt = require("jsonwebtoken");
const secret = require("../secret");
const userModel = require("../model/userModel");
async function signupController(req, res){
    let data = req.body;
    let newUser = await userModel.create(data);
    console.log(newUser);
    //console.log(data);
    res.end("data recieved");
}
async function loginController(req, res){
    try{
        let data = req.body;
        let {email, password} = data;
    if(email && password){
        let user = await userModel.findOne({email:email});
        if(user){
            if(user.password == password){
                //TOKEN CONTAINS - payload, secret text and algorithm 
                var token = jwt.sign({data:user["_id"]},secret.JWTSECRET);
                res.cookie("JWT",token);
                res.send("hi, welcome");
            }else{
                res.send("Email or password is wrong")
            }
        }else{
            res.end("user with this email Id is not found");
        }
    }else{
        res.end("Kindly end email and password both");
    }
    }catch(err){
        res.end(err.message);
    }
}
async function forgetPasswordController(req, res){
    try{
        let {email} = req.body;
        let otp = otpGenerator();
        let user = await userModel.findOneAndUpdate({email:email}, {otp:otp},{new:true})
        console.log(user);
        res.json({
            data:user,
            "message":"otp send to your mail"
        })
    }catch(err){
        res.send(err.message);
    }
}
async function resetPasswordController(req, res){
    try{
        let {otp, password, confirmPassword, email } = req.body;
        let user = await userModel.findOneAndUpdate({email},
            {password, confirmPassword},
            {runValidators:true, new:true});
            //key delete -> get the document obj -> modify that object 
            //by removing useless keys
            user.otp = undefined;
            //save to save this doc in db
            await user.save();
            console.log(user);
            res.json({
                data:user,
                message:"Password for the user is reset"
            })
    }catch(err){
        console.log(err.message);
    }
}
function otpGenerator(){
    return Math.floor(100000+Math.random()*900000);
}
function protectRoute(req, res, next){
    const cookies = req.cookies;
    const JWT = cookies.JWT;
    try{
        if(cookies.JWT){
            console.log("protect Route encountered");
            let token = jwt.verify(JWT, secret.JWTSECRET);
            console.log(token);
            let userId = token.data;
            req.userId = userId;
        next();
        }else{
            res.send("You are not logged in");
        }
    }catch(err){
        res.send(err.message);
    } 
}
module.exports={
    signupController,
    loginController,
    forgetPasswordController,
    resetPasswordController,
    protectRoute
}