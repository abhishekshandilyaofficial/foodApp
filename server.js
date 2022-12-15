const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const secret = require("./api");
const secrets = "aqswde";
app.use(express.json());
//add cookies to req.cookies
app.use(cookieParser()); 
const userModel = require("./userModel");
const { rawListeners } = require('./userModel');
app.listen(3000, function(){
    console.log("server started at port 3000")
});


app.post("/signup", async function(req, res){
    let data = req.body;
    let newUser = await userModel.create(data);
    console.log(newUser);
    //console.log(data);
    res.end("data recieved");
})

app.post("/login", async function(req, res){
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
})
app.get("/users", protectRoute, async function(req, res){
    try{
        let users = await userModel.find();
          res.json(users);
    }catch(err){
        res.end(err.message);
    }
})
app.get("/user", protectRoute, async function(req, res){
    try{
        const userId = req.userId;
        const user = await userModel.findById(userId);
        res.json({
            data:user
        })
    }catch(err){
        res.end(err.message);
    }
})
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

app.patch("/forgetPassword", async function(req, res){
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
})

function otpGenerator(){
    return Math.floor(100000+Math.random()*900000);
}
app.patch("/resetPassword", async function(req, res){
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
})