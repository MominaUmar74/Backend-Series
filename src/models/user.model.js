import mongoose,{Schema} from 'mongoose';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const userSchema= new Schema(
    {
        username:{
            type: String,
            required:true,
            lowercase:true,
            trim:true,
            index:true

        },
         email:{
            type: String,
            required:[true,"email is required"],
            lowercase:true,
            trim:true,
            
        }
    , fullname:{
            type: String,
            required:true,
            lowercase:true,
            trim:true,
            index:true
            
        },
         password:{
            type: String,
            required:true,
            lowercase:true,
            trim:true,
            
        }, coverimage:{
            type: String
            
        },
         avatar:{
            type: String,
            required:true,

            
        },
         refereshtoken:{
            type: String,
        
            
        }, watchhistory:{
            type: Schema.Types.ObjectId,
            ref:"Vedio"
        }
    },{
        timestamps:true
    }
)
    userSchema.pre("save",async function (next){
        if(!this.isModified("password")) return next()
        this.password= await bcrypt.hash(this.password,10)
        next()

    })
    userSchema.methods.isPasswordcorrect=async function(password){
      return await bcrypt.compare(password,this.password)
    }
    userSchema.methods.generateAcessTokens= function (){
       return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            fullname:this.fullname,
            

        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
        )

    }
    userSchema.methods.generateRefershTokens=function (){
       return jwt.sign(
        {
            _id:this._id,
    
   },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
        )

    }

export const User=mongoose.model("User",userSchema)
