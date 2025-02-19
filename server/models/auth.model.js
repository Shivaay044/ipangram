const mongoose = require("mongoose");



const schema = new mongoose.Schema({
     email: { type:String, unique:true, required:true },
     firstName: { type: String, trim: true, required:true},
     lastName: { type: String, trim: true, required:true},
     gender: { type: String, enum:["male", "female"],required:true},
     hobbies: { type: [String] },
     role:{ type: String, enum:["employee", "manager"], required:true},
     password: { type:String, required:true}
},{ timestamps:true });




exports.UserModel = mongoose.model("user", schema)