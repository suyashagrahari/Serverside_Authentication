const mongoose = require("mongoose");
const dblink = "mongodb://localhost:27017/suyash"
const connection = async()=>{
    try {
        await mongoose.connect(dblink,{ useNewUrlParser: true });
        console.log("db is connected");
    } catch (error) {
        console.log(error);
        
    }
}

connection();

