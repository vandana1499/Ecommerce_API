const User = require('../models/users')
const { errorHandler } = require('../helper/dbError')
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')

const signup = (req, res) => {

    const user = new User(req.body)
   
    user.save()
        .then(() => {
            //console.log(user)
            res.status(200).json({user:user})
        })
        .catch((err) => {
            
            const error = errorHandler(err)
            // console.log(error)
            res.status(400).json({error:error})
        })
}
const signin = async(req, res) => {

    try
    {
        const user=await User.findByCredentials(req.body.email,req.body.password)
        const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
        res.cookie("Token",token, { expire: new Date() + 9999 })    
        res.status(200).send({ user, token  })
    }
    catch(e)
    {
      
        return res.status(401).json({error:e})
    }
   
}

const signout=(req,res)=>{
    res.clearCookie('Token')
    res.status(200).json({message:"Signout Success!!"})
}
const requireSignin=expressJwt({
    secret:process.env.JWT_SECRET,
    userProperty:"auth" // req.auth
})
const isAuth=(req,res,next)=>{
    let user=req.profile && req.auth && req.profile._id == req.auth._id
    // console.log(req.profile._id)
    // console.log(req.auth._id)
    if(!user)
    {
        return res.status(403).send({error:"Access denied"})
    }
    next()
}

const isAdmin=(req,res,next)=>
{
    if(req.profile.role===0)
    {
        return res.status(403).send({error:"Admin only !! Access denied"})
    }
    next()
}
module.exports = {
    signup,
    signin,
    signout,
    requireSignin,
    isAuth,
    isAdmin
}

