import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
   firstName:{
    type: String, 
    require: true
   },
   lastName:{
    type: String, 
    require: true
   },
   email:{
    type: String, 
    require: true
   },
   password:{
    type: String, 
    require: true
   },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
})

export const userModel = mongoose.model('User', userSchema)