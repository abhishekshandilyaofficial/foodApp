const express = require('express');
const { signupController, forgetPasswordController,
     loginController, resetPasswordController } = require("../controller/authController");

const authRouter = express.Router();
app.use("/api/v1/auth", authRouter);
authRouter.post("/signup", signupController);
authRouter.post("/login", loginController);
authRouter.patch("/forgetPassword", forgetPasswordController)
authRouter.patch("/resetPassword", resetPasswordController)
module.exports = authRouter;