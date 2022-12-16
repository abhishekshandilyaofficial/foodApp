const userModel = require("../model/userModel");
async function profileController(req, res){
    try{
        const userId = req.userId;
        const user = await userModel.findById(userId);
        res.json({
            data:user
        })
    }catch(err){
        res.end(err.message);
    }
}
async function getAllUserController(req, res){
    try{
        let users = await userModel.find();
          res.json(users);
    }catch(err){
        res.end(err.message);
    }
}
module.exports = {
    profileController,
    getAllUserController
}