import { verify } from "crypto";
import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true, "Please Provide a username"],
        unique:true
    },
    email:{
        type:String,
        required:[true, "Please Provide an email"],
        unique:true
    },
    password:{
        type:String,
        required:[true, "Please Provide a password"],
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isAdmin:{
        type:Boolean,
       default:false
    },
    forgotPasswordToken: String,
    forgotPasswordExpires: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,

})

const User = mongoose.model.users || mongoose.model("Users", userSchema);

export default User