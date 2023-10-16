require("dotenv").config();

// const exp = require("constants");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const cookie = require('cookie');
const cookieParser = require("cookie-parser");
const auth = require("../src/middleware/auth")
const express = require("express");
require("./db/conn");
const app = express();
const port = process.env.PORT || 9000;
const path = require("path");
const hbs = require("hbs");

// const bodyParser = require('body-parser');
const Registermodel = require("./models/regiseterSchema");


// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

const static_path = path.join(__dirname,"../public");
const template_path = path.join(__dirname,"./templates/views");
const partial_path = path.join(__dirname,"./templates/partials");


console.log(static_path);
console.log(template_path);
console.log(partial_path);

app.use(cookieParser());
app.use(express.urlencoded({extended:false}))
app.use(express.static(static_path));
app.set("view engine","hbs");
app.set("views",template_path)
hbs.registerPartials(partial_path);


app.get("/",async(req,res)=>{
    try {
        res.render("index");
    } catch (error) {
        console.log(error);
        
    }
})

app.get("/login",async(req,res)=>{
    try {
        res.render("login");
    } catch (error) {
        console.log(error);
        
    }
})
app.get("/logout",auth, async(req,res)=>{
    try {
        console.log(req.user);

        // Logout from single device

        req.user.tokens = req.user.tokens.filter((currElem)=>{
            return currElem.token !== req.token
        })

        // logout from all the devices
        // req.user.tokens = [];
        res.clearCookie("logincookie")
        console.log("logout succefully");
        await req.user.save();
        res.render("login");
    } catch (error) {
        console.log(error);
        
    }
})

app.get("/register",async(req,res)=>{
    try {
        res.render("home");
    } catch (error) {
        console.log(error);
        
    }
})

app.get("/secret",auth,async(req,res)=>{
    try {
        res.render("secret");
        // console.log(`this is the cookie i get from login :- ${req.cookies.logincookie}`)
    } catch (error) {
        console.log(error);
        
    }
})

app.post('/submit', async(req, res) => {
   try {
        const newUser = new Registermodel(req.body);fse5
// Ab hm ynha pr token genrate krwa rhe hr user ke liye 
        const token = await newUser.generateAuthToken();

        res.cookie("jwt",token,{
            expires : new Date(Date.now() + 20000),
            httpOnly:true,

        });
        console.log(cookie);
        const user = await newUser.save();
        console.log(user);
        res.render("index");
   } catch (error) {
    console.log(error);
    
   }
});

// here i am  hashing the password

// so first of all we go in schema where password is declared then their first of all we require bcryptjs then define Schema.pre("save", async function(next)=>{
// }) 

// const SecurePassword = async(password)=>{
//     const secure = await bcrypt.hash(password,10);
//     console.log(secure);
// }                                                                    learning purpose only

// SecurePassword("suyash");




// Ynha pr hmne password ko bcrypt ke dwara compare kiya h 
app.post("/Login",async(req,res)=>{
    
    try {
        const Email = req.body.email;
        const Password = req.body.password;
        console.log(Email);
        console.log(Password);

        const user = await Registermodel.findOne({email:Email});

        console.log(user._id);
        console.log(user);

        const isMatch =  await bcrypt.compare(Password,user.password);

        const token = await user.generateAuthToken();
        res.cookie("logincookie",token,{
            expires : new Date(Date.now() + 80000),
            httpOnly:true,
        })
        console.log(token);
        console.log(token);

        if(isMatch )
        {
            res.send("login successful");
        }
        else{
            res.send("login unsuccessful");
        }

    } catch (error) {
        console.log(error);
        
    }
})



app.listen(port,()=>{
    console.log(`connection is successful at ${port}`);
})