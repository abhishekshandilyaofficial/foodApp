const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");


app.use(express.json());
//add cookies to req.cookies
app.use(cookieParser()); 

const userRouter = require("./routes/userRoutes");
const authRouter = require("./routes/authRoutes");

app.listen(3000, function(){
    console.log("server started at port 3000")
});






