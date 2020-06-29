const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password:{

        type:String,
        required:true,
        trim:true,
        minlength:7,
        validate(value)
        {
           

             if(value.toLowerCase().includes("password"))
             throw new Error("Password needed to be improved")
        }


    },
    about: {
        type: String,
        trim: true,
    },
    role: {
        type: Number,
        default: 0 // normal authenticated user is specified by 0 and the admin is specified by 1
    },
    history:
    {
        type: Array,
        default: []
    }
},
    {
        timestamps: true
    }
)

userSchema.methods = {
    
    toJSON: function () {
        const user = this
        const userObject = user.toObject();
        delete userObject.password
        delete userObject.createdAt
        delete userObject.updatedAt
        return userObject

    },
}


userSchema.pre('save', async function (next) {

    const user=this
    
     if(user.isModified('password'))
     {
        user.password=await bcrypt.hash(user.password,8)
     }
    next()
})

userSchema.statics.findByCredentials=async(email,password)=>{
    if(email==="" || password==="")
    {
        throw "Enter the credentials"
    }
    const user=await User.findOne({email})
    if(!user)
    {
        throw "Email does not exist"
    }
    const isMatch=await bcrypt.compare(password,user.password)
    if(!isMatch)
    {
        throw "Password does not match"
    }
    return user
}




const User = mongoose.model("User", userSchema)
module.exports = User