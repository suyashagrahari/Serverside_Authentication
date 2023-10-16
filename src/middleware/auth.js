const jwt = require("jsonwebtoken");
const Registermodel = require("../models/regiseterSchema");

const auth = async(req,res,next)=>{
    try {
        const token = req.cookies.logincookie;
        const verifyUser = jwt.verify(token,process.env.SECRET_KEY);
        console.log(verifyUser);
        const user = await Registermodel.findOne({_id:verifyUser._id});
        console.log(user.name);
        req.token = token;   // ye hmara current token h 
        req.user = user;      
        next();
    } catch (error) {
       console.log(error); 
    }
}

module.exports= auth;