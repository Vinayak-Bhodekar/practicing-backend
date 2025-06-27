import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import pkg from 'mongoose'


const {Schema} = pkg;


const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      index: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true
    }, 
    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    avatar: {
      type: String,
      required: true
    },
    avatarPublic_Id: {
      type: String,
      required: true
    },
    coverImage: {
      type: String,
      required: true
    },
    coverImagePublic_id: {
      type: String,
      required: true
    },
    watchHistroy: [
      {
      type: Schema.Types.ObjectId,
      ref: "Video"
      }
    ],
    password: {
      type: String,
      required: [true,"the password is required"]
    },
    refreshToken : {
      type: String
    }
  },
  {
    timestamps:true
  }
)

userSchema.pre("save", async function(next){
  
  if(!this.isModified("password")) return next()

  this.password = await bcrypt.hash(this.password,10)

  next()
})

userSchema.methods.isPasswordCorrect = async function(password) {
  return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function(){
  return jwt.sign({
    _id:this.id,
    email:this.email,
    username:this.username,
    fullname:this.fullname
  },
  process.env.ACCESS_TOKEN_SECRET,
  {expiresIn:process.env.ACCESS_TOKEN_EXPIRES}
)
}
userSchema.methods.generateRefreshToken = function(){
  return jwt.sign({
    _id:this.id, 
  },
  process.env.REFRESH_TOKEN_SECRET,
  {expiresIn:process.env.REFRESH_TOKEN_EXPIRES} 
)
}

export const User = mongoose.model("User",userSchema)