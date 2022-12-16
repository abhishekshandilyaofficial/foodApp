const express = require('express');
const app = express();
const { protectRoute } = require("../controller/authController");
const { profileController, getAllUserController } = 
require("../controller/userController");

const userRouter = express.Router();
app.use("/api/v1/user", userRouter);
userRouter.get("/users", protectRoute, getAllUserController )
userRouter.get("/user", protectRoute, profileController);
module.exports = userRouter;