import mongoose from "mongose";

const UserSchema = new mongoose.Schema ({
  fullName:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  }, 
  password:{
    type:String,
    required:true
  }
})

export const UserModel =  mongoose.model("User", UserSchema);
