const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const RegisterSchema = new mongoose.Schema({
    name:{
        type : String,
    },
    email: {
        type : String,
    },
    password:{
        type:String,
    },
    tokens : [{
        token : {
            type:String,
            required :true,
        }
    }]
})

RegisterSchema.methods.generateAuthToken = async function(){
    try {
        console.log(this._id);
        const token = jwt.sign({_id : this._id},process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token})
        await this.save();
        return token;
        console.log(token);
    } catch (error) {
        console.log(error);
        
    }
}



RegisterSchema.pre("save",async function(next){    // ynha save function use kiya gya h q ki uske baad save function pr hi jana h // fir next pura function khtm hone pr save function pr le jane ke liye use kiya ja rha h
    if(this.isModified("password"))                   // is modified ka use ilsiye kr rhe h kii jb hmara password change hoga tbhi ye use hoga wrna nhi
    {
        this.password =  await bcrypt.hash(this.password,10)

    }
    // this.confirmpassword = undefined iske dwara hm data base m confirm password save nhi krayenygye
    next();
})

const Registermodel = mongoose.model("Registermodel",RegisterSchema);

module.exports = Registermodel;